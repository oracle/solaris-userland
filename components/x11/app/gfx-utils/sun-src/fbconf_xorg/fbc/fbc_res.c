/*
 * Copyright (c) 2004, 2015, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_res - Video modes/resolutions (-res option)
 */


#include <ctype.h>		/* isdigit(), ispunct(), toupper() */
#include <stdio.h>		/* fputc(), printf(), sprintf() */
#include <string.h>		/* str[case]cmp(), strrchr(), strstr(), ... */

#include "xf86Parser.h"		/* Public function, etc. declarations */

#include "resolutions.h"	/* Video mode summary table: SunVideoTable[] */
#include "sun_edid.h"		/* EDID data parsing */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_xorg.h"		/* Edit config file data representations */
#include "fbc_ask.h"		/* User interaction */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_Modes.h"		/* Edit Modes sections */
#include "fbc_mode_list.h"	/* List of Modes from the config file */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_res.h"		/* Video modes/resolutions (-res option) */
#include "fbc_res_compatible.h"	/* Video mode compatibity check (-res) */


/*
 * fbc_resname_attr_str()
 *
 *    Return TRUE iff the video mode/resolution name contains a case
 *    insensitive version of the specified attribute substring (e.g.,
 *    "STEREO"), set off by punctuation characters (typically '_' or
 *    '-'), and/or, hypothetically, the string ends.
 *
 *    This code doesn't observe XFree86 name comparison rules with
 *    respect to whitespace and underscores.
 */

static
int
fbc_resname_attr_str(
	const char	*resname,	/* Video mode/resolution name */
	const char	*attribute)	/* Attribute substring */
{
	char		prev_char;	/* Previous mode/res name char */
	size_t		attr_len;	/* Length of attribute substring */
	size_t		resname_len;	/* Length of mode/resolution name */
	const char	*resname_ptr;	/* Ptr into mode/resolution name */
	char		term_char;	/* Potential '_' or '\0' in resname */

	resname_len = strlen(resname);
	attr_len    = strlen(attribute);
	prev_char   = '_';		/* Behave as if this were true */
	for (resname_ptr = resname;
	    resname_ptr <= resname + resname_len - attr_len;
	    resname_ptr += 1) {
		if (ispunct(prev_char)) {
			term_char = *(resname_ptr + attr_len);
			if ((ispunct(term_char) || (term_char == '\0')) &&
			    (strncasecmp(resname_ptr, attribute, attr_len)
						== 0)) {
				return (TRUE);
			}
		}
		prev_char = *resname_ptr;
	}
	return (FALSE);

}	/* fbc_resname_attr_str() */


/*
 * fbc_resname_attr_chr()
 *
 *    Return TRUE iff the mode/resolution name has a case-insensitive
 *    version of the specified suffix character.  The suffix character
 *    must be passed to this function in upper case.
 *
 *    This code doesn't observe XFree86 comparison rules w/r/t
 *    whitespace and underscores.
 */

static
int
fbc_resname_attr_chr(
	const char	*resname,	/* Video mode name */
	char		attribute)	/* Attribute suffix char, upper case */
{
	size_t		len;		/* Length of mode/resolution name */

	len = strlen(resname);
	return ((len > 0) && (toupper(resname[len-1]) == attribute));

}	/* fbc_resname_attr_chr() */


/*
 * fbc_resname_stereo()
 *
 *    Return TRUE iff the mode/resolution name indicates stereo video
 *    mode.  Such names contain a "STEREO" substring or have an 'S' or
 *    's' suffix character.
 */

int
fbc_resname_stereo(
	const char	*resname)	/* Video mode name */
{

	return (fbc_resname_attr_str(resname, "STEREO") ||
		fbc_resname_attr_chr(resname, 'S'));

}	/* fbc_resname_stereo() */


/*
 * fbc_resname_digital()
 *
 *    Return TRUE iff the mode/resolution name indicates digital video
 *    mode.  Such names contain a "DIG" substring.
 */

