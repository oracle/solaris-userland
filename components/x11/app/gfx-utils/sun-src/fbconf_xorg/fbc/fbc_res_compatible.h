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



#ifndef	_FBC_RES_COMPATIBLE_H
#define	_FBC_RES_COMPATIBLE_H


#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_query_device.h"	/* Query a frame buffer device */


int fbc_res_compatible(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_edid_res_t	edid_res_info[], /* Display device information */
	const char	*res_mode_name,	/* "-res <video_mode>", else NULL */
	fbc_mode_elem_t	*res_mode_list); /* "-res ?" mode list, else NULL */


#endif	/* _FBC_RES_COMPATIBLE_H */


/* End of fbc_res_compatible.h */
