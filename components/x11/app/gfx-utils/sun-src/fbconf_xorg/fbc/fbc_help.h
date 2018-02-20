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
 * fbc_help - Program usage and help messages
 */



#ifndef	_FBC_HELP_H
#define	_FBC_HELP_H


#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */


/*
 * Usage message text
 */
extern const char fbc_usage_text_header[];
extern const char fbc_usage_text_body[];

/*
 * Help (-help) message text
 */
extern const char fbc_help_clone[];
extern const char fbc_help_defaults[];
#ifdef	FBC_FUTURE	/* ... or past */
extern const char fbc_help_defdepth[];
#endif
extern const char fbc_help_deflinear[];
extern const char fbc_help_defoverlay[];
extern const char fbc_help_deftransparent[];
extern const char fbc_help_dev[];
extern const char fbc_help_doublewide[];
extern const char fbc_help_doublehigh[];
extern const char fbc_help_fake8[];
extern const char fbc_help_file[];
extern const char fbc_help_g[];
extern const char fbc_help_gfile[];
extern const char fbc_help_help[];
extern const char fbc_help_multisample[];
extern const char fbc_help_offset[];
extern const char fbc_help_outputs[];
extern const char fbc_help_prconf[];
extern const char fbc_help_predid[];
extern const char fbc_help_propt[];
extern const char fbc_help_res_nn[];
extern const char fbc_help_res_nntn[];
extern const char fbc_help_rscreen[];
extern const char fbc_help_samples[];
extern const char fbc_help_slave[];
extern const char fbc_help_stereo[];


void fbc_usage(
	FILE		*output_stream,	/* stdout or stderr */
	fbc_varient_t	*fbvar);	/* Program varient data */

void fbc_help(
	fbc_varient_t	*fbvar);	/* Program varient data */


#endif	/* _FBC_HELP_H */


/* End of fbc_help.h */
