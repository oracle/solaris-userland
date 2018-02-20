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



#ifndef	_FBC_MONITOR_H
#define	_FBC_MONITOR_H


#include "xf86Parser.h"		/* Public function, etc. declarations */

#include "fbc_xorg.h"		/* Edit config file data representations */


XF86ConfModeLinePtr fbc_find_Monitor_Mode(
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	const char	*mode_name);	/* ModeLine / Mode-EndMode name */

int fbc_edit_Monitor_section(
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	xf86_ent_mod_t	*xf86_entry_mods); /* Config entry modifications */

int fbc_insert_Monitor_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	const char	*mon_ident_tmpl, /* Monitor section ident template */
	XF86ConfMonitorPtr *monitor_ptr); /* Ptr to new Monitor section IR */

int fbc_insert_UseModes_entry(
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	XF86ConfModesPtr modes_sectn_ptr); /* Ptr to Modes section IR */


#endif	/* _FBC_MONITOR_H */


/* End of fbc_Monitor.h */