int
fbc_resname_digital(
	const char	*resname)	/* Video mode/resolution name */
{

	return (fbc_resname_attr_str(resname, "DIG"));

}	/* fbc_resname_digital() */


/*
 * fbc_resname_cmp()
 *
 *    Compare two video mode/resolution name strings for equivalence.
 *    The first name, full_resname, is the full name of a valid
 *    mode/resolution.  The name to be validated, resname, matches
 *    the first name if it is identical or if it is a substring
 *    consisting of the numeric dimensions and anything that follows in
 *    the full name.
 *
 *    Assumptions made by this algorithm:
 *      * Abbreviations begin with the first digit of the dimensions.
 *      * A full name can not be abbreviated unless it contains an
 *        underscore (_).
 *      * Its abbreviation would be the entire substring following the
 *        last underscore.
 *      * XFree86 comparison rules concerning whitespace and
 *        underscores are not applied.  The alternative would
 *        involve calling xf86nameCompare() instead of strcasecmp().
 *
 *    Return zero iff the video mode/resolution names match.
 */

static
int
fbc_resname_cmp(
	const char	*full_resname,	/* Full name of a video mode/res */
	const char	*resname)	/* Mode/res name or abbreviation */
{
	const char	*full_ptr;	/* Ptr into full_resname string */

	if (strcasecmp(full_resname, resname) == 0) {
		return (0);		/* Exact match of full names */
	}

	full_ptr = full_resname;
	if (isdigit(*resname)) {
		full_ptr = strrchr(full_resname, '_');
		if (full_ptr != NULL) {
			return (strcasecmp(full_ptr+1, resname));
		}
	}

	return (1);			/* No match */

}	/* fbc_resname_cmp() */


/*
 * fbc_get_monitor_id()
 *
 *    If there is more than one video stream, return a string containing
 *    the stream number (" %d").  Otherwise return an empty string ("").
 *    The string is returned in a monitor_id_buf[FBC_MAX_MONITOR_ID_LEN]
 *    buffer, and will be used to identify the monitor for display
 *    purposes (i.e., "... monitor <id> ..." or just "... monitor ...").
 */

void
fbc_get_monitor_id(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	int		stream_index,	/* Video stream index (zero-based) */
	char		*monitor_id_buf) /* Returned monitor ID, else "" */
{

	*monitor_id_buf = '\0';
	if (device->max_streams > 1) {
		sprintf(monitor_id_buf, " %d", stream_index + 1);
	}

}	/* fbc_get_monitor_id() */


/*
 * fbc_in_edid_modes()
 *
 *    Given a video mode name from the config file, find out whether:
 *      * the video mode name is present in the list of modes (from
 *        EDID) that are supported by the display device
 *      * the video mode name is first in the list (e.g. represents the
 *        preferred mode/resolution for the display)
 *
 *    Return the zero-relative subscript of the video mode name within
 *    the list/array of mode/resolution names.  Return
 *    FBC_NOT_IN_EDID_MODES if the name is not present in the list.
 */

#define	FBC_CHECK_EDID_MODES  (-2)	/* Check EDID video modes */
#define	FBC_NOT_IN_EDID_MODES (-1)	/* Video mode name not in EDID list */
#define	FBC_FIRST_EDID_MODE   (0)	/* First video mode in EDID list */

static
int
fbc_in_edid_modes(
	sun_edid_mode_t	*edid_mode,	/* Supported video modes array */
	const char	*mode_name)	/* Video mode name */
{
	int		i;		/* Index of matching EDID mode name */

	if (edid_mode != NULL) {
		for (i = 0; edid_mode[i].name != NULL; i += 1) {
// ??? Accept abbreviations, etc. ...
			if (fbc_resname_cmp(edid_mode[i].name, mode_name)
					== 0) {
// ??? ... or not
// ???			if (strcasecmp(edid_mode[i].name, mode_name) == 0) {
				return (i);
			}
		}
	}
	return (FBC_NOT_IN_EDID_MODES);	/* No list or name isn't in list */

}	/* fbc_in_edid_modes() */


