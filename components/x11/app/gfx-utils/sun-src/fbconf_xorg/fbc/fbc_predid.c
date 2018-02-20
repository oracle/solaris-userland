/*
 * Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.
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


#include <ctype.h>		/* isprint() */
#include <stdio.h>		/* printf(), putchar(), sprintf() */
#include <string.h>		/* strlen() */

#include "sun_edid.h"		/* EDID data parsing */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_predid.h"		/* Display EDID data */
#include "fbc_predid_ceaext.h"	/* Display EDID CEA-EXT data */
#include "fbc_predid_diext.h"	/* Display EDID DI-EXT data */
#include "fbc_predid_vtbext.h"	/* Display EDID VTB-EXT data */


/*
 * Conversions from EDID flag bit value to output text string
 */
static const char	*const fbc_No  = "No";
static const char	*const fbc_Yes = "Yes";

#define	FBC_YES_NO(_byte, _mask) \
		((_byte) & (_mask)) ? fbc_Yes : fbc_No

static const char	*const fbc_Supported     = "Supported";
static const char	*const fbc_Not_supported = "Not supported";


/*
 * fbc_predid_dump_bytes()
 *
 *    Dump the specified bytes of the EDID data block in hexadecimal.
 *
 *    Byte addresses as well as data bytes are displayed using two hex
 *    digits.  Each line can contain 16 bytes.  The data is such that an
 *    ASCII display wouldn't be useful.
 */

void
fbc_predid_dump_bytes(
	const uint8_t	edid_data[],	/* EDID Base & Extension blocks */
	size_t		start_addr,	/* Starting byte address */
	size_t		end_addr)	/* Ending   byte address */
{
	const size_t	bytes_per_line = 16; /* Bytes per line (power of 2) */
	const int	hex_cols = 3;	/* Columns per hex value (" %02X") */
	size_t		byte_addr;	/* Current byte address */
	char		hex_buf[hex_cols*bytes_per_line+1]; /* Hex byte buf */
	size_t		i;		/* Loop counter / array index */
	size_t		line_addr;	/* Address for start of current line */

	/*
	 * Provide Spaces for undisplayed bytes that precede the start address
	 */
	hex_buf[0] = '\0';
	line_addr = start_addr & ~(bytes_per_line - 1); /* Round down */
	for (byte_addr = line_addr; byte_addr < start_addr; byte_addr += 1) {
		strcat(hex_buf, "   ");
	}

	/*
	 * Display each 16-byte wide line of the dump
	 */
	for (; line_addr <= end_addr; line_addr += bytes_per_line) {
		for (;
		    (((byte_addr - line_addr) < bytes_per_line) &&
			      (byte_addr <= end_addr));
		    byte_addr += 1) {
			i = byte_addr - line_addr;
			sprintf(&hex_buf[hex_cols*i], " %02X",
				edid_data[byte_addr]);
		}
		printf("\t0x%02zX: %s\n", line_addr, hex_buf);
		hex_buf[0] = '\0';
	}

}	/* fbc_predid_dump_bytes() */


/*
 * fbc_predid_tagged_string()
 *
 *    Given a string tag number, a table of tagged strings with a
 *    final NULL entry, and a default string, return the text string
 *    with the matching tag, else return the default text string.
 */

const char *
fbc_predid_tagged_string(
	unsigned int	tag,		/* String tag number */
	const fbc_tag_str_t string[],	/* Array of tagged strings */
	const char *const default_text)	/* Default string text */
{
	int		i;		/* Loop counter / arrax index */

	for (i = 0; string[i].text != NULL; i += 1) {
		if (string[i].tag == tag) {
			return (string[i].text);
		}
	}

	return (default_text);

}	/* fbc_predid_tagged_string() */


/*
 * Parsed EDID data display function type
 */
typedef void (parsed_fn_t)(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr);	/* Ending   byte address */

/*
 * EDID data block format descriptor
 */
typedef struct {
	unsigned int	start_addr;	/* Starting byte address */
	unsigned int	end_addr;	/* Ending   byte address */
	const char	*heading;	/* Description */
	parsed_fn_t	*parsed_fn;	/* Parsed EDID data display function */
} fbc_edid_fmt_t;

enum {
	NO_DATA		= 0x0100,	/* Don't display hex data bytes */
	END_MARKER	= 0xFFFF	/* End of format descriptor table */
};


/*
 * fbc_predid_vendor()
 *
 *    Decode and display Vendor & Product Identification from an EDID
 *    Base block:
 *	* ID Manufacturer
 *	* ID Product Code
 *	* ID Serial Number (Zero = Not used)
 *      * Week of Manufacture
 *        (0x00 = Not used, 1..54 = Week, 0xFF = Model year flag (EDID 1.4))
 *      * Year of Manufacture or Model Year
 */

static
void
fbc_predid_vendor(
	const uint8_t	edid_base[],	/* EDID Base block */
	unsigned int	start_addr,	/* Starting byte address (0x08) */
	unsigned int	end_addr)	/* Ending   byte address (0x11) */
{
	uint16_t	product_code;	/* ID Product Code */
	uint32_t	serial_num;	/* ID Serial Number, else zero */
	char		string_buf[4];	/* ID Manufacturer (3 chars & Nul) */
	int		week;		/* Week of Manufacture (or flag) */
	int		year;		/* Year of Manufacture or Model Year */

	sun_edid_vendor(edid_base, string_buf, &product_code, &serial_num);
	printf("\t  ID Manufacturer Name: %s\n", string_buf);
	printf("\t  ID Product Code:      %u\n", product_code);
	printf("\t  ID Serial Number:     %u\n", serial_num);

	sun_edid_mdate(edid_base, &week, &year);
	if ((week >= 1) && (week <= 54)) {
		printf("\t  Week of Manufacture:  %d\n", week);
	} else {
		printf("\t  Week Flag:            0x%02X\n", week);
	}
	if (week == 0xFF) {
		printf("\t  Model Year:           %d\n", year);
	} else {
		printf("\t  Year of Manufacture:  %d\n", year);
	}

}	/* fbc_predid_vendor() */


