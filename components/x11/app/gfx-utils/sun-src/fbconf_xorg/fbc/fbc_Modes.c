/*
 * Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_Modes - Edit Modes sections
 */


#include <stdio.h>		/* snprintf() */
#include <stdlib.h>		/* exit() */

#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"          /* xf86conffree(), xf86confmalloc() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_Monitor.h"	/* Edit Monitor sections */
#include "fbc_append_config.h"	/* Append configuration file supplement */
#include "fbc_error.h"		/* Error reporting */


/*
 * fbc_append_Modes_sections()
 *
 *    Given a Monitor section and the name of a frame buffer device
 *    type, try to provide the Monitor section with one or more Modes
 *    sections, general and/or device-specific.  This may involve
 *    reading sections from canned files and appending them to the
 *    configuration.
 *
 *    Modes sections and supplemental config file pathnames might be:
 *        "SunModes"    /usr/lib/fbconfig/SunModes_xorg.conf
 *        "efbModes"    /usr/lib/fbconfig/efbModes_xorg.conf
 *        "kfbModes"    /usr/lib/fbconfig/kfbModes_xorg.conf
 *           ...           ...
 *    Currently only SunModes is implemented.  Device-specific Modes
 *    aren't felt to be necessary.
 */

int
fbc_append_Modes_sections(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	const char	*device_type)	/* Device type name (e.g. "kfb") */
{
#if (0)	/* This is used to handle a device-specific Modes section */
	char		dev_mode_name_buf[FBC_MAX_DEV_PATH_LEN]; /* Spacious */
#endif
	const char	**modes_name;	/* Current Modes section name */
	const char	*modes_section_name[4]; /* Modes section names */
	XF86ConfModesPtr modes_sectn_ptr; /* Ptr to Modes section IR */
	XF86ConfModesPtr usemodes_sectn_ptr; /* Ptr to Modes section IR */

	char		 *usemodes_name = "SunModes";
	char		 device_modes_name[80];
	int		 done = 0;

	/*
	 * Think of some well-known Modes sections that might be nice to have
	 */

	sprintf(device_modes_name, "%sSunModes", device_type);
	modes_section_name[0] = device_modes_name;
	modes_section_name[1] = "SunModes";
	modes_section_name[2] = NULL;	/* End-of-table marker */

#if (0)	/* This is how to implement a device-specific Modes section */
	if (snprintf(dev_mode_name_buf, sizeof (dev_mode_name_buf), "%sModes",
			device_type) < sizeof (dev_mode_name_buf)) {
		modes_section_name[1] = dev_mode_name_buf;
		modes_section_name[2] = NULL;	/* End-of-table marker */
	}

#endif	/* That was how to implement a device-specific Modes section */
	/*
	 * Search for each of the Modes section(s) named in our wish list
	 */
	modes_sectn_ptr =
			xf86findModes(usemodes_name, configIR->conf_modes_lst);

	for (modes_name = &modes_section_name[0];
	    !done && *modes_name != NULL;
	    modes_name += 1) {
		/*
		 * Search the existing configuration for the Modes section
		 *
		 *    A Modes section might already be present (e.g.
		 *    "SunModes") because it's used with some other
		 *    monitor.
		 *
		 *    The section may be present because it too is
		 *    contained by the supplemental config file read
		 *    during a previous iteration of this loop.
		 *    Putting more than one section into a supplemental
		 *    config file could be made to work for certain
		 *    purposes, but currently that's not our intent.
		 */
		if (modes_sectn_ptr == NULL) 
{
			/*
			 * Try a well-known file containing the Modes section
			 */
			if (fbc_append_config(configIR,	*modes_name) !=
					FBC_SUCCESS) {
				continue;	/* No Modes supplement file */
			}

			/*
			 * Find the Modes section that was just appended
			 */
			modes_sectn_ptr = xf86findModes(usemodes_name,
						    configIR->conf_modes_lst);
			if (modes_sectn_ptr == NULL) {
				/*
				 * Something evil has been read into the config
				 */
				fbc_errormsg(
		"Supplemental file does not contain Modes \"%s\" section\n",
						*usemodes_name);
				exit(FBC_EXIT_FAILURE);
			}
		}

		/*
		 * Insert the UseModes entry into the Monitor section
		 */
		usemodes_sectn_ptr = xf86findModes(usemodes_name, monitor_sectn_ptr->mon_modes_sect_lst);
		if (usemodes_sectn_ptr == NULL) 
		{
			(void) fbc_insert_UseModes_entry(monitor_sectn_ptr,
						modes_sectn_ptr);
		}
		done = 1;
	}

	return (FBC_SUCCESS);

}	/* fbc_append_Modes_sections() */


