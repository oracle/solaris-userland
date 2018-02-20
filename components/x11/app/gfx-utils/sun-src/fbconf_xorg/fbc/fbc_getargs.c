/*
 * Copyright (c) 2008, 2011, Oracle and/or its affiliates. All rights reserved.
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


#include <stdio.h>		/* fprintf(), fputs() */
#include <stdlib.h>		/* exit(), malloc(), strtof(), strtol() */
#include <string.h>		/* strchr(), strcmp(), strlen() */
#include <unistd.h>		/* issetugid() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_getargs.h"	/* Program command line processing */
#include "fbc_keywds.h"		/* Command line keyword look-up */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_res.h"		/* Video modes/resolutions (-res option) */
#include "fbc_xorg.h"		/* Edit config file data representations */


/*
 * fbc_search_optvals()
 *
 *    Look up the keyword that has been provided as the value for a
 *    command line option.
 */

void
fbc_search_optvals(
	fbc_varient_t	*fbvar,		/* Program varient data */
	const char	* const	option_name, /* Command line option name */
	const keywd_int_t *keywd_table,	/* Table of recognized keywords */
	const char	* const	option_value, /* Keyword string to look up */
	const keywd_int_t **match_ent_ptr) /* Returned ptr to matching ent */
{
	int		error_code;	/* Error code */
	int		i;		/* Loop counter / array index */

	/*
	 * Look up the option value keyword
	 */
	error_code = fbc_search_keywds((void *)keywd_table,
					sizeof (keywd_int_t),
					option_value,
					(const void **)match_ent_ptr);
	if (error_code != FBC_SUCCESS) {
		if (error_code == FBC_ERR_KWD_INVALID) {
			/*
			 * Handle an unknown/invalid option value keyword
			 */
			fbc_errormsg("Invalid value for -%s option: %s\n",
					option_name, option_value);
			fprintf(stderr, "Valid values for -%s option are:\n",
					option_name);
			for (i = 0; keywd_table[i].argv_name != NULL; i += 1) {
				fprintf(stderr, "\t%s\n",
					keywd_table[i].argv_name);
			}
		} else {
			/*
			 * Handle an ambiguous abbreviation of a value keyword
			 */
			fbc_errormsg("Ambiguous value for -%s option.\n",
					option_name);
			fprintf(stderr, "Possible values are:\n");
			fbc_print_matching_keywds((void *)keywd_table,
						sizeof (keywd_int_t),
						option_value);
		}
		fbvar->usage(stderr, fbvar);
		exit(FBC_EXIT_USAGE);
	}

}	/* fbc_search_optvals() */


/*
 * fbc_add_Option_mod()
 *
 *    Add a config Option entry description to the .Option_mods[] array.
 *
 *    Reject conflicting Option values and consolidate duplicate
 *    descriptions.  (Among other things, duplicates raise the
 *    possibility overfilling the .Option_mods[] array).
 *
 *    Currently supported are Option entries having no value or a single
 *    value.
 *
 *    Use fbvar->modify_config to show that the specified section of
 *    the configuration file is to be modified.
 */

