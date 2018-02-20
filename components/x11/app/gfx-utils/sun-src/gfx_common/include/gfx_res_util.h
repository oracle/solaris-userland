/*
 * Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.
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

#ifndef _GFX_RES_UTIL_H
#define	_GFX_RES_UTIL_H

/*
 * gfx_res_util.h: declarations for generic resolution structures.
 */

typedef enum {
	SunVideoEncoding_NOTSET = 0,
	SunVideoEncodingNone,
	SunVideoEncodingNTSC,
	SunVideoEncodingPAL
} SunVideoEncoding;


/*
 * Table of generic Sun video timing information
 */
typedef struct sun_video_timing {
	char		*id_string;
	unsigned int	Hact;	/* horizontal active width in pixels	*/
	unsigned int	Hfp;	/* horizontal front porch  in pixels	*/
	unsigned int	Hsw;	/* horizontal sync width   in pixels	*/
	unsigned int	Hbp;	/* horizontal back porch   in pixels	*/
	unsigned int	Hsrp;	/* horizontal serration    in pixels	*/
	unsigned int	Vact;	/* vertical active height  in scanlines	*/
	unsigned int	Vfp;	/* vertical front porch    in scanlines	*/
	unsigned int	Vsw;	/* vertical sync width     in scanlines	*/
	unsigned int	Vse;	/* vsync extension for multifield #1	*/
	unsigned int	Vbp;	/* vertical back porch     in scanlines	*/
	unsigned int	Pclk;	/* pixel clock frequency in khz		*/
	unsigned int	Fint;	/* interlaced       video enabled	*/ 
	unsigned int	Fseq;	/* field sequential video enabled	*/ 
	unsigned int	Fst;	/* stereo           video enabled	*/ 
	unsigned int	Stype;	/* sync type (separate, combined)	*/ 
	unsigned int	SHpol;	/* sync polarity horizontal		*/ 
	unsigned int	SVpol;	/* sync polarity vertical		*/ 
	unsigned int	SonG;	/* sync on green - enabled		*/ 
	unsigned int	SGpol;	/* sync on green - polarity		*/
	SunVideoEncoding Encod; /* Video Encoding Standard              */
	double          Hund;   /* horizontal underscan                 */
	double          Vund;   /* vertical   underscan                 */
} SunVideoTiming;

#endif /* _GFX_RES_UTIL_H */

