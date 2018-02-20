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



/*
  ___________________________________________________________________________
 /\									     \
 \_|									     |
   |  This module contains basic functions for parsing EDID data.	     |
   |  The evolution of this code has been based on documents such as:	     |
   |									     |
   |	    "Extended Display Identification Data Standard Document,"	     |
   |        Version 2, Revision 1, July 24th 1996.  (EDID 1.1)		     |
   |									     |
   |	    "VESA Enhanced Extended Display Identification Data Standard,"   |
   |        Release A, Revision 1, February 9, 2000.  (EDID 1.3)	     |
   |									     |
   |	    "VESA Enhanced Extended Display Identification Data Standard,"   |
   |        Release A, Revision 2, September 25, 2006.  (EDID 1.4)	     |
   |									     |
   |  For clarity, this module endeavors to use the same terminology and     |
   |  hexadecimal and decimal constants (addresses, byte numbers, data	     |
   |  values, etc.) that best reflect the (latest) EDID spec.		     |
   |									     |
   |  This module also contains functions to create and destroy arrays of    |
   |  EDID video mode names that are supported by the display device.	     |
   |									     |
   |   ______________________________________________________________________|_
    \_/_______________________________________________________________________/

*/


#include <sys/types.h>
#include <stdio.h>		/* snprintf() */
#include <stdlib.h>		/* free(), malloc(), memset(), strdup() */
#include <string.h>		/* strcmp() */

#include "gfx_res_util.h"	/* SunVideoTiming */

#include "resolutions.h"	/* Video mode summary table: SunVideoTable[] */
#include "sun_edid.h"		/* EDID data parsing */

#include "fbc_mode_list.h"	/* List of Modes from the config file */


#define	NAME_BUF_LEN	(64)	/* Buffer length for WxHxF mode name strings */


/*
 * sun_edid_get_be_short()
 *
 *    Return the unsigned 16-bit bigendian value decoded from the
 *    indicated EDID bytes.
 */

uint16_t
sun_edid_get_be_short(
	const uint8_t	*edid_bytes)	/* EDID data bytes */
{

	return ((((uint16_t)edid_bytes[0]) << 8) | edid_bytes[1]);

}	/* sun_edid_get_be_short() */


/*
 * sun_edid_get_le_short()
 *
 *    Return the unsigned 16-bit littleendian value decoded from the
 *    indicated EDID bytes.
 */

uint16_t
sun_edid_get_le_short(
	const uint8_t	*edid_bytes)	/* EDID data bytes */
{

	return ((((uint16_t)edid_bytes[1]) << 8) | edid_bytes[0]);

}	/* sun_edid_get_le_short() */


/*
 * sun_edid_get_le_long()
 *
 *    Return the unsigned 32-bit littleendian value decoded from the
 *    indicated EDID bytes.
 */

uint32_t
sun_edid_get_le_long(
	const uint8_t	*edid_bytes)	/* EDID data bytes */
{

	return ((((((((uint32_t)edid_bytes[3]) << 8) | edid_bytes[2]) << 8)
				| edid_bytes[1]) << 8) | edid_bytes[0]);

}	/* sun_edid_get_le_long() */


/*
 * sun_edid_checksum()
 *
 *    Return the 1-byte sum of all 128 bytes in the EDID data block.
 *    For the block to be valid, the sum of its bytes must be zero.
 */

uint8_t
sun_edid_checksum(
	const uint8_t	*edid_data)	/* EDID data block */
{
	int		addr;		/* Byte address within EDID block */
	uint8_t		sum;		/* 1-byte sum of all 128 bytes */

	sum = 0;
	for (addr = 0x00; addr < 0x80; addr += 1) {
	    sum += edid_data[addr];
	}
	return (sum);

}	/* sun_edid_checksum() */


/*
 * sun_edid_check_base()
 *
 *    Return zero if the EDID Base block passes all tests:
 *      * Non-NULL pointer to EDID data
 *      * Length permits at least a complete 128-byte Base block
 *      * 8-byte Header contains the pattern,
 *        [0x00 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0x00]
 *      * 1-byte sum of all 128 bytes is zero
 *
 *    Return -1 otherwise.
 */

int
sun_edid_check_base(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		edid_length)	/* EDID data length */
{

	if ((edid_data != NULL) && (edid_length >= 0x80) &&
	    (edid_data[0x00] == 0x00) &&
	    (edid_data[0x01] == 0xFF) &&
	    (edid_data[0x02] == 0xFF) &&
	    (edid_data[0x03] == 0xFF) &&
	    (edid_data[0x04] == 0xFF) &&
	    (edid_data[0x05] == 0xFF) &&
	    (edid_data[0x06] == 0xFF) &&
	    (edid_data[0x07] == 0x00) &&
	    (sun_edid_checksum(edid_data) == 0)) {
	    return (0);
	}
	return (-1);

}	/* sun_edid_check_base() */


/*
 * sun_edid_check_extensions()
 *
 *    The sun_edid_check_base() function must have been called
 *    successfully.
 *
 *    Return zero if the EDID Extension blocks pass all tests:
 *      * EDID data length is not less than the combined lengths of the
 *        128-byte EDID blocks expected to be present
 *      * 1-byte sum of each 128-byte Extension block is zero
 *      * EDID data length is equal to the combined lengths of the
 *        128-byte EDID blocks expected to be present
 *
 *    Return the non-zero block number of the offending EDID Extension
 *    block otherwise.
 */

int
sun_edid_check_extensions(
	const uint8_t	*edid_data,	/* EDID Base & Extension blocks */
	size_t		edid_length)	/* EDID data length */
{
	int		block_num;	/* EDID block number */
	size_t		block_off;	/* Byte offset of EDID block */

	block_num = 0;			/* EDID Base block number */
	block_off = 0;			/* EDID Base block offset */
	while (block_num < edid_data[0x7E]) {
	    block_num += 1;
	    block_off += 0x80;
	    if ((edid_length < block_off + 0x80) ||
		(sun_edid_checksum(&edid_data[block_off]) != 0)) {
		return (block_num);	/* Insufficient data or bad checksum */
	    }
	}
	if (edid_length != block_off + 0x80) {
	    return (block_num + 1);	/* Data length exceeds blocks found */
	}
	return (0);			/* Success */

}	/* sun_edid_check_extensions() */


/*
 * sun_edid_vendor()
 *
 *    Decode and return the following information from the Vendor &
 *    Product Identification from an EDID Base block:
 *	* Manufacturer ID	(three ASCII chars w/ Nul terminator)
 *	* Product Code		(16 bits)
 *	* Serial Number		(32 bits, Zero = Not used)
 */

void
sun_edid_vendor(
	const uint8_t	*buf,		/* EDID Base block, etc. */
	char		*name,		/* Manufacturer ID  (3 chars & Nul) */
	uint16_t	*product_code,	/* Product code */
	uint32_t	*serial_num)	/* Serial number, else zero */
{

	name[0] = 'A' - 1 +  ((buf[0x08] >> 2)			   & 0x1F);
	name[1] = 'A' - 1 + (((buf[0x08] << 3) | (buf[0x09] >> 5)) & 0x1F);
	name[2] = 'A' - 1 +   (buf[0x09]			   & 0x1F);
	name[3] = '\0';

	*product_code = sun_edid_get_le_short(&buf[0x0A]);
	*serial_num   = sun_edid_get_le_long(&buf[0x0C]);

}	/* sun_edid_vendor() */


/*
 * sun_edid_mdate()
 *
 *    Decode and return the manufacture date information from the Vendor
 *    & Product Identification section of an EDID Base block:
 *	* Week of manufacture
 *	  (0x00 = Not used, 1..54 = Week, 0xFF = Model year flag (EDID 1.4))
 *	* Year of manufacture or model year (EDID 1.4)
 */

void
sun_edid_mdate(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		*week,		/* Week of manufacture, else flags */
	int		*year)		/* Year of manufacture or model year */
{

	*week = edid_data[0x10];
	*year = edid_data[0x11] + 1990;

}	/* sun_edid_mdate() */


/*
 * sun_edid_video_input()
 *
 *    Decode and return these Basic Display Paramaters & Features from
 *    an EDID Base block:
 *      * Video Input Definition
 */

