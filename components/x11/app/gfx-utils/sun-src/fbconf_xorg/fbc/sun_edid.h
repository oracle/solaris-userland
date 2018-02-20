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


/* sun_edid - EDID data parsing */


#ifndef	_SUN_EDID_H
#define	_SUN_EDID_H


#include <sys/types.h>		/* uint8_t, uint16_t, uint32_t */ 

//#include "gfx_res_util.h"	/* SunVideoTiming */

#include "resolutions.h"	/* Video mode summary table: SunVideoTable[] */

#include "fbc_mode_list.h"	/* List of Modes from Monitor section of cfg */


/*
 * EDID Version & Revision comparison primitives
 */
#define	EDID_VER_REV(_BUF)	sun_edid_get_be_short(&_BUF[0x12])
#define	EDID_1_0		0x0100		/* EDID 1.0 */
#define	EDID_1_1		0x0101		/* EDID 1.1 */
#define	EDID_1_2		0x0102		/* EDID 1.2 */
#define	EDID_1_3		0x0103		/* EDID 1.3 */
#define	EDID_1_4		0x0104		/* EDID 1.4 */


uint16_t sun_edid_get_be_short(
	const uint8_t	*edid_data);	/* EDID data bytes */

uint16_t sun_edid_get_le_short(
	const uint8_t	*edid_data);	/* EDID data bytes */

uint32_t sun_edid_get_le_long(
	const uint8_t	*edid_bytes);	/* EDID data bytes */

uint8_t sun_edid_checksum(
	const uint8_t	*edid_data);	/* EDID data block */

int sun_edid_check_base(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		edid_length);	/* EDID data length */

int sun_edid_check_extensions(
	const uint8_t	*edid_data,	/* Base & Extension EDID blocks */
	size_t		edid_length);	/* EDID data length */

void sun_edid_vendor(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*name,		/* Manufacturer ID  (3 chars & Nul) */
	uint16_t	*product_code,	/* Product code */
	uint32_t	*serial_num);	/* Serial number, else zero */

void sun_edid_mdate(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		*week,		/* Week of manufacture (or flags) */
	int		*year);		/* Year of manufacture or model year */

/* Video Input Definition */
typedef struct {
	short		digital;	/* TRUE => Digital Video Interface */
	/* Analog Video Signal Interface */
	struct {
		float	video;		/* Signal Level Standard, Video */
		float	sync;		/* Signal Level Standard, Sync */
		short	black2black    : 1; /* Blank-to-Black or pedestal */
		short	sync_separate  : 1; /* Separate Sync H & V Signals */
		short	sync_composite : 1; /* Composite Sync on Horizontal */
		short	sync_green     : 1; /* Composite Sync on Green Video */
		short	serration      : 1; /* Serration on Vertical Sync */
	} alg;
	/* Digital Video Signal Interface */
	struct {
		short	color_depth;	/* Color Bit Depth */
		short	vid_standard;	/* Digital Video Interface Standard */
	} dig;
} sun_edid_viddef_t;

void sun_edid_video_input(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_viddef_t *video_def);	/* Returned Video Input Definition */

void sun_edid_screen_size(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		*horizontal,	/* Horizontal Screen Size (cm), etc. */
	int		*vertical,	/* Vertical Screen Size (cm), etc. */
	float		*aspect);	/* Aspect ratio, else zero */

void sun_edid_gamma(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	float		*gamma);	/* Returned gamma value, else zero */

/* EDID Feature Support info */
typedef struct {
	short		color_info;	/* Color Type / Color Encoding Fmt */
	short		standby    : 1;	/* TRUE => Standby Mode supported */
	short		suspend    : 1;	/* TRUE => Suspend Mode supported */
	short		active_off : 1;	/* TRUE => Active Off supported */
	short		digital    : 1;	/* TRUE => Input is Digital Video */
	short		srgb_std   : 1;	/* TRUE => sRGB Std is default */
	short		ptm_incl   : 1;	/* TRUE => PTM does include ... */
	short		cont_freq  : 1;	/* TRUE => Continuous frequency */
} sun_edid_feature_t;

void sun_edid_feature_support(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_feature_t *feature);	/* Returned Feature Support info */

/* EDID Color Characteristics */
typedef struct {
	float		red_x;		/* Red-x   */
	float		red_y;		/* Red-y   */
	float		green_x;	/* Green-x */
	float		green_y;	/* Green-y */
	float		blue_x;		/* Blue-x  */
	float		blue_y;		/* Blue-y  */
	float		white_x;	/* White-x */
	float		white_y;	/* White-y */
} sun_edid_colorchrs_t;