int
fbc_add_Option_mod(
	sectn_mask_t	option_section,	/* Option entry (sub)section */
	const char	*option_name,	/* Option entry name  string */
	const char	*option_value,	/* Option entry value string */
	int (* strcmp_fn)(const char *s1, const char *s2),
					/* strcmp(), strcasecmp(), etc. */
	fbc_varient_t	*fbvar,		/* Program varient data */
	xf86_opt_mod_t	**option_mod_p)	/* Option descr ptr ptr, else NULL */
{
	int		i;		/* Loop counter / array subscript */
	xf86_opt_mod_t	*option_mod;	/* Ptr to Option modification descr */

	/*
	 * A NULL Option description pointer can be returned in case of error
	 */
	if (option_mod_p == NULL) {
		/*
		 * If the caller doesn't want this result, discard it someplace
		 */
		option_mod_p = &option_mod;
	}
	*option_mod_p = NULL;

	/*
	 * Taking this code path shows intent to modify a config file section
	 */
	fbvar->modify_config |= option_section;

	/*
	 * See if this Option was specified already and if the values conflict
	 */
	for (i = 0; i < fbvar->xf86_entry_mods.Option_mods_num; i += 1) {
		/*
		 * Compare the config sections and Option names
		 *
		 *    Differences in alphabetic case aren't expected,
		 *    but are possible if our tables are constructed
		 *    carelessly.  XFree86-style insensitivity to
		 *    whitespace and underscores could be supported,
		 *    should that become an issue.
		 */
		option_mod = &fbvar->xf86_entry_mods.Option_mods[i];
		if ((option_section == option_mod->section) &&
		    (strcasecmp(option_name, option_mod->name) == 0)) {
			/*
			 * Compare the Option values or absence thereof
			 *
			 *    Our caller has provided strcmp_fn that
			 *    does case-insensitive comparisons for
			 *    keywords, or that does case sensitive
			 *    comparisons for other values such as
			 *    pathnames.  Whitespace- and underscore-
			 *    sensitivity could also be controlled in
			 *    this way.
			 */
			if ((option_value      != NULL) ||
			    (option_mod->value != NULL)) {
				if ((option_value      == NULL) ||
				    (option_mod->value == NULL)) {
					/* NULL and non-NULL conflict */
					return (FBC_ERR_OPT_CONFLICT);
				}
				if (strcmp_fn(option_value, option_mod->value)
						!= 0) {
					/* Value strings don't match */
					return (FBC_ERR_OPT_CONFLICT);
				}
			}

			/*
			 * Option name and value have been specified already
			 */
			*option_mod_p = option_mod;
			return (FBC_SUCCESS);
		}
	}

	/*
	 * Point to the next available Option entry description slot
	 *
	 *    Leave space for the array terminator element.
	 */
	option_mod = &fbvar->xf86_entry_mods.Option_mods[
				fbvar->xf86_entry_mods.Option_mods_num];
	fbvar->xf86_entry_mods.Option_mods_num += 1;
	if (fbvar->xf86_entry_mods.Option_mods_num >=
				fbvar->xf86_entry_mods.Option_mods_size) {
		fbc_errormsg("Internal error; array bound exceeded\n");
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Fill in the Option entry description
	 */
	option_mod->name    = option_name;
	option_mod->value   = option_value;
	option_mod->section = option_section;

	*option_mod_p = option_mod;
	return (FBC_SUCCESS);

}	/* fbc_add_Option_mod() */


/*
 * fbc_add_radio_Option_mod()
 *
 *    Add a config Option entry description to the .Option_mods[] array.
 *    If this and other Options are ganged together in radio button
 *    fashion (e.g., if one's value is set to True then all others' must
 *    be False) then reset the values of the other Options when
 *    necesary.  Note that these Options are all assumed to belong to
 *    the same, single section of the configuration file.
 *
 *    If the Option value is a keyword, look up the command line
 *    argument and convert it to its config file form.
 *
 *    For all Option descriptions that are to be added, reject
 *    conflicting Option values and consolidate duplicate descriptions.
 */

void
fbc_add_radio_Option_mod(
	const keywd_int_t *keywd_table,	/* Table of recognized keywords */
	const char	*option_reset_value, /* Opt reset keyword, else NULL */
	char	* const	argv[],		/* Program argument vector */
	int		arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr,	/* Ptr to cmd line option descr */
	xf86_opt_mod_t	**option_mod_p)	/* Option descr ptr ptr, else NULL */
{
	const keywd_int_t *match_ent_ptr; /* Ptr to matching keyword entry */
	const char	*option_name;	/* Option name  string */
	const char	*option_value;	/* Option value string */
	int (* strcmp_fn)(const char *s1, const char *s2);
					/* strcmp(), strcasecmp(), etc. */

	/*
	 * See whether the config Option value involves a keyword look-up
	 */
	option_value = argv[arg+1];
	strcmp_fn = &strcmp;		/* Assume case-sensitive value */
	if (keywd_table != NULL) {
		/*
		 * Validate the config Option's keyword value
		 */
		fbc_search_optvals(fbvar,
				((fbopt_descr_t *)fbopt_descr)->argv_name,
				keywd_table,
				option_value,
				&match_ent_ptr);

		/*
		 * Get the Option value as it will appear in the config file
		 *
		 *    If the .conf_name hasn't been provided (e.g.,
		 *    fbc_keywds_Samples[]), use the .argv_name.
		 */
		option_value = match_ent_ptr->conf_name;
		if (option_value == NULL) {
			option_value = match_ent_ptr->argv_name;
		}
		strcmp_fn = &strcasecmp; /* Keywords are case insensitive */
	}

	/*
	 * Set up the Option description for the config file
	 */
	option_name = ((const fbopt_descr_t *)fbopt_descr)->conf_name;
	if (fbc_add_Option_mod(
			((const fbopt_descr_t *)fbopt_descr)->section,
			option_name,
			option_value,
			strcmp_fn,
			fbvar,
			option_mod_p) != FBC_SUCCESS) {
		fbc_errormsg("Conflicting option, %s %s\n",
				argv[arg], argv[arg+1]);
		exit(FBC_EXIT_USAGE);
	}

	/*
	 * See whether setting this value should reset related Option values
	 *
	 *    The values of related Options should be reset (in radio
	 *    button fashion) if:
	 *      * A reset value (option_reset_value) has been provided
	 *      * The value of this Option isn't the reset value
	 *      * Related Options exist
	 */
	if ((option_reset_value != NULL) &&
	    (strcasecmp(option_value, option_reset_value) != 0)) {
		/*
		 * Reset each related Option value
		 */
		for (;;) {
			option_name += strlen(option_name) + 1;
			if (*option_name == '\0') {
				break;
			}

			/*
			 * Set up the Option description for the config file
			 */
			if (fbc_add_Option_mod(
					((const fbopt_descr_t *)fbopt_descr)->
								section,
					option_name,
					option_reset_value,
					strcmp_fn,
					fbvar,
					NULL) != FBC_SUCCESS) {
				fbc_errormsg(
				"Conflicting associated option, %s %s\n",
						argv[arg], argv[arg+1]);
				exit(FBC_EXIT_USAGE);
			}
		}
	}

}	/* fbc_add_radio_Option_mod() */

#ifdef FBC_FUTURE

/*
 * fbc_Option_none()
 *
 *    Handle a configuration Option entry having no Option value.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_none(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{

	if (fbc_add_Option_mod(((const fbopt_descr_t *)fbopt_descr)->section,
			((const fbopt_descr_t *)fbopt_descr)->conf_name,
			NULL,		/* Option entry has no value */
			&strcmp,	/* Not used; there's no value */
			fbvar,
			NULL) != FBC_SUCCESS) {
		fbc_errormsg("Conflicting option, %s\n", argv[*arg]);
		exit(FBC_EXIT_USAGE);
	}

}	/* fbc_Option_none() */

#endif	/* FBC_FUTURE */

/*
 * Keyword tables for command line options having keyword arguments
 *
 *    The zeroth keywd_int_t array element contains the "radio button"
 *    reset value in its .conf_name member.  The zeroth element is not
 *    part of the keyword look-up table.  The keyword look-up table
 *    begins at array element [1].
 */

	/* True | False */
