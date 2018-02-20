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
 * fbc_predid - Display EDID data
 */



#ifndef _FBC_PREDID_H
#define	_FBC_PREDID_H


#include <sys/int_types.h>	/* uint8_t */


void fbc_predid_dump_bytes(
	const uint8_t	edid_data[],	/* EDID Base & Extension blocks */
	size_t		start_offset,	/* Starting byte offset */
	size_t		end_offset);	/* Ending   byte offset */

typedef struct {
	unsigned int	tag;		/* String tag number */
	const char	*text;		/* String text */
} fbc_tag_str_t;

const char *
fbc_predid_tagged_string(
	unsigned int	tag,		/* String tag number */
	const fbc_tag_str_t string[],	/* Array of tagged strings */
	const char *const default_text); /* Default string text */

void fbc_predid_std_timings(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr);	/* Ending   byte address */

void fbc_predid_det_timing(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr);	/* Ending   byte address */

void fbc_predid(
	const uint8_t	*edid_data,	/* EDID Base & Extension blocks */
	size_t		edid_length,	/* EDID data block(s) length */
	int		predid_raw,	/* TRUE => Display raw EDID data */
	int		predid_parsed);	/* TRUE => Display parsed EDID data */


#endif	/* _FBC_PREDID_H */


/* End of fbc_predid.h */