void sun_edid_color_chars(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_colorchrs_t *color_char); /* Returned Color Characteristics */

int sun_edid_bit_set(
	const uint8_t	*edid_bytes,	/* First byte of the bit field */
	int		bit_off);	/* Bit offset into the bit field */

int sun_edid_etiming(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		addr,		/* Byte address within EDID block */
	int		bit_off,	/* Established Timings bit offset */
	int		*width,		/* Returned horiz addressable pixels */
	int		*height,	/* Returned vert addressable lines */
	int		*frequency);	/* Returned vertical frequency */

int sun_edid_stiming(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		addr,		/* Byte address within EDID block */
	int		*width,		/* Returned horiz addressable pixels */
	int		*height,	/* Returned vert addressable lines */
	int		*frequency);	/* Returned vertical frequency */

/* Detailed Timing information */
typedef struct {
	long		pixclock;	/* Pixel Clock, kHz   (Bytes #0,1) */
	int		hactive;	/* H Addr'able Video  (Bytes #2,4) */
	int		hblanking;	/* Horiz Blanking     (Bytes #3,4) */
	int		vactive;	/* V Addr'able Video  (Bytes #5,7) */
	int		vblanking;	/* Vert Blanking      (Bytes #6,7) */
	int		hsyncOffset;	/* Horiz Front Porch  (Bytes #8,11) */
	int		hsyncWidth;	/* H Sync Pulse Width (Bytes #9,11) */
	int		vsyncOffset;	/* Vert Front Porch   (Bytes #10,11) */
	int		vsyncWidth;	/* V Sync Pulse Width (Bytes #10,11) */
	int		hsize;		/* H Addr Vid Img, mm (Bytes #12,14) */
	int		vsize;		/* V Addr Vid Img, mm (Bytes #13,14) */
	int		hborder;	/* L/R Horiz Border   (Byte  #15) */
	int		vborder;	/* Top/Bot V Border   (Byte  #16) */
	int		flags;		/* Flag bits & fields (Byte  #17) */
} sun_edid_dtiming_t;

int sun_edid_dtiming(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		addr,		/* Byte address within EDID block */
	sun_edid_dtiming_t *dt);	/* Returned Detailed Timing info */

void sun_edid_descriptor_string(
	const uint8_t	*edid_data,	/* Display Descriptor bytes */
	char		*string_buf);	/* Returned Display Descriptor str */

int sun_edid_serial_number(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*string_buf);	/* Returned Display Product Serial # */

int sun_edid_alphanum_data(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*string_buf);	/* Returned Alphanumeric Data String */


/* Display Range Limits */
typedef struct {
	uint16_t	vert_min;	/* Minimum Vertical Rate */
	uint16_t	vert_max;	/* Maximum Vertical Rate */
	uint16_t	horiz_min;	/* Minimum Horizontal Rate */
	uint16_t	horiz_max;	/* Maximum Horizontal Rate */
	uint16_t	pixclock_max;	/* Maximum Pixel Clock */
	/* Generalized Timing Formula (GTF) Secondary Curve (deprecated) */
	uint16_t	gtf_start_break; /* Start break frequency */
	uint16_t	gtf_C;
	uint16_t	gtf_M;
	uint16_t	gtf_K;
	uint16_t	gtf_J;
	/* CVT Support */
	uint8_t		cvt_version;	/* CVT Standard Version Number */
	uint16_t	cvt_pixclock_max; /* Maximum Pixel Clock */
	uint16_t	cvt_hactive_max; /* Maximum Active Pixels per line */
} sun_edid_range_lim_t;

void sun_edid_range_limits(
	const uint8_t	*edid_data,	/* Display Descriptor bytes */
	sun_edid_range_lim_t *range_limits); /* Display Range Limits */ 

int sun_edid_product_name(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*string_buf);	/* Returned Display Product Name */

/*
 * End of EDID structure parsing functions
 * ---------------------------------------------------------------------
 * Start of EDID video mode name list construction functions
 */

typedef struct {
	char		*name;		/* Video mode name */
	short		width;		/* Horizontal addressable pixels */
	short		height;		/* Vertical addressable lines */
	short		frequency;	/* Vertical frequency */
} sun_edid_mode_t;

sun_edid_mode_t *sun_edid_video_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		edid_length,	/* EDID data length */
	fbc_mode_elem_t	*mode_list);	/* Modes from config file */

void sun_edid_video_modes_free(
	sun_edid_mode_t	*edid_modes);	/* EDID video mode list */


#endif	/* _SUN_EDID_H */


/* End of sun_edid.h */