void
sun_edid_video_input(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_viddef_t *video_def)	/* Returned Video Input Definition */
{
	uint8_t		byte;		/* Video Input Definition byte value */

	byte = edid_data[0x14];

	video_def->digital = ((byte & 0x80) != 0);
	if (video_def->digital) {
	    const short	color_bit_depth[8] =
			{ 0, 6, 8, 10, 12, 14, 16, -1 };

	    /*
	     * Input is a Digital Video Signal Interface
	     */
	    video_def->dig.color_depth  = color_bit_depth[(byte >> 4) & 0x07];
	    video_def->dig.vid_standard = byte & 0x0F;
	} else {
	    const struct {
		float	video;
		float	sync;
	    } sig_level_std[4] = {	/* Signal Level Standard */
	    	{ 0.700, 0.300 },
	    	{ 0.714, 0.286 },
	    	{ 1.000, 0.400 },
	    	{ 0.700, 0.000 }
	    };

	    /*
	     * Input is an Analog Video Signal Interface
	     */
	    video_def->alg.video = sig_level_std[byte >> 5 & 0x03].video;
	    video_def->alg.sync  = sig_level_std[byte >> 5 & 0x03].sync;

	    video_def->alg.black2black    = ((byte & 0x10) != 0);

	    video_def->alg.sync_separate  = ((byte & 0x08) != 0);
	    video_def->alg.sync_composite = ((byte & 0x04) != 0);
	    video_def->alg.sync_green     = ((byte & 0x02) != 0);

	    video_def->alg.serration      = ((byte & 0x01) != 0);
	}

}	/* sun_edid_video_input() */


/*
 * sun_edid_screen_size()
 *
 *    Decode and return these Basic Display Paramaters & Features from
 *    an EDID Base block:
 *      * Horizontal screen size in centimeters, or aspect ratio
 *        (Landscape), or zero
 *      * Vertical screen size in cm., or aspect ratio (Portrait), or
 *        zero
 *      * Aspect ratio (Landscape or Portrait), else zero  (EDID 1.4)
 */

void
sun_edid_screen_size(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		*horizontal,	/* Horizontal Screen Size (cm), etc. */
	int		*vertical,	/* Vertical Screen Size (cm), etc. */
	float		*aspect)	/* Aspect ratio, else zero */
{

	/*
	 * Max Horizontal & Vertical Screen Sizes
	 */
	*horizontal = edid_data[0x15];
	*vertical   = edid_data[0x16];

	/*
	 * Decode the aspect ratio, if any (introduced in EDID 1.4)
	 */
	*aspect = 0.0;
	if (EDID_VER_REV(edid_data) >= EDID_1_4) {
	    if ((*horizontal != 0) && (*vertical == 0)) {
		*aspect = (*horizontal + 99) * 0.01;
	    } else
	    if ((*horizontal == 0) && (*vertical != 0)) {
		*aspect = (100.0 / *vertical) - 99.0;
	    }
	}

}	/* sun_edid_screen_size() */


/*
 * sun_edid_gamma()
 *
 *    Decode and return these Basic Display Paramaters & Features from
 *    an EDID Base block:
 *      * Display Transfer Characteristic (Gamma)
 */

void
sun_edid_gamma(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	float		*gamma)		/* Returned gamma value, else zero */
{

	/*
	 * Decode the Display Transfer Characteristic (Gamma)
	 *
	 *    If it is defined (not 0xFF), the actual gamma value is
	 *    computed by adding 100 to the byte and dividing the result
	 *    by 100.  The range is from 1.00 to 3.54.
	 */
	*gamma = 0.0;
	if (edid_data[0x17] != 0xFF) {
	    *gamma = (100 + edid_data[0x17]) * 0.01;
	}

}	/* sun_edid_gamma() */


/*
 * sun_edid_feature_support()
 *
 *    Decode and return these Basic Display Paramaters & Features from
 *    an EDID Base block:
 *      * Feature Support
 */

void
sun_edid_feature_support(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_feature_t *feature)	/* Returned Feature Support info */
{

	feature->standby    = ((edid_data[0x18] & 0x80) != 0);
	feature->suspend    = ((edid_data[0x18] & 0x40) != 0);
	feature->active_off = ((edid_data[0x18] & 0x20) != 0);

	feature->digital    = ((edid_data[0x14] & 0x80) != 0);
	feature->color_info = edid_data[0x18] >> 3 & 0x03;

	feature->srgb_std   = ((edid_data[0x18] & 0x04) != 0);
	feature->ptm_incl   = ((edid_data[0x18] & 0x02) != 0);
	feature->cont_freq  = ((edid_data[0x18] & 0x01) != 0);

}	/* sun_edid_feature_support() */


/*
 * sun_edid_color_chars()
 *
 *    Decode and return Color Characteristics from an EDID Base block:
 *      * Red-x
 *      * Red-y
 *      * Green-x
 *      * Green-y
 *      * Blue-x
 *      * Blue-y
 *      * White-x
 *      * White-y
 */

void
sun_edid_color_chars(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_colorchrs_t *color_chars) /* Returned Color Characteristics */
{

	color_chars->red_x   =
	    ((edid_data[0x1B] << 2) | (edid_data[0x19] >> 6 & 0x03)) / 1024.;
	color_chars->red_y   =
	    ((edid_data[0x1C] << 2) | (edid_data[0x19] >> 4 & 0x03)) / 1024.;
	color_chars->green_x =
	    ((edid_data[0x1D] << 2) | (edid_data[0x19] >> 2 & 0x03)) / 1024.;
	color_chars->green_y =
	    ((edid_data[0x1E] << 2) | (edid_data[0x19]      & 0x03)) / 1024.;
	color_chars->blue_x  =
	    ((edid_data[0x1F] << 2) | (edid_data[0x1A] >> 6 & 0x03)) / 1024.;
	color_chars->blue_y  =
	    ((edid_data[0x20] << 2) | (edid_data[0x1A] >> 4 & 0x03)) / 1024.;
	color_chars->white_x =
	    ((edid_data[0x21] << 2) | (edid_data[0x1A] >> 2 & 0x03)) / 1024.;
	color_chars->white_y =
	    ((edid_data[0x22] << 2) | (edid_data[0x1A]      & 0x03)) / 1024.;

}	/* sun_edid_color_chars() */


/*
 * Established Timings represented by flag bits in Bytes 0x23..0x25
 *
 *    These timing numbers and "Source" column comments can be found in
 *    Table 3.18 of the VESA Enhanced Extended Display Identification
 *    Data Standard, Release A, Revision 2, September 25, 2006.
 */

typedef struct {
	const char *const name;		/* Video mode name */
	int		width;		/* Horizontal addressable pixels */
	int		height;		/* Vertical addressable lines */
	int		frequency;	/* Vertical frequency */
} sun_timing_t;

#define	ETIMING_BITS	((0x25-0x23+1)*8) /* Three bytes worth of flag bits */

static	const sun_timing_t est_timings[ETIMING_BITS] = {
	/*
	 * Established Timings I  (Byte address 0x23)
	 */
	{ "720x400x70",     	     720,  400, 70 },	/* IBM, VGA */
	{ "720x400x88",     	     720,  400, 88 },	/* IBM, XGA2 */
	{ "VESA_STD_640x480x60",     640,  480, 60 },	/* IBM, VGA */
	{ "640x480x67",     	     640,  480, 67 },	/* Apple, Mac II */
	{ "VESA_STD_640x480x72",     640,  480, 72 },	/* VESA */
	{ "VESA_STD_640x480x75",     640,  480, 75 },	/* VESA */
	{ "800x600x56",     	     800,  600, 56 },	/* VESA */
	{ "800x600x60",     	     800,  600, 60 },	/* VESA */
	/*
	 * Established Timings II  (Byte address 0x24)
	 *
	 *    ??? Need proper names for est_timings[11] and [14] ???
	 */
	{ "800x600x72",     	     800,  600, 72 },	/* VESA */
	{ "VESA_STD_800x600x75",     800,  600, 75 },	/* VESA */
	{ "832x624x75",    	     832,  624, 75 },	/* Apple, Mac II */
	{ "1024x768x87",      	    1024,  768, 87 },	/* IBM - Interlaced */
	{ "VESA_STD_1024x768x60",   1024,  768, 60 },	/* VESA */
	{ "VESA_STD_1024x768x70",   1024,  768, 70 },	/* VESA */
	{ "VESA_STD_1024x768x75",   1024,  768, 75 },	/* VESA */
	{ "VESA_STD_1280x1024x75",  1280, 1024, 75 },	/* VESA */
	/*
	 * Manufacturer's Timings  (Byte address 0x25)
	 */
	{ "1152x870x75",	    1152,  870, 75 },	/* Apple, Mac II */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 }	/* Reserved */
};


/*
 * Established Timings III represented by a Display Descriptor w/ Tag 0xF7
 */

#define	ETIMING_III_BITS ((11-6+1)*8)	/* Bytes #6..11 have defined flags */

