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
 * fbc_prconf - Display current hardware configuration
 */



#ifndef _FBC_PRCONF_H
#define	_FBC_PRCONF_H


#include <sys/int_types.h>	/* uint8_t */

#define	FBC_MAX_LINE_LEN 75	/* Max -prconf output line length in columns */


void fbc_prconf_model(
	int		device_fd);	/* Device file descriptor number */

void fbc_prconf_edid(
	uint8_t		*edid_data,	/* EDID Base & Extension blocks */
	size_t		edid_length,	/* EDID data block(s) length */
	fbc_mode_elem_t	*mode_list);	/* Video modes from config file */

void fbc_prconf_cur_mode(
	int		device_fd);	/* Device file descriptor number */


#endif	/* _FBC_PRCONF_H */


/* End of fbc_prconf.h */
