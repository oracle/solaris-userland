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
 * fbc_res_compatible - Video mode compatibity check (-res)
 */


//#include <sys/types.h>
#include <ctype.h>		/* isspace() */
#include <errno.h>		/* errno, ENOENT */
#include <stdio.h>		/* fclose(), feof(), fgets(), fopen(), ... */
#include <stdlib.h>		/* strtoul() */
#include <string.h>		/* strcasecmp(), strchr(), str[c]spn() */
#include <unistd.h>		/* ioctl() */

#include "gfx_common.h"		/* Model name, part number, cur video mode */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_mode_list.h"	/* List of Modes from the config file */
#include "fbc_query_device.h"	/* Query a frame buffer device */
#include "fbc_res_compatible.h"	/* Video mode compatibity check (-res) */


#define	MAX_LINE_LEN	1024		/* Max length of input line */


/*
 * fbc_res_comp_parse()
 *
 *    Parse an incompatibility file line and return the field values, if
 *    any.  The line buffer most likely will be altered in the process.
 */

static
int
fbc_res_comp_parse(
	char		*line_buf,	/* Line of video mode exception file */
	char		**fb_model_name, /* Returned frame buffer model name */
	char		**manufacturer_id, /* Returned display manufacturer */
	char		**product_field, /* Returned display product code */
	uint16_t	*product_code,	/* Returned display product code */
	char		**video_mode,	/* Returned video mode name */
	char		**error_text)	/* Returned error message text */
{
#define	FBC_WHITESPACE	"\t\n "		/* Characters treated as whitespace */
	char		*end_ptr;	/* Ptr to product code terminator */
	char		*line_ptr;	/* Ptr into line buffer */

	/*
	 * No fields to return yet
	 */
	*fb_model_name   = NULL;	/* Assume the line is empty */
	*manufacturer_id = NULL;
	*product_field   = NULL;
	*product_code    = 0;
	*video_mode      = NULL;
	*error_text      = NULL;	/* Assume no error to report */

	/*
	 * Discard any comment string
	 */
	line_ptr = strchr(line_buf, '#');
	if (line_ptr != NULL) {
		*line_ptr = '\0';
	}

	/*
	 * Skip any leading whitespace and ignore logically empty lines
	 */
	line_ptr = line_buf;
	line_ptr += strspn(line_ptr, FBC_WHITESPACE);
	if (*line_ptr == '\0') {
		return (FBC_SUCCESS);	/* Logically empty line */
	}

	/*
	 * Scan the frame buffer model name field (e.g., "SUNW,XVR-2500")
	 */
	*fb_model_name = line_ptr;
	line_ptr += strcspn(line_ptr, FBC_WHITESPACE);
	if (*line_ptr == '\0') {
		*error_text = "Error near frame buffer model name";
	}
	*line_ptr = '\0';		/* Nul overwrites whitespace char */
	line_ptr += 1;

	/*
	 * Skip any remaining whitespace that separates fields
	 */
	line_ptr += strspn(line_ptr, FBC_WHITESPACE);

	/*
	 * Scan the display device manufacturer ID field (e.g., "SUN" or "*")
	 */
	*manufacturer_id = line_ptr;
	line_ptr += strcspn(line_ptr, ",");
	if (*line_ptr == '\0') {
		*error_text = "Error near display device manufacturer ID";
		return (FBC_ERR_GENERAL);
	}
	*line_ptr = '\0';		/* Nul overwrites ',' char */
	line_ptr += 1;

	/*
	 * Parse the display device product code field (number or "*")
	 */
	*product_field = line_ptr;
	line_ptr += strcspn(line_ptr, FBC_WHITESPACE);
	if ((line_ptr == *product_field) || (*line_ptr == '\0')) {
		*error_text = "Error near display device product code";
	}
	*line_ptr = '\0';		/* Nul overwrites whitespace char */
	line_ptr += 1;
	if (strcmp(*product_field, "*") != 0) {
		*product_code = strtoul(*product_field, &end_ptr, 0);
		if (*end_ptr != '\0') {
			*error_text = "Invalid display device product code";
			return (FBC_ERR_GENERAL);
		}
	}

	/*
	 * Skip any whitespace separating fields
	 */
	line_ptr += strspn(line_ptr, FBC_WHITESPACE);

	/*
	 * Scan the video mode name field
	 */
	*video_mode = line_ptr;
	line_ptr += strcspn(line_ptr, FBC_WHITESPACE);
	if (*line_ptr == '\0') {
		return (FBC_SUCCESS);	/* No trailing whitespace */
	}
	*line_ptr = '\0';
	line_ptr += 1;			/* Nul overwrites whitespace or NL */

	/*
	 * Skip any additional trailing whitespace
	 */
	line_ptr += strspn(line_ptr, FBC_WHITESPACE);
	if (*line_ptr != '\0') {
		*error_text = "Garbage following video mode name";
		return (FBC_ERR_GENERAL);
	}

	return (FBC_SUCCESS);

}	/* fbc_res_comp_parse() */