/*
 * fbc_list_video_mode()
 *
 *    Display the specified video mode name from the config file unless
 *    it's disqualified by some special case.  This typically is a video
 *    mode name that has been referenced by the active Monitor section
 *    of the config file.
 *
 *    Set footnote[0] to TRUE iff a video mode is displayed that is not
 *    supported by all display devices.
 *
 *    Display any applicable footnote references (e.g. [1], [2], ...).
 *    Footnotes are applicable iff the video mode name appears in the
 *    list of EDID timings supported by the display device.  Return the
 *    corresponding note text, to be displayed later by the caller.
 */

static
void
fbc_list_video_mode(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	const char	*mode_name,	/* Video mode name to display */
	int		support_level,	/* FBC_xxxxx_EDID_MODEx */
	fbc_edid_res_t	edid_res_info[], /* EDID/-res information */
	int		footnote[])	/* Returned flags, else unchanged */
{
	int		i;		/* Index of matching video mode name */
	int		stream_index;	/* Video stream index (zero-based) */

	/*
	 * Suppress certain video mode names
	 *
??? Is this code suitable for kfb?  For any other frame buffers?
	 *    'I' - Interlaced video timing
	 *    'S' - Stereo video mode
	 */
	if (fbc_resname_attr_str(mode_name, "NTSC") ||
	    fbc_resname_attr_str(mode_name, "PAL") ||
	    fbc_resname_attr_str(mode_name, "INT") ||
	    fbc_resname_attr_str(mode_name, "FSC") ||
	    fbc_resname_attr_chr(mode_name, 'S') ||
	    fbc_resname_attr_chr(mode_name, 'I')) {
		return;
	}

	/*
	 * Display this video mode name
	 */
	printf("\t%-26s", mode_name);

	/*
	 * For the indicated video streams (-dev), display any footnote numbers
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		/*
		 * See whether video mode is supported by this display device
		 *
		 *    Most video modes should be looked up in the
		 *    list(s) of EDID video modes/timings.  Getting
		 *    support level footnotes for "AUTO" or "NONE" is
		 *    the exception.
		 */
		i = support_level;
		if (support_level == FBC_CHECK_EDID_MODES) {
			i = fbc_in_edid_modes(
				edid_res_info[stream_index].video_mode,
				mode_name);
		}
		if (i == FBC_NOT_IN_EDID_MODES) {
			footnote[0] = TRUE;	/* Mode not fully supported */
		} else {
			int note_num;	/* Note number */

			/*
			 * Show the whether the video mode is supported
			 */
			note_num = stream_index * 2 + 1;
			printf("[%d]", note_num);
			footnote[note_num] = TRUE;
			if (i == FBC_FIRST_EDID_MODE) {
				/* First mode in list is preferred one */
				printf("[%d]", note_num + 1);
				footnote[note_num + 1] = TRUE;
			}
		}
	}

	/*
	 * Terminate the line containing the video mode and any note numbers
	 */
	putchar('\n');

}	/* fbc_list_video_mode() */


/*
 * Keywords representing the display device's preferred video mode
 */
static const char *mode_pref_keywd[] = {
	FBC_RESNAME_PREFERRED,		/* AUTO */
	FBC_RESNAME_NONE,		/* NONE */
	NULL				/* End marker */
};


/*
 * fbc_res_list_modes()
 *
 *    Display the video mode names from the active Monitor section
 *    (-res ?).  For each video mode and for each video stream, footnote
 *    whether the mode is supported by the stream's display device and
 *    whether it is the preferred mode for the display device.
 *
 *    Note that a mode name should not be displayed unless the config
 *    file contains the a ModeLine or Mode-EndMode entry to define that
 *    mode.  Only the "mode_list" modes are defined in the config file.
 *    Additional modes in the edid_res_info[].mode_names arrays and in
 *    the SunVideoTable[] array are not defined in the config file.
 */

