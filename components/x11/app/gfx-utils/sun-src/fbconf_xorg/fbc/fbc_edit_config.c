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
 * fbc_edit_config - Write an updated configuration file
 */


#include <sys/types.h>		/* off_t */
#include <sys/param.h>		/* MAXPATHLEN */
#include <errno.h>		/* errno */
#include <stdio.h>		/* fprintf() */
#include <stdlib.h>		/* mkstemp() */
#include <string.h>		/* strcat(), strcpy(), strlen(), strerror() */
#include <unistd.h>
#include <sys/stat.h>		/* stat() */

#include "xf86Parser.h"		/* Public function, etc. declatations */
#include "Configint.h"		/* Private definitions, etc. */
#include "configProcs.h"	/* Private function, etc. declarations */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_Device.h"		/* Edit Device sections */
#include "fbc_Monitor.h"	/* Edit Monitor sections */
#include "fbc_Screen.h"		/* Edit Screen sections */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_edit_config.h"	/* Write an updated configuration file */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_fields.h"		/* Measure aligned whitespace fields */
#include "fbc_line_er.h"	/* External Representation of config lines */


/*
 * fbc_find_active_sections()
 *
 *    Find the active/target sections in the configuration that are
 *    associated with the specified frame buffer device:
 *        Device  section  (required)
 *        Screen  section  (required)
 *        Monitor section  (optional unless the user wants to reference it)
 *        Display subsection of Screen section  (optional unless referenced)
 *
 *    The device handle is used to find (or construct) the target Device
 *    section.  The Device section identifier is used to find (or
 *    construct) the referencing Screen section.  The target Screen
 *    section identifies the target Monitor section (or one may have to
 *    be constructed).  The target Screen section also contains the
 *    target Display subsection (or one may have to be constructed),
 *    which the Monitor section helps to identify.
 */

int
fbc_find_active_sections(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	sectn_mask_t	ref_config)	/* Referenced config sections, etc. */
{
	int		error_code;	/* Error code (FBC_ERR_XXXXX) */
	XF86ConfScrnMonitorEntryPtr mon_ptr; /* Ptr to active Monitor entry */
	fbc_line_elem_t *next_line_er;	/* Line ER following insertion point */
	int		stream_num;	/* Device stream/screen number */

	fbvar->active.screen_sectn     = NULL;
	fbvar->active.display_subsectn = NULL;
	fbvar->active.monitor_sectn    = NULL;

	/*
	 * Find the Device section that refers to this device
	 *
	 *    The Device section must exist for the configuration to be
	 *    correct.  If it doesn't exist then it must be created.  If
	 *    there is more than one, all but the first will be ignored.
	 */
/*???*/	stream_num = 0;
	fbvar->active.device_sectn =
		fbc_find_active_Device_section(
				device, configIR->conf_device_lst, stream_num);
	if (fbvar->active.device_sectn == NULL) {
		/*
		 * Insert a Device section for this device
		 */
		error_code = fbc_insert_Device_section(
					device,
					fbvar,
					configIR,
					FBC_LAST_ER,
					&fbvar->active.device_sectn);
		if (error_code != FBC_SUCCESS) {
			fbc_errormsg("Can't create Device section, %s\n",
					device->path);
			return (error_code);
		}
	}

	/*
	 * Find the first Screen section referring to this Device section name
	 *
	 *    The Screen section must exist for the configuration to be
	 *    correct.  If it doesn't exist then it must be created.
	 */
	fbvar->active.screen_sectn =
		fbc_find_active_Screen_section(
				configIR->conf_screen_lst,
				fbvar->active.device_sectn->dev_identifier);
	if (fbvar->active.screen_sectn == NULL) {
		/*
		 * Insert a Screen section that refers to the Device section
		 *
		 *    If this is the default device (/dev/fb), make this
		 *    the first Screen section in the configuration.
		 *    Otherwise, just append it.
		 */
		next_line_er = FBC_LAST_ER;	/* Append to config */
		if (device->is_default) {
			next_line_er = FBC_FIRST_ER; /* Prepend to config */
		}
		error_code = fbc_insert_Screen_section(
				configIR,
				next_line_er,
				device->name,
				fbvar->active.device_sectn->dev_identifier,
				&fbvar->active.screen_sectn);
		if (error_code != FBC_SUCCESS) {
			fbc_errormsg(
		"Can't create Screen section for Device section, \"%s\"\n",
				fbvar->active.device_sectn->dev_identifier);
			return (error_code);
		}
	}

	/*
	 * Find any active Monitor entry, and therefore the Monitor section
	 *
	 *    Monitor entries within a Screen section are optional.  If
	 *    the user wants to modify the Monitor section, the Display
	 *    subsection, or get to Modes sections (-res ?), then the
	 *    Monitor entry and section must exist or be created.
	 */
	mon_ptr = fbc_find_active_Monitor_entry(
				fbvar->active.screen_sectn->scrn_monitor_lst);
	if ((mon_ptr == NULL) &&
	    (ref_config & (FBC_SECTION_Monitor | FBC_SUBSCTN_Display))) {
		/*
		 * Insert a Monitor section and its Monitor entry
		 *
		 *    Memory allocation errors are unlikely and
		 *    won't corrupt program state.
		 */
		if (fbc_insert_Monitor_section(
					configIR,
					FBC_LAST_ER,
					device->name,
					&fbvar->active.monitor_sectn)
						!= FBC_SUCCESS) {
			fbc_errormsg(
		"Can't create Monitor section for Screen section, \"%s\"\n",
				fbvar->active.screen_sectn->scrn_identifier);
		} else
		if (fbc_insert_Monitor_entry(
					fbvar->active.screen_sectn,
					fbvar->active.monitor_sectn,
					&mon_ptr)
						!= FBC_SUCCESS) {
			fbc_errormsg(
		"Can't create Monitor entry in Screen section, \"%s\"\n",
				fbvar->active.screen_sectn->scrn_identifier);
		}
	}
	if (mon_ptr != NULL) {
		/*
		 * Note the active/target Monitor section
		 */
		fbvar->active.monitor_sectn = mon_ptr->scrn_monitor;

		/*
		 * Find any active/target Display subsection
		 *
		 *    Display subsections within a Screen section are
		 *    optional.  If the user wants to modify the Display
		 *    subsection then it must exist or be created.
		 */
		fbvar->active.display_subsectn =
			fbc_find_active_Display_subsection(
				fbvar->active.screen_sectn,
				mon_ptr,
				fbvar->active.screen_sectn->scrn_display_lst);
		if ((fbvar->active.display_subsectn == NULL) &&
		    (ref_config & FBC_SUBSCTN_Display)) {
			/*
			 * Insert a Display subsection
			 */
			if (fbc_insert_Display_subsection(
				fbvar->active.screen_sectn,
				fbvar->active.screen_sectn->scrn_end_line_er,
				mon_ptr,
				&fbvar->active.display_subsectn)
						!= FBC_SUCCESS) {
				fbc_errormsg(
		"Can't create Display subsection in Screen section, \"%s\"\n",
				fbvar->active.screen_sectn->scrn_identifier);
			}
		}
	}

	return (FBC_SUCCESS);

}	/* fbc_find_active_sections() */


