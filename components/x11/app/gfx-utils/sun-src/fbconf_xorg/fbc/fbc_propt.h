/*
 * Copyright (c) 2004, 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_propt - Display the current option settings
 */



#ifndef	_FBC_PROPT_H
#define	_FBC_PROPT_H


#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_xorg.h"		/* Edit config file data representations */


typedef void fbc_propt_fn_t(fbc_varient_t *fbvar);

void fbc_propt_name(
	const char * const label,	/* Label string */
	const char * const name,	/* Name string, else NULL */
	const char * const no_name);	/* Alternate string for missing name */

fbc_propt_fn_t	fbc_propt_file;		/* Configuration file */
fbc_propt_fn_t	fbc_propt_video_mode;	/* Current video mode name: -res */
fbc_propt_fn_t	fbc_propt_stereo;	/* Current stereo video mode */
fbc_propt_fn_t	fbc_propt_multisample;	/* Multisample mode settings */
fbc_propt_fn_t	fbc_propt_screen_title;	/* Screen settings title */
fbc_propt_fn_t	fbc_propt_dual_screen;	/* Dual-screen: -doublexxxxx */
fbc_propt_fn_t	fbc_propt_clone;	/* Clone setting */
fbc_propt_fn_t	fbc_propt_offset;	/* Screen offset settings */
fbc_propt_fn_t	fbc_propt_outputs;	/* Outputs setting */
fbc_propt_fn_t	fbc_propt_fake8;	/* Fake8 rendering: -fake8 */
fbc_propt_fn_t	fbc_propt_rscreen;	/* Remote console setting: -rscreen */
fbc_propt_fn_t	fbc_propt_visual_title;	/* Visual Information title */
fbc_propt_fn_t	fbc_propt_default_visual; /* Default visual: -defxxxxx" */
fbc_propt_fn_t	fbc_propt_g;		/* Gamma setting: -g only */
fbc_propt_fn_t	fbc_propt_gamma;	/* Gamma setting: -g and -gfile */

void fbc_propt(
	fbc_varient_t	*fbvar);	/* Program varient data */


#endif	/* _FBC_PROPT_H */


/* End of fbc_propt.h */