const keywd_int_t fbc_keywds_boolean[] = {
	{ NULL,      "False", FBC_Bool_False },	/* Reset value (Boolean) */
	{ "true",    "True",  FBC_Bool_True  },	/* Start of keyword table */
	{ "false",   "False", FBC_Bool_False },
	{ "enable",  "True",  FBC_Bool_True  },
	{ "disable", "False", FBC_Bool_False },
	{ "yes",     "Yes",   FBC_Bool_True  },
	{ "no",      "No",    FBC_Bool_False },
	{ "on",      "On",    FBC_Bool_True  },
	{ "off",     "Off",   FBC_Bool_False },
	{ "0",       "0",     FBC_Bool_False },
	{ "1",       "1",     FBC_Bool_True  },
	{ NULL,      NULL,    FBC_Bool_False }	/* End of keyword table */
};

	/* Enable | Disable */
const keywd_int_t fbc_keywds_xable[] = {
	{ NULL,      "Disable", FBC_Bool_False }, /* Reset value (Boolean) */
	{ "enable",  "Enable",  FBC_Bool_True  }, /* Start of keyword table */
	{ "disable", "Disable", FBC_Bool_False },
	{ "true",    "Enable",  FBC_Bool_True  },
	{ "false",   "Disable", FBC_Bool_False },
	{ "on",      "Enable",  FBC_Bool_True  },
	{ "off",     "Disable", FBC_Bool_False },
	{ "yes",     "Enable",  FBC_Bool_True  },
	{ "no",      "Disable", FBC_Bool_False },
	{ NULL,      NULL,      FBC_Bool_False }  /* End of keyword table */
};

	/* -outputs Swapped | Direct */
const keywd_int_t fbc_keywds_swappedirect[] = {
	{ NULL,      "Direct",  FBC_Bool_False }, /* Reset value (Boolean) */
	{ "swapped", "Swapped", FBC_Bool_True  }, /* Start of keyword table */
	{ "direct",  "Direct",  FBC_Bool_False },
	{ "true",    "Swapped", FBC_Bool_True  },
	{ "false",   "Direct",  FBC_Bool_False },
	{ "yes",     "Swapped", FBC_Bool_True  },
	{ "no",      "Direct",  FBC_Bool_False },
	{ NULL,      NULL,      FBC_Bool_False }  /* End of keyword table */
};

	/* -slave Disable | Multiview | ... */
const keywd_int_t fbc_keywds_MultiviewMode[] = {
	{ NULL,        NULL,        0                       }, /* No reset */
	{ "disable",   "Disable",   FBC_Multiview_Disable   }, /* Start */
	{ "multiview", "Multiview", FBC_Multiview_Multiview },
#ifdef U22only
	{ "bnc",       "BNC",       FBC_Multiview_BNC       },
#endif
	{ NULL,        NULL,        0                       }  /* End */
};

	/* -multisample Disable | Available | ForceOn */
const keywd_int_t fbc_keywds_Multisample[] = {
	{ NULL,        NULL,        0                   }, /* No reset value */
	{ "disable",   "Disable",   FBC_SampleMode_Off  }, /* Start of table */
	{ "available", "Available", FBC_SampleMode_On   },
	{ "forceon",   "ForceOn",   FBC_SampleMode_Auto },
	{ "off",       "Disable",   FBC_SampleMode_Off  },
	{ "on",        "Available", FBC_SampleMode_On   },
	{ "enable",    "Available", FBC_SampleMode_On   },
	{ "auto",      "ForceOn",   FBC_SampleMode_Auto },
	{ "true",      "Available", FBC_SampleMode_On   },
	{ "false",     "Disable",   FBC_SampleMode_Off  },
	{ NULL,        NULL,        0                   }  /* End of table */
};

	/* -samples */
const keywd_int_t fbc_keywds_Samples[] = {
	{ NULL,  NULL,  0 },		/* No reset value defined */
	{ "1",   NULL,  1 },		/* Start of keyword table */
	{ "4",   NULL,  4 },
	{ "8",   NULL,  8 },
	{ "16",  NULL, 16 },
	{ NULL,  NULL,  0 }		/* End of keyword table */
};


/*
 * fbc_Option_keyword()
 *
 *    Handle an configuration Option entry having a keyword value (that
 *    is independent of other Option entries),
 *
 *        Option  "Clone"         "Enable"|"Disable"      # -clone
 *
 *        Option  "MultiviewMode" "Disable"|"Multiview"   # -slave
 *
 *        Option  "Multisample"   "Disable"|"Available"|"ForceOn"
 *
 *        Option  "Samples"       "1"|"4"|"8"|"16"        # -samples
 *
 *        Option  "StereoEnable"  "Enable"|"Disable"      # -stereo
 *
 *    or multiple such configuration Option entries that are ganged
 *    together in radio-button fashion.
 *
 *        Option  "DefLinear"      "True"|"False"         # -deflinear
 *        Option  "DefOverlay"     "True"|"False"         # -defoverlay
 *        Option  "DefTransparent" "True"|"False"         # -deftransparent
 *
 *        Option  "DoubleWide"    "Enable"|"Disable"      # -doublewide
 *        Option  "DoubleHigh"    "Enable"|"Disable"      # -doublehigh
 *
 *    If this and other Options are ganged together in radio button
 *    fashion (e.g., if one's value is set to True then all others' must
 *    be False) then reset the values of the other Options when
 *    necessary.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_keyword(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	const keywd_int_t *keywd_table;	/* Table of recognized keywords */

	/*
	 * Prepare an Option entry having a Boolean-style keyword value
	 */
	keywd_table = ((fbopt_descr_t *)fbopt_descr)->keywd_table;
	fbc_add_radio_Option_mod(&keywd_table[1],
				keywd_table[0].conf_name,
				argv,
				*arg,
				fbvar,
				fbopt_descr,
				NULL);

}	/* fbc_Option_keyword() */