/*
 * fbc_find_active_mode()
 *
 *    This function tries to find the name of the active video mode in
 *    the Modes entry of the active Display Subsection of the active
 *    Screen Section.  For completeness, it also looks for the
 *    corresponding ModeLine / Mode-EndMode entry.
 */

int
fbc_find_active_mode(
	sectn_mask_t	modify_config,	/* Config sections, etc. to modify */
	xf86_active_t	*active)	/* Active config sections for device */
{

	/*
	 * No Mode name or ModeLine / Mode-EndMode entry has been found yet
	 */
	active->mode_name  = NULL;
	active->mode_entry = NULL;

	/*
	 * If Display & Monitor sections are known, find Mode name & Mode entry
	 */
	if (active->display_subsectn != NULL) {
		active->mode_name =
			fbc_find_active_Mode_name(active->display_subsectn);
		if (active->mode_name != NULL) {
			/*
			 * Look for the ModeLine / Mode-EndMode entry
			 */
			active->mode_entry = fbc_find_Monitor_Mode(
							active->monitor_sectn,
							active->mode_name);
		}
	}

	return (FBC_SUCCESS);

}	/* fbc_find_active_mode() */


/*
 * fbc_edit_active_sections()
 *
 *    Edit the active sections in the configuration that are associated
 *    with the frame buffer device.
 */

int
fbc_edit_active_sections(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	xf86_active_t	*active,	/* Active config sections for device */
	xf86_ent_mod_t	*xf86_entry_mods) /* Config entry modifications */
{
	int		error_code;	/* Error code */

	/*
	 * Make any modifications to the existing active Screen section
	 */
	error_code = fbc_edit_Screen_section(
				active->screen_sectn, xf86_entry_mods);
	if (error_code != FBC_SUCCESS) {
		return (error_code);
	}

	/*
	 * Make any modifications to the active Display subsection, if any
	 */
	if (active->display_subsectn != NULL) {
		error_code = fbc_edit_Display_subsection(
				active->display_subsectn, xf86_entry_mods);
		if (error_code != FBC_SUCCESS) {
			return (error_code);
		}
	}

	/*
	 * Make any modifications to the active Monitor section
	 */
	if (active->monitor_sectn != NULL) {
		/*
		 * Make any changes to the active Monitor section
		 */
		error_code = fbc_edit_Monitor_section(
				active->monitor_sectn, xf86_entry_mods);
		if (error_code != FBC_SUCCESS) {
			return (error_code);
		}
	}

	/*
	 * Make any modifications to the Option lists of active sections
	 */
	fbc_edit_Options(active, xf86_entry_mods->Option_mods);

	return (FBC_SUCCESS);

}	/* fbc_edit_active_sections() */


/* End of fbc_edit_config.c */
