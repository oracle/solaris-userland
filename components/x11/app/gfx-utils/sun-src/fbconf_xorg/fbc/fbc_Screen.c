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
 * fbc_Screen - Edit Screen sections
 */


#include <stdio.h>		/* NULL */

#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"		/* Private definitions, etc. */
#include "configProcs.h"	/* Private function, etc. declarations */
#include "xf86Optrec.h"		/* Option lists, memory management, etc. */

#include "fbc_Monitor.h"	/* Edit Monitor sections */
#include "fbc_Option.h"		/* Edit Option lists */
#include "fbc_Screen.h"		/* Edit Screen sections */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_line_er.h"	/* External Representation of config lines */
#include "fbc_write_config.h"	/* Write an updated config file */


/*
 * fbc_find_active_Monitor_entry()
 *
 *    Find the first Monitor entry within a list of Monitor section
 *    identifiers.
 * ???    The man pages don't seem to have said which is the active
 * ???    Monitor section when there is more than one Monitor entry.
 *    The list of Monitor sections comes from an active Screen section.
 *    The list may be empty, which means a default configuration is to
 *    be used.
 *
 * ???
 *    Monitor entries within a Screen section are optional.  Currently
 *    we don't support omitted Monitor sections and default
 *    configurations ...
 *
 *    Note that the syntax and data structures being traversed by this
 *    function belong to the Screen section, which is why this function
 *    is in fbc_Screen.c rather than a fbc_Monitor.c.
 */

XF86ConfScrnMonitorEntryPtr
fbc_find_active_Monitor_entry(
	XF86ConfScrnMonitorEntryPtr scrn_monitor_lst) /* Monitor entry list */
{

	/*
	 * Return the first Monitor section entry in the list, else NULL
	 */
	return (scrn_monitor_lst);

}	/* fbc_find_active_Monitor_entry() */


/*
 * fbc_insert_Monitor_entry()
 *
 *    Insert the specified Monitor entry line into the specified Screen
 *    section.
 *
 *    It is assumed that this function is called when no active Monitor
 *    section was found by fbc_find_active_Monitor_entry(), i.e. the
 *    list of Monitor entries is empty.  In any case, this function must
 *    not cause:
 *      * Omitted Monitor numbers when there are muliple Monitor entries
 *      * Duplicate Monitor numbers
 *      * Duplicate Monitor names
 *    See xf86parseScrnMonitor() in Screen.c.
 */

int
fbc_insert_Monitor_entry(
	XF86ConfScreenPtr screen_sectn_ptr, /* Ptr to current Screen section */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to cur Monitor section */
	XF86ConfScrnMonitorEntryPtr *mon_ptr) /* Ptr to Monitor entry */
{

	/*
	 * Allocate, zero, and further initialize the new Monitor entry element
	 */
	*mon_ptr = xf86confcalloc(1, sizeof (XF86ConfScrnMonitorEntryRec));
	if (*mon_ptr == NULL) {
		return (FBC_ERR_NOMEM);
	}
	(*mon_ptr)->scrn_monitor      = monitor_sectn_ptr;
	(*mon_ptr)->scrn_monitor_name =
			xf86configStrdup(monitor_sectn_ptr->mon_identifier);
	if ((*mon_ptr)->scrn_monitor_name == NULL) {
		xf86conffree(*mon_ptr);
		*mon_ptr = NULL;
		return (FBC_ERR_NOMEM);
	}

	/*
	 * Append new the Monitor entry element to the (empty) list
	 */
	screen_sectn_ptr->scrn_monitor_lst =
		(XF86ConfScrnMonitorEntryPtr)xf86addListItem(
				(glp)screen_sectn_ptr->scrn_monitor_lst,
				(glp)*mon_ptr);

	/*
	 * Insert the External Representation data for the Monitor entry line
	 */
	(void) fbc_insert_line_ER(
			screen_sectn_ptr->scrn_end_line_er,
			(void *)*mon_ptr,
			(xf86_print_fn_t *)&xf86printScreenSectionMonitor,
			FBC_INDENT_1);

	return (FBC_SUCCESS);

}	/* fbc_insert_Monitor_entry() */