#ifndef FBC_FUTURE

/*
 * fbc_Option_int()
 *
 *    Handle a configuration Option entry having an integer value.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_int(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	char		*end_ptr;	/* Ptr to terminator char */

	/*
	 * Validate the integer value string
	 */
	(void) strtol(argv[*arg+1], &end_ptr, 0);
	if ((end_ptr == argv[*arg+1]) || (*end_ptr != 0)) {
		fbc_errormsg("Invalid integer value, %s %s\n",
				argv[*arg], argv[*arg+1]);
		fbvar->usage(stderr, fbvar);
		exit(FBC_EXIT_USAGE);
	}

	/*
	 * Initialize the config Option descriptor
	 */
	if (fbc_add_Option_mod(((const fbopt_descr_t *)fbopt_descr)->section,
			((const fbopt_descr_t *)fbopt_descr)->conf_name,
			argv[*arg+1],
			&strcasecmp,	/* Hexadecimal is case insensitive */
			fbvar,
			NULL) != FBC_SUCCESS) {
		fbc_errormsg("Conflicting option, %s %s\n",
				argv[*arg], argv[*arg+1]);
		exit(FBC_EXIT_USAGE);
	}

}	/* fbc_Option_int() */

#endif	/* FBC_FUTURE */

/*
 * fbc_Option_Stream_Offset()
 *
 *    Handle the configuration Option entries:
 *         Option "StreamXOffset" <int>
 *         Option "StreamYOffset" <int>
 *
 *    This function handles a single command line option, -offset, that
 *    takes two integer arguments.  Retrieving two config Option names
 *    from one fbopt_descr_t table entry is atypical, and involves an
 *    embedded Nul character in the Option name(s) string.  Config
 *    Option entry descriptors are produced for StreamXOffset &
 *    StreamYOffset.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_Stream_Offset(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descriptor */
{
	char		*end_ptr;	/* Ptr to terminator char */
	int		i;		/* Loop counter / argv[] index */
	const char	*option_name;	/* Option name string */

	/*
	 * Validate the signed integer offset value strings
	 */
	for (i = 1; i <= 2; i += 1) {
		(void) strtol(argv[*arg+i], &end_ptr, 0);
		if ((end_ptr == argv[*arg+i]) || (*end_ptr != 0)) {
			fbc_errormsg("Invalid offset value #%d, %s %s %s\n",
				    i, argv[*arg], argv[*arg+1], argv[*arg+2]);
			fbvar->usage(stderr, fbvar);
			exit(FBC_EXIT_USAGE);
		}
	}

	/*
	 * Initialize StreamXOffset & StreamYOffset config Option descriptors
	 */
	option_name = ((const fbopt_descr_t *)fbopt_descr)->conf_name;
	for (i = 1; i <= 2; i += 1) {
		if (fbc_add_Option_mod(
				((const fbopt_descr_t *)fbopt_descr)->section,
				option_name,
				argv[*arg+i],
				&strcasecmp,	/* Hex is case insensitive */
				fbvar,
				NULL) != FBC_SUCCESS) {
			fbc_errormsg("Conflicting option, %s %s %s\n",
				argv[*arg], argv[*arg+1], argv[*arg+2]);
			exit(FBC_EXIT_USAGE);
		}
		option_name += strlen(option_name) + 1;
	}

}	/* fbc_Option_Stream_Offset() */

#ifdef FBC_FUTURE

/*
 * fbc_Option_real()
 *
 *    Handle a configuration Option entry having a floating point value.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_real(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descriptor */
{
	char		*end_ptr;	/* Ptr to terminator char */

	/*
	 * Validate the floating point value string
	 */
	(void) strtod(argv[*arg+1], &end_ptr);
	if ((end_ptr == argv[*arg+1]) || (*end_ptr != 0)) {
		fbc_errormsg("Invalid floating point value, %s %s\n",
				argv[*arg], argv[*arg+1]);
		fbvar->usage(stderr, fbvar);
		exit(FBC_EXIT_USAGE);
	}

	/*
	 * Initialize the config Option entry descriptor
	 */
	if (fbc_add_Option_mod(((const fbopt_descr_t *)fbopt_descr)->section,
			((const fbopt_descr_t *)fbopt_descr)->conf_name,
			argv[*arg+1],
			strcasecmp,	/* Floating point is insensitive */
			fbvar,
			NULL) != FBC_SUCCESS) {
		fbc_errormsg("Conflicting option, %s %s\n",
				argv[*arg], argv[*arg+1]);
		exit(FBC_EXIT_USAGE);
	}

}	/* fbc_Option_real() */

#endif	/* FBC_FUTURE */
#ifdef FBC_FUTURE

/*
 * fbc_Option_string()
 *
 *    Handle a configuration Option entry having a string value.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_string(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descriptor */
{

	if (fbc_add_Option_mod(((const fbopt_descr_t *)fbopt_descr)->section,
			((const fbopt_descr_t *)fbopt_descr)->conf_name,
			argv[*arg+1],
			&strcasecmp,	/* Ummm ... */
			fbvar,
			NULL) != FBC_SUCCESS) {
		fbc_errormsg("Conflicting option, %s %s\n",
				argv[*arg], argv[*arg+1]);
		exit(FBC_EXIT_USAGE);
	}

}	/* fbc_Option_string() */

