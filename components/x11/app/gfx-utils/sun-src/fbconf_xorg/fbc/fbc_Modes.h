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

#ifndef	_FBC_MODES_H
#define	_FBC_MODES_H


#include "xf86Parser.h"		/* Public function, etc. declatations */


int fbc_append_Modes_sections(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	const char	*device_type);	/* Device type name (e.g. "nfb") */

int fbc_trim_Modes_sections(
        XF86ConfigPtr   configIR,       /* Ptr to configuration Internal Rep */
        const char      *mode
        );

void
fbc_remove_monitor_sunmodes_section_ER(
        XF86ConfigPtr           configIR,
        XF86ConfMonitorPtr      monitor_sectn_ptr  /* Ptr to Monitor section IR */
        );

void
fbc_remove_monitor_usemodes_section_ER(
        XF86ConfigPtr           configIR,
        XF86ConfMonitorPtr      monitor_sectn_ptr  /* Ptr to Monitor section IR */
        );

void
fbc_remove_monitor_usemodes_entry_ER(
        XF86ConfigPtr           configIR,
        XF86ConfMonitorPtr      monitor_sectn_ptr  /* Ptr to Monitor section IR */
        );

#endif	/* _FBC_MODES_H */


/* End of fbc_Modes.h */