#define	FBC_MAX_NOTES	(FBC_MAX_STREAMS * 2)	/* Two footnotes per stream */

void
fbc_res_list_modes(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	XF86ConfigPtr	configIR)	/* Ptr to configuration Internal Rep */
{
	fbc_edid_res_t	edid_res_info[FBC_MAX_STREAMS]; /* EDID/-res info */
	int		i;		/* Loop counter / array index */
	int		footnote[FBC_MAX_NOTES+1]; /* TRUE => Display note */
	int		footnoted;	/* TRUE => Footnotes displayed */
	fbc_mode_elem_t *mode_elem;	/* Mode list element (unintrusive) */
	fbc_mode_elem_t	*mode_list;	/* Modes from Monitor section of cfg */
	int		stream_index;	/* Video stream index (zero-based) */

	/*
	 * No footnotes to display yet
	 */
	for (i = 0; i <= FBC_MAX_NOTES; i += 1) {
		footnote[i] = FALSE;
	}

	printf("Video modes accepted by the -res option:\n");

	/*
	 * Display keywords representing the monitor's preferred video mode
	 *
	 *    The FBC_FIRST_EDID_MODE argument is used here in order to
	 *    force the generation of the desired "supports" and
	 *    "preferred" footnotes.
	 */
	for (i = 0; mode_pref_keywd[i] != NULL; i += 1) {
		fbc_list_video_mode(device,
				    mode_pref_keywd[i],	/* "AUTO", "NONE" */
				    FBC_FIRST_EDID_MODE, /* Preferred */
				    edid_res_info,	/* Not used */
				    footnote);
	}

	/*
	 * Get from the config file the video modes to be displayed
	 */
	mode_list = fbc_get_mode_list(
			configIR, fbvar->active.monitor_sectn, device->type);

	/*
	 * Get the supported video modes from the EDID data
	 */
	fbvar->get_edid_res_info(device, mode_list, edid_res_info);

	/*
	 * Exclude any mode that's incompatible w/ this frame buffer & monitor
	 */
	(void) fbc_res_compatible(device, edid_res_info, NULL, mode_list);

	/*
	 * Display the video modes that are configured for this frame buffer
	 */
	for (mode_elem = mode_list;
	    mode_elem != NULL;
	    mode_elem = mode_elem->list.next) {
		if (mode_elem->mode_ptr == NULL) {
			continue;	/* This video mode has been excluded */
		}
		fbc_list_video_mode(device,
				    mode_elem->mode_ptr->ml_identifier,
				    FBC_CHECK_EDID_MODES,
				    edid_res_info,
				    footnote);
	}

	fbc_free_mode_list(mode_list);

	fputc('\n', stdout);		/* Blank line */

	/*
	 * Display all footnotes that apply
	 */
	footnoted = FALSE;
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		char monitor_id[FBC_MAX_MONITOR_ID_LEN];
		int note_num;

		fbc_get_monitor_id(device, stream_index, &monitor_id[0]);

		note_num = stream_index * 2 + 1;
		if (footnote[note_num]) {
			printf("[%d] Resolution is supported by monitor%s\n",
			       note_num, monitor_id);
			footnoted = TRUE;
		}
		note_num += 1;
		if (footnote[note_num]) {
			printf("[%d] Preferred resolution for monitor%s\n",
			       note_num, monitor_id);
			footnoted = TRUE;
		}

		if (edid_res_info[stream_index].video_mode == NULL) {
			printf(
"No EDID data for monitor%s.  Can not determine supported resolutions.\n",
				monitor_id);
			footnoted = TRUE;
			footnote[0] = TRUE;
		}
	}
	if (footnoted) {
		fputc('\n', stdout);		/* Blank line */
	}

	if (footnote[0]) {
		printf(
"Use of an unsupported resolution can render the video display unusable.\n\n");
	}

	printf("Abbreviations such as \"1280x1024x75\" may also be used.\n");

	/*
	 * Release dynamically allocated memory
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		sun_edid_video_modes_free(
				edid_res_info[stream_index].video_mode);
	}

}	/* fbc_res_list_modes() */


