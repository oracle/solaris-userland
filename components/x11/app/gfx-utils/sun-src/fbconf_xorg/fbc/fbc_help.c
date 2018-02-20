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


#include <stdio.h>		/* fprintf(), fputs() */
#include <string.h>		/* strchr(), strcmp(), strlen() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_getargs.h"	/* Program command line processing */
#include "fbc_help.h"		/* Program usage and help messages */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */


/*
 * Usage message header for all frame buffer devices
 */
const char	fbc_usage_text_header[] =
	"Usage:\n\t";

/*
 * Usage message body for an unknown frame buffer device type
 */
const char	fbc_usage_text_body[] =
	" [-dev devname] [-file machine | system | config-path]\n"
	"\t\t  [device-specific-options]\n"
	"\t\t  [-defaults]\n"
	"\t\t  [-help]\n"
	"\t\t  [-res \\?]\n"
	"\t\t  [-prconf] [-predid [raw] [parsed]] [-propt]\n"
	"\n";


/*
 * Help (-help) message text
 */
const char	fbc_help_clone[] =
"	-clone		If enabled, the two display devices will display\n"
"			identically.  Default: disable.\n";
const char	fbc_help_defaults[] =
"	-defaults	Set configuration options for the specified device\n"
"			to default values.  (This does not reset -res video\n"
"			modes.)\n";
#ifdef	FBC_FUTURE	/* ... or past */
const char	fbc_help_defdepth[] =
"	-defdepth	Default depth to start the window system in.\n"
"			Default: 24\n";
#endif
const char	fbc_help_deflinear[] =
"	-deflinear	If True, default visual will be linear visual.\n"
"			Default: false\n";
const char	fbc_help_defoverlay[] =
"	-defoverlay	If True, default visual will be an overlay visual.\n"
"			Default: false\n";
const char	fbc_help_deftransparent[] =
"	-deftransparent	If True, default visual will be a transparent overlay\n"
"			visual.  Default: false\n";
#if (0)	/* From Xsun's nfbconfig.c & pfbbconfig.c for Solaris 8 & 9 */
const char	fbc_help_depth[] =
"	-depth		Set the depth (bits per pixel) for the window system.\n"
"			Default: 24.\n";
#endif	/* From Xsun's nfbbconfig.c & pfbbconfig.c for Solaris 8 & 9 */
const char	fbc_help_dev[] =
"	-dev		Specify the frame buffer device file name.\n"
"			Default: "
FBC_DEVICE_SYMLINK_PATH " else " FBC_DEVICE_SYMLINK_PATH_0 ".\n";
const char	fbc_help_doublewide[] =
"	-doublewide	Combine both displays into one horizontal virtual\n"
"			display.  Default: disable\n";
const char	fbc_help_doublehigh[] =
"	-doublehigh	Combine both displays into one vertical virtual\n"
"			display.  Default: disable\n";
const char	fbc_help_fake8[] =
"	-fake8		If enabled, 8-bit windows will be rendered without\n"
"			a hardware colormap to reduce colormap flashing.\n"
"			Performance degradation might be observed.\n"
"			Default: disable\n";
const char	fbc_help_file[] =
"	-file		Which xorg.conf configuration file to update.\n"
"			Default: "
FBC_DEFAULT_CONFIG_LOC
"\n";
const char	fbc_help_g[] =
"	-g		Gamma Correction Value.\n"
"			Default: "
FBC_GAMMA_DEFAULT_STR
"\n";
const char	fbc_help_gfile[] =
"	-gfile		Filename of the file containing Gamma Correction Table.\n";
const char	fbc_help_help[] =
"	-help		Display this help text.\n";
const char	fbc_help_multisample[] =
"	-multisample	If disable, no multisampling is possible. If available,\n"
"			multisampling is possible but selected on a per window\n"
"			basis.  If forceon, all OpenGL windows are rendered\n"
"			using multisampling.\n"
"			Default: disable\n";
const char	fbc_help_offset[] =
"	-offset		Adjust the position of the specified stream.\n"
"			Currently only implemented in -doublewide and\n"
"			-doublehigh modes.\n"
"			For -doublewide the X offset is used to position the\n"
"			rightmost stream. Negative is left (overlaps with\n"
"			left stream).\n"
"			For -doublehigh the Y offset is used to position the\n"
"			bottommost stream.  Negative is up (overlaps with\n"
"			upper stream).\n";
const char	fbc_help_outputs[] =
"	-outputs	With the swapped setting, the displays are swapped\n"
"			horizontally or vertically, depending on whether\n"
"			-doublewide or -doublehigh is set.  With the direct\n"
"			setting, or if neither -doublewide nor -doublehigh is\n"
"			set, no swapping is done.\n"
"			Default: direct\n";
const char	fbc_help_prconf[] =
"	-prconf		Print the device hardware configuration.\n";
const char	fbc_help_predid[] =
"	-predid		Print the EDID (Enhanced Extended Display\n"
"			Identification Data) information obtained from the\n"
"			display device(s), which must be online.\n"
"			Optional arguments are:\n"
"			    raw    - Display the data as hexadecimal bytes\n"
"			    parsed - Display the data as human-readable text\n"
"			Default: parsed\n";
const char	fbc_help_propt[] =
"	-propt		Print the current configuration option settings.\n";
const char	fbc_help_res_nn[] =
"	-res		To list the video modes configured for the device,\n"
"			use the -res \\? option.  To change the current video\n"
"			mode use -res <video-mode>.  Modifiers are:\n"
"			    nocheck   - Bypass all video mode validation\n"
"			    noconfirm - No confirmation of unrecognized mode\n"
"			There is no default video mode.\n";
const char	fbc_help_res_nntn[] =
"	-res		To list the video modes configured for the device,\n"
"			use the -res \\? option.  To change the current video\n"
"			mode use -res <video-mode>.  Modifiers are:\n"
"			    nocheck   - Bypass all video mode validation\n"
"			    noconfirm - No confirmation if mode is not known\n"
"			    try       - Try the video mode for 10 seconds\n"
"			    now       - Apply the new video mode now\n"
"			There is no default video mode.\n";
const char	fbc_help_rscreen[] =
"	-rscreen	Enable or disable remote graphics console access.\n"
"			Default: disable.\n";
const char	fbc_help_samples[] =
"	-samples	Request the number of samples to compute per display\n"
"			pixel.\n"
"			Default: 4\n";
const char	fbc_help_slave[] =
"	-slave		If multiview this device synchronizes video with a\n"
"			master through the multiview ribbon cable.  Both\n"
"			devices should be running the same resolution and\n"
"			this option should be issued when the window system\n"
"			is running.  Default: disable\n";
const char	fbc_help_stereo[] =
"	-stereo		Enable or disable stereo video mode.  Default: false\n";


