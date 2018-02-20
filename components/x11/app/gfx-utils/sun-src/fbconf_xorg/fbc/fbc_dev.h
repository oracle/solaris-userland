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
 * fbc_dev - Identify the graphics device (-dev opt)
 */



#ifndef	_FBC_DEV_H
#define	_FBC_DEV_H


#include <string.h>		/* size_t */
#include <sys/visual_io.h>	/* VISUAL environment device identifier */


/*
 * Frame buffer device information (derived from the effective -dev argument)
 */
typedef struct {
	const char	*path;		/* Full path (e.g. "/dev/fbs/efb0a") */
	const char	*name;		/* Simple filename (e.g. "efb0a") */
	const char	*type;		/* Device type name (e.g. "efb") */
	int		number;		/* Unit number, else -1 */
	char		stream_char;	/* Stream suffix { '\0', 'a', 'b' } */
	char		stream_lo;	/* Stream index lower bound { 0..1 } */
	char		stream_hi;	/* Stream index upper bound { 0..1 } */
	int		max_streams;	/* Number of video streams { 1..2 } */
	int		fd;		/* File descriptor number, else -1 */
	int		is_default;	/* TRUE => Is default frame buffer */
	struct vis_identifier vis_ident; /* VISUAL environment identifier */
} fbc_dev_t;


int fbc_get_device_arg(
	const int	argc,		/* Program argument count */
	char	* const	argv[],		/* Program argument vector */
	const char	**device_arg);	/* Returned effective arg to -dev */

int fbc_get_default_device(
	char		*device_path_buf, /* Ptr to device path buffer */
	size_t		device_path_buflen, /* Device path buffer length */
	char		*device_type_buf, /* Ptr to device type buffer */
	size_t		device_type_buflen, /* Device type buffer length */
	fbc_dev_t	*device);	/* Returned device name components */

int fbc_get_device_name(
	const char	*device_arg,	/* Device argument (-dev opt) */
	char		*device_path_buf, /* Ptr to device path buffer */
	size_t		device_path_buflen, /* Device path buffer length */
	char		*device_type_buf, /* Ptr to device type buffer */
	size_t		device_type_buflen, /* Device type buffer length */
	fbc_dev_t	*device);	/* Returned device name components */

void fbc_revise_device_info(
	fbc_dev_t	*device);	/* Revised frame buffer device info */


#endif	/* _FBC_DEV_H */


/* End of fbc_dev.h */