/*
 * fbc_find_active_Mode_name()
 *
 *    Return a pointer to the name of the first ModeLine / Mode-EndMode
 *    entry, if any, referenced by this Display subsection.  Otherwise
 *    return NULL.
 *
 *    This function supports the -propt functionality.
 */

const char *
fbc_find_active_Mode_name(
	XF86ConfDisplayPtr display_subsectn_ptr) /* Ptr to Display subsectn */
{

	if (display_subsectn_ptr->disp_mode_lst != NULL) {
		return (display_subsectn_ptr->disp_mode_lst->mode_name);
	}
	return (NULL);

}	/* fbc_find_active_Mode_name() */


/*
 * fbc_find_active_Display_subsection()
 *
 *    Find the active Display subsection in this Screen section that
 *    matches the specified active Monitor entry.
 *
 *    "The 'active' Display subsections are the first for each monitor
 *    number that match the depth and/or fbbpp values being used, or
 *    failing that, the first for each monitor number that has neither a
 *    depth or fbbpp value specified.  ...  The Display subsections are
 *    optional.  ..."  - XF86Config(5)
 */

XF86ConfDisplayPtr
fbc_find_active_Display_subsection(
	XF86ConfScreenPtr screen_sectn_ptr, /* Ptr to active Screen section */
	XF86ConfScrnMonitorEntryPtr mon_ptr, /* Ptr to active Monitor entry */
	XF86ConfDisplayPtr scrn_display_lst) /* Display subsection list */

{
	XF86ConfDisplayPtr display_subsectn_ptr; /* Ptr to Display subsectn */

	/*
	 * Find any Display subsection referencing this Monitor section
	 */
	for (display_subsectn_ptr = scrn_display_lst;
	    display_subsectn_ptr != NULL;
	    display_subsectn_ptr = (XF86ConfDisplayPtr)
					(display_subsectn_ptr->list.next)) {
		/*
		 * Check for matching monitor numbers
		 *
		 *    There is no match if one entity (Display
		 *    subsection or Monitor entry) specifies a monitor
		 *    number and the other doesn't.
		 *
		 *    Considering only monitor numbers, there is a match
		 *    if both entities have the same monitor number.
		 *    There is a match if both entities have no monitor
		 *    number.
		 */
		if (display_subsectn_ptr->disp_monitor_seen !=
					mon_ptr->scrn_monitor_num_seen) {
			continue;	/* Not a match */
		}
		if (display_subsectn_ptr->disp_monitor_seen &&
			(display_subsectn_ptr->disp_monitor_num
					!= mon_ptr->scrn_monitor_num)) {
			continue;	/* Not a match */
		}

		/*
		 * Check for matching depth and/or fbbpp values
		 *
		 *    Note that the XF86Config(5) man page says "and/or"
		 *    rather than "and."  This seems to allow for the
		 *    possibility that only one of the two values is
		 *    specified.  If both values are specified, we'll
		 *    require a match on both.
		 *
???		 *    Though the parser code does not check for this, it
???		 *    is assumed that zero is not a valid value for
???		 *    depth nor [fb]bpp, and further assumed that a zero
???		 *    in the Display subsection data structure indicates
???		 *    that the value was not specified.
		 */
#define	NO_DEPTH	0		/* Unspecified depth value */
#define	NO_FBBPP	0		/* Unspecified fbbpp value */
		if ((display_subsectn_ptr->disp_depth != NO_DEPTH) &&
		    (display_subsectn_ptr->disp_depth
				!= screen_sectn_ptr->scrn_defaultdepth)) {
			continue;	/* Not a match */
		}
		if ((display_subsectn_ptr->disp_bpp != NO_FBBPP) &&
		    (display_subsectn_ptr->disp_bpp
				!= screen_sectn_ptr->scrn_defaultfbbpp)) {
			continue;	/* Not a match */
		}

		/*
		 * Return the first matching Display subsection found
		 */
		return (display_subsectn_ptr);
	}

	/*
	 * Return unsuccessfully
	 */
	return (NULL);

}	/* fbc_find_active_Display_subsection() */