/*
 * fbc_res_comp_lookup()
 *
 *    Read a text file containing entries:
 *        Frame buffer model name,
 *        Display device Manufacturer ID and Product Code
 *        Video mode name
 *    one entry per line.  Return TRUE iff the arguments to this
 *    function do not match any incompatibility entry.
 *
 *    File syntax:
 *        <file>    =:: <line>...
 *        <line>    =:: [<sp>][<entry>][<sp>]<eol>
 *        <entry>   =:: <fb_model_name><sp><display><sp><video_mode_name>
 *        <display> =:: <edid_manufacturer_id>,<edid_product_code>
 *        <sp>      =:: ' '|'\t'
 *        <eol>     =:: [<comment>]'\n'
 *        <comment> =:: '#'[<text>]
 *
 *        The "*" wildcard string will match any <edid_manufacturer_id>
 *        or any <edid_product_code>.  It follows that "*,*" will match
 *        any <display>.
 *
 *    File example:
 *
 *        # Hardware configurations and incompatible video modes
 *        #
 *        # Frame Buffer    Display Device         Video Mode Name
 *        # Model Name      Mfg ID, Product Code
 *        # ------------    --------------------   ---------------
 *        SUNW,XVR-50       *,*                    SUNW_STD_1280x1024x76
 *        SUNW,XVR-50       *,*                    SUNW_STD_1920x1200x75
 *        SUNW,XVR-100      SUN,0x586              SUNW_STD_1280x1024x76
 *        SUNW,XVR-300      SUN,0x586              SUNW_STD_1280x1024x76
 *
 *        # End of fbconf_res.rc
 */

static
int
fbc_res_comp_lookup(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	char		*gfx_model_name, /* Our frame buffer model name */
	fbc_edid_res_t	edid_res_info[], /* Display device information */
	const char	*res_mode_name,	/* "-res <video_mode>", else NULL */
	fbc_mode_elem_t	*res_mode_list,	/* "-res ?" mode list, else NULL */
	const char *const mode_comp_path, /* Video mode compatibility path */
	FILE		*mode_comp_stream) /* Vid mode compatibility stream */
{
	char		*manufacturer_id; /* Display Mfg ID in line_buf[] */
	uint16_t	product_code;	/* Display device product code */
	char		*product_field;	/* Disp dev prod code in line_buf[] */
	char		*end_ptr;	/* Ptr to terminator char */
	char		*error_text;	/* Error message text */
	char		*fb_model_name;	/* Frame buffer model in line_buf[] */
	char		line_buf[MAX_LINE_LEN];	/* Line of video mode file */
	int		line_num;	/* Exceptions file line number */
	char		*line_ptr;	/* Ptr into line_buf[] buffer */
	char		*mode_name;	/* Video mode name in line_buf[] */
	int		stream_index;	/* Video stream index (zero-based) */

	/*
	 * Examine each line of the video mode incompatibility file
	 */
	line_num  = 0;
	line_ptr  = &line_buf[0];
	*line_ptr = '\0';		/* Empty line buffer */
	for (;;) {
		/*
		 * Read a line from the file
		 */
		line_num += 1;
		if (fgets(line_buf, MAX_LINE_LEN, mode_comp_stream) == NULL) {
			if (feof(mode_comp_stream) == 0) {
				fbc_errormsg(
		"Error reading video mode exceptions file, %s, line %d\n",
						mode_comp_path, line_num);
				break;	/* Mode exceptions file input error */
			}
			break;		/* End of mode exceptions file */
		}

		/*
		 * Parse the line
		 */
		if (fbc_res_comp_parse(line_buf,
					&fb_model_name,
					&manufacturer_id,
					&product_field,
					&product_code,
					&mode_name,
					&error_text) != FBC_SUCCESS) {
			fbc_errormsg("%s, %s, line %d\n",
					error_text, mode_comp_path, line_num);
			continue;
		}

		/*
		 * See if this line specifies our frame buffer model
		 */
		if (fb_model_name == NULL) {
			continue;	/* Logically empty line */
		}
		if (strcasecmp(fb_model_name, gfx_model_name) != 0) {
			continue;	/* Not our frame buffer model */
		}

		/*
		 * See if this line matches any of our display devices
		 */
		for (stream_index = device->stream_lo; ; stream_index += 1) {
			if (stream_index > device->stream_hi) {
				/* None of our display devices found */
				goto continue_outer_loop;
			}

			if (((strcmp(manufacturer_id, "*") == 0) ||
			    (strcasecmp(manufacturer_id,
					edid_res_info[stream_index]
							.manufacturer_id)
					== 0)) &&
			    ((strcmp(product_field, "*") == 0) ||
			    (product_code ==
				edid_res_info[stream_index].product_code))) {
				/* At least one of our display devices found */
				break;
			}
		}

		/*
		 * See if this line specifies a video mode of interest
		 */
		if ((res_mode_name != NULL) &&
		    (strcasecmp(mode_name, res_mode_name) == 0)) {
			/*
			 * Incompatible "-res <video_mode>" mode
			 */
			return (FALSE);
		}

		if (res_mode_list != NULL) {
			fbc_mode_elem_t *mode_elem; /* Mode list element */

			for (mode_elem = res_mode_list;
			    mode_elem != NULL;
			    mode_elem = mode_elem->list.next) {

				if ((mode_elem->mode_ptr->ml_identifier
						!= NULL) &&
				    (strcasecmp(mode_name,
						mode_elem->mode_ptr->
							ml_identifier) == 0)) {
					/*
					 * Incompatible "-res ?" video mode
					 */
					mode_elem->mode_ptr = NULL;
				}
			}
		}

		/*
		 * No match with this line of the file
		 */
continue_outer_loop:
		;
	}

	/*
	 * Show that we didn't find an incompatible "-res <video_mode>" mode
	 *
	 *    The return value is defined only for the
	 *    "-res <video_mode>" case.  In the "-res ?" case, this is
	 *    the sole return path, and any incompatible video modes
	 *    have been unlinked from the res_mode_list list.
	 */
	return (TRUE);

}	/* fbc_res_comp_lookup() */