static	const sun_timing_t est_timings_iii[ETIMING_III_BITS] = {
	{	"640x350x85",        640,  350, 85 },
	{	"640x400x85",        640,  400, 85 },
	{	"720x400x85",        720,  400, 85 },
	{	"640x480x85",        640,  480, 85 },
	{	"848x480x60",        848,  480, 60 },
	{	"800x600x85",        800,  600, 85 },
	{	"1024x768x85",      1024,  768, 85 },
	{	"1152x864x75",      1152,  864, 75 },

	{	"1280x768x60",      1280,  768, 60 },	/* Reduced Blanking */
	{	"1280x768x60",      1280,  768, 60 },
	{	"1280x768x75",      1280,  768, 75 },
	{	"1280x768x85",      1280,  768, 85 },
	{	"1280x960x60",      1280,  960, 60 },
	{	"1280x960x85",      1280,  960, 85 },
	{	"1280x1024x60",     1280, 1024, 60 },
	{	"1280x1024x85",     1280, 1024, 85 },

	{	"1360x768x60",      1360,  768, 60 },
	{	"1440x900x60",      1440,  900, 60 },	/* Reduced Blanking */
	{ "VESA_STD_1440x900x60",   1440,  900, 60 },
	{	"1440x900x75",      1440,  900, 75 },
	{	"1440x900x85",      1440,  900, 85 },
	{	"1400x1050x60",     1400, 1050, 60 },	/* Reduced Blanking */
	{	"1400x1050x60",     1400, 1050, 60 },
	{	"1400x1050x75",     1400, 1050, 75 },

	{	"1400x1050x85",     1400, 1050, 85 },
	{ "VESA_RB_1680x1050x60",   1680, 1050, 60 },	/* Reduced Blanking */
	{ "VESA_STD_1680x1050x60",  1680, 1050, 60 },
	{	"1680x1050x75",     1680, 1050, 75 },
	{	"1680x1050x85",     1680, 1050, 85 },
	{	"1600x1200x60",     1600, 1200, 60 },
	{	"1600x1200x65",     1600, 1200, 65 },
	{	"1600x1200x70",     1600, 1200, 70 },

	{	"1600x1200x75",     1600, 1200, 75 },
	{	"1600x1200x85",     1600, 1200, 85 },
	{	"1792x1344x60",     1792, 1344, 60 },
	{	"1792x1344x75",     1792, 1344, 75 },
	{	"1856x1392x60",     1856, 1392, 60 },
	{	"1856x1392x75",     1856, 1392, 75 },
	{	"1920x1200x60",     1920, 1200, 60 },	/* Reduced Blanking */
	{	"1920x1200x60",     1920, 1200, 60 },

	{	"1920x1200x75",     1920, 1200, 75 },
	{	"1920x1200x85",     1920, 1200, 85 },
	{	"1920x1440x60",     1920, 1440, 60 },
	{	"1920x1440x75",     1920, 1440, 75 },
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 },	/* Reserved */
	{ NULL,			       0,    0,  0 }	/* Reserved */
};


/*
 * sun_edid_bit_set()
 *
 *    Return non-zero (TRUE) iff the bit is set at the specified offset
 *    within the bit field (e.g. Established Timings).
 */

int
sun_edid_bit_set(
	const uint8_t	*edid_bytes,	/* First byte of the bit field */
	int		bit_off)	/* Bit offset into the bit field */
{

	/*
	 * Test the indicated bit within the bit field
	 */
	return (edid_bytes[bit_off / 8] & (0x80 >> bit_off % 8));

}	/* sun_edid_bit_set() */


/*
 * sun_edid_etiming()
 *
 *    Given an EDID Base block and a bit offset (0..23) into the
 *    Established Timings flag bits, validate the offset and return the
 *    corresponding width, height, and vertical frequency.  Return -1 if
 *    the bit offset is out of range.  Return zero if the timing isn't
 *    supported.  Return 1 if the timing is supported.
 */

int
sun_edid_etiming(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		addr,		/* Byte address within EDID block */
	int		bit_off,	/* Established Timings bit offset */
	int		*width,		/* Returned width */
	int		*height,	/* Returned height */
	int		*frequency)	/* Returned vertical frequency */
{

	/*
	 * Validate the bit offset
	 */
	if ((bit_off < 0) || (bit_off >= 3*8)) {
	    return (-1);
	}

	/*
	 * Return the Established Timing information (supported or not)
	 */
	*width     = est_timings[bit_off].width;
	*height    = est_timings[bit_off].height;
	*frequency = est_timings[bit_off].frequency;

	/*
	 * See whether the bit offset corresponds to a supported timing
	 */
	if (!sun_edid_bit_set(&edid_data[addr], bit_off) ||
	    (est_timings[bit_off].width == 0)) {
	    return (0);			/* Timing is not supported */
	}
	return (1);			/* Timing is supported */

}	/* sun_edid_etiming() */


/*
 * decode_stiming()
 *
 *    Decode a Standard Timings byte pair and return the width, height,
 *    and vertical frequency.  Return 0 upon success and -1 on failure.
 */

static
int
decode_stiming(
	int		edid_ver_rev,	/* EDID version and revision */
	const uint8_t	*edid_bytes,	/* Standard Timings byte pair */
	int		*x,		/* Returned horiz addressable pixels */
	int		*y,		/* Returned vert addressable lines */
	int		*f)		/* Returned vertical frequency */
{

	/*
	 * Check for reserved encodings and unused slots
	 */
	if (edid_bytes[0] == 0x00) {
	    return (-1);		/* Zero in the 1st byte is reserved */
	}
	if ((edid_bytes[0] == 0x01) && (edid_bytes[1] == 0x01)) {
	    return (-1);		/* Unused */
	}

	/*
	 * Horizontal addressable pixels  (1st byte)
	 */
	*x = (edid_bytes[0] + 31) * 8;

	/*
	 * Image Aspect Ratio  (bits 7..6 of 2nd byte)
	 */
	switch (edid_bytes[1] >> 6) {
	case 0:	if (edid_ver_rev <= EDID_1_2) {
		    *y = *x;		/* 1:1 AR */
		} else {
		    *y = *x * 10 / 16;	/* 16:10 AR */
		}
		break;
	case 1:	*y = *x * 3 / 4;	/* 4:3 AR */
		break;
	case 2:	*y = *x * 4 / 5;	/* 5:4 AR */
		break;
	case 3:	*y = *x * 9 / 16;	/* 16:9 AR */
		break;
	}

	/*
	 * Field Refresh Rate  (bits 5..0 of 2nd byte)
	 */
	*f = (edid_bytes[1] & 0x3F) + 60;

	/*
	 * Return zero upon success
	 */
	return (0);

}	/* decode_stiming() */


/*
 * sun_edid_stiming()
 *
 *    Decode the Standard Timings byte pair at the byte specified byte
 *    address.  Return the width, height, and vertical frequency.
 *    Return zero upon success and -1 upon failure (invalid Standard
 *    Timings data).
 */

int
sun_edid_stiming(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		addr,		/* Byte address within EDID block */
	int		*width,		/* Returned horiz addressable pixels */
	int		*height,	/* Returned vert addressable lines */
	int		*frequency)	/* Returned vertical frequency */
{

	/*
	 * Decode the Standard Timings byte pair and return the results
	 */
	return (decode_stiming(EDID_VER_REV(edid_data),
				&edid_data[addr], width, height, frequency));

}	/* sun_edid_stiming() */


/*
 * decode_dtiming()
 *
 *    Decode the Detailed Timing Descriptor and return the results in
 *    the Detailed Timing information structure.  Return zero upon
 *    success and -1 upon failure.
 */

static
int
decode_dtiming(
	const uint8_t	*data_block,	/* EDID 18-Byte Data Block */
	sun_edid_dtiming_t *dt)		/* Returned Detailed Timing info */
{

	/*
	 * See whether this 18-Byte Data Block is a Detailed Timing Descriptor
	 */
	if ((data_block[0] == 0) && (data_block[1] == 0)) {
	    return (-1);		/* This is a Display Descriptor */
	}

	/*
	 * Decode this Detailed Timing Descriptor
	 */
	dt->pixclock	= sun_edid_get_le_short(&data_block[0])*10000;
	dt->hactive	= data_block[ 2] | (data_block[ 4] << 4 & 0xF00);
	dt->hblanking	= data_block[ 3] | (data_block[ 4] << 8 & 0xF00);
	dt->vactive	= data_block[ 5] | (data_block[ 7] << 4 & 0xF00);
	dt->vblanking	= data_block[ 6] | (data_block[ 7] << 8 & 0xF00);
	dt->hsyncOffset	= data_block[ 8] | (data_block[11] << 2 & 0x300);
	dt->hsyncWidth	= data_block[ 9] | (data_block[11] << 4 & 0x300);
	dt->vsyncOffset	=
			(data_block[10] >> 4)   | (data_block[11] << 2 & 0x30);
	dt->vsyncWidth	=
			(data_block[10] & 0x0F) | (data_block[11] << 4 & 0x30);
	dt->hsize	= data_block[12] | (data_block[14] << 4 & 0xF00);
	dt->vsize	= data_block[13] | (data_block[14] << 8 & 0xF00);
	dt->hborder	= data_block[15];
	dt->vborder	= data_block[16];
	dt->flags	= data_block[17];

	return (0);

}	/* decode_dtiming() */


