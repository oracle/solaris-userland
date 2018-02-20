/*
 * Copyright (c) 2008, Oracle and/or its affiliates. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next
 * paragraph) shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*
 * fbc_Monitor - Edit Monitor sections
 */


#include <stdio.h>		/* NULL */

#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"		/* xf86conffree(), xf86confmalloc() */
#include "configProcs.h"	/* Private function, etc. declarations */

#include "fbc_xorg.h"		/* Edit config file data representations */
#include "fbc_Monitor.h"	/* Edit Monitor sections */
#include "fbc_Option.h"		/* Edit Option lists */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_line_er.h"	/* External Representation of config lines */
#include "fbc_write_config.h"	/* Write an updated config file */


/*
 * fbc_find_Monitor_Mode()
 *
 *    Given a Monitor section pointer and the name of a ModeLine /
 *    Mode-EndMode entry, return a pointer to the matching entry that is
 *    available to this Monitor section.  "Available" means the entry is
 *    contained either within the Monitor section or within a Modes
 *    section named by a UseModes entry in the Monitor section.  Return
 *    NULL if no available ModeLine / Mode-EndMode entry has that name.
 *
 *    Compare this function with xf86validateMonitor() in Monitor.c.
 */

XF86ConfModeLinePtr
fbc_find_Monitor_Mode(
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	const char	*mode_name)	/* ModeLine / Mode-EndMode name */
{
	XF86ConfModeLinePtr mlptr;	/* Ptr to ModeLine list entry */
	XF86ConfModesLinkPtr modeslink;	/* Ptr to UseModes list entry */

	/*
	 * Search Monitior section for the named ModeLine / Mode-EndMode entry
	 */
	mlptr = xf86findModeLine(
			mode_name, monitor_sectn_ptr->mon_modeline_lst);
	if (mlptr != NULL) {
		return (mlptr);		/* Found ModeLine / Mode-EndMode */
	}

	/*
	 * Traverse the list of Modes sectns specified by any UseModes entries
	 */
	for (modeslink = monitor_sectn_ptr->mon_modes_sect_lst;
	    modeslink != NULL;
	    modeslink = modeslink->list.next) {
		/*
		 * Search Modes section for ModeLine / Mode-EndMode entry
		 *
		 *    Note that xf86validateMonitor() should already
		 *    have translated the UseModes names to Modes
		 *    sections links (modeslink->ml_modes), which is why
		 *    we don't have to call xf86findModes().
		 */
		mlptr = xf86findModeLine(mode_name,
				    modeslink->ml_modes->mon_modeline_lst);
		if (mlptr != NULL) {
			break;
		}
	}

	return (mlptr);

}	/* fbc_find_Monitor_Mode() */


/*
 * fbc_edit_Monitor_section()
 *
 *    Modify or insert Monitor section values to the Internal
 *    Representation of the configuration file.
 *        Gamma       <gamma_value>                   # -g <gamma_value>
 *    #   Gamma       <gamma_red> <gamma_green> <gamma_blue>
 */

int
fbc_edit_Monitor_section(
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	xf86_ent_mod_t	*xf86_entry_mods) /* Config entry modifications */
{

	/*
	 * Make any Gamma entry modification
	 */
	if (xf86_entry_mods->mon_gamma_red != FBC_NO_Gamma) {
		monitor_sectn_ptr->mon_gamma_red   =
					xf86_entry_mods->mon_gamma_red;
		monitor_sectn_ptr->mon_gamma_green =
					xf86_entry_mods->mon_gamma_green;
		monitor_sectn_ptr->mon_gamma_blue  =
					xf86_entry_mods->mon_gamma_blue;

		/*
		 * Edit the External Representation of the Gamma entry
		 */
		if (monitor_sectn_ptr->mon_gamma_red > 0.) {
			/*
			 * Insert or modify the line's External Representation
			 */
			fbc_edit_line_ER(&monitor_sectn_ptr->mon_gamma_line_er,
					monitor_sectn_ptr->mon_end_line_er,
					monitor_sectn_ptr,
					(xf86_print_fn_t *)
						&xf86printMonitorSectionGamma,
					FBC_INDENT_1);
		} else {
			/*
			 * Delete the Gamma line's External Representation
			 */
			fbc_delete_line_ER(
					monitor_sectn_ptr->mon_gamma_line_er);
		}
	}

	return (0);

}	/* fbc_edit_Monitor_section() */