/*
 * fbc_predid_version()
 *
 *    Decode and display the EDID Structure and Revision from an EDID
 *    Base block:
 *	* ID Manufacturer
 *	* ID Product Code
 *	* ID Serial Number (Zero = Not used)
 *      * Week of Manufacture (0x00 = Not used, 1..54 = Week,
 *                             0xFF = Model year flag (EDID 1.4))
 *      * Year of Manufacture or Model Year
 */

static
void
fbc_predid_version(
	const uint8_t	edid_base[],	/* EDID Base block */
	unsigned int	start_addr,	/* Starting byte address (0x12) */
	unsigned int	end_addr)	/* Ending   byte address (0x13) */
{

	printf("\t  EDID Version:         %u.%u\n",
		edid_base[0x12],	/* EDID version byte */
		edid_base[0x13]);	/* EDID revision byte */

}	/* fbc_predid_version() */


/*
 * fbc_predid_disp_params()
 *
 *    Decode and display the Basic Display Parameters & Features section
 *    of an EDID Base block:
 *	* Video Input Definition
 *	* Horizontal & Vertical Screen Size or Aspect Ratio
 *	* Vertical Screen Size or Aspect Ratio
 *      * Display Transfer Characteristic (Gamma)
 *      * Feature Support
 */

static
void
fbc_predid_disp_params(
	const uint8_t	edid_base[],	/* EDID Base block */
	unsigned int	start_addr,	/* Starting byte address (0x14) */
	unsigned int	end_addr)	/* Ending   byte address (0x18) */
{
	float		aspect;		/* Aspect ratio, else zero */
	sun_edid_feature_t feature;	/* Feature Support info */
	float		gamma;		/* Gamma value, else zero */
	int		horizontal;	/* Horizontal screen size (cm), etc. */
	int		vertical;	/* Vertical screen size (cm), etc. */
	sun_edid_viddef_t video_def;	/* Video Input Definition */

	/*
	 * Video Input Definition
	 */
	sun_edid_video_input(edid_base, &video_def);

	if (!video_def.digital) {
		/*
		 * Input is an Analog Video Signal Interface
		 */
		printf("\t  Signal Level Std (Video+Sync=Total): "
			" %5.3f + %5.3f = %5.3f\n",
			video_def.alg.video,
			video_def.alg.sync,
			video_def.alg.video + video_def.alg.sync);
		printf("\t  Video Setup: %s\n",
			(video_def.alg.black2black) ?
				"Blank-to-Black setup or pedestal" :
				"Blank Level = Black Level");
		printf("\t  Separate Sync H & V Signals:          %s\n",
			(video_def.alg.sync_separate) ?
				fbc_Supported : fbc_Not_supported);
		printf("\t  Composite Sync Signal on Horizontal:  %s\n",
			(video_def.alg.sync_composite) ?
				fbc_Supported : fbc_Not_supported);
		printf("\t  Composite Sync Signal on Green Video: %s\n",
			(video_def.alg.sync_green) ?
				fbc_Supported : fbc_Not_supported);
		printf("\t  Serration on the Vertical Sync:       %s\n",
			(video_def.alg.serration) ?
				fbc_Supported : fbc_Not_supported);
	} else {
		const char *dvi_std[] = {
			"Not defined",
			"DVI",
			"HDMI-a",
			"HDMI-b",
			"MDDI",
			"DisplayPort"
		};

		/*
		 * Input is a Digital Video Signal Interface
		 */
		printf("\t  Color Bit Depth:  ");
		if (video_def.dig.color_depth == 0) {
			printf("Undefined\n");
		} else
		if (video_def.dig.color_depth >= 0) {
			printf("%u\n", video_def.dig.color_depth);
		} else {
			printf("Reserved\n");
		}

		printf("\t  Digital Video Interface Standard: %s\n",
			(video_def.dig.vid_standard <= 5) ?
				dvi_std[video_def.dig.vid_standard] :
				"Reserved");
	}

	/*
	 * Horizontal & Vertical Screen Size or Aspect Ratio
	 *
	 *    The returned aspect ratio value (introduced in EDID 1.4)
	 *    is only valid iff positive.  Aspect ratios are rounded to
	 *    the hundredth decimal place.
	 */
	sun_edid_screen_size(edid_base, &horizontal, &vertical, &aspect);
	if ((horizontal != 0) && (vertical != 0)) {
		printf("\t  Screen Size (HxV):    %dx%d cm\n",
			horizontal, vertical);
	} else
	if (aspect > 0.0) {
		if (horizontal != 0) {
			printf(FBC_PR_INDENT
				"\t  Aspect ratio (Landscape): %4.2f:1\n",
				aspect);
		} else {
			printf("\t  Aspect ratio (Portrait): %4.2f:1\n",
				aspect);
		}
	}

	/*
	 * Display Transfer Characteristic (Gamma)
	 */
	sun_edid_gamma(edid_base, &gamma);
	printf("\t  Gamma:                ");
	if (gamma > 0.0) {
		printf("%4.2f\n", gamma);
	} else {
		printf("Undefined\n");
	}

	/*
	 * Feature Support
	 */
	sun_edid_feature_support(edid_base, &feature);

	printf("\t  Standby Mode:         %s\n",
		feature.standby ? fbc_Supported : fbc_Not_supported);
	printf("\t  Suspend Mode:         %s\n",
		feature.suspend ? fbc_Supported : fbc_Not_supported);
	printf("\t  Active Off:           %s\n",
		feature.active_off ? fbc_Supported : fbc_Not_supported);

	if (!feature.digital) {
		const char *color_type[4] = {
			"Monochrome or Grayscale",
			"RGB color",
			"Non-RGB color",
			"Undefined"
		};

		printf("\t  Display Color Type:   %s\n",
			color_type[feature.color_info]);
	} else {
		const char *color_fmts[4] = {
			"RGB 4:4:4",
			"RGB 4:4:4 & YCrCb 4:4:4",
			"RGB 4:4:4 & YCrCb 4:2:2",
			"RGB 4:4:4 & YCrCb 4:4:4 & YCrCb 4:2:2"
		};

		printf("\t  Color Encoding Format(s): %s\n",
			color_fmts[feature.color_info]);
	}

	printf("\t  sRGB Standard is default color space: %s\n",
		feature.srgb_std ? fbc_Yes : fbc_No);
	printf("\t  Preferred Timing Mode inclusions:     %s\n",
		feature.ptm_incl ? fbc_Yes : fbc_No);
	printf("\t  Display is continuous frequency:      %s\n",
		feature.cont_freq ? fbc_Yes : fbc_No);

}	/* fbc_predid_disp_params() */


