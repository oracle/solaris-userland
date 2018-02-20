/*
 * Copyright (c) 2003, 2008, Oracle and/or its affiliates. All rights reserved.
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


#ifndef	_RESOLUTIONS_H
#define	_RESOLUTIONS_H


/*
 * Video mode summary table
 */

typedef	struct {
	const char	*id_string;	/* e.g. "SUNW_STD_1280x1024x60" */
	unsigned int	width;
	unsigned int	height;
	unsigned int	vfreq;		/* Rounded to nearest Hz */
	unsigned int	Hfp;		/* Front porch */
	unsigned int	Hsw;		/* Horizontal sync width */
	unsigned int	Hbp;		/* Back porch */
	unsigned int	Vfp;		/* Front porch */
	unsigned int	Vsw;		/* Vertical sync width */
	unsigned int	Vbp;		/* Back porch */
	unsigned int	Pclk;		/* Pixel clock, kHz */
	unsigned int	Fint  : 1;	/* Interlaced */
	unsigned int	Fst   : 1;	/* Stereo */
	unsigned int	Stype : 1;	/* Sync type (seperate, combined) */
	unsigned int	SHpol : 1;	/* Horizontal polarity */
	unsigned int	SVpol : 1;	/* Vertical polarity */
} SunVideoSummary;

extern const SunVideoSummary SunVideoTable[]; /* NULL-terminated */


#endif	/* _RESOLUTIONS_H */


/* End of resolutions.h */