/*
 * fbc_insert_new_Monitor_section()
 *
 *    Insert a new, mostly empty Monitor section in the configuration at
 *    the specified location.
 *
 *        Section "Monitor"
 *            Identifier  "<monitor_identifier>"
 *        EndSection
 *        <blank line>
 *
 *    Note that the Monitor section identifier string, mon_identifier,
 *    has been dynamically allocated by our caller.
 */

static
int
fbc_insert_new_Monitor_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	char		*mon_identifier, /* Monitor section identifier */
	XF86ConfMonitorPtr *monitor_ptr) /* Ptr to new Monitor section IR */
{

	/*
	 * Allocate and initialize the Internal Rep for a new Monitor section
	 */
	*monitor_ptr = xf86confcalloc(1, sizeof (XF86ConfMonitorRec));
	if (*monitor_ptr == NULL) {
		xf86conffree(mon_identifier);
		return (FBC_ERR_NOMEM);
	}
	(*monitor_ptr)->mon_identifier = mon_identifier;

	/*
	 * Insert the External Representation data for the Monitor section
	 */
	/*  Section "Monitor"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*monitor_ptr,
			(xf86_print_fn_t *)&xf86printMonitorSectionSection,
			FBC_INDENT_0);

	/*  Identifier "<monitor_identifier>"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*monitor_ptr,
			(xf86_print_fn_t *)&xf86printMonitorSectionIdentifier,
			FBC_INDENT_1);

	/*  EndSection  */
	(*monitor_ptr)->mon_end_line_er =
		fbc_insert_line_ER(
			next_line_er,
			*monitor_ptr,
			(xf86_print_fn_t *)&xf86printMonitorSectionEndSection,
			FBC_INDENT_0);

	/*  <blank line>  */
	(void) fbc_insert_line_ER(
			next_line_er,
			"\n",
			(xf86_print_fn_t *)&fbc_print_config_text,
			FBC_INDENT_0);

	/*
	 * Add the new Monitor section to the in-memory configuration
	 */
	configIR->conf_monitor_lst =
		(XF86ConfMonitorPtr) xf86addListItem(
			(glp)configIR->conf_monitor_lst, (glp)configIR);

	return (FBC_SUCCESS);

}	/* fbc_insert_new_Monitor_section() */


/*
 * fbc_insert_Monitor_section()
 *
 *    Insert a new, empty Monitor section in the configuration at the
 *    specified location.
 */

int
fbc_insert_Monitor_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	const char	*mon_ident_tmpl, /* Monitor section ident template */
	XF86ConfMonitorPtr *monitor_ptr) /* Ptr to new Monitor section IR */
{
	int		error_code;	/* Error code */
	unsigned int	i;		/* Loop counter / uniqueness factor */
	const char	*ident_format;	/* Format for unique identifier */
	char		*mon_identifier; /* Monitor section identifier */

	/*
	 * Allocate memory for the new Monitor identifier string
	 *
	 *    Allocate space for the intended name and any extra
	 *    underscore and decimal digits needed to make it unique.
	 *    The number of digits will never be greater than the byte
	 *    size of the loop counter, i, multiplied by three decimal
	 *    digits per byte.
	 */
	mon_identifier = xf86confmalloc(strlen(mon_ident_tmpl)
					+ 1			/* "_" */
					+ 3 * sizeof (i)	/* Digits */
					+ 1);			/* Nul */
	if (mon_identifier == NULL) {
		return (FBC_ERR_NOMEM);
	}

	/*
	 * Insure that the new Monitor section identifier will be unique
	 */
	ident_format = "%s";
	for (i = 0; ; ) {
		XF86ConfMonitorPtr mon_ptr; /* Ptr to existing Monitor sectn */

		/*
		 * Try the name alone and then the name with a numeric suffix
		 */
		sprintf(mon_identifier, ident_format, mon_ident_tmpl, i);
		ident_format = "%s_%u";

		/*
		 * Search for this name among the existing Monitor sections
		 */
		for (mon_ptr = configIR->conf_monitor_lst;
		     mon_ptr != NULL;
		     mon_ptr = mon_ptr->list.next) {
			if (xf86nameCompare(mon_identifier,
					    mon_ptr->mon_identifier) == 0) {
				break;	/* Not unique */
			}
		}

		/*
		 * Stop when the name is unique (or if the loop counter wraps)
		 */
		i += 1;
		if ((mon_ptr == NULL) || (i == 0)) {
			break;		/* The name is unique enough */
		}
	}

	/*
	 * Insert a new Monitor section into the in-memory configuration
	 */
	error_code = fbc_insert_new_Monitor_section(
			configIR, next_line_er, mon_identifier, monitor_ptr);
	if (error_code != FBC_SUCCESS) {
		xf86conffree(mon_identifier);
		return (error_code);
	}

	return (FBC_SUCCESS);

}	/* fbc_insert_Monitor_section() */


