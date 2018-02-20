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
 * fbc_getargs - Program command line processing
 */



#ifndef	_FBC_GETARGS_H
#define	_FBC_GETARGS_H


#include <stdio.h>		/* FILE */

#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_xorg.h"		/* Edit config file data representations */


/*
 * Configuration file pathnames & search path (passed to xf86openConfigFile())
 */
extern const char *const fbc_config_search_path; /* Absolute pathname: "%A" */


/*
 * Ordinal-valued keyword table entry definition and table declarations
 */

typedef struct {
	const char *const argv_name;	/* Program command line keyword */
	const char *const conf_name;	/* Config file keyword, else NULL */
	int		value;		/* Keyword's ordinal value */
} keywd_int_t;

enum {
	FBC_File_Machine,		/* /etc/X11/xorg.conf */
	FBC_File_System			/* /usr/X11/xorg.conf */
};
extern const keywd_int_t fbc_keywds_file[];	/* Machine, System */

#ifdef FBC_FUTURE
extern const keywd_int_t fbc_keywds_DefaultDepth[]; /* 8, 24 */

#endif	/* FBC_FUTURE */

enum {
	FBC_Bool_False,			/* False */
	FBC_Bool_True			/* True */
};
extern const keywd_int_t fbc_keywds_boolean[];
extern const keywd_int_t fbc_keywds_xable[];
extern const keywd_int_t fbc_keywds_swappedirect[];

	/* -slave / MultiviewMode */
enum {
	FBC_Multiview_NOTSET = 0,
	FBC_Multiview_Disable,
	FBC_Multiview_Multiview,
	FBC_Multiview_Stereo,
	FBC_Multiview_BNC
};
extern const keywd_int_t fbc_keywds_MultiviewMode[];

	/* -multisample / Multisample */
enum {
	FBC_SampleMode_NOTSET = 0,
	FBC_SampleMode_Off,		/* Disable */
	FBC_SampleMode_On,		/* Available / Enable(old) */
	FBC_SampleMode_Auto		/* ForceOn / Auto(old) */
};
extern const keywd_int_t fbc_keywds_Multisample[];

extern const keywd_int_t fbc_keywds_res_nn[];	/* noconfirm, nocheck */
extern const keywd_int_t fbc_keywds_res_nntn[];	/* nocon., nocheck, try, now */

extern const keywd_int_t fbc_keywds_Samples[]; /* 1, 4, 8, 16 */


void fbc_search_optvals(
	fbc_varient_t	*fbvar,		/* Program varient data */
	const char	*const	option_name, /* Command line option name */
	const keywd_int_t *keywd_table,	/* Table of recognized keywords */
	const char	*const	option_value, /* Keyword string to look up */
	const keywd_int_t **match_ent_ptr); /* Returned ptr to matching ent */

int fbc_add_Option_mod(
	sectn_mask_t	option_section,	/* Option entry (sub)section */
	const char	*option_name,	/* Option entry name  string */
	const char	*option_value,	/* Option entry value string */
	int (* strcmp_fn)(const char *s1, const char *s2),
					/* strcmp(), strcasecmp(), etc. */
	fbc_varient_t	*fbvar,		/* Program varient data */
	xf86_opt_mod_t	**option_mod_p); /* Option descr ptr ptr, else NULL */

void fbc_add_radio_Option_mod(
	const keywd_int_t *keywd_table,	/* Table of recognized keywords */
	const char	*option_reset_value, /* Opt reset keyword, else NULL */
	char	*const	argv[],		/* Program argument vector */
	int		arg,		/* Program argument number */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr,	/* Ptr to cmd line option descr */
	xf86_opt_mod_t	**option_mod_p); /* Option descr ptr ptr, else NULL */

/*
 * Program command line option evaluation functions
 */

typedef void fbc_getopt_fn_t(		/* Program cmd line option evaluator */
		char	*const argv[],	/*   Program argument vector */
		int	*arg,		/*   Program argument subscript */
		fbc_varient_t *fbvar,	/*   Program varient data */
		const void *fbopt_descr); /*   Ptr to cmd line option descr */