/*
 * fbc_is_known_mode()
 *
 *    Given a "-res <video_mode> ..." command line option:
 *      * If present in the video mode name, replace '@' with 'x'
 *      * Look up the video mode name in these places:
 *          * The EDID video mode names supported by the monitor
 *          * The active Monitor section of the configuration file
 *          * The built-in SunVideoTable[] array
 *      * If the video mode name is found, substitute and return its
 *        canonical form (full spelling, in the proper case, with no '@'
 *        character)
 *      * Return video mode display dimensions or something like them
 *    Return TRUE iff the video mode name is found.
 */

static
int
fbc_is_known_mode(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_edid_res_t	edid_res_info[], /* Display device information */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	char		*mode_name_buf,	/* Video mode name scratch buffer */
	size_t		mode_name_buf_len, /* Scratch buffer length */
	fbc_video_mode_t *video_mode)	/* Video mode (-res <video_mode>) */
{
	sun_edid_mode_t	*edid_mode;	/* EDID/supported video mode */
	const char	*full_resname;	/* Current video mode/res name */
	fbc_mode_elem_t *mode_elem;	/* Mode list element (unintrusive) */
	fbc_mode_elem_t	*mode_list;	/* Modes from Monitor section of cfg */
	const char	*ptr;		/* Ptr into mode name, else NULL */
	int		stream_index;	/* Video stream index (zero-based) */
	const SunVideoSummary *vs;	/* Video summary array element ptr */

	/*
	 * Try to determine the display parameters for this video mode
	 *
	 *    For example, "VESA_STD_1280x1024x60" or "1280x1024x60"
	 *    would yeild 1280 for width and 1024 for height.
	 *
	 *    This is being done to cover the case in which the video
	 *    mode name isn't recognized.  The values may be needed for
	 *    "-res <video_mode> try" support.
	 *
	 *    This approach wouldn't work well with "AUTO" or "NONE."
	 *    It also is questionable to assume that a video mode name
	 *    reflects precise values.  Note the height values for these
	 *    EDID Standard Timings and the corresponding video mode
	 *    names:
	 *        1152x921x76 => "SUNW_STD_1152x900x76"
	 *        1152x921x66 => "SUNW_STD_1152x900x66"
	 */
	ptr = strrchr(video_mode->name, '_');
	if (ptr != NULL) {
		ptr += 1;
	} else {
		ptr = video_mode->name;
	}
	if (sscanf(ptr, "%dx%d", &video_mode->width, &video_mode->height)
					< 2) {
		video_mode->width  = 0;
		video_mode->height = 0;
	}
	video_mode->frequency = 0;	/* Not needed by any code so far */

	/*
	 * If found, replace '@' with 'x' (e.g. "640x480@60" => "640x480x60")
	 */
	ptr = strrchr(video_mode->name, '@');
	if (ptr != NULL) {
		if (strlcpy(mode_name_buf, video_mode->name, mode_name_buf_len)
					>= mode_name_buf_len) {
			return (FALSE);	/* Mode name is too problematic */
		}
		mode_name_buf[ptr - video_mode->name] = 'x';
		video_mode->name = mode_name_buf;
	}

	/*
	 * See whether the video mode name is found among the EDID modes
	 *
	 *    Ideally, the video mode name can be found with each of the
	 *    specified video streams, since we'll have to reject it
	 *    later otherwise.  For now, however, we just want to know
	 *    whether the name is valid.
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		if (edid_res_info[stream_index].video_mode == NULL) {
			continue;	/* No EDID data, etc. */
		}
		for (edid_mode = edid_res_info[stream_index].video_mode;
		     edid_mode->name != NULL;
		     edid_mode += 1) {
			if (fbc_resname_cmp(edid_mode->name, video_mode->name)
					== 0) {
				/* Return w/ canonicalized name, etc. */
				video_mode->name      = mode_name_buf;
				video_mode->width     = edid_mode->width;
				video_mode->height    = edid_mode->height;
				video_mode->frequency = edid_mode->frequency;
				return (strlcpy(mode_name_buf,
						edid_mode->name,
						mode_name_buf_len)
							< mode_name_buf_len);
			}
		}
	}

	/*
	 * See whether the video mode name is found in the config file
	 */
	mode_list =
		fbc_get_mode_list(configIR, monitor_sectn_ptr, device->type);
	for (mode_elem = mode_list;
	    mode_elem != NULL;
	    mode_elem = mode_elem->list.next) {
		full_resname = mode_elem->mode_ptr->ml_identifier;
		if (fbc_resname_cmp(full_resname, video_mode->name) == 0) {
			/* Return succesfully w/ canonicalized name, etc. */
			video_mode->name   = full_resname;
			video_mode->width  = mode_elem->mode_ptr->ml_hdisplay;
			video_mode->height = mode_elem->mode_ptr->ml_vdisplay;
			video_mode->frequency = 0; /* Unnecessary to compute */
			fbc_free_mode_list(mode_list);
			return (TRUE);
		}
	}
	fbc_free_mode_list(mode_list);

	/*
	 * See whether the video mode name is found in the built-in table
	 */
	for (vs = &SunVideoTable[0]; vs->id_string != NULL; vs += 1) {
		if (fbc_resname_cmp(vs->id_string, video_mode->name) == 0) {
			/* Return succesfully w/ canonicalized name, etc. */
			video_mode->name      = vs->id_string;
			video_mode->width     = vs->width;
			video_mode->height    = vs->height;
			video_mode->frequency = vs->vfreq;
			return (TRUE);
		}
	}

	/*
	 * Unrecognized video mode name
	 */
	return (FALSE);

}	/* fbc_is_known_mode() */