/*
 * fbc_insert_UseModes_entry()
 *
 *    Insert the specified UseModes entry into the specified Monitor
 *    section.
 *
 *    It is assumed that this function is called when no such UseModes
 *    entry can be found in the Monitor section.
 */

int
fbc_insert_UseModes_entry(
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	XF86ConfModesPtr modes_sectn_ptr) /* Ptr to Modes section IR */
{
	XF86ConfModesLinkPtr usemodes_ptr; /* Ptr to UseModes entry element */
	XF86ConfModesLinkPtr usemodes_er_ptr; /* Ptr to UseModes entry element */
	char usemodes_name[80];

	/*
	 * Allocate, zero, and further initialize the generic UseModes entry element
	 */
	usemodes_ptr = xf86confcalloc(1, sizeof (XF86ConfModesLinkRec));
	if (usemodes_ptr == NULL) {
		return (FBC_ERR_NOMEM);
	}
	usemodes_ptr->ml_modes_str =
			xf86configStrdup(modes_sectn_ptr->modes_identifier);
	if (usemodes_ptr->ml_modes_str == NULL) {
		xf86conffree(usemodes_ptr);
		return (FBC_ERR_NOMEM);
	}
	usemodes_ptr->ml_modes = modes_sectn_ptr;

	/*
	 * Append the new UseModes entry element to the (empty) list
	 */
	monitor_sectn_ptr->mon_modes_sect_lst =
		(XF86ConfModesLinkPtr)xf86addListItem(
				(glp)monitor_sectn_ptr->mon_modes_sect_lst,
				(glp)usemodes_ptr);

	/*
	 * Insert the device specific UseModes entry
	 */
	sprintf(usemodes_name, "%s_%s", modes_sectn_ptr->modes_identifier, monitor_sectn_ptr->mon_identifier);
	usemodes_er_ptr = xf86findModes(usemodes_name, monitor_sectn_ptr->mon_modes_sect_lst);

	if (usemodes_er_ptr == NULL) {

		/*
	 	 * Allocate, zero, and further initialize the UseModes entry element
	 	 */
		usemodes_er_ptr = xf86confcalloc(1, sizeof (XF86ConfModesLinkRec));
		if (usemodes_er_ptr == NULL) {
			return (FBC_ERR_NOMEM);
		}

		usemodes_er_ptr->ml_modes_str = xf86configStrdup(usemodes_name);
		usemodes_er_ptr->ml_modes = modes_sectn_ptr;

		/*
	 	 * Append the new UseModes entry element to the (empty) list
		 */
		monitor_sectn_ptr->mon_modes_sect_lst =
			(XF86ConfModesLinkPtr)xf86addListItem(
				(glp)monitor_sectn_ptr->mon_modes_sect_lst,
				(glp)usemodes_er_ptr);

		usemodes_er_ptr->line_er = fbc_insert_line_ER(
			monitor_sectn_ptr->mon_end_line_er,
			(void *)usemodes_er_ptr,
			(xf86_print_fn_t *)&xf86printMonitorSectionUseModes,
			FBC_INDENT_1);
	}

	monitor_sectn_ptr->mon_usemodes_line_er = usemodes_er_ptr->line_er;

	return (FBC_SUCCESS);

}	/* fbc_insert_UseModes_entry() */


/* End of fbc_Monitor.c */