/*
 * fbc_find_active_Screen_section()
 *
 *    Find the Screen section that refers to the specified device name.
 *
 *    Note that we can't tell whether a given Screen section will be
 *    considered active at execution time.  This is because even if we
 *    could guess which ServerLayout section is likely to be active, the
 *    -screen command line option could still be used to override our
 *    best guess.
 */

XF86ConfScreenPtr
fbc_find_active_Screen_section(
	XF86ConfScreenPtr conf_screen_lst, /* Head of Screen section list */
	const char	* const	device_identifier) /* Device name */
{
	XF86ConfScreenPtr scrn_sectn_ptr; /* Ptr to Screen section */

	/*
	 * Search each Screen section for the specified device identifier
	 */
	for (scrn_sectn_ptr = conf_screen_lst;
	    scrn_sectn_ptr != NULL;
	    scrn_sectn_ptr = scrn_sectn_ptr->list.next) {
		if (xf86nameCompare(scrn_sectn_ptr->scrn_device_str,
					device_identifier) == 0) {
			/*
			 * Return this as the active Screen section
			 */
			return (scrn_sectn_ptr);
		}
	}

	/*
	 * Return unsuccessfully
	 */
	return (NULL);

}	/* fbc_find_active_Screen_section() */


/*
 * fbc_edit_Display_subsection()
 *
 *    Modify or insert Display subsection values to the Internal and
 *    External Representations of the configuration file:
 *        Modes       "<mode_name>" ...
 */

int
fbc_edit_Display_subsection(
	XF86ConfDisplayPtr display_subsectn_ptr, /* Ptr to Display subsectn */
	xf86_ent_mod_t	*xf86_entry_mods) /* Config entry modifications */
{
	XF86ModePtr	*disp_mode_pptr; /* Ptr to ptr to Modes element */
	XF86ModePtr	disp_mode_ptr;	/* Ptr to Modes list element */
	int		no_modes_line;	/* TRUE => No Modes line */

	/*
	 * See whether a Mode name has been specified (-res option)
	 */
	if (xf86_entry_mods->video_mode.name == NULL) {
		return (FBC_SUCCESS);	/* No "-res <video_mode>" option */
	}

	/*
	 *  Before disturbing it, remember whether we found the list empty
	 */
	no_modes_line = (display_subsectn_ptr->disp_mode_lst == NULL);

	/*
	 * Look for a matching Modes name element or create one if not found
	 */
	for (disp_mode_pptr = &display_subsectn_ptr->disp_mode_lst;
	    ;
	    disp_mode_pptr = (XF86ModePtr *)&disp_mode_ptr->list.next) {
		disp_mode_ptr = *disp_mode_pptr;

		/*
		 * See whether we've reached the end of the Modes list
		 */
		if (disp_mode_ptr == NULL) {
			/*
			 * Create a new Modes list element for this Mode name
			 */
			disp_mode_ptr =
				xf86confcalloc(1, sizeof (XF86ModeRec));
			if (disp_mode_ptr == NULL) {
				fbc_errormsg(
				"Insufficient memory, \"%s\" list element\n",
					xf86_entry_mods->video_mode.name);
				return (FBC_ERR_NOMEM);
			}
			disp_mode_ptr->mode_name =
			    xf86configStrdup(xf86_entry_mods->video_mode.name);
			if (disp_mode_ptr->mode_name == NULL) {
				xf86conffree(disp_mode_ptr);
				fbc_errormsg(
				"Insufficient memory, \"%s\" name string\n",
					    xf86_entry_mods->video_mode.name);
				return (FBC_ERR_NOMEM);
			}
			break;
		}

		/*
		 * See whether this existing Mode name is a match
		 */
		if (xf86nameCompare(xf86_entry_mods->video_mode.name,
				    disp_mode_ptr->mode_name) == 0) {
			/*
			 * Unlink the matching Mode name element from the list
			 */
			*disp_mode_pptr =
				(XF86ModePtr)disp_mode_ptr->list.next;
			break;
		}
	}

	/*
	 * Replace the Mode
	 */
	if (display_subsectn_ptr->disp_mode_lst)
		xf86conffree(display_subsectn_ptr->disp_mode_lst);
	display_subsectn_ptr->disp_mode_lst = disp_mode_ptr;

	/*
	 * Insert a new Mode line ER or modify an existing one
	 */
	if (no_modes_line) {
		/*
		 * Insert the External Representation of the new Modes line
		 */
		(void) fbc_insert_line_ER(
				display_subsectn_ptr->disp_end_line_er,
				display_subsectn_ptr,
				(xf86_print_fn_t *)
					&xf86printDisplaySubsectionModes,
				FBC_INDENT_1);
	} else {
		/*
		 * Modify the External Representation of the Modes line
		 */
		fbc_modify_line_ER(display_subsectn_ptr->disp_modes_line_er);
	}

	return (FBC_SUCCESS);

}	/* fbc_edit_Display_subsection() */