/*
 * get_dtiming_frequency()
 *
 *    Calculate and return the vertical frequency for this Detailed
 *    Timing.
 */

static
int
get_dtiming_frequency(
	const sun_edid_dtiming_t *dt)	/* Detailed Timing info */
{
	long		htotal;		/* Total horizontal pixels */
	long		vtotal;		/* Total vertical lines */
//???	long		total;		/* Total pixels */

	htotal = dt->hborder + dt->hactive + dt->hborder + dt->hblanking;
	vtotal = dt->vborder + dt->vactive + dt->vborder + dt->vblanking;
	if ((htotal <= 0) || (vtotal <= 0)) {
	    return (0);		/* Don't divide by zero or use negatives */
	}
//??? Round upwards?
//???	total = htotal * vtotal;
//???	return ((int)((dt->pixclock + total/2) / total));
//??? Or truncate?
	return ((int)(dt->pixclock / (htotal * vtotal)));

}	/* get_dtiming_frequency() */


/*
 * dtiming_to_vtiming()
 *
 *    Convert Detailed Timing information to SunVideoTiming information.
 */

static
void
dtiming_to_vtiming(
	const sun_edid_dtiming_t *dt,	/* Detailed Timing information */
	SunVideoTiming	*block)		/* Returned SunVideoTiming info */
{

	/*
	 * Fill in some of the video timing info block
	 */
	block->Hact = dt->hactive;
	block->Hfp  = dt->hsyncOffset;
	block->Hsw  = dt->hsyncWidth;
	block->Hbp  = dt->hblanking - dt->hsyncOffset - dt->hsyncWidth;
	block->Hsrp = 0;			/* TODO: serration */
	block->Vact = dt->vactive;
	block->Vfp  = dt->vsyncOffset;
	block->Vsw  = dt->vsyncWidth;
	block->Vbp  = dt->vblanking - dt->vsyncOffset - dt->vsyncWidth;
	block->Pclk = dt->pixclock / 1000;
	block->Fint = (dt->flags & 0x80) != 0; /* Interlaced flag */
	block->Fseq = 0;			/* TODO: field sequential */

	/* Stereo flags.  TODO: SunVideoTiming block needs more flags */
	switch (dt->flags & 0x61) {
	case 0x00:
	case 0x01:	block->Fst = 0;	/* Normal Display, No Stereo */
			break;
	case 0x20:
	case 0x21:
	case 0x40:
	case 0x41:
	case 0x60:
	case 0x61:	block->Fst = 1;	/* Stereo */
			break;
	}

	/* Sync type flags.  TODO: a flag for sync on RGB */
	/* TODO: do serration right */
	switch (dt->flags & 0x18) {
	case 0x00:	/* Analog Composite Sync */
	case 0x08:	/* Bipolar Analog Composite Sync */
			block->Hsrp  = (dt->flags & 0x04) != 0;
			block->Stype = 0;		/* combined sync */
			block->SHpol = 0;		/* TODO */
			block->SVpol = 0;		/* TODO */
			break;
	case 0x10:	/* Digital Composite Sync */
			block->Hsrp  = (dt->flags & 0x04) != 0;
			block->Stype = 0;		/* combined sync */
			block->SHpol = (dt->flags & 0x02) ? 1 : 0;
			block->SVpol = 0;		/* always negative? */
			break;
	case 0x18:	/* Digital Separate Sync */
			block->Stype = 1;		/* Separate */
			block->SHpol = (dt->flags & 0x02) ? 1 : 0;
			block->SVpol = (dt->flags & 0x04) ? 1 : 0;
			break;
	}

	block->Encod = SunVideoEncodingNone;		/* TODO */
	block->Hund  = 0.;				/* TODO */
	block->Vund  = 0.;				/* TODO */

}	/* dtiming_to_vtiming() */


/*
 * sun_edid_dtiming()
 *
 *    Decode the Detailed Timing Descriptor that is assumed to be in the
 *    18-Byte Data Block that corresponds to the specified index (0..3).
 *    Return the width, height, and vertical frequency.  If a timing
 *    info block has been provided by the caller, fill it in also.  This
 *    includes a dynamically allocated name string (id_string).  Return
 *    zero upon success and -1 upon failure.
 */

int
sun_edid_dtiming(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	int		addr,		/* Byte address within EDID block */
	sun_edid_dtiming_t *dt)		/* Returned Detailed Timing info */
{

	/*
	 * Decode the Detailed Timing Descriptor (if that's what it is)
	 *
	 *    An 18-Byte Data Block is encoded in 18 (decimal) bytes.
	 *    The 1st descriptor starts at EDID block address 0x36.
	 *    The 4th descriptor ends at EDID block address 0x7E.
	 */
	return (decode_dtiming(&edid_data[addr], dt));

}	/* sun_edid_dtiming() */


/*
 * find_display_descriptor()
 *
 *    Return the address of the first Display Descriptor that contains
 *    the specified tag, or -1 if the descriptor isn't found.
 *
 *    Subsequent descriptors having the same tag won't be found.
 *
 *    Display Descriptor tag numbers are (as of EDID 1.4):
 *      0xFF  Display Product Serial Number
 *      0xFE  Alphanumeric Data String (ASCII)
 *      0xFD  Display Range Limits
 *      0xFC  Display Product Name
 *      0xFB  Color Point Data
 *      0xFA  Standard Timing Identifications
 *      0xF9  Display Color Management (DCM) Data
 *      0xF8  CVT 3 Byte Timing Codes
 *      0xF7  Established Timings III
 *      0x11..0xF6  Reserved
 *      0x10  Dummy Descriptor
 *      0x00..0x0F  Manufacturer Specified Display Descriptors
 */

int
find_display_descriptor(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	uint8_t		tag)		/* Display Descriptor tag number */
{
	int		addr;		/* Address of Display Descriptor */

	/*
	 * Prior to EDID 1.1, Display Descriptors were not applicable
	 */
	if (EDID_VER_REV(edid_data) < EDID_1_1) {
	    return (-1);
	}

	/*
	 * Examine each of the 18-Byte Data Blocks for the Display Descriptor
	 *
	 *    An 18-Byte Data Block is encoded in 18 (decimal) bytes.
	 *    The 1st descriptor starts at EDID block address 0x36.
	 *    The 4th descriptor ends at EDID block address 0x7E.
	 *
	 *    The Byte #2 of a Display Descriptor is always reserved.
	 *    Byte #4 is reserved except for Display Range Limits
	 *    descriptors.
	 */
	for (addr = 0x36; addr < 0x7E; addr += 18) {
	    if ((edid_data[addr+0] == 0) &&	/* Display Descriptor */
		(edid_data[addr+1] == 0) &&	/* Display Descriptor */
		(edid_data[addr+2] == 0) &&	/* Reserved */
		(edid_data[addr+3] == tag)) {	/* Display Descriptor tag */
		return (addr);
	    }
	}

	return (-1);

}	/* find_display_descriptor() */


/*
 * sun_edid_descriptor_string()
 *
 *    Return a string that has been encoded in a Display Descriptor of
 *    an EDID data block.
 *
 *    The name string can be up to 13 (18-5) ASCII characters long and
 *    will be terminated by a Nul character, requiring the caller to
 *    provide a 14-character buffer.
 */

void
sun_edid_descriptor_string(
	const uint8_t	*edid_data,	/* Display Descriptor bytes */
	char		*string_buf)	/* Returned Display Descriptor str */
{
	int		i;		/* Offset into Display Descriptor */

	/*
	 * Extract the string from the Display Descriptor
	 *
	 *    The string can be up to 13 (18-5) ASCII characters long.
	 *    A name that is shorter will have been terminated by a Line
	 *    Feed (0x0A) followed by zero or more Spaces (0x20).
	 */
	for (i = 5; (i < 18) && (edid_data[i] != 0x0A); i += 1) {
	    *string_buf = edid_data[i];
	    string_buf += 1;
	}
	*string_buf = '\0';

}	/* sun_edid_descriptor_string() */


