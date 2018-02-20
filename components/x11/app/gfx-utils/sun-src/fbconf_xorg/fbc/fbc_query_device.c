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
 * fbc_query_device - Query a frame buffer device
 */


#include <errno.h>		/* errno */
#include <stdlib.h>		/* free(), malloc() */
#include <string.h>		/* memset(), strerror(), strlen(), strstr() */
#include <unistd.h>		/* ioctl() */

#include <sys/fbio.h>		/* fbgattr */

#include "gfx_common.h"		/* Model name, part #, cur video mode, EDID */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_query_device.h"	/* Query a frame buffer device */


/*
 * fbc_get_attributes()
 *
 *    Query the frame buffer device for attribute information.  Return
 *    zero upon success, along with the attribute information.  In the
 *    event of an error, display an error message, clear the fbgattr
 *    structure, and return the errno code.
 */

int
fbc_get_attributes(
	int		device_fd,	/* Device file descriptor number */
	struct fbgattr	*gattr)		/* Returned "Get attributes" struct */
{
	int		error_code;	/* Error code (from errno.h) */

	error_code = 0;
	if (ioctl(device_fd, FBIOGATTR, gattr) < 0) {
		error_code = errno;
		fbc_errormsg("%s, ioctl(FBIOGATTR)\n", strerror(error_code));
		memset(gattr, 0, sizeof (struct fbgattr));
	}
	return (error_code);

}	/* fbc_get_attributes() */


/*
 * fbc_get_fb_model_name()
 *
 *    Return a pointer to a dynamically allocated string containing the
 *    complete frame buffer model name string (with any "SUNW," prefix)
 *    as well as a pointer to the simple model name substring (without
 *    any "SUNW," prefix), else NULLs in the event of an error.
 *
 *    It is the caller's responsibility to free the dynamically
 *    allocated model name string.
 */

char *
fbc_get_fb_model_name(
	int		device_fd,	/* Device file descriptor number */
	char		**simple_model_name) /* Returned name w/o "SUNW," */
{
	const char *const SUNW_ = "SUNW,"; /* Prefix on model & part strings */
	struct gfx_identifier gfx_ident; /* Graphics identifier */
	char		*full_model_name; /* Model name w/ "SUNW," prefix */

	full_model_name    = NULL;	/* Unavailable */
	*simple_model_name = NULL;

	if (ioctl(device_fd, GFX_IOCTL_GET_IDENTIFIER, &gfx_ident) >= 0) {
		if (gfx_ident.flags & GFX_IDENT_MODELNAME) {
			full_model_name = strdup(&gfx_ident.model_name[0]);
			if (full_model_name != NULL) {
				*simple_model_name = full_model_name;
				if (strncmp(full_model_name,
						SUNW_,
						strlen(SUNW_)) == 0) {
					*simple_model_name += strlen(SUNW_);
				}
			}
		}
	}

	return (full_model_name);

}	/* fbc_get_fb_model_name() */


/*
 * fbc_get_edid_data()
 *
 *    Query the frame buffer device for EDID data.  Return zero upon
 *    success, along with the EDID data, etc.  In the event of an error,
 *    display an error message and return the errno code and a NULL
 *    data pointer.
 */

#include "fbc_predid.h"

int
fbc_get_edid_data(
	int		device_fd,	/* Device file descriptor number */
	int		stream_index,	/* Video stream index (zero-based) */
	uint8_t		**edid_data,	/* Returned EDID Base block, etc. */
	size_t		*edid_length)	/* Returned EDID data length */
{
#define	GFX_EDID_HEAD_A	0x01		/* ??? */
#define	GFX_EDID_HEAD_B	0x02		/* ??? */
	const uint32_t	edid_head[2] = {
		GFX_EDID_HEAD_A,	/* Video stream A */
		GFX_EDID_HEAD_B		/* Video stream B */
	};
	gfx_edid_t	edid;		/* EDID data retrieval structure */
	int		error_code;	/* Error code (see errno.h) */

	/*
	 * In case of error
	 */
	*edid_data   = NULL;
	*edid_length = 0;

	/*
	 * Get the byte length of the available EDID data (else try to fake it)
	 *
	 *    If there's an error, assume the display device isn't
	 *    present.  Don't report the error here.  Just try to keep
	 *    going.
	 */
	memset(&edid, 0, sizeof(gfx_edid_t));
	edid.version = GFX_EDID_VERSION;
	edid.head    = edid_head[stream_index];
	error_code   = 0;
	if (ioctl(device_fd, GFX_IOCTL_GET_EDID_LENGTH, &edid) < 0) {
		error_code = errno;
		return error_code;
	}

	if (edid.length <= 0) {
		return -1;
	}

	/*
	 * Allocate the EDID data buffer
	 */
	edid.data = malloc(edid.length);
	if (edid.data == NULL) {
		error_code = errno;
		fbc_errormsg("%s, malloc(%u)\n",
			    strerror(error_code),
			    edid_length);
		return (error_code);
	}

	/*
	 * Get the EDID data
	 *
	 *    If there's an error, assume the display device isn't
	 *    present.  Don't report the error here.  Just return the
	 *    first error code encountered.
	 */
	if (ioctl(device_fd, GFX_IOCTL_GET_EDID, &edid) < 0) {
		if (error_code == 0) {
			error_code = errno;
		}
		free(edid.data);
		return (error_code);
	}

	/*
	 * Return successfully with the EDID data
	 */
	*edid_data   = (uint8_t *)edid.data;
	*edid_length = edid.length;
	return (0);

}	/* fbc_get_edid_data() */


/*
 * fbc_get_edid_res_info()
 *
 *    For each stream indicated by the effective -dev option, retrieve
 *    the EDID data from the display device and return the following
 *    information:
 *      * Manufacturer ID
 *      * Product Code
 *      * Pointer to a dynamically allocated array of supported video
 *        mode name strings w/ preferred video mode in first element
 *    The display device information is returned in the
 *    edid_res_info[FBC_MAX_STREAMS] array.
 */

void
fbc_get_edid_res_info(
	const fbc_dev_t *device,	/* Frame buffer device info (-dev) */
	fbc_mode_elem_t	*mode_list,	/* Modes from Monitor section of cfg */
	fbc_edid_res_t	edid_res_info[]) /* Returned display device info */
{
	uint8_t		*edid_data;	/* EDID Base block, etc. */
	size_t		edid_length;	/* EDID data length */
	uint32_t	serial_num;	/* ID Serial Number (ignored) */
	int		stream_index;	/* Video stream index (zero-based) */

	memset(edid_res_info, 0, sizeof (fbc_edid_res_t) * FBC_MAX_STREAMS);

	/*
	 * Repeat for each video stream
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		/*
		 * Get the EDID data for the display device
		 */
		if (fbc_get_edid_data(device->fd,
					stream_index,
					&edid_data,
					&edid_length) != 0) {
			continue;
		}
		if (sun_edid_check_base(edid_data, edid_length) == 0) {
			/*
			 * Get the -res related data for this display device
			 */
			sun_edid_vendor(edid_data,
					edid_res_info[0].manufacturer_id,
					&edid_res_info[0].product_code,
					&serial_num);
			edid_res_info[0].video_mode =
				sun_edid_video_modes(edid_data,
							edid_length,
							mode_list);
			free(edid_data);
		}
	}

}	/* fbc_get_edid_res_info() */


/* End of fbc_query_device.c */