/*
 * fbc_insert_Display_subsection()
 *
 *    Insert a new, semi-empty Display subsection in the configuration
 *    at the specified location.
 *
 *        Subsection "Display"
 *     [          Monitor <monitor_num>    ]
 *    #[          Depth   <depth>          ]
 *    #[          FbBpp   <bpp>            ]
 *        EndSubsection
 */

int
fbc_insert_Display_subsection(
	XF86ConfScreenPtr screen_ptr,	/* Ptr to new Screen section IR */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	XF86ConfScrnMonitorEntryPtr mon_ptr, /* Ptr to Monitor entry */
	XF86ConfDisplayPtr *display_ptr) /* Ptr to new Display subsection IR */
{

	/*
	 * Allocate and initialize the Internal Rep for new Display subsection
	 */
	*display_ptr = xf86confcalloc(1, sizeof (XF86ConfDisplayRec));
	if (*display_ptr == NULL) {
		return (FBC_ERR_NOMEM);
	}

	(*display_ptr)->disp_monitor_seen = FALSE;

	(*display_ptr)->disp_black.red    = -1;
	(*display_ptr)->disp_black.green  = -1;
	(*display_ptr)->disp_black.blue   = -1;

	(*display_ptr)->disp_white.red    = -1;
	(*display_ptr)->disp_white.green  = -1;
	(*display_ptr)->disp_white.blue   = -1;

	(*display_ptr)->disp_frameX0      = -1;
	(*display_ptr)->disp_frameY0      = -1;

	/*
	 * Insert the External Representation data for the Display subsection
	 */
	/*  Subsection "Display"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*display_ptr,
			(xf86_print_fn_t *)
				&xf86printDisplaySubsectionSubsection,
			FBC_INDENT_1);

	/*  Monitor <monitor_num>  */
	if ((mon_ptr != NULL) && (mon_ptr->scrn_monitor_num_seen)) {
		(*display_ptr)->disp_monitor_seen = TRUE;
		(*display_ptr)->disp_monitor_num  = mon_ptr->scrn_monitor_num;
		(void) fbc_insert_line_ER(
			next_line_er,
			*display_ptr,
			(xf86_print_fn_t *)&xf86printDisplaySubsectionMonitor,
			FBC_INDENT_2);
	}

	/*  Depth <depth>  */

	/*  FbBpp <bpp>  */

	/*  EndSubsection  */
	(*display_ptr)->disp_end_line_er =
		fbc_insert_line_ER(
			next_line_er,
			*display_ptr,
			(xf86_print_fn_t *)
				&xf86printDisplaySubsectionEndSubsection,
			FBC_INDENT_1);

	/*
	 * Add the new Display subsection to the in-memory configuration
	 */
	screen_ptr->scrn_display_lst =
			(XF86ConfDisplayPtr)xf86addListItem(
					(glp)screen_ptr->scrn_display_lst,
					(glp)*display_ptr);

	return (FBC_SUCCESS);

}	/* fbc_insert_Display_subsection() */


