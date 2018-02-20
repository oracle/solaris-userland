/*
 * Copyright (c) 2012, Oracle and/or its affiliates. All rights reserved.
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
 * mga_query_device - Query the mga frame buffer device
 */

#include <sys/int_types.h>	/* uint8_t, uint32_t */
#include <errno.h>		/* errno */
#include <stdio.h>		/* NULL */
#include <stdlib.h>		/* malloc() */
#include <string.h>		/* memset(), strdup(), strerror() */
#include <unistd.h>		/* ioctl(), sleep() */

#include <sys/fbio.h>		/* cg6_info, fbgattr */

#include "gfx_common.h"		/* Model name, part number, cur video mode */

#include "sun_edid.h"		/* EDID data parsing */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_mode_list.h"	/* List of Modes from the config file */
#include "fbc_query_device.h"	/* Query a frame buffer device */

#include "mga_query_device.h"	/* Query the mga frame buffer device */


/*
 * mga_get_edid_data()
 *
 *    Query the frame buffer device for EDID data.  Return zero upon
 *    success, along with the EDID data, etc.  In the event of an error,
 *    display an error message and return the errno code and a NULL
 *    data pointer.
 */

int
mga_get_edid_data(
	int		device_fd,	/* Device file descriptor number */
	gfx_edid_t	*edid)		/* EDID data, etc. */
{
	int		i;		/* Retry loop counter */

	/*
	 * Get the EDID data for this video stream's display device
	 *
	 *    If the display device had been powered down, it may take a
	 *    few seconds to come up (Bug 4962976).
	 */
#define	GET_EDID_RETRIES 3		/* # of ioctl(MGA_GET_EDID) retries */
	for (i = GET_EDID_RETRIES; ; i -= 1) {
	        if (ioctl(device_fd, GFX_IOCTL_GET_EDID, edid) >= 0) {
			break;
		}
		if (i <= 0) {
			edid->length = 0;
			edid->data   = NULL;
			return (errno);	/* EDID data is unavailable */
		}
		sleep(1);
	}

	return (0);

}	/* mga_get_edid_data() */


/*
 * mga_get_edid_res_info()
 *
 *    For each video stream indicated by the effective -dev option,
 *    retrieve the EDID data from the display device and return the
 *    following information:
 *      * Manufacturer ID
 *      * Product Code
 *      * Pointer to a dynamically allocated array of supported video
 *        mode name strings w/ preferred video mode in first element
 *    The display device information is returned in the
 *    edid_res_info[FBC_MAX_STREAMS] array.
 */

void
mga_get_edid_res_info(
	const fbc_dev_t *device,	/* Frame buffer device info (-dev) */
	fbc_mode_elem_t	*mode_list,	/* Modes from Monitor section of cfg */
	fbc_edid_res_t	edid_res_info[]) /* Returned display device info */
{
	const int	mga_stream[2] = {
		GFX_EDID_HEAD_ONE,		/* Video stream 1 bit */
		GFX_EDID_HEAD_TWO		/* Video stream 2 bit */
	};
	gfx_edid_t	edid;		/* EDID data, etc. */
	uint8_t		edid_data[128]; /* EDID blocks (128 bytes each) */
	uint32_t	serial_num;	/* ID Serial Number (ignored) */
	int		stream_index;	/* Video stream index (zero-based) */

	memset(edid_res_info, 0, sizeof (fbc_edid_res_t) * FBC_MAX_STREAMS);

	/*
	 * Get the EDID -res information for the indicated streams (-dev)
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		/*
		 * Get the EDID data for this video stream's display device
		 */
		edid.head = mga_stream[stream_index];
		edid.length = sizeof (edid_data);
		edid.data   = (caddr_t)edid_data;
		if ((mga_get_edid_data(device->fd, &edid) != 0)
		    || (sun_edid_check_base((uint8_t *)edid.data, edid.length) != 0)) {
			continue;
		}

		/*
		 * Extract the -res related data for this display device
		 */
		sun_edid_vendor((uint8_t *)edid.data,
				edid_res_info[stream_index].manufacturer_id,
				&edid_res_info[stream_index].product_code,
				&serial_num);
		edid_res_info[stream_index].video_mode =
		    sun_edid_video_modes((uint8_t *)edid.data, edid.length, mode_list);
	}

}	/* mga_get_edid_res_info() */


/* End of mga_query_device.c */
