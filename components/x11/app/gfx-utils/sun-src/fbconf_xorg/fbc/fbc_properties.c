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
 * fbc_properties - Establish fbconf_xorg(1M) program properties
 */


#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_getargs.h"	/* Program command line processing */
#include "fbc_help.h"		/* Program usage and help messages */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_propt.h"		/* Display the current option settings */


/*
 * Command line options that commonly might be implied by "-defaults"
 *
 *    The form of every <x> option name string should be something like:
 *        "-defaults; -<x>"
 *    instead of simply:
 *        "-<x>"
 *    Read ";" as "implies" (which could be spelled out if need be).
 *    This is for reporting errors, such as conflicting option values.
 *    It allows us to tell the user that the error is asociated with the
 *    actual -defaults option and the -<x> option that is implied.
 *    Whatever form is chosen, this option name string must look right
 *    when displayed by the fbc_errormsg() error reporting code.
 */

char *const fbc_defargv_clone[] =
	{ "-defaults; -clone", "disable", NULL };

char *const fbc_defargv_deflinear[] =
	{ "-defaults; -deflinear", "false", NULL };

char *const fbc_defargv_defoverlay[] =
	{ "-defaults; -defoverlay", "false", NULL };

char *const fbc_defargv_deftransparent[] =
	{ "-defaults; -deftransparent", "false", NULL };

char *const fbc_defargv_doublehigh[] =
	{ "-defaults; -doublehigh", "disable", NULL };

char *const fbc_defargv_doublewide[] =
	{ "-defaults; -doublewide", "disable", NULL };

char *const fbc_defargv_fake8[] =
	{ "-defaults; -fake8", "disable", NULL };

char *const fbc_defargv_g[] =
	{ "-defaults; -g", FBC_GAMMA_DEFAULT_STR, NULL };

char *const fbc_defargv_multisample[] =
	{ "-defaults; -multisample", "disable", NULL };

char *const fbc_defargv_offset[] =
	{ "-defaults; -offset", "0", "0", NULL };

char *const fbc_defargv_outputs[] =
	{ "-defaults; -outputs", "direct", NULL };

char *const fbc_defargv_rscreen[] =
	{ "-defaults; -rscreen", "disable", NULL };

char *const fbc_defargv_samples[] =
	{ "-defaults; -samples", "4", NULL };

char *const fbc_defargv_slave[] =
	{ "-defaults; -slave", "disable", NULL };

char *const fbc_defargv_stereo[] =
	{ "-defaults; -stereo", "false", NULL };


/*
 * Command line option descriptors for fbconf_xorg with an unknown device type
 *
 *    This descriptor array won't be used except in the case of an
 *    unproven [a-z]fb_properties.c module.
 */
static fbopt_descr_t	fbc_option[] = {
	{
	/* End-of-table marker */
		NULL,
		NULL,
		NULL,
		0,
		NULL,
		0,
		NULL
	}
};


/*
 * List of functions to display the current option settings (-propt)
 *
 *    This function array won't be used except in the case of an
 *    unproven [a-z]fb_properties.c module.
 */
static fbc_propt_fn_t	*fbc_propt_fn[] = {
	fbc_propt_file,			/* Configuration file */
	NULL				/* End of table */
};


/*
 * fbc_get_base_properties()
 *
 *    Establish some minimal and/or generic fbconf_xorg(1M) properties.
 *
 *    Some of these are applicable when the device type is not known.
 *    Some might be overwritten when the device type becomes known.
 *    Some of these are "universally" applicable and need not be
 *    overwritten except in fairly unforseen circumstances.
 */

void
fbc_get_base_properties(
	fbc_varient_t	*fbvar)		/* Returned fbconf_xorg properties */
{

	/*
	 * Establish the minimal fbconf_xorg(1M) behavior
	 */
	fbvar->getargs           = &fbc_getargs;
	fbvar->usage             = &fbc_usage;
	fbvar->usage_text_header = fbc_usage_text_header;
	fbvar->usage_text_body   = fbc_usage_text_body;
	fbvar->help              = &fbc_help;

	fbvar->fbc_option        = &fbc_option[0];

	fbvar->xf86_entry_mods.Option_mods_size =
				sizeof (fbc_option) / sizeof (fbopt_descr_t);

	fbvar->revise_settings   = NULL;
	fbvar->init_device       = NULL;
	fbvar->propt_fn          = &fbc_propt_fn[0];
	fbvar->res_mode_try      = NULL;	/* "-res <video_mode> try" */
	fbvar->res_mode_now      = NULL;	/* "-res <video_mode> now" */

}	/* fbc_get_base_properties() */


/* End of fbc_properties.c */