/*
 * fbc_predid_color_chars()
 *
 *    Decode and display the Color Characteristics section of an EDID
 *    Base block.
 */

static
void
fbc_predid_color_chars(
	const uint8_t	edid_base[],	/* EDID Base block */
	unsigned int	start_addr,	/* Starting byte address (0x19) */
	unsigned int	end_addr)	/* Ending   byte address (0x22) */
{
	sun_edid_colorchrs_t color_chars; /* Color Characteristics */

	sun_edid_color_chars(edid_base, &color_chars);
	printf("\t  Red   x,y:  %9.7f  %9.7f\n",
		color_chars.red_x, color_chars.red_y);
	printf("\t  Green x,y:  %9.7f  %9.7f\n",
		color_chars.green_x, color_chars.green_y);
	printf("\t  Blue  x,y:  %9.7f  %9.7f\n",
		color_chars.blue_x, color_chars.blue_y);
	printf("\t  White x,y:  %9.7f  %9.7f\n",
		color_chars.blue_x, color_chars.blue_y);

}	/* fbc_predid_color_chars() */


/*
 * fbc_predid_est_timings()
 *
 *    Decode and display the sense of an Established Timings bit array.
 */

static
void
fbc_predid_est_timings(
	const uint8_t	edid_base[],	/* EDID Base block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	int		bit_off;	/* Established Timings bit offset */
	int		frequency;	/* Vertical frequency */
	int		height;		/* Vertical addressable lines */
	int		width;		/* Horizontal addressable pixels */

	for (bit_off = 0;
	    bit_off < (end_addr - start_addr + 1) * 8;
	    bit_off += 1) {
		if (sun_edid_etiming(edid_base, start_addr, bit_off,
					&width, &height, &frequency) == 1) {
			printf("\t  %2d:  %4d x %4d @ %3d\n",
			       bit_off, width, height, frequency);
		}
	}

}	/* fbc_predid_est_timings() */


/*
 * fbc_predid_std_timing()
 *
 *    Decode and display a Standard Timing Descriptor.
 */

void
fbc_predid_std_timings(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	int		addr;		/* Byte address within EDID block */
	int		frequency;	/* Vertical frequency */
	int		height;		/* Vertical addressable lines */
	int		index;		/* Index into Std Timing byte pairs */
	int		width;		/* Horizontal addressable pixels */

	index = 0;
	for (addr = start_addr; addr <= end_addr; addr += 2) {
		if (sun_edid_stiming(edid_block, addr,
					&width, &height, &frequency) == 0) {
			printf("\t  %2d:  %4d x %4d @ %3d\n",
			       index, width, height, frequency);
		}
		index += 1;
	}

}	/* fbc_predid_std_timings() */


/*
 * fbc_predid_det_timing()
 *
 *    Decode and display a Detailed Timing Descriptor.
 */

void
fbc_predid_det_timing(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	sun_edid_dtiming_t dt;		/* Detailed Timing info */

	if (sun_edid_dtiming(edid_block, start_addr, &dt) == 0) {
		/*
		 * Detailed Timing Definition -- Part 1
		 */
		printf("\t  Pixel Clock:              %ld kHz\n", dt.pixclock);
		printf("\t  H Addressable Video:      %d\n", dt.hactive);
		printf("\t  Horizontal Blanking:      %d\n", dt.hblanking);
		printf("\t  V Addressable Video:      %d\n", dt.vactive);
		printf("\t  Vertical Blanking:        %d\n", dt.vblanking);
		printf("\t  Horiz Front Porch:        %d\n", dt.hsyncOffset);
		printf("\t  H Sync Pulse Width:       %d\n", dt.hsyncWidth);
		printf("\t  Vertical Front Porch:     %d\n", dt.vsyncOffset);
		printf("\t  V Sync Pulse Width:       %d\n", dt.vsyncWidth);
/*???*/		if (((dt.hsize == 16) && (dt.vsize == 9)) ||
/*???*/		    ((dt.hsize ==  4) && (dt.vsize == 3))) {
			/* Note 18 for Table 3.21 */
			printf("\t  Image Aspect Ratio:       %d:%d\n",
				dt.hsize, dt.vsize);
		} else {
			printf("\t  H Addr Video Image:       %d mm\n",
				dt.hsize);
			printf("\t  V Addr Video Image:       %d mm\n",
				dt.vsize);
		}
		printf("\t  Left/Rt Horiz Border:     %d\n", dt.hborder);
		printf("\t  Top/Bot Vert Border:      %d\n", dt.vborder);

		/*
		 * Detailed Timing Definition -- Part 2 (Flags)
		 */
		printf("\t  Signal Interface Type:    %s\n",
			(dt.flags & 0x80) ? "Interlaced" : "Non-Interlaced");
		{
			const char *stereo_support[8] = {
			    "Normal Display - No Stereo",
			    "Normal Display - No Stereo",
			    "Field sequential, right when sync = 1",
			    "2-way interleaved, right on even lines",
			    "Field sequential, left when sync = 1",
			    "2-way interleaved, left on even lines",
			    "4-way interleaved stereo",
			    "Side-by-Side interleaved stereo"
			};
			printf("\t  Stereo Viewing Support:   %s\n",
				stereo_support[((dt.flags & 0x60) >> 4)
						| (dt.flags & 0x01)]);
		}
		if (!(dt.flags & 0x10)) {
			printf("\t  Analog Sync Signal Definitions:\n");
			printf("\t\tBipolar Analog Composite Sync:   %s\n",
				FBC_YES_NO(dt.flags, 0x08));
			printf("\t\tSerrations:                      %s\n",
				FBC_YES_NO(dt.flags, 0x04));
			printf("\t\tSync On:                         %s\n",
				(dt.flags & 0x02) ? "RGB" : "Green");
		} else {
			printf("\t  Digital Sync Signal Definitions:\n");
			if (!(dt.flags & 0x08)) {
				printf("\t      Digital Composite Sync:\n");
				printf("\t\t  Serrations:       %s\n",
					FBC_YES_NO(dt.flags, 0x080));
			} else {
				printf("\t      Digital Separate Sync:\n");
				printf("\t\t  Vertical Sync:    %s\n",
					(dt.flags & 0x080)
						? "Positive" : "Negative");
			}
			printf("\t      Horizontal Sync:      %s\n",
				(dt.flags & 0x080) ? "Positive" : "Negative");
		}
	}

}	/* fbc_predid_det_timing() */