/*
 * fbc_edit_Screen_section()
 *
 *    Modify or insert Screen section values to the Internal
 *    Representation of the configuration file.
 *        DefaultDepth "8"|"24"                       # -defdepth "8"|"24"
 */

int
fbc_edit_Screen_section(
	XF86ConfScreenPtr screen_sectn_ptr, /* Ptr to current Screen section */
	xf86_ent_mod_t	*xf86_entry_mods) /* Config entry modifications */
{

	/*
	 * Make any DefaultDepth modification to the Screen section
	 */
	if (xf86_entry_mods->scrn_defaultdepth != FBC_NO_DefaultDepth) {
		/*
		 * Update the line's Internal Representation
		 */
		screen_sectn_ptr->scrn_defaultdepth =
					xf86_entry_mods->scrn_defaultdepth;

		/*
		 * Insert or modify the line's External Representation
		 */
		fbc_edit_line_ER(&screen_sectn_ptr->scrn_defaultdepth_line_er,
				screen_sectn_ptr->scrn_end_line_er,
				screen_sectn_ptr,
				(xf86_print_fn_t *)
					&xf86printScreenSectionDefaultDepth,
				FBC_INDENT_1);
	}

	return (FBC_SUCCESS);

}	/* fbc_edit_Screen_section() */


/*
 * fbc_insert_new_Screen_section()
 *
 *    Insert a new, mostly empty Screen section in the configuration at
 *    the specified location.
 *
 *        Section "Screen"
 *            Identifier  "<screen_identifier>"
 *            Device      "<device_identifier>"
 *        EndSection
 *        <blank line>
 *
 *    The Monitor entry will be inserted later, iff there are command
 *    line options that modify a Monitor section.
 *
 *    Note that the Screen section identifier string, scrn_identifier,
 *    has been dynamically allocated by our caller.  The Device section
 *    identifier, scrn_device_str, is assumed not to have been.
 */

static
int
fbc_insert_new_Screen_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	char		*scrn_identifier, /* Screen section identifier */
	const char	*scrn_device_str, /* Device section identifier */
	XF86ConfScreenPtr *screen_ptr)	/* Ptr to new Screen section IR */
{

	/*
	 * Allocate and initialize the Internal Rep for a new Screen section
	 */
	*screen_ptr = xf86confcalloc(1, sizeof (XF86ConfScreenRec));
	if (*screen_ptr == NULL) {
		return (FBC_ERR_NOMEM);
	}

	(*screen_ptr)->scrn_identifier = scrn_identifier;
	(*screen_ptr)->scrn_device_str = xf86configStrdup(scrn_device_str);

	/*
	 * Insert the External Representation data for the Screen section
	 */
	/*  Section "Screen"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*screen_ptr,
			(xf86_print_fn_t *)&xf86printScreenSectionSection,
			FBC_INDENT_0);

	/*  Identifier "<screen_identifier>"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*screen_ptr,
			(xf86_print_fn_t *)&xf86printScreenSectionIdentifier,
			FBC_INDENT_1);

	/*  Device "<device_identifier>"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*screen_ptr,
			(xf86_print_fn_t *)&xf86printScreenSectionDevice,
			FBC_INDENT_1);

	/*  EndSection  */
	(*screen_ptr)->scrn_end_line_er =
		fbc_insert_line_ER(
			next_line_er,
			*screen_ptr,
			(xf86_print_fn_t *)&xf86printScreenSectionEndSection,
			FBC_INDENT_0);

	/*  <blank line>  */
	(void) fbc_insert_line_ER(
			next_line_er,
			"\n",
			(xf86_print_fn_t *)&fbc_print_config_text,
			FBC_INDENT_0);

	/*
	 * Add the new Screen section to the in-memory configuration
	 *
	 *    The External and Internal Representations of this Screen
	 *    section must agree that it is either first (FBC_FIRST_ER)
	 *    or last (FBC_LAST_ER aka NULL) in the configuration.
	 */
	if (next_line_er == FBC_LAST_ER) {
		/*
		 * Last Screen section in the configuration
		 */
		configIR->conf_screen_lst =
			(XF86ConfScreenPtr)xf86addListItem(
					(glp)configIR->conf_screen_lst,
					(glp)*screen_ptr);
	} else {
		/*
		 * First Screen section in the configuration
		 */
		(*screen_ptr)->list.next  = configIR->conf_screen_lst;
		configIR->conf_screen_lst = *screen_ptr;
	}

	return (FBC_SUCCESS);

}	/* fbc_insert_new_Screen_section() */