/*
 * display_descriptor_string()
 *
 *    Search the EDID Base block for the first Display Descriptor
 *    having the specified tag.  If found, return the Nul-terminated
 *    string that has been encoded in the Display Descriptor along with
 *    a zero return code.  Otherwise return an empty string and a return
 *    code of -1.
 *
 *    The name string can be up to 13 (18-5) ASCII characters long and
 *    will be terminated by a Nul character, requiring the caller to
 *    provide a 14-character buffer.
 */

static
int
display_descriptor_string(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	uint8_t		tag,		/* Display Descriptor tag number */
	char		*string_buf)	/* Returned Display Descriptor str */
{
	int		addr;		/* Address of Display Descriptor */

	*string_buf = '\0';		/* In case nothing is found */

	/*
	 * Examine each of the 18-Byte Data Blocks for a matching tag
	 */
	addr = find_display_descriptor(edid_data, tag);
	if (addr <= 0) {
	    return (-1);
	}

	/*
	 * Extract the string from the Display Descriptor
	 */
	sun_edid_descriptor_string(&edid_data[addr], string_buf);
	return (0);

}	/* display_descriptor_string() */


/*
 * sun_edid_serial_number()
 *
 *    Return a Nul-terminated Display Product Serial Number string in a
 *    caller-supplied 14-character buffer and a zero iff successful.
 *    Return an empty string and -1 otherwise.
 */

int
sun_edid_serial_number(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*string_buf)	/* Returned Display Product Serial # */
{

	return (display_descriptor_string(edid_data, 0xFF, string_buf));

}	/* sun_edid_serial_number() */


/*
 * sun_edid_alphanum_data()
 *
 *    Return a Nul-terminated Alphanumeric Data String in a caller-
 *    supplied 14-character buffer and a zero iff successful.  Return an
 *    empty string and -1 otherwise.
 */

int
sun_edid_alphanum_data(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*string_buf)	/* Returned Alphanumeric Data String */
{

	return (display_descriptor_string(edid_data, 0xFE, string_buf));

}	/* sun_edid_alphanum_data() */


/*
 * sun_edid_range_limits()
 *
 *    Return Display Range Limits (frequency) from a Display Descriptor
 *    in an EDID Base block, including:
 *      * Vertical frequencies in Hz
 *      * Horizontal frequencies in kHz
 *      * Pixel Clock frequency in MHz.
 *
 *    Only valid in EDID 1.1 or higher.
 */

void
sun_edid_range_limits(
	const uint8_t	*edid_data,	/* Display Descriptor bytes */
	sun_edid_range_lim_t *range_limits) /* Display Range Limits */ 
{

	memset(range_limits, 0, sizeof (sun_edid_range_lim_t));

	range_limits->vert_min  =
		edid_data[5] + (((edid_data[4] & 0x03) == 0x03) ? 255 : 0);
	range_limits->vert_max  =
		edid_data[6] + ( (edid_data[4] & 0x02)          ? 255 : 0);

	range_limits->horiz_min =
		edid_data[7] + (((edid_data[4] & 0x0C) == 0x0C) ? 255 : 0);
	range_limits->horiz_max =
		edid_data[8] + ( (edid_data[4] & 0x08)          ? 255 : 0);

	range_limits->pixclock_max     = edid_data[9] * 10;
	range_limits->cvt_pixclock_max = range_limits->pixclock_max << 2;

	switch (edid_data[10]) {

	case 0x02: /* General Timing Formula (GTF) Secondary Curve supported */
		range_limits->gtf_start_break = edid_data[12];
		range_limits->gtf_C = edid_data[13] >> 1;
		range_limits->gtf_M = sun_edid_get_le_short(&edid_data[14]);
		range_limits->gtf_K = edid_data[16];
		range_limits->gtf_J = edid_data[17] >> 1;
		break;

	case 0x04: /* CVT supported */
		range_limits->cvt_version = edid_data[11];
		range_limits->cvt_pixclock_max -= edid_data[12] >> 2;
		if (edid_data[13] != 0) {
			range_limits->cvt_hactive_max =
				(((edid_data[12] & 0x03) << 8) | edid_data[13])
					* 8;
		}
		/* ??? TODO ??? */
		break;

	}

}	/* sun_edid_range_limits() */


/*
 * sun_edid_product_name()
 *
 *    Return a Nul-terminated Display Product Name in a caller-supplied
 *    14-character buffer and a zero iff successful.  Return an empty
 *    string and -1 otherwise.
 */

int
sun_edid_product_name(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	char		*string_buf)	/* Returned Display Product Name */
{

	return (display_descriptor_string(edid_data, 0xFC, string_buf));

}	/* sun_edid_product_name() */


/*
 * End of EDID structure parsing functions
 * ---------------------------------------------------------------------
 * Start of EDID video mode name list construction functions
 */


#include "fbc_res.h"		/* Video modes/resolutions (-res option) */


/*
 * add_video_mode()
 *
 *    Insert a new video mode name at the end of a mode names array,
 *    assuming the name pointer isn't NULL and the name isn't already in
 *    the list.
 *
 *    A NULL name pointer can result when a reserved Established or
 *    Standard Timing is encountered.
 */

static
void
add_video_mode(
	sun_edid_mode_t	*edid_modes,	/* Growing list of modes */
	sun_edid_mode_t	**edid_modes_end, /* Ptr to end of modes list */
	const char	*mode_name,	/* Potential new mode name, or NULL */
	short		width,		/* Horizontal addressable pixels */
	short		height,		/* Vertical addressable lines */
	short		frequency)	/* Vertical frequency */
{
	sun_edid_mode_t	*mode_ptr;	/* Ptr to video mode within list */

	/*
	 * Ignore this video mode if the caller didn't provide the name
	 */
	if (mode_name == NULL) {
	    return;
	}

	/*
	 * Ignore the video mode if it's already in the list
	 */
	for (mode_ptr = edid_modes; mode_ptr->name != NULL; mode_ptr += 1) {
	    if ((strcmp(mode_name, mode_ptr->name) == 0) &&
		(width     == mode_ptr->width) &&
		(height    == mode_ptr->height) &&
		(frequency == mode_ptr->frequency)) {
		return;
	    }
	}

	/*
	 * Append the new video mode to the list
	 *
	 *    Note that a distant caller function has allocated the
	 *    edid_modes array of sufficient size to eliminate the
	 *    possibility of overrunning it.
	 */
	(*edid_modes_end)->name = strdup(mode_name);
	if ((*edid_modes_end)->name == NULL) {
	    return;			/* Never mind */
	}
	(*edid_modes_end)->width     = width;
	(*edid_modes_end)->height    = height;
	(*edid_modes_end)->frequency = frequency;
	*edid_modes_end += 1;

	/*
	 * Mark the new end of the list
	 */
	(*edid_modes_end)->name = NULL;

}	/* add_video_mode() */


/*
 * add_etiming_modes()
 *
 *    Test each of the Established Timings flag bits in the EDID data
 *    bytes 0x23..0x25.  Do the same with the Established Timings III
 *    flag bits, if present in a Display Descriptor.  If a bit is set
 *    and the name pointer isn't NULL (indicating a reserved bit) then
 *    the timing is supported by the display device.  If the timing is
 *    supported then add the mode name to the array of names.  Return
 *    the updated list.
 */

static
void
add_etiming_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	sun_edid_mode_t	*edid_modes,	/* Growing list of modes */
	sun_edid_mode_t	**edid_modes_end) /* Ptr to end of modes list */
{
	int		addr;		/* Address of Display Descriptor */
	int		bit_off;	/* Established Timings bit offset */

	/*
	 * Test each bit of the three Established Timings bytes
	 */
	for (bit_off = 0; bit_off < ETIMING_BITS; bit_off += 1) {
	    if (sun_edid_bit_set(&edid_data[0x23], bit_off)) {
		/*
		 * Add this timing mode to the list
		 *
		 *    If the Established Timings bit is reserved, the
		 *    mode name pointer is NULL, preventing the mode
		 *    from being added to the list.
		 */
		add_video_mode(edid_modes, edid_modes_end,
				est_timings[bit_off].name,
				est_timings[bit_off].width,
				est_timings[bit_off].height,
				est_timings[bit_off].frequency);
	    }
	}

	/*
	 * Ditto for Established Timings III bytes, if present
	 */
	addr = find_display_descriptor(edid_data, 0xF7);
	if (addr > 0) {
	    for (bit_off = 0; bit_off < ETIMING_III_BITS; bit_off += 1) {
		if (sun_edid_bit_set(&edid_data[addr+6], bit_off)) {
		    add_video_mode(edid_modes, edid_modes_end,
				    est_timings_iii[bit_off].name,
				    est_timings_iii[bit_off].width,
				    est_timings_iii[bit_off].height,
				    est_timings_iii[bit_off].frequency);
		}
	    }
	}

}	/* add_etiming_modes() */