static
void
fbc_predid_range_limits(
	const uint8_t	*edid_data,	/* Display Descriptor bytes */
	sun_edid_range_lim_t *range_limits) /* Display Range Limits */
{

	printf("\t  Display Range Limits\n");
	printf("\t    Vertical Rate:       %u - %u Hz\n",
		range_limits->vert_min,
		range_limits->vert_max);
	printf("\t    Horizontal Rate:     %u - %u kHz\n",
		range_limits->horiz_min,
		range_limits->horiz_max);
	printf("\t    Maximum Pixel Clock: %u MHz\n",
		range_limits->pixclock_max);

	switch (edid_data[10]) {
	case 0x00:
		/* Note that this bit must be set: (edid_data[0x18] & 0x01) */
		printf("\t    Default GTF supported\n");
		break;
	case 0x01:
		printf("\t    Range Limits only\n");
		break;
	case 0x02:	/* Generalized Timing Formula (deprecated) */
		/* Note that this bit must be set: (edid_data[0x18] & 0x01) */
		printf("\t    GTF Secondary Curve\n");
		printf(
		"\t\tStart break frequency for secondary curve:  %u kHz\n",
			range_limits->gtf_start_break);
		printf("\t\tC:  %u\n", range_limits->gtf_C);
		printf("\t\tM:  %u\n", range_limits->gtf_M);
		printf("\t\tK:  %u\n", range_limits->gtf_K);
		printf("\t\tJ:  %u\n", range_limits->gtf_J);
		break;
	case 0x04:
		/* Note that this bit must be set: (edid_data[0x18] & 0x01) */
		printf("\t    CVT Support Information\n");
		printf("\t\tCVT Standard Version:  %u.%u\n",
			range_limits->cvt_version >> 4,
			range_limits->cvt_version & 0x0F);
		printf("\t\tMaximum Pixel Clock:   %u.%02u MHz\n",
			range_limits->cvt_pixclock_max >> 2,
			(range_limits->cvt_pixclock_max & 0x03) * 25);
		printf("\t\tMaximum Active Pixels per Line: ");
		if (range_limits->cvt_hactive_max == 0) {
			printf("No limit\n");
		} else {
			printf("%u\n", range_limits->cvt_hactive_max);
		}
		{
			const char *aspect_ratio[] = {
			    "4:3",
			    "16:9",
			    "16:10",
			    "5:4",
			    "15:9",
			    "Reserved",
			    "Reserved",
			    "Reserved",
			    NULL
			};
			int bit_off;
			char *comma;

			printf("\t\tSupported Aspect Ratios: ");
			comma = "";
			for (bit_off = 0;
			    aspect_ratio[bit_off] != NULL;
			    bit_off += 1) {
				if (sun_edid_bit_set(
						&edid_data[14], bit_off)) {
					printf("%s%s",
						comma,
						aspect_ratio[bit_off]);
						comma = ", ";
				}
			}
			printf("\n");
			printf("\t\tPreferred Aspect Ratio:  %s\n",
				aspect_ratio[edid_data[15] >> 5]);
		}
		printf("\t\tStandard CVT Blanking:   %s\n",
		       FBC_YES_NO(edid_data[15], 0x08));
		printf("\t\tReduced CVT Blanking:    %s\n",
		       FBC_YES_NO(edid_data[15], 0x10));
		{
			const char *display_scaling[] = {
			    "Horizontal Shrink",
			    "Horizontal Stretch",
			    "Vertical Shrink",
			    "Vertical Stretch",
			    NULL
			};
			int bit_off;

			printf("\t\tSupported Display Scaling:\n");
			for (bit_off = 0;
			    display_scaling[bit_off] != NULL;
			    bit_off += 1) {
				if (sun_edid_bit_set(
						&edid_data[16], bit_off)) {
					printf("\t\t    %s\n",
						display_scaling[bit_off]);
				}
			}
		}
		printf("\t\tPreferred Refresh Rate: %u Hz\n", edid_data[17]);
		break;
	}

}	/* fbc_predid_range_limits() */


/*
 * fbc_predid_18_byte_data()
 *
 *    Decode and display an 18-Byte Data Block.
 */