#endif	/* FBC_FUTURE */
#ifdef FBC_FUTURE	/* or past */

/*
 * fbc_opt_DefaultDepth()
 *
 *    Set the DefaultDepth entry of a Screen section (-defdepth):
 *
 *        DefaultDepth 8|24
 *
 *    (Had been implemented for kfbconfig OS release 5.9.)
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

const keywd_int_t fbc_keywds_DefaultDepth[] = {
	{ "8",  NULL,  8 },
	{ "24", NULL, 24 },
	{ NULL, NULL,  0 }		/* End of table */
};

void
fbc_opt_DefaultDepth(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descriptor */
{
	const keywd_int_t *match_ent_ptr; /* Ptr to matching keyword entry */

	/*
	 * Get the option's keyword value
	 */
	fbc_search_optvals(fbvar,
			((fbopt_descr_t *)fbopt_descr)->argv_name,
			((fbopt_descr_t *)fbopt_descr)->keywd_table,
			argv[*arg+1],
			&match_ent_ptr);

	/*
	 * Convert the keyword value to the corresponding depth value
	 */
	fbvar->xf86_entry_mods.scrn_defaultdepth = match_ent_ptr->value;

	/*
	 * The -defdepth option shows intent to modify the Screen section
	 */
	fbvar->modify_config |= FBC_SECTN_DefaultDepth;

}	/* fbc_opt_DefaultDepth() */

#endif

/*
 * fbc_opt_defaults()
 *
 *    Establish the default configuration for the specified device
 *    (-defaults).
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_opt_defaults(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	int		defaults_arg;	/* Implied command line arg index */
	const fbopt_descr_t *fbopt_dsc;	/* Ptr to cmd line option descr */

	/*
	 * For each command line option descriptor, set any -defaults values
	 */
	for (fbopt_dsc = fbvar->fbc_option;
	    fbopt_dsc->argv_name != NULL;
	    fbopt_dsc += 1) {
		/*
		 * See if this command line option has any -defaults values
		 */
		if (fbopt_dsc->defaults_argv == NULL) {
			continue;	/* Nope */
		}

		/*
		 * Avoid infinite recursion; disallow defaults for -defaults
		 */
		if ((fbopt_dsc == (fbopt_descr_t *)fbopt_descr) ||
		    (strcasecmp(fbopt_dsc->argv_name, "defaults") == 0)) {
			fbc_errormsg(
	"Internal error; recursive -defaults encountered and ignored\n");
			continue;	/* Let's not find out what that does */
		}

		/*
		 * Set the default(s) for this implied command line option
		 */
		defaults_arg = 0;
		(*fbopt_dsc->fbc_getopt_fn)(fbopt_dsc->defaults_argv,
					    &defaults_arg,
					    fbvar,
					    fbopt_dsc);
	}

}	/* fbc_opt_defaults() */


/*
 * fbc_opt_dev()
 *
 *    Needn't get the frame buffer device name (-dev).
 *
 *    The frame buffer device name should have been determined already
 *    (by fbc_get_device_arg() and fbc_get_device_name()), so it could
 *    be established what command line options to support.
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_opt_dev(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{

	/* void */

}	/* fbc_opt_dev() */


/*
 * fbc_opt_file()
 *
 *    Specify the configuration file (-file)
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

/*
 * Note:  Initialization code in main() assumes that the
 *        fbc_keywds_file[0] entry contains the default values.
 */
const keywd_int_t	fbc_keywds_file[] = {
	{ FBC_FILE_KEYWD_MACHINE, FBC_FILE_PATH_MACHINE, FBC_File_Machine },
	{ FBC_FILE_KEYWD_SYSTEM,  FBC_FILE_PATH_SYSTEM,  FBC_File_System  },
	{ NULL,                   NULL,                  0                }
};

const char * const fbc_config_search_path  = "%A";	/* Absolute path: %A */

void
fbc_opt_file(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	const keywd_int_t *match_ent_ptr; /* Ptr to matching keyword entry */

	/*
	 * Distinguish between keywords and pathnames
	 *
	 *    Pathnames ought to be absolute ("%A"), which means the
	 *    first character must be a slash.  Otherwise, it's assumed
	 *    that the argument is a keyword.
	 */
	if (*argv[*arg+1] == '/') {
		/*
??? Allow this?	 * Save the fully qualified configuration file pathname
		 */
		fbvar->config_file_loc  = NULL;
		fbvar->config_file_path = argv[*arg+1];

		if (issetugid()) {
		    fbc_errormsg("%s %s not allowed with added privileges\n",
				 argv[*arg], argv[*arg+1]);
		    fbvar->usage(stderr, fbvar);
		    exit(FBC_EXIT_USAGE);
		}
	} else {
		/*
		 * Look up the configuration file location keyword
		 */
		fbc_search_optvals(fbvar,
				((fbopt_descr_t *)fbopt_descr)->argv_name,
				((fbopt_descr_t *)fbopt_descr)->keywd_table,
				argv[*arg+1],
				&match_ent_ptr);

		/*
		 * Normalize the location keyword, to be used in -propt output
		 */
		fbvar->config_file_loc  = match_ent_ptr->argv_name;

		/*
		 * Establish the configuration file pathname
		 */
		fbvar->config_file_path = match_ent_ptr->conf_name;
	}

	/*
	 * Establish the configuration file search path
	 */
	fbvar->config_search_path = fbc_config_search_path;

}	/* fbc_opt_file() */


