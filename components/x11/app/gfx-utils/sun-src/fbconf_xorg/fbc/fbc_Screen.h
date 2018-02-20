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



#ifndef	_FBC_SCREEN_C
#define	_FBC_SCREEN_C


#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"

#include "fbc_edit_config.h"	/* Write an updated config file */
#include "fbc_Option.h"		/* Edit Option lists */


XF86ConfScrnMonitorEntryPtr fbc_find_active_Monitor_entry(
	XF86ConfScrnMonitorEntryPtr scrn_monitor_lst); /* Monitor entry list */

int fbc_insert_Monitor_entry(
	XF86ConfScreenPtr screen_sectn_ptr, /* Ptr to current Screen section */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to cur Monitor section */
	XF86ConfScrnMonitorEntryPtr *mon_ptr); /* Ptr to Monitor entry */

const char *fbc_find_active_Mode_name(
	XF86ConfDisplayPtr display_subsectn_ptr); /* Ptr to Display subsectn */

XF86ConfDisplayPtr fbc_find_active_Display_subsection(
	XF86ConfScreenPtr screen_sectn_ptr, /* Ptr to active Screen section */
	XF86ConfScrnMonitorEntryPtr mon_ptr, /* Ptr to active Monitor entry */
	XF86ConfDisplayPtr scrn_display_lst); /* Display subsection list */

XF86ConfScreenPtr fbc_find_active_Screen_section(
	XF86ConfScreenPtr conf_screen_lst, /* Head of Screen section list */
	const char	* const	device_identifier); /* Device name */

int fbc_edit_Display_subsection(
	XF86ConfDisplayPtr display_subsectn_ptr, /* Ptr to Display subsectn */
	xf86_ent_mod_t	*xf86_entry_mods); /* Config entry modifications */

int fbc_insert_Display_subsection(
	XF86ConfScreenPtr screen_ptr,	/* Ptr to new Screen section IR */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	XF86ConfScrnMonitorEntryPtr mon_ptr, /* Ptr to Monitor entry */
	XF86ConfDisplayPtr *display_ptr); /* Ptr to new Display subsectn IR */

int fbc_edit_Screen_section(
	XF86ConfScreenPtr screen_sectn_ptr, /* Ptr to Screen section IR */
	xf86_ent_mod_t	*xf86_entry_mods); /* Config entry modifications */

int fbc_insert_Screen_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	const char	*scrn_ident_tmpl, /* Screen section ident template */
	const char	*scrn_device_str, /* Device section identifier */
	XF86ConfScreenPtr *screen_ptr); /* Ptr to new Screen section IR */


#endif	/* _FBC_SCREEN_C */


/* End of fbc_Screen.h */
