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
 * fbc_xorg - Edit config file data representations
 */



#ifndef	_FBC_XORG_H
#define	_FBC_XORG_H


#include <stdio.h>		/* NULL */

#include "xf86Parser.h"		/* Configuration (sub)section definitions */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */


/*
 * Active (sub)sections associated with the specified frame buffer device
 */
typedef struct {
	XF86ConfScreenPtr screen_sectn;	/* Ptr to Screen  section */
	XF86ConfDisplayPtr display_subsectn; /* Ptr to Display subsection */
	XF86ConfMonitorPtr monitor_sectn; /* Ptr to Monitor section */
	const char	*mode_name;	/* Video mode name (for -propt) */
	XF86ConfModeLinePtr mode_entry;	/* ModeLine / Mode-EndMode entry */
	XF86ConfDevicePtr device_sectn;	/* Ptr to Device section */
} xf86_active_t;

/*
 * Codes representing active configuration (sub)sections or entries
 *
 *    These codes are used to show what type of (sub)section, etc. would
 *    contain a particular Option entry within the configuration.  In
 *    this context, the codes are selector indices (e.g. switch statement
 *    values) and are not intended to be ORed together as a bit mask.
 *
 *    These codes can also be used to show which active configuration
 *    (sub)sections, etc. are to be modified.  In this context, the
 *    codes are flag bits that can be ORed together.
 *
 *    Beyond that, these values are arbitrary.
 */
typedef enum {
	FBC_SECTION_NONE    = 0x0000,	/* Nothing (initial/zero state)	*/
	FBC_SECTION_Screen  = 0x0001,	/* Screen  section		*/
	FBC_SUBSCTN_Display = 0x0002,	/* Display subsection		*/
	FBC_SECTION_Monitor = 0x0004,	/* Monitor section		*/
	FBC_SECTION_Device  = 0x0008,	/* Device  section		*/
/*	FBC_ENTRY_Mode	    = 0x0010	** ModeLine / Mode-EndMode entry */
} sectn_mask_t;

/*
 * Array element describing a config Option entry to be inserted or updated
 */
typedef struct {
	sectn_mask_t	section;	/* Option entry [sub]section code */
	const char	*name;		/* Option entry name string */
	const char	*value;		/* Option entry value string */
} xf86_opt_mod_t;

/*
 * Definitions for command line processing and configuration entries
 */
	/*
	 * Prefix character used to mark pseudo-Option entries
	 *
	 *    Pseudo-Option entry names (e.g., "#Gamma") are placed in
	 *    the .Option_mods[] array to help detect conflicting
	 *    command line option values and to implement a radio-button
	 *    behavior among related options.
	 */
#define	FBC_PSEUDO_PREFIX	"#"	/* Not a legal Option name character */

	/* -clone */
#define	FBC_SECTN_Clone		FBC_SECTION_Screen
#define	FBC_KEYWD_Clone		"Clone"

	/* -defaults */
#define	FBC_SECTN_Defaults	FBC_SECTION_NONE
#define	FBC_KEYWD_Defaults	NULL

	/* -defaultdepth 8|24 */
#define	FBC_NO_DefaultDepth	(0)	/* No DefaultDepth value */

	/* -deflinear true|false */
#define	FBC_SECTN_DefLinear	FBC_SUBSCTN_Display
#define	FBC_KEYWD_DefLinear	"DefLinear"

	/* -defoverlay true|false */
#define	FBC_SECTN_DefOverlay	FBC_SUBSCTN_Display
#define	FBC_KEYWD_DefOverlay	"DefOverlay"

	/* -deftransparent true|false */
#define	FBC_SECTN_DefTransparent FBC_SUBSCTN_Display
#define	FBC_KEYWD_DefTransparent "DefTransparent"

	/* -dev <device> */
#define	FBC_SECTN_Device	FBC_SECTION_Device
#define	FBC_KEYWD_Device	"Device"

	/* -doublehigh enable|disable */
#define	FBC_SECTN_DoubleHigh	FBC_SECTION_Screen
#define	FBC_KEYWD_DoubleHigh	"DoubleHigh"

	/* -doublewide enable|disable */
#define	FBC_SECTN_DoubleWide	FBC_SECTION_Screen
#define	FBC_KEYWD_DoubleWide	"DoubleWide"

	/* -fake8 enable|disable */
#define	FBC_SECTN_Fake8		FBC_SECTION_Screen
#define	FBC_KEYWD_Fake8		"Fake8"

	/* -file machine|system|<config-path> */
#define	FBC_SECTN_File		FBC_SECTION_NONE
#define	FBC_KEYWD_File		NULL

	/* -g <gamma-value> */