/*
 * fbc_is_supported_mode()
 *
 *    Given the canonicalized video mode name derived from a
 *    "-res <video_mode> ..." command line option:
 *      * Make sure the video mode is supported by all of the display
 *        devices associated with the frame buffer device.  The EDID
 *        data from each display device says which video timings and
 *        therefore which names are supported.
 *      * Make sure the hardware combination of frame buffer and each
 *        display device works with this video mode.
 *    Return TRUE iff the video mode appears valid.
 */

static
int
fbc_is_supported_mode(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	const char	*mode_name,	/* Video mode name (-res) */
	fbc_edid_res_t	edid_res_info[]) /* Display device information */
{
	sun_edid_mode_t	*edid_mode;	/* EDID/supported video mode(s) */
	int		stream_index;	/* Video stream index (zero-based) */
	int		supported_mode;	/* TRUE => Video mode is supported */

#if (1)	/* Unexplained vestige from Xsun's kfbconfig.c and nfbconfig.c */
	/*
	 * Compensate for some omission in sun_edid.c or resolutions.c?
	 */
	if (strcasecmp(mode_name, "VESA_STD_1600x1200x60") == 0) {
        	mode_name = "1600x1200x60";
	}

#endif
#if (0)	/* Is this a worthwhile check? */
	/*
	 * Make sure the mode is defined by a ModeLine / Mode-EndMode entry
	 */
	if (active->mode_entry == NULL) {
		fbc_errormsg(
			"Mode \"%s\" not found using Monitor section \"%s\"\n",
			active->mode_name,
			active->monitor_sectn->mon_identifier);
		return (FBC_ERR_GENERAL);
	}

#endif
	/*
	 * Validate the video mode for the indicated video streams (-dev)
	 */
	supported_mode = TRUE;

	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {

		edid_mode = edid_res_info[stream_index].video_mode;

		/*
		 * Make sure this monitor provided EDID data
		 */
		if (edid_mode == NULL) {
			char monitor_id[FBC_MAX_MONITOR_ID_LEN];

			fbc_get_monitor_id(
					device, stream_index, &monitor_id[0]);
			fbc_errormsg(
			"Warning: EDID data is not available for monitor%s\n",
				monitor_id);
			supported_mode = FALSE;
			continue;	/* Check any other monitors too */
		}

		/*
		 * See if this monitor supports the mode, according to EDID
		 */
		for ( ; ; edid_mode += 1) {
			if (edid_mode->name == NULL) {
				supported_mode = FALSE;
				break;	/* Not supported by this monitor */
			}
			if (fbc_resname_cmp(edid_mode->name, mode_name) == 0) {
				break;	/* Supported by this monitor */
			}
		}
	}

	return (supported_mode);

}	/* fbc_is_supported_mode() */


