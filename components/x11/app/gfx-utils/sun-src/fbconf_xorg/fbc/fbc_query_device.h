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
 * fbc_query_device - Query a frame buffer device
 */



#ifndef _FBC_QUERY_DEVICE_H
#define	_FBC_QUERY_DEVICE_H


#include <sys/int_types.h>	/* uint16_t */
#include <sys/fbio.h>		/* fbgattr */

#include "sun_edid.h"		/* EDID data parsing */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */


/*
 * Display device information returned by xxx_get_edid_res_info() functions
 *
 *    Note that the length, 4, for manufacturer_id[] is hard-wired by
 *    EDID and includes a Nul terminator.
 */
typedef struct {
	char		manufacturer_id[4]; /* ID Manufacturer */
	uint16_t	product_code;	/* ID Product Code */
	sun_edid_mode_t	*video_mode;	/* Supported video modes array */
} fbc_edid_res_t;


int fbc_get_attributes(
	int		device_fd,	/* Device file descriptor number */
	struct fbgattr	*gattr);	/* Returned "Get attributes" struct */

char *fbc_get_fb_model_name(
	int		device_fd,	/* Device file descriptor number */
	char		**simple_model_name); /* Returned name w/o "SUNW," */

int fbc_get_edid_data(
	int		device_fd,	/* Device file descriptor number */
	int		stream_index,	/* Video stream index (zero-based) */
	uint8_t		**edid_data,	/* Returned EDID Base block, etc. */
	size_t		*edid_length);	/* Returned EDID data length */

void fbc_get_edid_res_info(
	const fbc_dev_t *device,	/* Frame buffer device info (-dev) */
	fbc_mode_elem_t	*mode_list,	/* Modes from Monitor section of cfg */
	fbc_edid_res_t	edid_res_info[]); /* Returned display device info */


#endif	/* _FBC_QUERY_DEVICE_H */


/* End of fbc_query_device.h */