/*
 * fbc_insert_Screen_section()
 *
 *    Insert a new, empty Screen section in the configuration at the
 *    specified location.
 */

int
fbc_insert_Screen_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	const char	*scrn_ident_tmpl, /* Screen section ident template */
	const char	*scrn_device_str, /* Device section identifier */
	XF86ConfScreenPtr *screen_ptr)	/* Ptr to new Screen section IR */
{
	int		error_code;	/* Error code */
	unsigned int	i;		/* Loop counter / uniqueness factor */
	const char	*ident_format;	/* Format for unique identifier */
	char		*scrn_identifier; /* Screen section identifier */

	/*
	 * Allocate memory for the new Screen identifier string
	 *
	 *    Allocate space for the intended name and any extra
	 *    underscore and decimal digits needed to make it unique.
	 *    The number of digits will never be greater than the byte
	 *    size of the loop counter, i, multiplied by three decimal
	 *    digits per byte.
	 */
	scrn_identifier = xf86confmalloc(strlen(scrn_ident_tmpl)
					+ 1			/* "_" */
					+ 3 * sizeof (i)	/* Digits */
					+ 1);			/* Nul */
	if (scrn_identifier == NULL) {
		return (FBC_ERR_NOMEM);
	}

	/*
	 * Insure that the new Screen section identifier will be unique
	 */
	ident_format = "%s";
	for (i = 0; ; ) {
		XF86ConfScreenPtr scrn_ptr; /* Ptr to existing Screen sectn */

		/*
		 * Try the name alone and then the name with a numeric suffix
		 */
		sprintf(scrn_identifier, ident_format, scrn_ident_tmpl, i);
		ident_format = "%s_%u";

		/*
		 * Search for this name among the existing Screen sections
		 */
		for (scrn_ptr = configIR->conf_screen_lst;
		     scrn_ptr != NULL;
		     scrn_ptr = scrn_ptr->list.next) {
			if (xf86nameCompare(scrn_identifier,
					    scrn_ptr->scrn_identifier) == 0) {
				break;	/* Not unique */
			}
		}

		/*
		 * Stop when the name is unique (or if the loop counter wraps)
		 */
		i += 1;
		if ((scrn_ptr == NULL) || (i == 0)) {
			break;		/* The name is unique enough */
		}
	}

	/*
	 * Insert a new Screen section into the in-memory configuration
	 */
	error_code = fbc_insert_new_Screen_section(configIR,
						    next_line_er,
						    scrn_identifier,
						    scrn_device_str,
						    screen_ptr);
	if (error_code != FBC_SUCCESS) {
		xf86conffree(scrn_identifier);
		return (error_code);
	}

	return (FBC_SUCCESS);

}	/* fbc_insert_Screen_section() */


/* End of fbc_Screen.c */
