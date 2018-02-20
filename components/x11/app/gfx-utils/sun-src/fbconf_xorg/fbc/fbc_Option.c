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


#include "xf86Optrec.h"		/* Option list definitions and declarations */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_xorg.h"		/* Edit config file data representations */
#include "fbc_Option.h"		/* Edit Option lists */
#include "fbc_error.h"		/* Error reporting */


/*
 * fbc_get_Option_list()
 *
 *    Return a pointer to the head of the Option entry list for the
 *    specified active configuration (sub)section.  Also return a
 *    pointer to the External Represention of the (sub)section's
 *    End[Sub]Section line, needed when inserting a new Option entry.
 */

static
XF86OptionPtr *
fbc_get_Option_list(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	void		**end_line_er)	/* End[Sub]Section line External Rep */
{

	/*
	 * Get the Option list, etc. for the specified config (sub)section
	 */
	switch (section) {
	case FBC_SECTION_NONE:
	default:
		break;			/* Inappropriate (sub)section code */
	case FBC_SECTION_Screen:
		if (active->screen_sectn != NULL) {
			*end_line_er = active->screen_sectn->scrn_end_line_er;
			return (&active->screen_sectn->scrn_option_lst);
		}
		break;
	case FBC_SUBSCTN_Display:
		if (active->display_subsectn != NULL) {
			*end_line_er =
				active->display_subsectn->disp_end_line_er;
			return (&active->display_subsectn->disp_option_lst);
		}
		break;
	case FBC_SECTION_Monitor:
		if (active->monitor_sectn != NULL) {
			*end_line_er = active->monitor_sectn->mon_end_line_er;
			return (&active->monitor_sectn->mon_option_lst);
		}
		break;
	case FBC_SECTION_Device:
		if (active->device_sectn != NULL) {
			*end_line_er = active->device_sectn->dev_end_line_er;
			return (&active->device_sectn->dev_option_lst);
		}
		break;
	}

	/*
	 * The specified active (sub)section was not found
	 */
	*end_line_er = NULL;
	return (NULL);

}	/* fbc_get_Option_list() */


/*
 * fbc_set_Option_value()
 *
 *    Modify or insert an Option entry in the specified configuration
 *    section.
 */

void
fbc_set_Option_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name,	/* Option name */
	const char	*option_value)	/* Option value string */
{
	void		*end_line_er;	/* End[Sub]Section line External Rep */
	XF86OptionPtr	*option_list;	/* Head of Option list */

	/*
	 * Retrieve the Option list for the specified config section
	 */
	option_list = fbc_get_Option_list(active, section, &end_line_er);
	if (option_list == NULL) {
		const char *section_type;

		switch (section) {
		case FBC_SECTION_Screen:
			section_type = "Screen section";
			break;
		case FBC_SUBSCTN_Display:
			section_type = "Display subsection";
			break;
		case FBC_SECTION_Monitor:
			section_type = "Monitor section";
			break;
		case FBC_SECTION_Device:
			section_type = "Device section";
			break;
		default:
			section_type = "section";
			break;
		}
		fbc_errormsg("No active %s to contain \"%s\" Option\n",
			    section_type, option_name);
		return;
	}

	/*
	 * Modify or insert this Option entry
	 *
	 *    (type casting to discard "const" qualifiers)
	 */
	*option_list = xf86addNewOptionOrValue(
					*option_list,
//??? xf86configStrdup() ???
					(char *)option_name,
//??? xf86configStrdup() ???
					(char *)option_value,
					0,	/* The "used" arg is unused */
					end_line_er);

}	/* fbc_set_Option_value() */


/*
 * fbc_get_Option_string_value()
 *
 *    Retrieve the specified Option entry value from the specified config
 *    section.  Return the value string or else the "not found" or "value
 *    empty" string.
 */