#ifdef FBC_FUTURE
fbc_getopt_fn_t		fb_Option_none;
#endif
fbc_getopt_fn_t		fbc_Option_keyword;
#ifdef FBC_FUTURE
fbc_getopt_fn_t		fbc_Option_int;
#endif
fbc_getopt_fn_t		fbc_Option_Stream_Offset;
#ifdef FBC_FUTURE
fbc_getopt_fn_t		fbc_Option_real;
fbc_getopt_fn_t		fbc_Option_frequency;
fbc_getopt_fn_t		fbc_Option_string;
fbc_getopt_fn_t		fbc_opt_DefaultDepth;
#endif
fbc_getopt_fn_t		fbc_opt_defaults;
fbc_getopt_fn_t		fbc_opt_dev;
fbc_getopt_fn_t		fbc_opt_file;
fbc_getopt_fn_t		fbc_opt_Gamma;
fbc_getopt_fn_t		fbc_Option_GFile;
fbc_getopt_fn_t		fbc_opt_help;
fbc_getopt_fn_t		fbc_opt_prconf;
fbc_getopt_fn_t		fbc_opt_predid;
fbc_getopt_fn_t		fbc_opt_propt;
fbc_getopt_fn_t		fbc_opt_res;


/*
 * fbconf_xorg(1M) program command line option descriptor
 *
 *    The array of fbopt_descr_t elements is used to describe program
 *    command line options that are recognized and how they should be
 *    handled.
 *
 *    When not NULL, the .conf_name pointer provides a string of one or
 *    more names.  Each name is Nul-terminated.  An additional Nul
 *    terminates the entire string when a variable number of names is
 *    expected (which precludes zero-length names other than the first
 *    one).  These are config Option entry names and/or pseudo-Option
 *    names.  Pseudo-Option names have a "#" prefix (e.g., "#Gamma") to
 *    identify and set them apart.  The names in a string are often of
 *    Options that are ganged in radio-button fashion; setting one
 *    resets the others (e.g., "DefLinear", "DefOverlay", and
 *    "DefTransparent").  Attempting to set more than one is an error.
 *    Pseudo-Options are an evil necessitated by "GFile", which is an
 *    Option, and "Gamma", which is not, however, they must work in
 *    radio-button fashion.  The corresponding fbc_getopt_fn function
 *    uses the string of names according to its needs.  The case of
 *    "StreamXOffset" and "StreamYOffset" is an exception where one
 *    command line option generates two Option entries.
 *
 *    The .defaults_argv pointer is NULL except for command line options
 *    that have default values that can be set by the -defaults option.
 *    In that case, the .defaults_argv member points to an argv-style
 *    array of option strings that provide the default value(s).
 *
 *    For command line option processing, a NULL .argv_name pointer
 *    marks the end of the array.  For help text display, a NULL
 *    .help_text pointer marks the end of the array.  Both pointers
 *    should therefore be NULL in the array terminator element.
 */
typedef struct {
	const char *const argv_name;	/* Command line option name */
	const char *const help_text;	/* Command line option help text */
	int		option_args;	/* Minimum # of option arguments */
	fbc_getopt_fn_t	*fbc_getopt_fn;	/* Cmd line option eval function */
	const keywd_int_t *keywd_table;	/* Cmd line option argument keywords */
	sectn_mask_t	section;	/* Config entry [sub]section code */
	const char *const conf_name;	/* Config Option entry name(s) */
	char	*const	*defaults_argv;	/* argv[] for -defaults, else NULL */
} fbopt_descr_t;


int fbc_getargs(
	const int	argc,		/* Program argument count */
	char	*const	argv[],		/* Program argument vector */
	fbc_varient_t	*fbvar);	/* Program varient data */


#endif	/* _FBC_GETARGS_H */


/* End of fbc_getargs.h */
