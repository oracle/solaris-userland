/*
 * Copyright (c) 2009, Oracle and/or its affiliates. All rights reserved.
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
 * ast_properties - ast device-specific properties
 *
 *    AST2100
 */

#include <stdlib.h>		/* free() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_getargs.h"	/* Program command line processing */
#include "fbc_help.h"		/* Program usage and help messages */
#include "fbc_properties.h"	/* Establish fbconf_xorg program properties */
#include "fbc_propt.h"		/* Display the current option settings */
#include "fbc_query_device.h"	/* Query a frame buffer device */
#include "fbc_xorg.h"		/* Edit config file data representations */

#include "ast_prconf.h"		/* Display ast hardware configuration */
#include "ast_predid.h"		/* Display EDID data */
#include "ast_properties.h"	/* ast device-specific properties */
#include "ast_query_device.h"	/* Query the ast graphics device */
#include "ast_res_try_now.h"	/* Video mode setting (-res try now) */


/*
 * Tell fbconf_xorg(1M) what API version libSUNWast_conf is using
 */
fbc_api_ver_t SUNWast_api_version = FBC_API_VERSION;


/*
 * Usage (error) message text
 */
static const char	*ast_usage_text_body =
	" [-dev device-filename]\n"
	"\t\t  [-file machine | system | config-path]\n"
	"\t\t  [-res video-mode [nocheck | noconfirm] ]\n"
	"\t\t  [-rscreen enable | disable]\n"
	"\t\t  [-defaults]\n"
	"\t\t  [-help]\n"
	"\t\t  [-res \\?]\n"
	"\t\t  [-prconf] [-predid [raw] [parsed]] [-propt]\n"
	"\n";


/*
 * Command line option descriptors for fbconf_xorg(1M) and ast devices
 *
 *    These table entries must be in -help display order.
 *
 *    When fbc_Option_keyword() is the "Option handler function"
 *    (fbopt_descr_t.fbc_getopt_fn member), the "Config Option entry
 *    name(s)" string (fbopt_descr_t.conf_name member) is composed of
 *    contiguous Nul-terminated Option names that are terminated by an
 *    additional Nul, e.g.:
 *        FBC_KEYWD_DoubleWide "\0" FBC_KEYWD_DoubleHigh "\0"
 *    or (nominally):
 *        "DoubleWide\0DoubleHigh\0\0"
 *
 *    See fbc_getopt.h for the relevant declarations and definitions.
 */

static fbopt_descr_t	ast_option[] = {
	{
	/* -defaults */
		"defaults",		/* Command line option name	*/
		fbc_help_defaults,	/* Help text			*/
		0,			/* Min # of option arguments	*/
		fbc_opt_defaults,	/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL		/* *** POSITIVELY NO RECURSIVE DEFAULTS! *** */
	},
	{
	/* -dev <device> */
		"dev",			/* Command line option name	*/
		fbc_help_dev,		/* Help text			*/
		1,			/* Min # of option arguments	*/
		fbc_opt_dev,		/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTN_Device,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -file machine|system|<config-path> */
		"file",			/* Command line option name	*/
		fbc_help_file,		/* Help text			*/
		1,			/* Min # of option arguments	*/
		fbc_opt_file,		/* Option handler function	*/
		fbc_keywds_file,	/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -help */
		"help",			/* Command line option name	*/
		fbc_help_help,		/* Help text			*/
		0,			/* Min # of option arguments	*/
		fbc_opt_help,		/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -prconf */
		"prconf",		/* Command line option name	*/
		fbc_help_prconf,	/* Help text			*/
		0,			/* Min # of option arguments	*/
		fbc_opt_prconf,		/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -predid [raw] [parsed] */
		"predid",		/* Command line option name	*/
		fbc_help_predid,	/* Help text			*/
		0,			/* Min # of option arguments	*/
		fbc_opt_predid,		/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -propt */
		"propt",		/* Command line option name	*/
		fbc_help_propt,		/* Help text			*/
		0,			/* Min # of option arguments	*/
		fbc_opt_propt,		/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -res ? */
	/* -res <video-mode> [nocheck|noconfirm] [try] [now] */
		"res",			/* Command line option name	*/
		fbc_help_res_nntn,	/* Help text			*/
		1,			/* Min # of option arguments	*/
		fbc_opt_res,		/* Option handler function	*/
		fbc_keywds_res_nntn,	/* Command line option keywords	*/
		FBC_SECTN_Res,		/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	},
	{
	/* -rscreen enable|disable */
		"rscreen",		/* Command line option name	*/
		fbc_help_rscreen,	/* Help text			*/
		1,			/* Min # of option arguments	*/
		fbc_Option_keyword,	/* Option handler function	*/
		fbc_keywds_xable,	/* Command line option keywords	*/
		FBC_SECTN_RScreen,	/* Config section code		*/
		FBC_KEYWD_RScreen "\0",	/* Config Option entry name(s)	*/
		fbc_defargv_rscreen	/* argv[] invoked by -defaults	*/
	},

	{
	/* End-of-table marker */
		NULL,			/* Command line option name	*/
		NULL,			/* Help text			*/
		0,			/* Min # of option arguments	*/
		NULL,			/* Option handler function	*/
		NULL,			/* Command line option keywords	*/
		FBC_SECTION_NONE,	/* Config section code		*/
		NULL,			/* Config Option entry name(s)	*/
		NULL			/* argv[] invoked by -defaults	*/
	}
};


/*
 * List of functions to display the current option settings (-propt)
 */
static fbc_propt_fn_t	*ast_propt_fn[] = {
	fbc_propt_file,			/* Configuration file */
	fbc_propt_video_mode,		/* Current video mode name: -res */
	fbc_propt_screen_title,		/* Screen settings title */
	fbc_propt_rscreen,		/* Remote console setting: -rscreen */
	NULL				/* End of table */
};


/*
 * SUNWast_get_properties()
 *
 *    Return the fbconf_xorg(1M) properties for the ast frame buffer
 *    device type.
 */

int
SUNWast_get_properties(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar)		/* Updated fbconf_xorg properties */
{

	/*
	 * Provide some more frame buffer device information
	 */
	device->max_streams = 1;	/* No 'a'|'b' suffixes */

	/*
	 * Establish the device properties and the fbconf_xorg(1M) behavior
	 */
	fbvar->usage_text_body   = ast_usage_text_body;

	fbvar->gamma_default     = FBC_GAMMA_DEFAULT; /* No gamma correction */

	fbvar->lut_size          = 0;	/* No gamma look-up table w/ ast */
	fbvar->fbc_option        = &ast_option[0];

	fbvar->xf86_entry_mods.Option_mods_size =
				sizeof (ast_option) / sizeof (fbopt_descr_t);

	fbvar->get_edid_res_info = &ast_get_edid_res_info;
	fbvar->revise_settings   = NULL;
	fbvar->init_device       = NULL;
	fbvar->prconf            = &ast_prconf;
	fbvar->predid            = &ast_predid;
	fbvar->propt_fn          = &ast_propt_fn[0];

#if defined(RES_TRY_NOW)
	fbvar->res_mode_try      = &ast_res_mode_try;
	fbvar->res_mode_now      = &ast_res_mode_now;
#else
	fbvar->res_mode_try      = NULL;
	fbvar->res_mode_now      = NULL;
#endif

	return (FBC_SUCCESS);

}	/* SUNWast_get_properties() */


/* End of ast_properties.c */
