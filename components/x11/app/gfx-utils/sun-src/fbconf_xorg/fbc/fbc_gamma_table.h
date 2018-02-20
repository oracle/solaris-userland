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
 * fbc_gamma_table - Read, pack, and write a gamma table
 */



#ifndef _FBC_GAMMA_TABLE_H
#define	_FBC_GAMMA_TABLE_H


int fbc_read_gamma_table(
	const char	*gfile_in_path,	/* Pathname of input gamma file */
	int		lut_size,	/* Gamma look-up table size */
	char		**gamma_string_red, /* Returned packed Red values */
	char		**gamma_string_green, /* Returned packed Green vals */
	char		**gamma_string_blue); /* Returned packed Blue values */

int fbc_build_gamma_table_path(
	const char	*config_file_path, /* Configuration file pathname */
	const char	*device_name,	/* Frame buffer device name */
	char		*gfile_path_buf, /* Gamma table output pathname buf */
	int		gfile_path_buf_len); /* Gamma table path buf len */

int fbc_write_packed_gamma_table(
	const char	*gfile_out_path, /* Pathname of output gamma file */
	char		*gamma_string_red, /* Packed Red values string */
	char		*gamma_string_green, /* Packed Green values string */
	char		*gamma_string_blue); /* Packed Blue values string */

int fbc_read_packed_gamma_table(
	const char	*gfile_in_path,	/* Pathname of input gamma file */
	char		**gamma_string_red, /* Returned packed Red values */
	char		**gamma_string_green, /* Returned packed Green vals */
	char		**gamma_string_blue); /* Returned packed Blue values */

void fbc_free_gamma_strings(
	char		*gamma_string_red, /* Packed Red values string */
	char		*gamma_string_green, /* Packed Green values string */
	char		*gamma_string_blue); /* Packed Blue values string */


#endif	/* _FBC_GAMMA_TABLE_H */


/* fbc_gamma_table.h */
