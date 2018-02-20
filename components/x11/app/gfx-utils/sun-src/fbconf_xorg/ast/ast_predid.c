/*
 * Copyright (c) 2009, Oracle and/or its affiliates. All rights reserved.
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
 * ast_predid - Display EDID data
 */

#include <sys/int_types.h>	/* uint8_t */
#include <stdio.h>		/* printf() */

#if 0
#include "astio.h"		/* ast I/O, including ioctl() stuff */
#endif

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_predid.h"		/* Display EDID data */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_query_device.h"	/* Query a frame buffer device */

#include "ast_predid.h"		/* Display EDID data */
#include "ast_query_device.h"	/* Query the ast graphics device */


/*
 * ast_predid_stream()
 *
 *    Display the EDID data for the display device specified by video
 *    stream index (which corresponds to the device name's stream suffix
 *    letter).
 */

static
void
ast_predid_stream(
	int 		device_fd,	/* Device file descriptor */
	int		stream_index,	/* Video stream index (zero-based) */
	int		predid_raw,	/* TRUE => Display raw EDID data */
	int		predid_parsed)	/* TRUE => Display parsed EDID data */
{
	const int	edid_stream[2] = {
		GFX_EDID_HEAD_ONE,		/* Video stream 1 bit */
		GFX_EDID_HEAD_TWO		/* Video stream 2 bit */
	};
	gfx_edid_t	edid;		/* EDID data, etc. */
	uint8_t		edid_data[128]; /* EDID blocks (128 bytes each) */

	/*
	 * Get the EDID data for this video stream's display device
	 */
	edid.head = edid_stream[stream_index];
	edid.length = sizeof(edid_data);
	edid.data   = (caddr_t)edid_data;
	ast_get_edid_data(device_fd, &edid);

	/*
	 * Display the EDID information for this display device
	 */
	fbc_predid((uint8_t *)edid.data, edid.length, predid_raw, predid_parsed);

}	/* ast_predid_stream() */


/*
 * ast_predid()
 *
 *    Display EDID data for each video stream (-predid [raw] [parsed]).
 */

void
ast_predid(
	const fbc_dev_t *device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar)		/* fbconf_xorg(1M) varient data */
{
	int		stream_index;	/* Video stream index (zero-based) */

	/*
	 * Display the EDID data for each of the indicated streams (-dev)
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		printf("Monitor %d:\n", stream_index + 1);
		ast_predid_stream(device->fd,
				stream_index,
				fbvar->option_set.predid_raw,
				fbvar->option_set.predid_parsed);
	}

}	/* ast_predid() */


/* End of ast_predid.c */