/*
 * fbc_opt_Gamma()
 *
 *    Set the Gamma entry of a Monitor section (-g <gamma_value>):
 *
 *        Gamma <gamma_value>
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_opt_Gamma(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	char		*end_ptr;	/* Ptr to terminator char */

	/*
	 * Process the gamma correction value argument
	 */
	fbvar->xf86_entry_mods.mon_gamma_red = strtof(argv[*arg+1], &end_ptr);
	if ((end_ptr == argv[*arg+1]) ||
	    (*end_ptr != '\0') ||
	    !FBC_VALID_Gamma(fbvar->xf86_entry_mods.mon_gamma_red)) {
		fbc_errormsg("Invalid gamma value, %s %s\n",
				argv[*arg], argv[*arg+1]);
		fbvar->usage(stderr, fbvar);
		exit(FBC_EXIT_USAGE);
	}
	fbvar->xf86_entry_mods.mon_gamma_green =
				fbvar->xf86_entry_mods.mon_gamma_red;
	fbvar->xf86_entry_mods.mon_gamma_blue  =
				fbvar->xf86_entry_mods.mon_gamma_red;

	/*
	 * Add the "#Gamma" pseudo-Option and reset any "GFile" Option
	 *
	 *    If no config entries are ganged with -g ("#Gamma"), we
	 *    don't need to do anything.  This is indicated by having no
	 *    config Option entry names (.conf_name is NULL).
	 *
	 *    If this device has any config entries that are ganged with
	 *    "#Gamma" then they should also be pseudo-Options, or real
	 *    Options for which the empty pathname value, "", is the
	 *    correct reset value.  Pseudo-options are flagged with a
	 *    "#" name prefix.  These fake Options will be eliminated
	 *    from the .Option_mods[] array before the array is used to
	 *    update the config file, so the choice of a reset value is
	 *    unimportant in such cases.
	 *
	 *    The point of all this is to permit these two (more in the
	 *    future?) config entries to be manipulated in radio-button
	 *    fashion, when one is an Option entry and the other is not.
	 */
	if (((const fbopt_descr_t *)fbopt_descr)->conf_name != NULL) {
		fbc_add_radio_Option_mod(NULL,
					"",	/* No gamma table pathname */
					argv,
					*arg,
					fbvar,
					fbopt_descr,
					NULL);
	}

}	/* fbc_opt_Gamma() */


/*
 * fbc_Option_GFile()
 *
 *    Handle a gamma table file pathname configuration Option entry
 *    (-gfile):
 *        Option "GFile" "[<gfile_path>]"
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_Option_GFile(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descriptor */
{
	xf86_opt_mod_t	*option_mod;	/* Option entry description */

	/*
	 * Save the gamma table input file pathname (or empty string)
	 */
	fbvar->gfile_in_path = argv[*arg+1];

	/*
	 * Add the "GFile" Option and reset the "#Gamma" pseudo-Option, if any
	 *
	 *    If this device has any config entries that are ganged with
	 *    "GFile" then they should be pseudo-Options, such as
	 *    "#Gamma", or be real Options for which the arbitrarily
	 *    chosen FBC_GAMMA_DEFAULT_STR is the correct reset value.
	 *    Pseudo-options are flagged with a "#" name prefix.  These
	 *    fake Options will be eliminated from the .Option_mods[]
	 *    array before the array is used to update the config file,
	 *    so the choice of a reset value is unimportant.
	 *
	 *    The point of all this is to permit these two (more in the
	 *    future?) config entries to be manipulated in radio-button
	 *    fashion, when one is an Option entry and the other is not.
	 */
	fbc_add_radio_Option_mod(NULL,		/* "GFile" takes no keywords */
				FBC_GAMMA_DEFAULT_STR, /* A "don't care" arg */
				argv,
				*arg,
				fbvar,
				fbopt_descr,
				&option_mod);

	/*
	 * Arrange to delete any Gamma entry
	 */
	fbvar->xf86_entry_mods.mon_gamma_red   = 0.;
	fbvar->xf86_entry_mods.mon_gamma_green = 0.;
	fbvar->xf86_entry_mods.mon_gamma_blue  = 0.;

	/*
	 * Note where the pointer for the gamma table pathname has been stored
	 *
	 *    The description for the "GFile" Option entry has just been
	 *    initialized using a pointer to the input gamma table
	 *    pathname.  Before the actual Option entry is created, this
	 *    must be replaced by a pointer to the output pathname (e.g.
	 *    "/etc/X11/kfb0.gamma"), which is based on the config file
	 *    directory and the device name.  We don't necessarily know
	 *    the config file directory yet.
	 *
	 *    A further wrinkle is that the Option description needs the
	 *    input pathname during command line processing so that
	 *    conflicting -gfile argument strings can be detected.
	 *
	 *    If this -gfile option has a non-empty pathname argument
	 *    and no other -gfile option has been seen, remember the
	 *    address of the pathname pointer so it can be changed
	 *    later, after the command line processing has been
	 *    completed, and once the output pathname components are
	 *    known.
	 */
	if ((*(argv[*arg+1]) != '\0') && (fbvar->gfile_out_path == NULL)) {
		fbvar->gfile_out_path = &option_mod->value;
	}

}	/* fbc_Option_GFile() */


/*
 * fbc_opt_help()
 *
 *    Handle a request for help with the current varient of
 *    fbconf_xorg(1M) (-help).
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_opt_help(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{

	/*
	 * Remember to be helpful later on
	 */
	fbvar->option_set.help = TRUE;

}	/* fbc_opt_help() */


/*
 * fbc_opt_prconf()
 *
 *    Print hardware configuration (-prconf).
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_opt_prconf(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{

	fbvar->option_set.prconf = TRUE;

}	/* fbc_opt_prconf() */