static
void
fbc_predid_18_byte_data(
	const uint8_t	edid_base[],	/* EDID Base block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{

	/*
	 * Determine what kind of 18-Byte Data Block this is
	 */
	if ((edid_base[start_addr+0] != 0) || (edid_base[start_addr+1] != 0)) {
		/*
		 * Display the Detailed Timing Descriptor
		 */
		fbc_predid_det_timing(edid_base, start_addr, end_addr);
	} else
	/* if (edid_base[start_addr+2] == 0) */ {	/* Reserved */
		char	string_buf[14];	/* String from Display Descriptor */
		uint8_t	tag;		/* Display Descriptor tag number */

		/*
		 * Display the Display Descriptor
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
		tag = edid_base[start_addr+3];
		switch (tag) {
		case 0xFF:
			sun_edid_descriptor_string(&edid_base[start_addr],
						    string_buf);
			printf("\t  Display Product Serial Number: %s\n",
				string_buf);
			break;
		case 0xFE:
			sun_edid_descriptor_string(&edid_base[start_addr],
						    string_buf);
			printf("\t  Alphanumeric Data String: %s\n",
				string_buf);
			break;
		case 0xFD:
			{
				sun_edid_range_lim_t range_limits;

				/* Display Range Limits */
				sun_edid_range_limits(&edid_base[start_addr],
							&range_limits);
				fbc_predid_range_limits(&edid_base[start_addr],
							&range_limits);
			}
			break;
		case 0xFC:
			sun_edid_descriptor_string(&edid_base[start_addr],
						    string_buf);
			printf("\t  Display Product Name: %s\n",
				string_buf);
			break;
		case 0xFB:
			printf("\t  Color Point Data\n");
			break;
		case 0xFA:
			printf("\t  Standard Timing Identifications\n");
			fbc_predid_std_timings(edid_base,
						start_addr+5, start_addr+16);
			break;
		case 0xF9:
			printf("\t  Display Color Management (DCM) Data\n");
			break;
		case 0xF8:
			printf("\t  CVT 3 Byte Timing Codes\n");
			break;
		case 0xF7:
			printf("\t  Established Timings III\n");
			fbc_predid_est_timings(edid_base,
						start_addr+6, start_addr+11);
			break;
		case 0x10:
			printf("\t  Dummy Descriptor\n");
			break;
		default:
			if ((tag >= 0x11) && (tag <= 0xF6)) {
				printf(
		       "\t  Reserved Display Descriptor (tag = 0x%02X)\n",
					tag);
				break;
			}
			if (tag <= 0x0F) {
				printf(
	"\t  Manufacturer Specified Display Descriptor (tag = 0x%02X)\n",
					tag);
				break;
			}
			break;
		}
	}

}	/* fbc_predid_18_byte_data() */


/*
 * fbc_predid_ext_blk_cnt()
 *
 *    Display the Extension Block Count N of an EDID Base block.
 */