#define	FBC_SECTN_Gamma		FBC_SECTION_Monitor
#define	FBC_KEYWD_Gamma		"Gamma"
#define	FBC_NO_Gamma		(-1.0)	/* No Gamma correction value */
#define	FBC_VALID_Gamma(_gamma)	(((_gamma) >= 1.0) && ((_gamma) <= 10.0))

	/* -gfile <gamma-file> */
#define	FBC_SECTN_GFile		FBC_SECTION_Monitor
#define	FBC_KEYWD_GFile		"GFile"

	/* -help */
#define	FBC_SECTN_Help		FBC_SECTION_NONE
#define	FBC_KEYWD_Help		NULL

	/* -multisample disable|available|forceon */
#define	FBC_SECTN_Multisample	FBC_SECTION_Screen
#define	FBC_KEYWD_Multisample	"Multisample"

	/* -offset <xoff> <yoff> */
#define	FBC_SECTN_StreamXOffset	FBC_SECTION_Screen
#define	FBC_KEYWD_StreamXOffset	"StreamXOffset"

#define	FBC_SECTN_StreamYOffset	FBC_SECTION_Screen
#define	FBC_KEYWD_StreamYOffset	"StreamYOffset"

	/* -outputs swapped|direct */
#define	FBC_SECTN_Outputs	FBC_SECTION_Screen
#define	FBC_KEYWD_Outputs	"Outputs"

	/* -prconf */
#define	FBC_SECTN_PrConf	FBC_SECTION_NONE
#define	FBC_KEYWD_PrConf	NULL

	/* -predid */
#define	FBC_SECTN_PrEDID	FBC_SECTION_NONE
#define	FBC_KEYWD_PrEDID	NULL

	/* -propt */
#define	FBC_SECTN_PrOpt		FBC_SECTION_NONE
#define	FBC_KEYWD_PrOpt		NULL

	/* -res ? */
	/* -res <video-mode> [nocheck] [noconfirm] [try] [now] */
#define	FBC_SECTN_Res		FBC_SUBSCTN_Display
#define	FBC_KEYWD_Res		NULL
#define	FBC_NO_MODE_NAME	NULL	/* No video mode name string */

#define	FBC_SECTN_StereoEnable	FBC_SUBSCTN_Display
#define	FBC_KEYWD_StereoEnable	"StereoEnable"

	/* -rscreen enable|disable */
#define	FBC_SECTN_RScreen	FBC_SECTION_Screen
#define	FBC_KEYWD_RScreen	"RemoteScreen"

	/* -samples 1|4|8|16 */
#define	FBC_SECTN_Samples	FBC_SECTION_Screen
#define	FBC_KEYWD_Samples	"Samples"

	/* -slave disable|multiview */
#define	FBC_SECTN_MultiviewMode	FBC_SECTION_Screen
#define	FBC_KEYWD_MultiviewMode	"MultiviewMode"


/*
 * Configuration entries to be modified or inserted
 */
typedef struct {
	/*
	 * Screen section explicit entries  (see XF86ConfScreenRec)
	 */
	int	scrn_defaultdepth;	/* Default depth (8|24), else zero */
	/*
	 * Monitor section explicit entries  (see XF86ConfMonitorRec)
	 */
	float	mon_gamma_red;		/* Red   gamma, else FBC_NO_Gamma */
	float	mon_gamma_green;	/* Green gamma value, else undefined */
	float	mon_gamma_blue;		/* Blue  gamma value, else undefined */
	/*
	 * "-res <video_mode>" command line option
	 */
	fbc_video_mode_t video_mode;	/* Video mode (e.g. ModeLine) name */

	/*
	 * Option entry modification descriptors
	 *
	 *    This can include descriptors for pseudo-Options.  Pseudo
	 *    Options are explicitly named entries, such as "Gamma,"
	 *    that are placed in this array as part of the mechanism to
	 *    detect conflicting entries, such as "Gamma" (-g) and the
	 *    "GFile" Option (-gfile).
	 */
	int		Option_mods_size; /* Option_mods[] array size */
	int		Option_mods_num; /* # of Option_mods[] entries */
	xf86_opt_mod_t *Option_mods;	/* Option entries to be modified */

} xf86_ent_mod_t;


/*
 * Preferred video mode/resolution for monitor
 *
 *    Case-insensitive "NONE" is accepted as an argument to the -res
 *    command line option.  Later it is translated to uppercase "AUTO"
 *    and isn't recognized thereafter.
 */
#define	FBC_RESNAME_PREFERRED	"AUTO"	/* Preferred resolution for monitor */
#define	FBC_RESNAME_NONE	"NONE"	/* Accepted only as a -res argument */


#endif	/* _FBC_XORG_H */


/* End of fbc_xorg.h */