#if defined(ACTIVATE_DEAD_CODE)	/* Not used by fbconfig */

/*
 * sun_edid_etiming_modes()
 *
 *    Return a NULL-terminated array of Established Timing / video
 *    resolution name strings that the display device supports,
 *    according to the timing data found in this EDID data block.
 *
 *    The dynamically allocated memory for the array and name strings
 *    can be freed by calling the sun_edid_mode_names_free() function.
 */

char **
sun_edid_etiming_modes(uint8_t *edid_data, int len)
{
	sun_edid_mode_t	*edid_modes;	/* Returned list of mode names */
	sun_edid_mode_t	**edid_modes_end; /* Ptr to end of mode names list */

	/*
	 * Allocate and populate an array of ptrs to Established Timing names
	 *
	 *    There may be:
	 *     24  Established Timings mode names      (ETIMING_BITS     = 24)
	 *     48  Established Timings III mode names  (ETIMING_III_BITS = 48)
	 *      1  NULL terminator for the array
	 *
	 */
	edid_modes = malloc((ETIMING_BITS + ETIMING_III_BITS + 1)
					* sizeof (*edid_modes));
	if (edid_modes != NULL) {
	    edid_modes_end       = edid_modes;
	    edid_modes_end->name = NULL;

	    add_etiming_modes(edid_data, edid_modes, &edid_modes_end);

	    if (edid_modes_end <= edid_modes) {
		free(edid_modes);
		edid_modes = NULL;	/* The list is empty */
	    }
	}

	return (edid_modes);

}	/* sun_edid_etiming_modes() */

#endif	/* Not used by fbconfig */

/*
 *    A few "standard" timings actually come from us.  If we
 *    recognize one of them, we return a different name.
 *    This list may grow over time.
 *
 *    Note that with EDID 1.2 and before, the Standard Timings byte
 *    pair, 0xD1,0x00, will decode differently than shown here.
 */
static	const sun_timing_t std_timings[] = {
	{ "SUNW_STD_1280x1024x76",	1280, 1024,  76 },	/* 0x81 0x90 */
	{ "SUNW_STD_1152x900x76",	1152,  921,  76 },	/* 0x71 0x90 */
		      /* ^^^ */		    /* ^^^ */
	{ "VESA_STD_1280x1024x75",	1280, 1024,  75 },	/* 0x81 0x8F */
	{ "SUNW_STD_1280x1024x67",	1280, 1024,  67 },	/* 0x81 0x87 */
	{ "SUNW_STD_1152x900x66",	1152,  921,  66 },	/* 0x71 0x86 */
		      /* ^^^ */		    /* ^^^ */
	{ "VESA_STD_1024x768x75",	1024,  768,  75 },	/* 0x61 0x4F */
	{ "SUNW_STD_1600x1200x75",	1600, 1200,  75 },	/* 0xA9 0x4F */
	{ "SUNW_STEREO_1280x1024x112",	1280, 1024, 112 },	/* 0x81 0xB4 */
	{ "VESA_STD_1280x1024x60",	1280, 1024,  60 },	/* 0x81 0x80 */
	{ "SUNW_DIG_1920x1200x60",	1920, 1200,  60 },	/* 0xD1 0x00 */
	{ "SUNW_DIG_1920x1080x60",	1920, 1080,  60 },	/* 0xD1 0xC0 */
	{ "SUNW_DIG_1600x1200x60",	1600, 1200,  60 },	/* 0xA9 0x40 */
	{ NULL,				   0,    0,   0 }
};


/*
 * get_stiming_name()
 *
 *    Given a Standard Timing width, height, and frequency, return the
 *    corresponding video mode / resolution name.  The name might be
 *    found in a built-in table or in configuration file video modes
 *    data structures, or it might be constructed on the fly.
 *
 *    If a name must be constructed, the caller-supplied name_buf buffer
 *    will be used.  The buffer must be at least NAME_BUF_LEN bytes
 *    long.
 */

static
const char *
get_stiming_name(
	int		width,		/* Horizontal addressable pixels */
	int		height,		/* Vertical addressable lines */
	int		frequency,	/* Vertical frequency */
	fbc_mode_elem_t	*mode_list,	/* Modes from config file */
	char		*name_buf)	/* Buffer for returned WxHxF name */
{
	int		i;		/* Loop ctr / std_timings[] index */
	fbc_mode_elem_t	*mode_elem;	/* Modes list element (unintrusive) */
	const SunVideoSummary *ptr;	/* Ptr into SunVideoTable[] table */

	/*
	 * Look for the video mode name in the built-in std_timings[] table
	 */
	for (i = 0; std_timings[i].width != 0; i += 1) {
	    if ((width     == std_timings[i].width) &&
		(height    == std_timings[i].height) &&
		(frequency == std_timings[i].frequency)) {
		return (std_timings[i].name);
	    }
	}

	/*
	 * Look for the video mode name in the built-in SunVideoTable[] table
	 */
	for (ptr = &SunVideoTable[0]; ptr->id_string != NULL; ptr += 1) {
	    if ((width     == ptr->width) &&
		(height    == ptr->height) &&
		(frequency == ptr->vfreq)) {
		return (ptr->id_string);
	    }
	}

	/*
	 * Look for the mode name in the active Mode entries of the config file
	 */
	for (mode_elem = mode_list;
	    mode_elem != NULL;
	    mode_elem = mode_elem->list.next) {
	    XF86ConfModeLinePtr mode_ptr; /* ModeLine / Mode-EndMode entry */
	    int		ml_vfreq;	/* Computed vertical frequency */

	    /*
	     * Get the config file ModeLine / Mode-EndMode entry
	     */
	    mode_ptr = mode_elem->mode_ptr;

	    /*
	     * Compute the vertical frequency for the ModeLine entry
	     */
	    ml_vfreq = mode_ptr->ml_htotal * mode_ptr->ml_vtotal;
	    if (ml_vfreq <= 0) {
		continue;	/* Don't divide by zero or use negatives */
	    }
	    ml_vfreq = mode_ptr->ml_clock * 1000 / ml_vfreq;

	    /*
	     * If the parameters match, return the video mode name
	     */
	    if ((width     == mode_ptr->ml_hdisplay) &&
		(height    == mode_ptr->ml_vdisplay) &&
		(frequency ==           ml_vfreq)) {
		return (mode_ptr->ml_identifier);
	    }
	}

	/*
	 * Construct and return a WxHxF mode name in the caller-supplied buffer
	 */
	snprintf(name_buf, NAME_BUF_LEN, "%dx%dx%d", width, height, frequency);
	return (name_buf);

}	/* get_stiming_name() */


/*
 * add_stiming_modes()
 *
 *    Given an EDID data block, decode each of the Standard Timings and
 *    determine a name for it, and populate a dynamically allocated
 *    array of pointers to these Standard Timings names.
 */