/*
 * fbc_opt_predid()
 *
 *    Print EDID data (-predid [raw] [parsed]).
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

enum {
	FBC_PrEDID_Raw,
	FBC_PrEDID_Parsed
};
const keywd_int_t	fbc_keywds_predid[] = {
	{ "raw",    NULL, FBC_PrEDID_Raw	},
	{ "parsed", NULL, FBC_PrEDID_Parsed	},
	{ NULL,     NULL, 0			}	/* End of table */
};

void
fbc_opt_predid(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	const keywd_int_t *match_ent_ptr; /* Ptr to matching keyword entry */

	/*
	 * Redundant but safe
	 */
	fbvar->option_set.predid_raw    = FALSE;
	fbvar->option_set.predid_parsed = FALSE;

	/*
	 * Repeat for each argv[] string that looks like an argument
	 */
	while ((argv[*arg+1] != NULL) && (*argv[*arg+1] != '-')) {
		/*
		 * Look up the keyword (and exit if it isn't found)
		 */
		fbc_search_optvals(fbvar,
				((fbopt_descr_t *)fbopt_descr)->argv_name,
				&fbc_keywds_predid[0],
				argv[*arg+1],
				&match_ent_ptr);

		switch (match_ent_ptr->value) {
		case FBC_PrEDID_Raw:	/* 10-sec video mode trial */
			fbvar->option_set.predid_raw = TRUE;
			break;
		case FBC_PrEDID_Parsed:	/* Apply new video mode now */
			fbvar->option_set.predid_parsed = TRUE;
			break;
		default:
			fbc_errormsg(
			"Internal error; unimplemented keyword, %s\n",
					argv[*arg+2]);
			break;
		}

		/*
		 * Include this keyword argument in the count
		 */
		*arg += 1;
	}

	/*
	 * The default is "-predid parsed"
	 */
	if (!(fbvar->option_set.predid_raw ||
		fbvar->option_set.predid_parsed)) {
	    fbvar->option_set.predid_parsed = TRUE;
	}

}	/* fbc_opt_predid() */


/*
 * fbc_opt_propt()
 *
 *    Print configuration options (-propt).
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

void
fbc_opt_propt(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{

	fbvar->option_set.propt = TRUE;

}	/* fbc_opt_propt() */


/*
 * fbc_opt_res()
 *
 *    Video mode/resolution:
 *        -res ?
 *        -res <video_mode> [noconfirm|nocheck]
 *        -res <video_mode> [noconfirm|nocheck] [try|now]
 *
 *    Note: This is a fbc_getopt_fn_t typed function.
 */

enum {
	FBC_ResMode_NOTSET = 0,	/* No update, let window system do it later */
	FBC_ResMode_NoCheck,	/* Don't check video mode for monitor support */
	FBC_ResMode_NoConfirm,	/* Check video mode, but don't ask user */
	FBC_ResMode_Try,	/* Update for 10 seconds, then restore */
	FBC_ResMode_Now		/* Update video mode now */
};
const keywd_int_t fbc_keywds_res_nn[] = {
	{ "nocheck",   NULL, FBC_ResMode_NoCheck   },
	{ "noconfirm", NULL, FBC_ResMode_NoConfirm },
	{ NULL,        NULL, 0                }	/* End of table */
};
const keywd_int_t fbc_keywds_res_nntn[] = {
	{ "nocheck",   NULL, FBC_ResMode_NoCheck    },
	{ "noconfirm", NULL, FBC_ResMode_NoConfirm  },
	{ "try",       NULL, FBC_ResMode_Try	    },
	{ "now",       NULL, FBC_ResMode_Now	    },
	{ NULL,        NULL, 0			    }	/* End of table */
};

void
fbc_opt_res(
	char	* const	argv[],		/* Program argument vector */
	int		*arg,		/* Program argument subscript */
	fbc_varient_t	*fbvar,		/* Program varient data */
	const void	*fbopt_descr)	/* Ptr to cmd line option descr */
{
	const keywd_int_t *match_ent_ptr; /* Ptr to matching keyword entry */

	/*
	 * Redundant but safe
	 */
	fbvar->option_set.res_list           = FALSE;
	fbvar->option_set.res_mode_nocheck   = FALSE;
	fbvar->option_set.res_mode_noconfirm = FALSE;
	fbvar->option_set.res_mode_try       = FALSE;
	fbvar->option_set.res_mode_now       = FALSE;

	/*
	 * Handle -res ? as the special directive for listing video modes
	 */
	if (strcmp(argv[*arg+1], "?") == 0) {
		fbvar->option_set.res_list = TRUE;
		return;
	}

	/*
	 * Save the video mode / resolution name
	 */
	fbvar->xf86_entry_mods.video_mode.name = argv[*arg+1];

	/*
	 * Handle any keyword arguments
	 */
	if (((fbopt_descr_t *)fbopt_descr)->keywd_table != NULL) {
		/*
		 * Repeat for each argv[] string that looks like an argument
		 */
		while ((argv[*arg+2] != NULL) && (*argv[*arg+2] != '-')) {
			/*
			 * Look up the keyword (and exit if it isn't found)
			 */
			fbc_search_optvals(
				fbvar,
				((fbopt_descr_t *)fbopt_descr)->argv_name,
				((fbopt_descr_t *)fbopt_descr)->keywd_table,
				argv[*arg+2],
				&match_ent_ptr);

			switch (match_ent_ptr->value) {
			case FBC_ResMode_NoCheck:
				/* Don't check the video mode argument */
				fbvar->option_set.res_mode_nocheck = TRUE;
				/* "nocheck" implies "noconfirm" */
				/*FALLTHROUGH*/
			case FBC_ResMode_NoConfirm:
				/* Check without confirmation */
				fbvar->option_set.res_mode_noconfirm = TRUE;
				break;
			case FBC_ResMode_Try:
				/* 10-second video mode trial */
				fbvar->option_set.res_mode_try = TRUE;
				break;
			case FBC_ResMode_Now:
				/* Apply the new video mode now */
				fbvar->option_set.res_mode_now = TRUE;
				break;
			default:
				fbc_errormsg(
				"Internal error; unimplemented keyword, %s\n",
						argv[*arg+2]);
				break;
			}

			/*
			 * Include this keyword argument in the count
			 */
			*arg += 1;
		}
	}

	/*
	 * Taking this code path shows intent to modify a config file section
	 */
	fbvar->modify_config |= FBC_SECTN_Res;

}	/* fbc_opt_res() */


