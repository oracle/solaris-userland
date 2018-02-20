/* Copyright (c) 2004, 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_propt - Display current software configuration
 */


#include <stdio.h>		/* printf() */
#include <string.h>		/* strcasecmp(), strcmp() */

#include "configProcs.h"	/* xf86findOption(), xf86nameCompare() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_Option.h"		/* Edit Option lists */
#include "fbc_propt.h"		/* Display current software configuration */


static const char *const fbc_msg_Not_set = "Not set";


/*
 * fbc_propt_name()
 *
 *    Display a label string, a quoted name string or the alternative
 *    string for a missing name, and a line terminator.
 *
 *    The name string is quoted, as it is in the config file, since it
 *    may include leading, trailing, and/or embedded whitespace.
 */

void
fbc_propt_name(
	const char * const label,	/* Label string */
	const char * const name,	/* Name string, else NULL */
	const char * const no_name)	/* Alternate string for missing name */
{

	if (name != NULL) {
		printf("%s\"%s\"\n", label, name);
	} else {
		printf("%s%s\n", label, no_name);
	}

}	/* fbc_propt_name() */


/*
 * fbc_propt_file()
 *
 *    Display identifying information for the current config file and
 *    for the active configuration sections.
 */

void
fbc_propt_file(
	fbc_varient_t	*fbvar)		/* Program varient data */
{
	const char	*name;		/* Active section, etc. name */
	const char	*no_name;	/* Alternate string for missing name */

	/*
	 * Configuration file location and pathname
	 */
	printf("\nxorg.conf: ");
	if (fbvar->config_file_loc != NULL) {
		printf("%s -- ", fbvar->config_file_loc);
	}
	printf("%s\n", fbvar->config_file_path);

	/*
	 * Active Screen section  (section and name string must exist)
	 */
	name    = NULL;
	no_name = "*** none ***";	/* Asterisks to emphasize a problem */
	if (fbvar->active.screen_sectn != NULL) {
		name    = fbvar->active.screen_sectn->scrn_identifier;
		no_name = "*** no name ***";
	}
	fbc_propt_name(FBC_PR_INDENT "Screen section:  ", name, no_name);

	/*
	 * Active Device section  (section and name string must exist)
	 */
	name    = NULL;
	no_name = "*** none ***";
	if (fbvar->active.device_sectn != NULL) {
		no_name = "*** no name ***";
		name    = fbvar->active.device_sectn->dev_identifier;
	}
	fbc_propt_name(FBC_PR_INDENT "Device section:  ", name, no_name);

	/*
	 * Active Monitor section, if any  (section must have a name string)
	 */
	name    = NULL;
	no_name = "none";
	if (fbvar->active.monitor_sectn != NULL) {
		name    = fbvar->active.monitor_sectn->mon_identifier;
		no_name = "*** no name ***";
	}
	fbc_propt_name(FBC_PR_INDENT "Monitor section: ", name, no_name);

	printf("\n");

}	/* fbc_propt_file() */


/*
 * fbc_propt_video_mode()
 *
 *    Display the current video mode name.
 */

void
fbc_propt_video_mode(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	fbc_propt_name("Video Mode: ",
			fbvar->active.mode_name,
			fbc_msg_Not_set);

}	/* fbc_propt_video_mode() */


/*
 * fbc_propt_stereo()
 *
 *    Display the current stereo video mode name (-res).
 */

void
fbc_propt_stereo(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT FBC_KEYWD_StereoEnable ": %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_StereoEnable,
					    FBC_KEYWD_StereoEnable,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));

}	/* fbc_propt_stereo() */


/*
 * fbc_propt_multisample()
 *
 *    Display the current Multisample mode settings.
 */