static
void
fbc_predid_ext_blk_cnt(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{

	printf("\t  Extension blocks: %u\n", edid_block[0x7E]);

}	/* fbc_predid_ext_blk_cnt() */


/*
 * fbc_predid_checksum()
 *
 *    Display the checksum byte of an EDID data block and complain when
 *    it's not correct.
 */

static
void
fbc_predid_checksum(
	const uint8_t	edid_block[],	/* EDID data block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	uint8_t		sum;		/* 1-byte sum of all 128 bytes */

	printf("\t  Checksum: 0x%02X\n", edid_block[0x7F]);
	sum = sun_edid_checksum(edid_block);
	if (sum != 0) {
		printf(
		    "\t    Sum of bytes (0x%02X) in EDID block is non-zero\n",
		    sum);
	}

}	/* fbc_predid_checksum() */


/*
 * fbc_predid_ext_revision()
 *
 *    EDID Extension Block revision number.
 */

static
void
fbc_predid_ext_revision(
	const uint8_t	edid_block[],	/* EDID Extension Block */
	unsigned int	start_addr,	/* Starting byte address (0x01) */
	unsigned int	end_addr)	/* Ending   byte address (0x01) */
{

	printf("\t  Revision: %u\n", edid_block[0x01]);

}	/* fbc_predid_ext_revision() */


/* Base Block common strings (referenced at least twice) */
static const char bb_base_block[]	= "EDID Base Block";
static const char bb_header[]		= "Header";
static const char bb_vendor_prod_id[]	= "Vendor & Product Identification";
static const char bb_version_revision[]	= "EDID Structure Version & Revision";
static const char bb_disp_params[]     = "Basic Display Parameters & Features";
static const char bb_color_chars[]	= "Color Characteristics";
static const char bb_est_timings[]	= "Established Timings";
static const char bb_std_timings[]	= "Standard Timings";
static const char bb_det_timings[]	= "Detailed Timing Blocks";
static const char bb_18_byte_data_blks[] = "18-Byte Data Blocks";
static const char bb_block_1[]		= "  Block #1";
static const char bb_block_2[]		= "  Block #2";
static const char bb_block_3[]		= "  Block #3";
static const char bb_block_4[]		= "  Block #4";
static const char bb_det_timing_2_etc[]	=
			"  Detailed Timing #2 or Display Descriptor";
static const char bb_det_timing_3_etc[]	=
			"  Detailed Timing #3 or Display Descriptor";
static const char bb_det_timing_4_etc[]	=
			"  Detailed Timing #4 or Display Descriptor";
static const char bb_ext_blk_cnt[]	= "Extension Block Count N";
static const char bb_checksum[]		= "Checksum C";


/* Base Block format, EDID 1.0 */
static const fbc_edid_fmt_t edid_1_0_base_fmt[] = {
	{ NO_DATA, NO_DATA, "EDID 1.0 Base Block", NULL			},
	{ 0x00, 0x07, bb_header,		NULL			},
	{ 0x08, 0x11, bb_vendor_prod_id,	&fbc_predid_vendor	},
	{ 0x12, 0x13, bb_version_revision,	&fbc_predid_version	},
	{ 0x14, 0x18, bb_disp_params,		&fbc_predid_disp_params	},
	{ 0x19, 0x22, bb_color_chars,		&fbc_predid_color_chars	},
	{ 0x23, 0x25, bb_est_timings,		&fbc_predid_est_timings	},
	{ 0x26, 0x35, bb_std_timings,		&fbc_predid_std_timings	},
	{ NO_DATA, NO_DATA, bb_det_timings,	NULL			},
	{ 0x36, 0x47, "    Block 1",		&fbc_predid_det_timing	},
	{ 0x48, 0x59, "    Block 2",		&fbc_predid_det_timing	},
	{ 0x5A, 0x6B, "    Block 3",		&fbc_predid_det_timing	},
	{ 0x6C, 0x7D, "    Block 4",		&fbc_predid_det_timing	},
	{ 0x7E, 0x7E, bb_ext_blk_cnt,		&fbc_predid_ext_blk_cnt	},
	{ 0x7F, 0x7F, bb_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};

/* Base Block format, EDID 1.1 & 1.2 */
static const fbc_edid_fmt_t edid_1_1_base_fmt[] = {
	{ NO_DATA, NO_DATA, bb_base_block,	NULL			},
	{ 0x00, 0x07, bb_header,		NULL			},
	{ 0x08, 0x11, bb_vendor_prod_id,	&fbc_predid_vendor	},
	{ 0x12, 0x13, bb_version_revision,	&fbc_predid_version	},
	{ 0x14, 0x18, bb_disp_params,		&fbc_predid_disp_params	},
	{ 0x19, 0x22, bb_color_chars,		&fbc_predid_color_chars	},
	{ 0x23, 0x25, bb_est_timings,		&fbc_predid_est_timings	},
	{ 0x26, 0x35, bb_std_timings,		&fbc_predid_std_timings	},
	{ NO_DATA, NO_DATA, bb_18_byte_data_blks, NULL			},
	{ 0x36, 0x47, "  Detailed Timing #1 or Display Descriptor",
						&fbc_predid_18_byte_data },
	{ 0x48, 0x59,    bb_det_timing_2_etc,	&fbc_predid_18_byte_data },
	{ 0x5A, 0x6B,    bb_det_timing_3_etc,	&fbc_predid_18_byte_data },
	{ 0x6C, 0x7D,    bb_det_timing_4_etc,	&fbc_predid_18_byte_data },
	{ 0x7E, 0x7E, bb_ext_blk_cnt,		&fbc_predid_ext_blk_cnt	},
	{ 0x7F, 0x7F, bb_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};

/* Base Block format, EDID 1.3 & 1.4 */
static const fbc_edid_fmt_t edid_1_3_base_fmt[] = {
	{ NO_DATA, NO_DATA, bb_base_block,	NULL			},
	{ 0x00, 0x07, bb_header,		NULL			},
	{ 0x08, 0x11, bb_vendor_prod_id,	&fbc_predid_vendor	},
	{ 0x12, 0x13, bb_version_revision,	&fbc_predid_version	},
	{ 0x14, 0x18, bb_disp_params,		&fbc_predid_disp_params	},
	{ 0x19, 0x22, bb_color_chars,		&fbc_predid_color_chars	},
	{ 0x23, 0x25, bb_est_timings,		&fbc_predid_est_timings	},
	{ 0x26, 0x35, bb_std_timings,		&fbc_predid_std_timings	},
	{ NO_DATA, NO_DATA, bb_18_byte_data_blks, NULL			},
	{ 0x36, 0x47, "  Preferred Timing Mode", &fbc_predid_18_byte_data },
	{ 0x48, 0x59,    bb_det_timing_2_etc,	&fbc_predid_18_byte_data },
	{ 0x5A, 0x6B,    bb_det_timing_3_etc,	&fbc_predid_18_byte_data },
	{ 0x6C, 0x7D,    bb_det_timing_4_etc,	&fbc_predid_18_byte_data },
	{ 0x7E, 0x7E, bb_ext_blk_cnt,		&fbc_predid_ext_blk_cnt	},
	{ 0x7F, 0x7F, bb_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* Extension Block common strings (referenced at least twice) */
static const char ext_block_tag[]	= "Extension Block Tag Number";
static const char ext_revision[]	= "Revision number";
static const char ext_data[]		= "Extension Block Data";
static const char ext_checksum[]	= "Extension Block Checksum";
static const char ext_map_checksum[]	= "Extension Block Map Checksum";


/* CEA-EXT (Tag 0x02): CEA 861 Series Extension Block */
static const fbc_edid_fmt_t edid_cea_ext_fmt[] = {
	{ NO_DATA, NO_DATA,
	  "CEA 861 Series Extension (CEA-EXT) Block", NULL		},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x02, "Detailed Timing Descriptor Start Address",
						&fbc_predid_ceaext_layout },
	{ NO_DATA, NO_DATA, NULL,		&fbc_predid_ceaext_xxx	},
	{ NO_DATA, NO_DATA, NULL,		&fbc_predid_ceaext_data	},
	{ 0x7F, 0x7F, ext_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* VTB-EXT (Tag 0x10): Video Timing Block Extension Block */
static const fbc_edid_fmt_t edid_vtb_ext_fmt[] = {
	{ NO_DATA, NO_DATA,
	  "Video Timing Block Extension (VTB-EXT) Block", NULL		},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x04, "VTB Data Structure Layout", &fbc_predid_vtbext_layout },
	{ NO_DATA, NO_DATA, NULL,		&fbc_predid_vtbext_data },
	{ 0x7F, 0x7F, ext_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* DI-EXT (Tag 0x40): Display Information Extension Block */
static const fbc_edid_fmt_t edid_di_ext_fmt[] = {
	{ NO_DATA, NO_DATA,
		      "Display Information Extension (DI-EXT) Block", NULL },
	{ 0x00, 0x00, "Block Header; Tag Number", NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x0D, "Digital Interface section",
					&fbc_predid_diext_display_interface },
	{ 0x0E, 0x13, "Display Device section",
					&fbc_predid_diext_display_device },
	{ 0x14, 0x36, "Display Capabilities & Feature Support Set",
					&fbc_predid_diext_capabilities	},
	{ 0x37, 0x47, "Unused Bytes (Reserved)", NULL			},
	{ 0x48, 0x50, "Audio Support (Reserved)", NULL			},
	{ 0x51, 0x7E, "Display Transfer Characteristic - Gamma",
						&fbc_predid_diext_gamma	},
	{ 0x7F, 0x7F, "Miscellaneous Items; Checksum", &fbc_predid_checksum },
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* LS-EXT (Tag 0x50): Localized String Extension Block */
static const fbc_edid_fmt_t edid_ls_ext_fmt[] = {
	{ NO_DATA, NO_DATA,
	  "Localized String Extension (LS-EXT) Block", NULL		},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x7E, ext_data,			NULL			},
	{ 0x7F, 0x7F, ext_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* DPVL-EXT (Tag 0x60): Digital Packet Video Link (DPVL-EXT) Extension */
static const fbc_edid_fmt_t edid_dpvl_ext_fmt[] = {
	{ NO_DATA, NO_DATA,
	  "Digital Packet Video Link Extension (DPVL-EXT) Block", NULL	},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x7E, ext_data,			NULL			},
	{ 0x7F, 0x7F, ext_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* Extension Block Map 1 format (Tag 0xF0 at Block 1) */
static const fbc_edid_fmt_t edid_map1_ext_fmt[] = {
	{ NO_DATA, NO_DATA, "Extension Block Map 1", NULL		},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x7E,
	  "Extension Block Tags for Extension Blocks 2 to 127", NULL	},
	{ 0x7F, 0x7F, ext_map_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};

/* Extension Block Map 2 format (Tag 0xF0 at Block 128) */
static const fbc_edid_fmt_t edid_map2_ext_fmt[] = {
	{ NO_DATA, NO_DATA, "Extension Block Map 2", NULL		},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x7E,
	  "Extension Block Tags for Extension Blocks 129 to 254", NULL	},
	{ 0x7F, 0x7F, ext_map_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* Extensions defined by the display manufacturer (Tag 0xFF) */
static const fbc_edid_fmt_t edid_mfg_ext_fmt[] = {
	{ NO_DATA, NO_DATA,
	  "Extensions defined by the display manufacturer", NULL	},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x7E, ext_data,			NULL			},
	{ 0x7F, 0x7F, ext_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* Unknown Extension block (This might be passed to fbc_predid_dump_block()) */
static const fbc_edid_fmt_t edid_unknown_ext_fmt[] = {
	{ NO_DATA, NO_DATA, "Extension Block",	NULL			},
	{ 0x00, 0x00, ext_block_tag,		NULL			},
	{ 0x01, 0x01, ext_revision,		&fbc_predid_ext_revision },
	{ 0x02, 0x7E, ext_data,			NULL			},
	{ 0x7F, 0x7F, ext_checksum,		&fbc_predid_checksum	},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/* Unknown EDID block  (This won't be passed to fbc_predid_dump_block()) */
static const fbc_edid_fmt_t edid_unknown_fmt[] = {
	{ NO_DATA, NO_DATA, "Unknown EDID block", NULL			},
	{ END_MARKER, END_MARKER, NULL,		NULL			}
};


/*
 * fbc_predid_dump_block()
 *
 *    Display this EDID data block according to the provided format
 *    descriptors (as from edid_1_3_base_fmt[], etc.).
 */

static
void
fbc_predid_dump_block(
	const uint8_t	edid_block[],	/* EDID data block */
	const fbc_edid_fmt_t block_fmt[], /* EDID data block format */
	int		predid_raw)	/* TRUE => Display raw EDID data */
{
	const fbc_edid_fmt_t *blk_fmt;	/* EDID structure format descriptor */
	int		parsed;		/* TRUE => Parsed data displayed */

	/*
	 * Repeat for each EDID structure format descriptor
	 *
	 *    The EDID data block heading (block_fmt[0].heading) has
	 *    been displayed already.
	 */
	for (blk_fmt = &block_fmt[1];
	    blk_fmt->start_addr != END_MARKER;
	    blk_fmt += 1) {
		/*
		 * Display a line describing the data that follows
		 */
		if (blk_fmt->heading != NULL) {
			printf("    %s\n", blk_fmt->heading);
		}

		/*
		 * If the function exisis, display the EDID data in parsed form
		 *
		 *    There typically wouldn't be a parser function for:
		 *      * Heading text lines
		 *      * EDID Base block header bytes
		 *      * Raw, opaque, or enigmatic data bytes
		 *      * Reserved bytes (zeroes)
		 *      * etc.
		 */
		parsed = (blk_fmt->parsed_fn != NULL);
		if (parsed) {
			blk_fmt->parsed_fn(edid_block,
					    blk_fmt->start_addr,
					    blk_fmt->end_addr);
		}

		/*
		 * Display the EDID data as raw hexadecimal bytes
		 *
		 *    Skip this if this fbc_edid_fmt_t descriptor is for
		 *    a header line, and not for data bytes (NO_DATA).
		 *
		 *    Otherwise, display the raw data if either is true:
		 *      * There is no parsed EDID data display function
		 *      * The "-predid ... raw ..." option is specified
		 */
		if ((blk_fmt->start_addr != NO_DATA) &&
		    (predid_raw || !parsed)) {
			fbc_predid_dump_bytes(edid_block,
						blk_fmt->start_addr,
						blk_fmt->end_addr);
		}
	}

}	/* fbc_predid_dump_block() */


/*
 * fbc_predid()
 *
 *    Dump the E-EDID (Enhanced Extended Display Identification Data)
 *    data blocks.  The contiguous EDID data bytes are pointed to by
 *    edid_data.  The byte length is specified by edid_length.
 *
 *    The output format will be raw hexadecimal (predid_raw) and/or
 *    human-readable text (predid_parsed).  If only raw data is wanted,
 *    the hex values will appear in a 16x8 grid.  Parsed output will
 *    include subheadings, text labels, numeric or textual values, etc.
 *    If both raw and parsed form are wanted, raw hex for each
 *    subheading will appear after the parsed output, as an aligned
 *    fragment of a 16x8 grid.
 */

void
fbc_predid(
	const uint8_t	*edid_data,	/* EDID Base & Extension blocks */
	size_t		edid_length,	/* EDID data block(s) length */
	int		predid_raw,	/* TRUE => Display raw EDID data */
	int		predid_parsed)	/* TRUE => Display parsed EDID data */
{
	size_t		block_addr;	/* Byte addr of current data block */
	const fbc_edid_fmt_t *block_fmt; /* EDID structure format descriptor */
	const uint8_t	*block_map;	/* Ptr to current Block Map block */
	int		block_num;	/* EDID data block number */
	size_t		block_len;	/* EDID data block length */
	int		edid_version;	/* EDID_v_r */
	unsigned int	ext_block_tag;	/* Extension Block Tag Number (temp) */
	uint8_t		tag;		/* Extension Block Tag Number (temp) */

#if defined(FBC_EDID_TEST_DATA)
#include "fbc_edid_test_data.h"	/* EDID test data */
#endif

	/*
	 * Make sure there's at least some EDID data to display
	 */
	if ((edid_data == NULL) || (edid_length < 0x80)) {
		printf(FBC_PR_INDENT
			"EDID Data: EDID Base block is not available\n");
		return;
	}

	/*
	 * EDID version and revision
	 */
	edid_version = EDID_VER_REV(edid_data);

	/*
	 * Display each EDID data block
	 */
	block_num = 0;
	block_map = NULL;		/* Assume Block Maps aren't used */
	for (block_addr = 0x00;
	    block_addr < edid_length;
	    block_addr += 0x80) {
		/*
		 * Figure out what kind of EDID block this might be
		 */
		block_fmt = &edid_unknown_fmt[0];
		block_len = 0x80;
		if (block_len > edid_length - block_addr) {
			/*
			 * Incomplete EDID data block
			 */
			block_len = edid_length - block_addr;
		} else
		if (block_num == 0) {
			/*
			 * EDID Base Block
			 */
			block_fmt = &edid_1_0_base_fmt[0];
			if (edid_version >= EDID_1_1) {
				block_fmt = &edid_1_1_base_fmt[0];
			}
			if (edid_version >= EDID_1_3) {
				block_fmt = &edid_1_3_base_fmt[0];
			}
		} else
		if (block_num <= 255) {
			/*
			 * EDID Extension Block
			 *
			 *    There's not much solid documentation on
			 *    Extension Blocks until the EDID 1.4 spec.
			 *    The EDID 1.3 spec is kind of runny.
			 *
			 *    If block #255 is found to be out of range,
			 *    retain &edid_unknown_fmt[0] as the value
			 *    of block_fmt.
			 */
			ext_block_tag = 0xFFFF;	/* Unrecognized tag */
			tag           = edid_data[block_addr + 0x00];

			if (edid_version < EDID_1_3) {
				block_fmt = &edid_unknown_ext_fmt[0];
			} else
			if (edid_version == EDID_1_3) {
				if (block_num < 255) {
					block_fmt = &edid_unknown_ext_fmt[0];
					if ((tag == 0xF0) || (tag == 0xFF)) {
						ext_block_tag = tag;
					}
				}
			} else
			if (edid_version >= EDID_1_4) {
				if ((block_num < 255) || (block_map == NULL)) {
					ext_block_tag = tag;
				}
			}

			switch (ext_block_tag) {
			default:    /* Bad blk #, bad tag, no documentation */
				break;
			case 0x02:  /* CEA-EXT: CEA 861 Series Extension */
				block_fmt = &edid_cea_ext_fmt[0];
				break;
			case 0x10:  /* VTB-EXT: Video Timing Block Ext */
				block_fmt = &edid_vtb_ext_fmt[0];
				break;
			case 0x40:  /* DI-EXT: Display Info Extension */
				block_fmt = &edid_di_ext_fmt[0];
				break;
			case 0x50:  /* LS-EXT: Localized String Extension */
				block_fmt = &edid_ls_ext_fmt[0];
				break;
			case 0x60:  /* DPVL-EXT: Digital Packet Video Link */
				block_fmt = &edid_dpvl_ext_fmt[0];
				break;
			case 0xF0:  /* EXTENSION Block Map 1 or 2 */
				if (block_num == 1) {
					block_fmt = &edid_map1_ext_fmt[0];
					block_map = &edid_data[block_addr];
				} else
				if (block_num == 128) {
					block_fmt = &edid_map2_ext_fmt[0];
					block_map = &edid_data[block_addr];
				}
				/* Reject Block Maps at other locations */
				break;
			case 0xFF:  /* EXTENSIONS by display manufacturer */
				block_fmt = &edid_mfg_ext_fmt[0];
				break;
			}
		}

		/*
		 * Display the EDID data block
		 */
		if (block_num > 0) {
			putchar('\n');	/* Blank line between EDID blocks */
		}
		printf("Block %d: %s\n", block_num, block_fmt->heading);
		if (!predid_parsed || (block_fmt == edid_unknown_fmt)) {
			/*
			 * Display a raw valid or unknown/invalid EDID block
			 */
			fbc_predid_dump_bytes(
				&edid_data[block_addr], 0, block_len-1);
		} else {
			/*
			 * Display a valid EDID block parsed or parsed & raw
			 */
			fbc_predid_dump_block(
				&edid_data[block_addr], block_fmt, predid_raw);
		}

		block_num += 1;
	}

}	/* fbc_predid() */


/* End of fbc_predid.c */