/*
 * fbc_getargs()
 *
 *    Process the fbconf_xorg(1M) program command line options.  There
 *    are no legal program command line arguments.
 *
 *    In the event of an error this function or one of its subordinate
 *    functions is expected to report the error and exit the program.
 */

int
fbc_getargs(
	const int	argc,		/* Program argument count */
	char	 *const	argv[],		/* Program argument vector */
	fbc_varient_t	*fbvar)		/* Program varient data */
{
	int		arg;		/* Program cmd line arg index */
	int		error_code;	/* Error code */
	fbopt_descr_t	*fbopt_descr;	/* Program option descriptors */
	xf86_opt_mod_t	*option_mod;	/* Ptr to Option mod descr */

	/*
	 * Fill in "not set" values for the explicitly named xorg.conf entries
	 */
	fbvar->xf86_entry_mods.scrn_defaultdepth = FBC_NO_DefaultDepth;

	fbvar->xf86_entry_mods.mon_gamma_red     = FBC_NO_Gamma;
	fbvar->xf86_entry_mods.mon_gamma_green   = FBC_NO_Gamma;
	fbvar->xf86_entry_mods.mon_gamma_blue    = FBC_NO_Gamma;

	fbvar->xf86_entry_mods.video_mode.name   = FBC_NO_MODE_NAME;

	/*
	 * Allocate a descriptor array of config Option entries to be modified
	 *
	 *    This includes space for the descriptor array's terminator
	 *    element.
	 */
	fbvar->xf86_entry_mods.Option_mods =
			malloc(fbvar->xf86_entry_mods.Option_mods_size
						* sizeof (xf86_opt_mod_t));
	if (fbvar->xf86_entry_mods.Option_mods == NULL) {
		fbc_errormsg("Insufficient memory, Option_mods\n");
		exit(FBC_EXIT_FAILURE);
	}
	fbvar->xf86_entry_mods.Option_mods_num = 0; /* No entries yet */

	fbvar->modify_config = FBC_SECTION_NONE; /* No modifications yet */

	/*
	 * Process the program command line options
	 */
	for (arg = 1; arg < argc; arg += 1) {
		/*
		 * Look up the command line option by name
		 */
		if (*argv[arg] != '-') {
			break;		/* This looks more like an argument */
		}
		error_code = fbc_search_keywds(fbvar->fbc_option,
						sizeof (fbopt_descr_t),
						argv[arg]+1,
						(void *)&fbopt_descr);
		if (error_code != FBC_SUCCESS) {
			if (error_code == FBC_ERR_KWD_INVALID) {
				fbc_errormsg("Unknown option, %s\n",
						argv[arg]);
			} else {
				fbc_errormsg("Option %s is ambiguous.\n",
						argv[arg]);
				fprintf(stderr, "Possible values are:\n");
				fbc_print_matching_keywds(fbvar->fbc_option,
							sizeof (fbopt_descr_t),
							argv[arg]+1);
			}
			fbvar->usage(stderr, fbvar);
			exit(FBC_EXIT_USAGE);
		}

		/*
		 * Make sure the final cmd line option isn't missing an arg
		 */
		if ((arg + fbopt_descr->option_args) >= argc) {
			fbc_errormsg("Option requires an argument, %s\n",
					argv[arg]);
			fbvar->usage(stderr, fbvar);
			exit(FBC_EXIT_USAGE);
		}

		/*
		 * Process the command line option and any argument(s)
		 */
		(*fbopt_descr->fbc_getopt_fn)(argv, &arg, fbvar, fbopt_descr);

		/*
		 * Advance to the next option, if any
		 *
		 *    If the current option accepted a variable number
		 *    of arguments, the "fbc_getopt_fn" function should
		 *    have incremented the "arg" index by the number of
		 *    optional arguments that were encountered.  Here
		 *    the "arg" index is incremented by the number of
		 *    required arguments.
		 */
		arg += fbopt_descr->option_args;
	}

	/*
	 * Disallow program command line arguments
	 */
	if (arg < argc) {
		fbc_errormsg("Unknown option, %s\n", argv[arg]);
		fbvar->usage(stderr, fbvar);
		exit(FBC_EXIT_USAGE);
	}

	/*
	 * Mark the end of the array of config Option entries to be modified
	 */
	option_mod = &fbvar->xf86_entry_mods.Option_mods[
			fbvar->xf86_entry_mods.Option_mods_num];
	option_mod->section = 0;
	option_mod->name    = NULL;
	option_mod->value   = NULL;

	/*
	 * Return without incident
	 */
	return (FBC_EXIT_SUCCESS);

}	/* fbc_getargs() */


/* End of fbc_getargs.c */
