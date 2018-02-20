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



#ifndef	_FBC_EDIT_CONFIG_H
#define	_FBC_EDIT_CONFIG_H


//#include <stdio.h>		/* FILE */

#include "xf86Parser.h"		/* XF86ConfigPtr */

#include "fbc_xorg.h"		/* Edit config file data representations */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */


int fbc_find_active_sections(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	sectn_mask_t	ref_config);	/* Referenced config sections, etc. */

int fbc_find_active_mode(
	sectn_mask_t	modify_config,	/* Config sections, etc. to modify */
	xf86_active_t	*active);	/* Active config sections for device */

int fbc_edit_active_sections(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	xf86_active_t	*active,	/* Active config sections for device */
	xf86_ent_mod_t	*xf86_entry_mods); /* Config entry modifications */


#endif	/* _FBC_EDIT_CONFIG_H */


/* End of fbc_edit_config.h */