/*
 * fbc_trim_Modes_sections()
 *
 * remove all the modes in the SunModes section except the one specified in -res
 *
 * return TRUE if the specified mode is defined in the SunModes section
 * else return FALSE
 */
int
fbc_trim_Modes_sections(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	const char	*mode
	)
{
	XF86ConfModesPtr modes_sectn_ptr; /* Ptr to Modes section IR */
	XF86ConfModeLinePtr modes, ptr, next_mode_ptr, mode_ptr;
	int status = FALSE;

	modes_sectn_ptr = xf86findModes("SunModes", configIR->conf_modes_lst);
	if (modes_sectn_ptr == NULL) 
		return FALSE;

	modes = modes_sectn_ptr->mon_modeline_lst;
	ptr = modes;
	mode_ptr = NULL;

	while (ptr != NULL) {
		next_mode_ptr = ptr->list.next;
                if (xf86nameCompare(mode, ptr->ml_identifier) == 0) {
			mode_ptr = ptr;
		} else {
                	TestFree (ptr->ml_identifier);
                	TestFree (ptr->ml_comment);
                	xf86conffree (ptr);
		}
		ptr = next_mode_ptr;
	}

	modes_sectn_ptr->mon_modeline_lst = mode_ptr;
	if (mode_ptr) {
		mode_ptr->list.next = NULL;
		status = TRUE;
	}

	return status;
}


/*
 * fbc_remove_monitor_sunmodes_section_ER()
 *
 * removes the external representation of the device specific SunModes section
 */

void
fbc_remove_monitor_sunmodes_section_ER(
	XF86ConfigPtr		configIR,
        XF86ConfMonitorPtr 	monitor_sectn_ptr  /* Ptr to Monitor section IR */
	)
{
	char modes_name[80];
	XF86ConfModesPtr modes_sectn_ptr;
        fbc_line_elem_t *line_er;                  /* Ptr to Extnl Rep of config line */

	sprintf(modes_name, "SunModes_%s", monitor_sectn_ptr->mon_identifier);
        modes_sectn_ptr = xf86findModes(modes_name, configIR->conf_modes_lst);
	if (modes_sectn_ptr == NULL)
		return;

	/*
	 * Remove the external representation of this mode section
	 */
	line_er = modes_sectn_ptr->begin_line_er;
	while (line_er != modes_sectn_ptr->end_line_er) {
		fbc_delete_line_ER(line_er);
		line_er = line_er->next_ptr;
	}
	if (modes_sectn_ptr->end_line_er != NULL)
		fbc_delete_line_ER(line_er);
}


/*
 * fbc_remove_monitor_usemodes_entry_ER()
 *
 * removes the device specific use SunModes entry from the external representation
 */

void
fbc_remove_monitor_usemodes_entry_ER(
	XF86ConfigPtr		configIR,
        XF86ConfMonitorPtr 	monitor_sectn_ptr  /* Ptr to Monitor section IR */
	)
{
	char modes_name[80];
	XF86ConfModesLinkPtr usemodes_ptr;

	sprintf(modes_name, "SunModes_%s", monitor_sectn_ptr->mon_identifier);

        usemodes_ptr = xf86findModes(modes_name, monitor_sectn_ptr->mon_modes_sect_lst);

	if (usemodes_ptr != NULL) {
		fbc_delete_line_ER(usemodes_ptr->line_er);
	}
}
/* End of fbc_Modes.c */
