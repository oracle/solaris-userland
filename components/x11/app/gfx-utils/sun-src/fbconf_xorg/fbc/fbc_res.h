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
 * fbc_res - Video mode/resolutions (-res option)
 */



#ifndef	_FBC_RES_H
#define	_FBC_RES_H


#include <string.h>		/* size_t */

#include "xf86Parser.h"		/* Public function, etc. declarations */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_query_device.h"	/* Query a frame buffer device */


int fbc_resname_stereo(
	const char	*resname);	/* Video mode name */

int fbc_resname_digital(
	const char	*resname);	/* Video mode name */

#define	FBC_MAX_MONITOR_ID_LEN	16	/* Room for " %d" or "" string */

void fbc_get_monitor_id(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	int		stream_index,	/* Video stream index (zero-based) */
	char		*monitor_id_buf); /* Returned monitor ID, else "" */

void fbc_res_list_modes(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	XF86ConfigPtr	configIR);	/* Ptr to configuration Internal Rep */

int fbc_res_validate_mode(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	char		*mode_name_buf,	/* Returned normalized video mode */
	size_t		mode_name_buf_len, /* Scratch buffer length */
	fbc_video_mode_t *video_mode);	/* Video mode (-res <video_mode>) */


#endif	/* _FBC_RES_H */


/* End of fbc_res.h */
