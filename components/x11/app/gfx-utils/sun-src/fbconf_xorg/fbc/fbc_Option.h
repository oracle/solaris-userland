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
 * fbc_Option - Edit Option lists
 */



#ifndef	_FBC_OPTION_H
#define	_FBC_OPTION_H


#include "xf86Optrec.h"		/* Option list definitions and declarations */

#include "fbc_xorg.h"		/* Edit config file data representations */


void fbc_set_Option_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name,	/* Option name */
	const char	*option_value);	/* Option value string */

const char *fbc_get_Option_string_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name,	/* Option name */
	const char	*option_not_found, /* Case if Option isn't found */
	const char	*option_value_empty); /* Case if Option has no value */

typedef struct {
	const char * const name;	/* Option value keyword */
	int		value;		/* Option keyword's ordinal value */
} fbc_Optkeywd_t;

int fbc_get_Option_keywd_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name,	/* Option name */
	int		option_not_found, /* Case if Option isn't found */
	int		option_value_bad, /* Case if Option value is bad */
	const fbc_Optkeywd_t *keywd_table); /* Table of Option value keywds */

int fbc_get_Option_bool_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name);	/* Boolean Option name */

void fbc_edit_Options(
	xf86_active_t	*active,	/* Active config sections for device */
	xf86_opt_mod_t	Option_mods[]);	/* Config Option modifications */


#endif	/* _FBC_OPTION_H */


/* End of fbc_Option.h */