const char *
fbc_get_Option_string_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name,	/* Option name */
	const char	*option_not_found, /* Case if Option isn't found */
	const char	*option_value_empty) /* Case if Option has no value */
{
	void		*end_line_er;	/* End[Sub]Section line External Rep */
	XF86OptionPtr	*option_list;	/* Ptr to head of Option list */
	XF86OptionPtr	option_entry;	/* Ptr to Option entry, else NULL */

	/*
	 * Retrieve the Option entry, else return the not-found string
	 */
	option_list = fbc_get_Option_list(active, section, &end_line_er);
	if (option_list == NULL) {
		return (option_not_found); /* No active section */
	}
	option_entry = xf86findOption(*option_list, option_name);
	if (option_entry == NULL) {
		return (option_not_found); /* Option not found in section */
	}

	/*
	 * Return the Option value string, else the value-empty string
	 */
	if (option_entry->opt_val == NULL) {
		return (option_value_empty);
	}
	return (option_entry->opt_val);

}	/* fbc_get_Option_string_value() */


/*
 * fbc_get_Option_keywd_value()
 *
 *    Retrieve the specified Option entry value from the specified config
 *    section.  Evaluate the value string as a keyword and return the
 *    corresponding ordinal value.
 */

int
fbc_get_Option_keywd_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name,	/* Option name */
	int		option_not_found, /* Case if Option isn't found */
	int		option_value_bad, /* Case if Option value is bad */
	const fbc_Optkeywd_t *keywd_table) /* Table of Option value keywds */
{
	int		i;		/* Loop counter / array index */
	const char	*opt_val;	/* Option value string, else NULL */

	/*
	 * Retrieve the Option value string
	 *
	 *    Specify that a NULL should be used to indicate Option not
	 *    found, and that an empty string should be used to indicate
	 *    no Option value.
	 */
	opt_val = fbc_get_Option_string_value(
				active, section, option_name, NULL, "");
	if (opt_val == NULL) {
		return (option_not_found);
	}

	/*
	 * Convert the value string to an ordinal value
	 */
	for (i = 0; keywd_table[i].name != NULL; i += 1) {
		if (xf86nameCompare(keywd_table[i].name, opt_val) == 0) {
			return (keywd_table[i].value);
		}
	}
	return (option_value_bad);

}	/* fbc_get_Option_keywd_value() */


/*
 * fbc_get_Option_bool_value()
 *
 *    Retrieve the specified Option entry from the specified config
 *    section.  Evaluate the Option as a Boolean.
 *
 *    The argument field of Boolean Option entry may be omitted,
 *    implying "True".  The Option name may have a "No" prefix, which
 *    negates the value.  "False" is implied (in all fbconf_xorg(1M)
 *    cases to date) if the Option does not occur in the configuration,
 *    or if the value is garbage.
 *
 *    Sequitur:
 *        An empty string is equivalent to an omitted argument
 *        (according to xf86findOptionValue()).  A string consisting
 *        only of whitespace and underscores is equivalent to an
 *        empty string, and therefore to "True", rather than to
 *        garbage.
 *
 *    Return the actual or implied value of the Option as TRUE or FALSE.
 */