/*
 * fbc_usage()
 *
 *    Display the appropriate program command line usage.
 */

void
fbc_usage(
	FILE		*output_stream,	/* stdout or stderr */
	fbc_varient_t	*fbvar)		/* Program varient data */
{

	fputs(fbvar->usage_text_header, output_stream);
	fputs(fbvar->prog_name, output_stream);
	fputs(fbvar->usage_text_body, output_stream);

}	/* fbc_usage() */


/*
 * fbc_help()
 *
 *    Display the appropriate program help text (-help).
 */

void
fbc_help(
	fbc_varient_t	*fbvar)		/* Program varient data */
{
	const fbopt_descr_t *option;	/* Current cmd option descriptor */

	/*
	 * Display the usage text
	 */
	fbvar->usage(stdout, fbvar);

	/*
	 * Display the help text for each command line option
	 */
	for (option = fbvar->fbc_option;
	    option->help_text != NULL;
	    option += 1) {
		if (option->help_text != NULL) {
			fputs(option->help_text, stdout);
#ifdef DEBUG
		} else {
			/* Undocumented(?) option */
			fbc_error("No help text for option, -%s\n",
					option->argv_name);
#endif
		}
	}
	fputs("\n", stdout);

}	/* fbc_help() */


/* End of fbc_help.c */
