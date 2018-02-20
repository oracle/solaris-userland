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
 * fbc_fields - Measure aligned whitespace fields
 */



#ifndef	_FBC_FIELDS_H
#define	_FBC_FIELDS_H


/*
 * Whitespace used to format a configuration line
 *
 *    Once populated, the NULL-terminated fbc_wspace_t.whitespace[]
 *    array can be passed to the xf86printFields() function, as the
 *    whitespace[] parameter.
 */
#define	FBC_WSPACE_FIELDS 2		/* Look at just the first two fields */

typedef struct {
	const char	*whitespace[FBC_WSPACE_FIELDS+1]; /* Wspace ptrs */
	char		whitespace_buf[1024]; /* Whitespace strings buffer */
} fbc_wspace_t;


void fbc_measure_whitespace(
	const char * const configBuf,	/* Configuration file line buffer */
	fbc_wspace_t	*wspace_chars);	/* Line's whitespace characteristics */


#endif	/* _FBC_FIELDS_H */


/* End of fbc_fields.h */
