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

/* fields - Write aligned whitespace and text fields */

#pragma ident	"@(#)fields.h	1.1	08/10/10 16:29:28 SMI"


#ifndef	 _FIELDS_H
#define	 _FIELDS_H


#include <stdio.h>		/* FILE */


#define	XF86_TAB_WIDTH	8		/* Standard 8-column Tabs */


extern const char * const xf86whitespace_0[]; /* Indendation level 0 */
extern const char * const xf86whitespace_1[]; /* Indendation level 1 */
extern const char * const xf86whitespace_2[]; /* Indendation level 2 */


void xf86printFields(
	FILE		*cf,		/* Config file output stream */
	const char * const whitespace[], /* Array of whitespace strings */
	...);				/* NULL-terminated text field args */


#endif	/* _FIELDS_H */


/* End of fields.h */