/*
 * fbc_res_validate_mode()
 *
 *    Given a "-res <video_mode> [nocheck|noconfirm] ..." command line
 *    option:
 *      * Look up the video mode name argument in these places:
 *          * The predefined keywords, "AUTO" and "NONE"
 *          * The EDID video mode names supported by the monitor
 *          * The active Monitor section of the configuration file
 *          * The built-in SunVideoTable[] array
 *      * If the video mode name is found, and if necessary, substitute
 *        and return its canonical form.
 *      * If the user didn't specify "nocheck" or "noconfirm",
 *          * make sure the video mode name was found, and
 *              * make sure the video mode is supported by each of the
 *                applicable display devices, including in combination
 *                with the frame buffer, or else
 *              * ask if the user knows what he's doing.
 *    Return TRUE iff the video mode appears valid or if the user
 *    insists.
 */

int
fbc_res_validate_mode(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	char		mode_name_buf[], /* Returned canonicalized mode name */
	size_t		mode_name_buf_len, /* Scratch buffer length */
	fbc_video_mode_t *video_mode)	/* Video mode (-res <video_mode>) */
{
	fbc_edid_res_t	edid_res_info[FBC_MAX_STREAMS];
	int		i;		/* Loop counter / array index */
	int		known_mode;	/* TRUE => Video mode name is known */
	fbc_mode_elem_t	*mode_list;	/* Modes from active Monitor section */
	int		stream_index;	/* Video stream index (zero-based) */
	int		valid_mode;	/* TRUE => Accept this video mode */
	int		sun_mode;	/* TRUE if mode is defined in SunModes section */


	/*
	 * Get the video modes from the active Monitor sectn of the config file
	 */
	mode_list = fbc_get_mode_list(
			configIR, fbvar->active.monitor_sectn, device->type);

	/*
	 * Get the video modes from the EDID data for each display device
	 */
	fbvar->get_edid_res_info(device, mode_list, edid_res_info);

	/*
	 * Free the list of video modes from the config file
	 *
	 *    Note that this is an unintrusive list.  Freeing it does
	 *    not affect the xf86 config data structures.
	 */
	fbc_free_mode_list(mode_list);

	/*
	 * Accept a keyword representing the monitors' preferred video mode
	 *
???	 *    TODO: Make sure all display devices have the same preferred mode
	 */
	for (i = 0; mode_pref_keywd[i] != NULL; i += 1) {
		if (strcasecmp(video_mode->name, mode_pref_keywd[i]) == 0) {
			sun_edid_mode_t	*edid_mode; /* Preferred mode */

			/*
			 * Return succesfully w/ preferred video mode, "AUTO"
			 */
			video_mode->name      = FBC_RESNAME_PREFERRED;
			video_mode->width     = 0;	/* If no EDID data */
			video_mode->height    = 0;	/* If no EDID data */
			video_mode->frequency = 0;	/* If no EDID data */

			stream_index = device->stream_lo;
			edid_mode = edid_res_info[stream_index].video_mode;
			if (edid_mode != NULL) {
				video_mode->width     = edid_mode->width;
				video_mode->height    = edid_mode->height;
				video_mode->frequency = edid_mode->frequency;
			}

			for ( ;
			    stream_index <= device->stream_hi;
			    stream_index += 1) {
				sun_edid_video_modes_free(
				    edid_res_info[stream_index].video_mode);
			}


			/* 
			 * If "AUTO" or "NONE" is specified, there is no need
			 * to include a SunModes section. So remove it,
			 * both internal & external representation
			 */
			fbc_trim_Modes_sections(configIR, video_mode->name);
			fbc_remove_monitor_sunmodes_section_ER(configIR,
						fbvar->active.monitor_sectn);

			/*
			 * Also remove the device specific use SunModes entry as well
			 */
			fbc_remove_monitor_usemodes_entry_ER(configIR,
						fbvar->active.monitor_sectn);
	
			return (TRUE);
		}
	}

	/*
	 * Look up and canonicalize the -res <video_mode> name argument
	 */
	known_mode = fbc_is_known_mode(configIR,
					device,
					edid_res_info,
					fbvar->active.monitor_sectn,
					mode_name_buf,
					mode_name_buf_len,
					video_mode);

	/*
	 * Check the video mode unless the user said "nocheck"
	 */
	valid_mode = TRUE;
	if (!fbvar->option_set.res_mode_nocheck) {
		const char *msg_format;	/* Error message format */

		/*
		 * Accept this video mode if either main bullet point is true:
		 *
		 *    * The video mode satisfies all of:
		 *        * is known from EDID, the config file, etc.
		 *        * is supported by the display device(s)
		 *        * is compatible with the frame buffer/monitor
		 *          combination
		 *    * The user said "noconfirm" or gives confirmation
		 */
		valid_mode = FALSE;
		msg_format = "Unrecognized video mode, \"%s\"\n";
		if (known_mode) {
			msg_format =
		    "Cannot verify that \"%s\" is a supported video mode\n";
			if (fbc_is_supported_mode(
				    device, video_mode->name, edid_res_info)) {
				/*
				 * See if frame buf & monitor(s) like this mode
				 */
				msg_format =
			    "Hardware does not support video mode, \"%s\"\n";
				if (fbc_res_compatible(device,
							edid_res_info,
							video_mode->name,
							NULL)) {
					valid_mode = TRUE;
				}
			}
		}
		if (!valid_mode) {
			fbc_errormsg(msg_format, video_mode->name);
			valid_mode =
				fbvar->option_set.res_mode_noconfirm ||
				fbc_ask_yes_no("Use \"%s\" anyway (yes/no) ? ",
						video_mode->name);
		}
		if (!valid_mode) {
			fbc_errormsg("No configuration changes made!\n");
			fbc_errormsg(
			"Note: Use \"-res ?\" to show valid video modes\n");
		}
	}

	/*
	 * Discard the mode name lists derived from EDID data
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		sun_edid_video_modes_free(
				edid_res_info[stream_index].video_mode);
	}

	/*
	 * after the validation, only keep the specified sun mode in the
	 * SunModes section
 	 */
	sun_mode = fbc_trim_Modes_sections(configIR, video_mode->name);

	/*
	 * remove the SunModes external representation that was added when
	 * the config file was read.
	 * A device specific SunModes section will be added to the file
	 * later which only includes the mode specified in the -res option.
	 * The reason is if all the SunModes are included in the mode section,
	 * xf86ValidateModes code will set the virtual dimension to the largest
	 * possible. This is not what is expected from fbconfig.
 	 */
	fbc_remove_monitor_sunmodes_section_ER(configIR,
						fbvar->active.monitor_sectn);

	if (!sun_mode) {
		/*
		 * if the specified mode is not a SunMode, remove the
		 * use SunMode entry
		 */
		fbc_remove_monitor_usemodes_entry_ER(configIR,
						fbvar->active.monitor_sectn);
	}

	return (valid_mode);

}	/* fbc_res_validate_mode() */


/* End of fbc_res.c */