void
fbc_propt_multisample(
	fbc_varient_t	*fbvar)		/* Program varient data */
{
	const char	*description;	/* Ptr to description of setting */
	const char	*setting;	/* Ptr to setting text string */

	printf("\nMultisample Information:\n");

	/*
	 * Multisample
	 */
	setting = fbc_get_Option_string_value(&fbvar->active,
					      FBC_SECTN_Multisample,
					      FBC_KEYWD_Multisample,
					      fbc_msg_Not_set,
			"*** Missing \"" FBC_KEYWD_Multisample "\" value ***");
	description = "";
	if (strcasecmp(setting, "Disabled") == 0) {
		description = " (multisample visuals will not be available)";
	} else
	if (strcasecmp(setting, "Available") == 0) {
		description = " (multisample visuals will be available)";
	} else
	if (strcasecmp(setting, "ForceOn") == 0) {
		description =
			" (All Sun OpenGL programs will be multisampled)";
	}
	printf(FBC_PR_INDENT
		"Multisample Mode:  %s%s\n", setting, description);

	/*
	 * Samples  (This was "MultisampleDepth" in OWconfig)
	 */
	printf(FBC_PR_INDENT
		"Samples Per Pixel: %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_Samples,
					    FBC_KEYWD_Samples,
					    fbc_msg_Not_set,
			"*** Missing \"" FBC_KEYWD_Samples "\" value ***"));

}	/* fbc_propt_multisample() */


/*
 * fbc_propt_screen_title()
 *
 *    Display the screen settings title line.
 */

void
fbc_propt_screen_title(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	/*
	 * Screen information
	 */
	printf("\nScreen Information:\n");

}	/* fbc_propt_screen_title() */


/*
 * fbc_propt_dual_screen()
 *
 *    Display the current dual-screen (-doublewide, -doublehigh)
 *    settings.
 */

void
fbc_propt_dual_screen(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT FBC_KEYWD_DoubleWide ": %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_DoubleWide,
					    FBC_KEYWD_DoubleWide,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));
	printf(FBC_PR_INDENT FBC_KEYWD_DoubleHigh ": %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_DoubleHigh,
					    FBC_KEYWD_DoubleHigh,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));

}	/* fbc_propt_dual_screen() */


/*
 * fbc_propt_clone()
 *
 *    Display the current clone setting (-clone).
 */

void
fbc_propt_clone(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT FBC_KEYWD_Clone ": %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_Clone,
					    FBC_KEYWD_Clone,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));

}	/* fbc_propt_clone() */


/*
 * fbc_propt_offset()
 *
 *    Display the current screen offset settings (-offset).
 */

void
fbc_propt_offset(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT "Offset/Overlap: [%s, %s]\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_StreamXOffset,
					    FBC_KEYWD_StreamXOffset,
					    "0",
		    "*** Missing \"" FBC_KEYWD_StreamXOffset "\" value ***"),
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_StreamXOffset,
					    FBC_KEYWD_StreamYOffset,
					    "0",
		    "*** Missing \"" FBC_KEYWD_StreamYOffset "\" value ***"));

}	/* fbc_propt_offset() */


/*
 * fbc_propt_outputs()
 *
 *    Display the current Outputs setting (-outputs).
 */

void
fbc_propt_outputs(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT FBC_KEYWD_Outputs ":        %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_Outputs,
					    FBC_KEYWD_Outputs,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));

}	/* fbc_propt_outputs() */


/*
 * fbc_propt_fake8()
 *
 *    Display the current Fake8 Rendering setting (-fake8).
 */

void
fbc_propt_fake8(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT "Fake8 Rendering: %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_Fake8,
					    FBC_KEYWD_Fake8,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));

}	/* fbc_propt_fake8() */


/*
 * fbc_propt_rscreen()
 *
 *    Display the current Remote Console setting (-rscreen).
 */

void
fbc_propt_rscreen(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf(FBC_PR_INDENT "Remote Screen: %s\n",
		fbc_get_Option_string_value(&fbvar->active,
					    FBC_SECTN_RScreen,
					    FBC_KEYWD_RScreen,
					    fbc_msg_Not_set,
					    fbc_msg_Not_set));

}	/* fbc_propt_rscreen() */