/*
 * fbc_res_compatible()
 *
 *    Given the caller's frame buffer, its attached display devices, and
 *    a video mode or list of video modes, indicate which of the
 *    caller's video modes are on file as being incompatible with the
 *    hardware.  Known incompatibilities are contained in a text file
 *    consisting of entries of the form:
 *        Frame buffer model name
 *        Display device Manufacturer ID and Product Code
 *        Video mode name
 *    Each one-line entry represents hardware and a video mode that
 *    behave badly when used together.
 *
 *    To check a "-res <video_mode>" command line option value for
 *    compatibility, the caller should pass the video mode name via the
 *    res_mode_name parameter and a NULL via the res_mode_list
 *    parameter.  This function will return TRUE iff the parameters do
 *    not match any entry in the file, or if the file doesn't exist.
 *
 *    To filter the "-res ?" video modes that will be displayed, the
 *    caller should pass a NULL via the res_mode_name parameter and an
 *    unintrusive linked list of config file Mode entries via the
 *    res_mode_list parameter.  This function will unlink any Mode
 *    entries that are known to be incompatible with the hardware.
 *    (The caller is responsible for insuring that this does not cause
 *    memory leaks.)  The function return value is undefined.
 *
 *    The results are undefined if the res_mode_name and res_mode_list
 *    parameters are both NULL or are both non-NULL.
 */

int
fbc_res_compatible(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_edid_res_t	edid_res_info[], /* Display device information */
	const char	*res_mode_name,	/* "-res <video_mode>", else NULL */
	fbc_mode_elem_t	*res_mode_list)	/* "-res ?" mode list, else NULL */
{
	const char *const mode_comp_path = FBC_LIB_DIR "/fbconf_res.rc";
	int		error_code;	/* Returned error code */
	struct gfx_identifier gfx_ident; /* Graphics identifier */
	int		is_compatible;	/* TRUE => Video mode should be OK */
	FILE		*mode_comp_stream; /* Mode compatibility stream */

	/*
	 * Get the complete frame buffer model name (e.g., "SUNW,XVR-2500")
	 */
	if ((ioctl(device->fd, GFX_IOCTL_GET_IDENTIFIER, &gfx_ident) < 0) ||
	    ((gfx_ident.flags & GFX_IDENT_MODELNAME) == 0)) {
		return (TRUE);	/* Assume compatibility */
	}

	/*
	 * Open the video mode incompatibility file, if any
	 */
	errno = 0; /* fopen() can fail and not set errno if no free streams */
	mode_comp_stream = fopen(mode_comp_path, "r");
	if (mode_comp_stream == NULL) {
		if (errno != ENOENT) {
			fbc_errormsg(
			    "Can't open video mode compatibility file, %s\n",
				    mode_comp_path);
		}
		return (TRUE);		/* Assume no incompatibilities */
	}

	/*
	 * Read incompatibility entries, checking each for a match
	 */
	is_compatible = fbc_res_comp_lookup(device,
					    &gfx_ident.model_name[0],
					    edid_res_info,
					    res_mode_name,
					    res_mode_list,
					    mode_comp_path,
					    mode_comp_stream);

	/*
	 * Close the video mode incompatibilities file
	 */
	fclose(mode_comp_stream);

	return (is_compatible);

}	/* fbc_res_compatible() */


/* End of fbc_res_compatible.c */