int
fbc_get_Option_bool_value(
	xf86_active_t	*active,	/* Active config sections for device */
	sectn_mask_t	section,	/* Section containing Option entry */
	const char	*option_name)	/* Boolean Option name */
{
	/*
	 * Boolean argument strings, as per the XFree86 man page
	 *
	 *    Compare with fbc_keywds_boolean[].  It is suitable for
	 *    unidirectional rather than bidirectional translation.
	 */
	const fbc_Optkeywd_t keywd_boolean[] = {
		{ "false", FALSE },	/* Preferred Boolean keyword */
		{ "true",  TRUE  },	/* Preferred Boolean keyword */
		{ "off",   FALSE },
		{ "on",    TRUE  },
		{ "no",    FALSE },
		{ "yes",   TRUE  },
		{ "0",     FALSE },
		{ "1",     TRUE  },
		{ "",      TRUE  },	/* Omitted argument or empty string */
		{ NULL,    FALSE }	/* End of table */
	};

	void		*end_line_er;	/* End[Sub]Section line External Rep */
	int		i;		/* Loop counter / array index */
	const char	*opt_val;	/* Option value string, else NULL */
	XF86OptionPtr	option_entry;	/* Ptr to matching Option entry */
	XF86OptionPtr	*option_list;	/* Ptr to head of Option list */
	int		value;		/* Boolean Option value */

	/*
	 * Retrieve the Option value string, else return FALSE
	 *
???	 *    Unlike other Option names, Boolean Option names can have a
	 *    "No" prefix.  A partial argument could be made that a new
	 *    function, other than xf86findOption(), is needed.  That or
	 *    the function must be called once without the "No" prefix
	 *    and once with it.  This would be reasonable for retrieving
	 *    an Option but less so for setting it.  Our
	 *    xf86findOption() function has been provided with a list of
	 *    known Boolean Option names.  This is used to prevent
	 *    duplicate Options, no matter how a name is spelled, from
	 *    being added to a list.
	 */
	option_list = fbc_get_Option_list(active, section, &end_line_er);
	if (option_list == NULL) {
		return (FALSE);		/* No active section */
	}
	option_entry = xf86findOption(*option_list, option_name);
	if (option_entry == NULL) {
		return (FALSE);		/* Option not found in section */
	}

	/*
	 * Evaluate the Option argument string as a keyword
	 */
	value = FALSE;			/* Accept garbage as FALSE */
	opt_val = option_entry->opt_val;
	if (opt_val == NULL) {
		opt_val = "";		/* Accept NULL as "" */
	}
	for (i = 0; keywd_boolean[i].name != NULL; i += 1) {
		if (xf86nameCompare(keywd_boolean[i].name, opt_val) == 0) {
			value = keywd_boolean[i].value;
			break;
		}
	}

	/*
	 * A "No" prefix on a Boolean Option name compliments the value
	 *
???	 *    The xf86findOption() function found the named Option entry
	 *    by searching both with and without the "No" prefix.
	 *    Therefore if the found name doesn't match the specified
	 *    Option name, we can conclude that the found name has a
	 *    "No" prefix.
	 */
	if (xf86nameCompare(option_name, option_entry->opt_name) != 0) {
		value = !value;
	}

	return (value);

}	/* fbc_get_Option_bool_value() */


/*
 * fbc_edit_Options()
 *
 *    Modify or insert configuration Option entries, based on program
 *    command line options reflected in the Option_mods[] array.
 *
 *    Screen section
 *        Option  "DoubleWide" "Enable"|"Disable"
 *        Option  "DoubleHigh" "Enable"|"Disable"
 *        Option  "Multisample" "Disable"|"Available"|"ForceOn"
 *        Option  "Samples" "1"|"4"|"8"|"16"
 *        Option  "MultiviewMode" "Disable"|"Multiview" # -slave <arg>
 *        Option  "StreamXOffset" "<integer>"
 *        Option  "StreamYOffset" "<integer>"
 *    Display subsection
 *        Option  "DefLinear" "True"|"False"
 *        Option  "DefOverlay" "True"|"False"
 *        Option  "DefTransparent" "True"|"False"
 *    Monitor section
 *        Option  "GFile" "[<filename>]"        # -gfile "[<filename>]"
 */

void
fbc_edit_Options(
	xf86_active_t	*active,	/* Active config sections for device */
	xf86_opt_mod_t	Option_mods[])	/* Config Option modifications */
{
	int		i;		/* Loop counter / array index */

	/*
	 * Repeat for each config Option entry to be modified or added
	 */
	for (i = 0; Option_mods[i].name != NULL; i += 1) {
		/*
		 * Ignore pseudo-Options (e.g., "#Gamma")
		 *
		 *    Pseudo-Options are left over from program command
		 *    line processing and should not be inserted into
		 *    the configuration.
		 */
		if (*Option_mods[i].name == FBC_PSEUDO_PREFIX[0]) {
			continue;
		}

		/*
		 * Modify or insert this Option entry
		 */
		fbc_set_Option_value(active,
				    Option_mods[i].section,
				    Option_mods[i].name,
				    Option_mods[i].value);
	}

}	/* fbc_edit_Options() */


/* End of fbc_Option.c */