/*
 * fbc_propt_visual_title()
 *
 *    Display the default visual title line.
 */

void
fbc_propt_visual_title(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	printf("\nVisual Information:\n");

}	/* fbc_propt_visual_title() */


/*
 * fbc_propt_default_visual()
 *
 *    Display the current default visual setting for -deflinear,
 *    -defoverlay, and -deftransparent.
 */

void
fbc_propt_default_visual(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	/*
	 * Default visual
	 *
	 *    DefLinear, DefOverlay, and DefTransparent are supposed to
	 *    be mutually exclusive, however, there is no assurance that
	 *    manual editing of the configuration file left it in a
	 *    consistent state.
	 */
	if (fbc_get_Option_bool_value(&fbvar->active,
					FBC_SECTN_DefOverlay,
					FBC_KEYWD_DefOverlay)) {
		printf(FBC_PR_INDENT
			"Default Visual: Nonlinear Overlay Visual\n");
	} else
	if (fbc_get_Option_bool_value(&fbvar->active,
					FBC_SECTN_DefTransparent,
					FBC_KEYWD_DefTransparent)) {
		printf(FBC_PR_INDENT
			"Default Visual: Transparent Overlay Visual\n");
	} else
	if (fbc_get_Option_bool_value(&fbvar->active,
					FBC_SECTN_DefLinear,
					FBC_KEYWD_DefLinear)) {
		printf(FBC_PR_INDENT "Default Visual: Linear Normal Visual\n");
	} else {
		printf(FBC_PR_INDENT
			"Default Visual: Nonlinear Normal Visual\n");
	}

}	/* fbc_propt_default_visual() */


#define	GAMMA_CORRECTION_LABEL	"Gamma Correction: "

/*
 * fbc_propt_g()
 *
 *    Display the current gamma correction setting for -g only.
 */

void
fbc_propt_g(
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	/*
	 * Gamma correction
	 */
	if ((fbvar->active.monitor_sectn != NULL) &&
			(fbvar->active.monitor_sectn->mon_gamma_red > 0.0)) {
		printf(FBC_PR_INDENT GAMMA_CORRECTION_LABEL
					"Using gamma value %.2f\n",
			fbvar->active.monitor_sectn->mon_gamma_red);
	} else {
		printf(FBC_PR_INDENT GAMMA_CORRECTION_LABEL
					"Using default gamma value %2.2f\n",
			fbvar->gamma_default);
	}

}	/* fbc_propt_g() */


/*
 * fbc_propt_gamma()
 *
 *    Display the current gamma correction settings for -g and -gfile.
 */

void
fbc_propt_gamma(
	fbc_varient_t	*fbvar)		/* Program varient data */
{
	const char	*setting;	/* Ptr to setting text string */

	/*
	 * Gamma correction
	 *
	 *    Gamma and GFile should be mutually exclusive entries.
	 *    There's no assurance, however, that manual editing of the
	 *    configuration file will leave it in a consistent state.
	 */
	setting = fbc_get_Option_string_value(&fbvar->active,
						FBC_SECTN_GFile,
						FBC_KEYWD_GFile,
						"", "");
	if (*setting != '\0') {
		printf(FBC_PR_INDENT GAMMA_CORRECTION_LABEL
					"Using gamma file\n");
	} else {
		fbc_propt_g(fbvar);
	}

}	/* fbc_propt_gamma() */


/*
 * fbc_propt()
 *
 *    Display the current software configuration (option settings) for a
 *    frame buffer device (-propt).
 */

void
fbc_propt(
	fbc_varient_t	*fbvar)		/* Program varient data */
{
	fbc_propt_fn_t	**propt_fn;	/* Ptr to addr of a display function */

	/*
	 * Repeat for each -propt display function in the array
	 */
	for (propt_fn = (fbc_propt_fn_t **)fbvar->propt_fn;
	    *propt_fn != NULL;
	    propt_fn += 1) {
		(**propt_fn)(fbvar);
	}

}	/* fbc_propt() */


/* End of fbc_propt.c */