static
void
add_stiming_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	fbc_mode_elem_t	*mode_list,	/* Modes from config file */
	sun_edid_mode_t	*edid_modes,	/* Growing list of modes */
	sun_edid_mode_t	**edid_modes_end) /* Ptr to end of modes list */
{
	int		addr;		/* Byte address within EDID block */
	int		edid_ver_rev;	/* EDID version and revision */
	int		frequency;	/* Vertical frequency */
	int		height;		/* Vertical addressable lines */
	char		mode_name_buf[NAME_BUF_LEN];
	int		width;		/* Horizontal addressable pixels */

	edid_ver_rev = EDID_VER_REV(edid_data);

	/*
	 * Decode each of the eight Std Timings and add the names to the list
	 */
	for (addr = 0x26; addr < 0x36; addr += 2) {
	    if (decode_stiming(edid_ver_rev, &edid_data[addr],
				&width, &height, &frequency) == 0) {
		add_video_mode(edid_modes, edid_modes_end,
				get_stiming_name(width,
						height,
						frequency,
						mode_list,
						mode_name_buf),
				width, height, frequency);
	    }
	}

	/*
	 * Decode any Standard Timings contained in 18-Byte Data Blocks
	 *
	 *    The display device may have additional Standard Timings
	 *    in the 18-Byte Data Blocks (formerly known as Detailed
	 *    Timing blocks).
	 *
	 *    The VESA EDID 1.4 spec requires the first 18-Byte Data
	 *    Block to contain the Preferred Timing Mode.  EDID 1.1 and
	 *    1.2 allowed this block to be used for a Display (Monitor)
	 *    Descriptor, however, so it's best to simply scan all of
	 *    the blocks.
	 *
	 *    Not applicable prior to EDID 1.1
	 */
	if (edid_ver_rev >= EDID_1_1) {
	    /*
	     * Examine each of the four 18-Byte Data Blocks
	     *
	     *    An 18-Byte Data Block is encoded in 18 (decimal) bytes.
	     *    The 1st descriptor starts at EDID block address 0x36.
	     *    The 4th descriptor ends at EDID block address 0x7E.
	     */
	    for (addr = 0x36; addr < 0x7E; addr += 18) {
		/*
		 * See if this 18-Byte Data Block contains Standard Timings
		 */
		if ((edid_data[addr+0] == 0) &&	/* Display Descriptor */
		    (edid_data[addr+1] == 0) &&	/* Display Descriptor */
		    (edid_data[addr+2] == 0) &&	/* Reserved */
		    (edid_data[addr+3] == 0xFA) && /* Std Timing Ident tag */
		    (edid_data[addr+4] == 0)) {	/* Reserved */
		    int i;

		    /*
		     * Decode the six Std Timings and add the names to the list
		     *
		     *    Standard Timings are encoded in 2 bytes.
		     *    The 1st pair of bytes starts at offset 5.
		     *    The 6th pair of bytes ends at offset 17 (decimal).
		     */
		    for (i = 5; i < 17; i += 2) {
			if (decode_stiming(edid_ver_rev, &edid_data[addr + 1],
					&width, &height, &frequency) == 0) {
			    add_video_mode(edid_modes, edid_modes_end,
					get_stiming_name(width,
							height,
							frequency,
							mode_list,
							mode_name_buf),
					width, height, frequency);
			}
		    }
		}
	    }
	}

}	/* add_stiming_modes() */

#if defined(ACTIVATE_DEAD_CODE)	/* Not used by fbconfig */

/*
 * sun_edid_stiming_modes()
 *
 *    Return a NULL-terminated array of Standard Timing mode name
 *    strings that the display device supports, according to the timing
 *    data found in this EDID data block.
 *
 *    The dynamically allocated memory for the array and name strings
 *    can be freed by calling the sun_edid_mode_names_free() function.
 */

char **
sun_edid_stiming_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		len,		/* EDID data length */
	fbc_mode_elem_t	*mode_list)	/* Modes from config file */
{
	sun_edid_mode_t	*edid_modes;	/* Returned list of mode names */
	sun_edid_mode_t	*edid_modes_end; /* Ptr to end of mode names list */

	/*
	 * Allocate and populate an array of pointers to Standard Timing names
	 *
	 *    There may be:
	 *      8  Standard Timings mode names
	 *    4*6  Additional Standard Timings names  (6 per descriptor)
	 *      1  NULL terminator for the array
	 */
	edid_modes = malloc((8 + 4*6 + 1) * sizeof (*edid_modes));
	if (edid_modes != NULL) {
	    edid_modes_end       = edid_modes;
	    edid_modes_end->name = NULL;

	    add_stiming_modes(
			edid_data, mode_list, edid_modes, &edid_modes_end);

	    if (edid_modes_end <= edid_modes) {
		free(edid_modes);
		edid_modes = NULL;	/* The list is empty */
	    }
	}

	return (edid_modes);

}	/* sun_edid_stiming_modes() */

#endif	/* Not used by fbconfig */

/*
 * get_dtiming_name()
 *
 *    Given decoded Detailed Timing info, produce a corresponding video
 *    mode / resolution name.  The name might be found in a built-in
 *    table or in configuration file video modes data structures, or it
 *    might be constructed on the fly.
 *
 *    If a name must be constructed, the caller-supplied name_buf buffer
 *    will be used.  The buffer must be at least NAME_BUF_LEN bytes
 *    long.
 */

static
const char *
get_dtiming_name(
	const sun_edid_dtiming_t *dt,	/* Detailed Timing info */
	int		frequency,	/* Vertical frequency */
	fbc_mode_elem_t	*mode_list,	/* Modes from config file */
	char		*name_buf)	/* Buffer for returned WxHxF name */
{
	/*
	 * Detailed Timing data repackaged as xorg.conf ModeLine data
	 */
	int		dt__hdisplay;	/* Horizontal addressable pixels */
	int		dt__hsyncstart;
	int		dt__hsyncend;
	int		dt__htotal;	/* Total horizontal pixels */
	int		dt__vdisplay;	/* Vertical addressable lines */
	int		dt__vsyncstart;
	int		dt__vsyncend;
	int		dt__vtotal;	/* Total vertical lines */
	int		dt__interlace;	/* TRUE => Interlaced */
	int		dt__stereo;	/* TRUE => Stereo viewing support */
	int		dt__digital;	/* TRUE => Digital sync */
/*???*/	int		dt__composite;	/* TRUE => Composite sync */

	SunVideoTiming	info;		/* Video timing info block */
	fbc_mode_elem_t	*mode_elem;	/* Modes list element (unintrusive) */
	XF86ConfModeLinePtr mode_ptr;	/* ModeLine / Mode-EndMode entry */
	const SunVideoSummary *ptr;	/* Ptr into SunVideoTable[] table */

	/*
	 * Look for the video mode name in the built-in SunVideoTable[] table
	 */
	dtiming_to_vtiming(dt, &info);

	for (ptr = &SunVideoTable[0]; ptr->id_string != NULL; ptr += 1) {
	    if ((info.Hact  == ptr->width) &&
		(info.Vact  == ptr->height) &&
		(info.Pclk  == ptr->Pclk) &&
		(info.Hfp   == ptr->Hfp) &&
		(info.Hsw   == ptr->Hsw) &&
		(info.Hbp   == ptr->Hbp) &&
		(info.Vfp   == ptr->Vfp) &&
		(info.Vsw   == ptr->Vsw) &&
		(info.Vbp   == ptr->Vbp) &&
		(info.Fint  == ptr->Fint) &&
		(info.Fst   == ptr->Fst) &&
		(info.Stype == ptr->Stype) &&
		(info.SHpol == ptr->SHpol) &&
		(info.SVpol == ptr->SVpol)) {
		return (ptr->id_string);
	    }
	}

	/*
	 * Look for the mode name in the active Mode entries of the config file
	 *
	 *    Not used in establishing a match:
	 *      dt->hsize   - Addressable Video Image, millimeters
	 *      dt->vsize   - Addressable Video Image, millimeters
???	 *      dt->hborder - Not in common use (typically zero)
???	 *      dt->vborder - Not in common use (typically zero)
	 *      mode_ptr->ml_vscan - Times each scan line is painted
	 *      mode_ptr->ml_hskew - Pixels that Display Enable is skewed
	 */
//???	dt__hdisplay   = dt->hborder + dt->hactive + dt->hborder;
	dt__hdisplay   = dt->hactive;
	dt__hsyncstart = dt__hdisplay   + dt->hsyncOffset;
	dt__hsyncend   = dt__hsyncstart + dt->hsyncWidth;
	dt__htotal     = dt__hdisplay   + dt->hblanking;

//???	dt__vdisplay   = dt->vborder + dt->vactive + dt->vborder;
	dt__vdisplay   = dt->vactive;
	dt__vsyncstart = dt__vdisplay   + dt->vsyncOffset;
	dt__vsyncend   = dt__vsyncstart + dt->vsyncWidth;
	dt__vtotal     = dt__vdisplay   + dt->vblanking;

	dt__interlace  = ((dt->flags & 0x80) != 0);
	dt__stereo     = ((dt->flags & 0x60) != 0);
	dt__digital    = ((dt->flags & 0x10) != 0);
/*???*/	dt__composite  = ((dt->flags & 0x08) == 0);

	for (mode_elem = mode_list;
	    mode_elem != NULL;
	    mode_elem = mode_elem->list.next) {
	    /*
	     * See whether the ModeLine / Mode-EndMode config entry matches
	     *
	     *    The Stereo and Digital attributes of a mode from the
	     *    config file can't be determined except by parsing the
	     *    mode name.  That can tell us whether the attribute is
	     *    TRUE, but not for sure whether it is FALSE.  The only
	     *    certainty is that there's no match when the Detailed
	     *    Timing attribute (dt__xxxxx) is FALSE and the config
	     *    file mode attribute (fbc_resname_xxxxx()) is TRUE.
	     */
	    mode_ptr = mode_elem->mode_ptr;
	    if ((dt->pixclock   == mode_ptr->ml_clock * 1000) &&
		(dt__hdisplay   == mode_ptr->ml_hdisplay) &&
		(dt__hsyncstart == mode_ptr->ml_hsyncstart) &&
		(dt__hsyncend   == mode_ptr->ml_hsyncend) &&
		(dt__htotal     == mode_ptr->ml_htotal) &&
		(dt__vdisplay   == mode_ptr->ml_vdisplay) &&
		(dt__vsyncstart == mode_ptr->ml_vsyncstart) &&
		(dt__vsyncend   == mode_ptr->ml_vsyncend) &&
		(dt__vtotal     == mode_ptr->ml_vtotal) &&
		(dt__interlace  ==
			((mode_ptr->ml_flags & XF86CONF_INTERLACE) != 0)) &&
//???		(dt__composite  ==
//???			((mode_ptr->ml_flags & XF86CONF_CSYNC) != 0)) &&
		(dt__stereo || !fbc_resname_stereo(mode_ptr->ml_identifier)) &&
		(dt__digital ||
			!fbc_resname_digital(mode_ptr->ml_identifier))) {
		return (mode_ptr->ml_identifier);
	    }
	}

	/*
	 * Construct and return a WxHxF mode name in the caller-supplied buffer
	 */
	snprintf(name_buf, NAME_BUF_LEN, "%dx%dx%d",
		dt->hactive, dt->vactive, frequency);
	return (name_buf);

}	/* get_dtiming_name() */


/*
 * add_dtiming_modes()
 *
 *    Add Detailed Timing mode names to the list of mode names.
 */

static
void
add_dtiming_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		edid_length,	/* EDID data length */
	fbc_mode_elem_t	*mode_list,	/* Modes from config file */
	sun_edid_mode_t	*edid_modes,	/* Growing list of modes */
	sun_edid_mode_t	**edid_modes_end) /* Ptr to end of modes list */
{
	int		addr;		/* Address of 18-Byte Data Block */
	sun_edid_dtiming_t dt;		/* Detailed Timing info */
	char		mode_name_buf[NAME_BUF_LEN];

	/*
	 * Examine each of the four 18-Byte Data Blocks for Detailed Timings
	 *
	 *    An 18-Byte Data Block is encoded in 18 (decimal) bytes.
	 *    The 1st descriptor starts at EDID block address 0x36.
	 *    The 4th descriptor ends at EDID block address 0x7E.
	 */
	for (addr = 0x36; addr < 0x7E; addr += 18) {
	    /*
	     * Decode this 18-Byte Data Block if it's a Detailed Timing Block
	     */
	    if (decode_dtiming(&edid_data[addr], &dt) == 0) {
		int	frequency;	/* Vertical frequency */

		frequency = get_dtiming_frequency(&dt);
		add_video_mode(edid_modes,
				edid_modes_end,
				get_dtiming_name(&dt,
						frequency,
						mode_list,
						mode_name_buf),
				dt.hactive,
				dt.vactive,
				frequency);

		/*
???		 * "Only valid in Edid 1.1 or higher"
		 *
		 *    In EDID 1.0, the Preferred Timing Descriptor
		 *    Block is optional.  Other Detailed Timing
		 *    Blocks appear to be not applicable.
		 */
		if (EDID_VER_REV(edid_data) < EDID_1_1) {
		    break;
		}
	    }
	}

	/* Someday we should look at what's in any EDID Extension Blocks */

}	/* add_dtiming_modes() */

#if defined(ACTIVATE_DEAD_CODE)	/* Not used by fbconfig */

/*
 * sun_edid_dtiming_modes()
 *
 *    Return a NULL-terminated array of Detailed Timing mode name
 *    strings that the display device supports, according to the timing
 *    data found in this EDID data block.  The first element will
 *    contain the name of the display device's preferred mode.
 *
 *    Knowing the length of the EDID data, the EDID parser can examine
 *    extension blocks for more information.
 *
 *    The dynamically allocated memory for the array and name strings
 *    can be freed by calling the sun_edid_mode_names_free() function.
 */

char **
sun_edid_dtiming_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		edid_length,	/* EDID data length */
	fbc_mode_elem_t	*mode_list)	/* Modes from config file */
{
	sun_edid_mode_t	*edid_modes;	/* Returned list of mode names */
	sun_edid_mode_t	*edid_modes_end; /* Ptr to end of list */

	/*
	 * Allocate and populate an array of pointers to Detailed Timing names
	 *
	 *    There may be:
	 *      4  Detailed Timings mode names  (1 per descriptor)
	 *      1  NULL terminator for the array
	 */
	edid_modes = malloc((4 + 1) * sizeof (*edid_modes));
	if (edid_modes != NULL) {
	    edid_modes_end       = edid_modes;
	    edid_modes_end->name = NULL;

	    add_dtiming_modes(edid_data, edid_length, mode_list,
				edid_modes, &edid_modes_end);

	    if (edid_modes_end <= edid_modes) {
		free(edid_modes);
		edid_modes = NULL;	/* The list is empty */
	    }
	}

	return (edid_modes);

}	/* sun_edid_dtiming_modes() */

#endif	/* Not used by fbconfig */

/*
 * sun_edid_video_modes()
 *
 *    Return a NULL-terminated array of video mode name strings that the
 *    display device supports, according to the timing data found in
 *    this EDID data block.  The first array element will contain the
 *    name of the display device's preferred mode, else the mode name
 *    string will be empty.
 *
 *    Knowing the length of the EDID data, the EDID parser can examine
 *    extension blocks for more information.  Hypothetically, for now.
 *
 *    The dynamically allocated memory for the array and name strings
 *    can be freed by calling the sun_edid_mode_names_free() function.
 */

sun_edid_mode_t *
sun_edid_video_modes(
	const uint8_t	*edid_data,	/* EDID Base block, etc. */
	size_t		edid_length,	/* EDID data length */
	fbc_mode_elem_t	*mode_list)	/* Modes from config file */
{
	sun_edid_mode_t	*edid_modes;	/* Returned list of video modes */
	sun_edid_mode_t	*edid_modes_end; /* Ptr to end of list */

	/*
	 * Allocate and populate an array of EDID video mode names
	 *
	 *    There may be:
	 *      4  Detailed Timings modes  (1 per descriptor)
	 *      8  Standard Timings modes
	 *    4*6  Additional Standard Timing modes  (6 per descriptor)
	 *     24  Established Timings modes         (ETIMING_BITS     = 24)
	 *     48  Established Timings III modes     (ETIMING_III_BITS = 48)
	 *      1  Array terminator (NULL name ptr)
	 *
	 *    Note that an 18-Byte Data Block can contain one Detailed
	 *    Timing or six additional Standard Timings or 48
	 *    Established Timing IIIs, so this array will always be
	 *    longer than necessary.
	 */
	edid_modes = malloc((4 + 8 + 4*6 + ETIMING_BITS + ETIMING_III_BITS + 1)
					* sizeof (sun_edid_mode_t));
	if (edid_modes != NULL) {
	    edid_modes_end       = edid_modes;
	    edid_modes_end->name = NULL;

	    add_dtiming_modes(edid_data, edid_length, mode_list,
				edid_modes, &edid_modes_end);
	    if (edid_modes_end == edid_modes) {
		/* Show that no Preferred Timing Mode was found */
		add_video_mode(edid_modes, &edid_modes_end, "", 0, 0, 0);
	    }
	    add_stiming_modes(edid_data, mode_list,
				edid_modes, &edid_modes_end);
	    add_etiming_modes(edid_data, edid_modes, &edid_modes_end);
	}

	return (edid_modes);

}	/* sun_edid_video_modes() */


/*
 * sun_edid_video_modes_free()
 *
 *    Free a NULL-terminated array of EDID video modes that was returned
 *    by one of the add_[esd]mode_names() functions above.
 */

void
sun_edid_video_modes_free(
	sun_edid_mode_t	*edid_modes)	/* EDID video mode list */
{
	sun_edid_mode_t	*video_mode;	/* Ptr to video mode within list */

	if (edid_modes != NULL) {
	    for (video_mode = edid_modes;
		video_mode->name != NULL;
		video_mode += 1) {
		free(video_mode->name);
	    }
	    free(edid_modes);
	}

}	/* sun_edid_video_modes_free() */


/* End of sun_edid.c */
