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
 * fbc_predid_diext - Display EDID data DI-EXT data
 */


#include <stdio.h>		/* printf(), putchar() */

#include "sun_edid.h"		/* EDID data parsing */

#include "fbc_predid.h"		/* Display EDID data */
#include "fbc_predid_diext.h"	/* Display EDID DI-EXT data */


/*
 * Conversions from EDID flag bit value to output text string
 */
static const char	*const fbc_No  = "No";
static const char	*const fbc_Yes = "Yes";

#define	FBC_YES_NO(_byte, _mask) \
		((_byte) & (_mask)) ? fbc_Yes : fbc_No

static const char	*const fbc_Supported     = "Supported";
static const char	*const fbc_Not_supported = "Not supported";

#define	FBC_SUPPORTED_NOT(_byte, _mask) \
		((_byte) & (_mask)) ? fbc_Supported : fbc_Not_supported


/*
 * fbc_predid_diext_display_interface()
 *
 *    Display Interface (Monitors with a digital video interface)
 */

void
fbc_predid_diext_display_interface(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x02) */
	unsigned int	end_addr)	/* Ending   byte address (0x0D) */
{

	/*
	 * Standard/Specification Supported
	 */
	{
		const fbc_tag_str_t di_std_spec[] = {
		    { 0x00, "Display has an Analog Video Input"		},
		    { 0x01, "Display has a Digital Video Input"		},
		    { 0x02, "Digital Visual Interface (DVI) - Single link" },
		    { 0x03,
	"Digital Visual Interface (DVI) - Dual link, High resolution"	},
		    { 0x04,
	"Digital Visual Interface (DVI) - Dual link, High color"	},
		    { 0x05,
	"Digital Visual Interface (DVI) - For consumer electronics"	},
		    { 0x06, "Plug & Display (P&D)"			},
		    { 0x07, "Digital Flat Panel (DFP)"			},
		    { 0x08, "Open LDI - Single Link"			},
		    { 0x09, "Open LDI - Dual Link"			},
		    { 0x0A, "Open LDI - For consumer electronics"	},
		};
		printf("\t  Standard/Specification:\n");
		printf("\t\t%s\n",
			fbc_predid_tagged_string(
				edid_block[0x02], di_std_spec, "Reserved"));
	}

	/*
	 * Version/Revision Number
	 */
	printf("\t  Version/Revision:              ");
	switch (edid_block[0x03] >> 6) {
	case 0:
		printf("Not specified\n");
		break;
	case 1:	/* Version/Revision */
		printf("%d.%d / %d.%d\n",
			edid_block[0x03] & 0x3F,
			edid_block[0x04],
			edid_block[0x05],
			edid_block[0x06]);
		break;
	case 2:	/* ASCII character */
		printf("%c\n", edid_block[4]);
		break;
	case 3:	/* Year, Month, Day */
		printf("%d/%02d/%02d\n",
			1990 + edid_block[0x04],
			edid_block[0x05],
			edid_block[0x06]);
		break;
	}

	/*
	 * Data Format Description
	 */
	printf("\t  Data Enable Signal:            ");
	if (edid_block[0x07] & 0x80) {
		printf("Available\n");
		printf("\t  Data enabled upon:             %s signal\n",
		       (edid_block[0x07] & 0x40) ? "High" : "Low");
	} else {
		printf("Unavailable\n");
	}

	{
		const char *const shift_clock[4] = {
		    "Not specified",
		    "Rising edge",
		    "Falling edge",
		    "Both rising and falling edges"
		};
		printf("\t  Shift Clock usage:             %s\n",
			shift_clock[(edid_block[0x07] >> 4) & 0x03]);
	}

	printf("\t  HDCP Support:                  %s\n",
				FBC_YES_NO(edid_block[0x07], 0x08));
	printf("\t  Double Clocking of Input Data: %s\n",
				FBC_SUPPORTED_NOT(edid_block[0x07], 0x04));
	printf("\t  Packetized Digital Video:      %s\n",
				FBC_SUPPORTED_NOT(edid_block[0x07], 0x02));

	/*
	 * Data Format Description
	 */
	{
		const fbc_tag_str_t data_format[] = {
		    { 0x00, "Display has an Analog Video Input"		},
		    { 0x15, "8-bit Over 8-bit RGB"			},
		    { 0x19, "12-bit Over 12-bit RGB"			},
		    { 0x24, "24-Bit MSB-Aligned RGB (Single Link)"	},
		    { 0x48, "48-Bit MSB-Aligned RGB (Dual Link Hi-Res)"	},
		    { 0x49, "48-Bit MSB-Aligned RGB (Dual Link Hi-Color)" },
		    {    0, NULL					}
		};
		printf("\t  Digital Interface:  %s\n",
			fbc_predid_tagged_string(
				edid_block[0x08], data_format, "Undefined"));
	}

	/*
	 * Min & Max Pixel Clock Frequency (PCF) Per Link and Crossover PCF
	 */
	{
		unsigned int frequency;	/* Pixel Clock Frequency */

		printf("\t  Min Pixel Clock Frequency:     ");
		frequency = edid_block[0x09];
		if (frequency == 0x00) {
			printf("Display has an Analog Video Input\n");
		} else
		if (frequency == 0xFF) {
			printf("Reserved\n");
		} else {
			printf("%3u MHz\n", frequency);
		}

		printf("\t  Max Pixel Clock Frequency:     ");
		frequency = sun_edid_get_le_short(&edid_block[0x0A]);
		if (frequency == 0x0000) {
			printf("Display has an Analog Video Input\n");
		} else
		if (frequency == 0xFFFF) {
			printf("Reserved\n");
		} else {
			printf("%3u MHz\n", frequency);
		}

		printf("\t  Crossover Pixel Clock Freq:    ");
		frequency = sun_edid_get_le_short(&edid_block[0x0C]);
		if (frequency == 0x0000) {
			printf("Display has an Analog Video Input\n");
		} else
		if (frequency == 0xFFFF) {
			printf("Single Link (no frequency)\n");
		} else {
			printf("%3u MHz\n", frequency);
		}
	}

}	/* fbc_predid_diext_display_interface() */


/*
 * fbc_predid_diext_display_device()
 *
 *    Display Device (Monitors w/ analog and/or digital interface(s))
 */

void
fbc_predid_diext_display_device(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x0E) */
	unsigned int	end_addr)	/* Ending   byte address (0x13) */
{

	/*
	 * Sub-Pixel Layout, Configuration, and Shape
	 */
	{
		const fbc_tag_str_t subpix_layout[] = {
		    { 0x00, "Not defined"		},
		    { 0x01, "RGB"			},
		    { 0x02, "BGR"			},
		    { 0x03, "Quad pixel (RG/GB)"	},
		    { 0x04, "Quad pixel (GR/BG)"	},
		    {    0, NULL			}
		};
		printf("\t  Sub-Pixel Layout:           %s\n",
			fbc_predid_tagged_string(
				edid_block[0x0E], subpix_layout, "Reserved"));
	}
	{
		const fbc_tag_str_t subpix_config[] = {
		    { 0x00, "Not defined"			},
		    { 0x01, "Delta (Tri-ad)"			},
		    { 0x02, "Stripe"				},
		    { 0x03, "Stripe Offset"			},
		    { 0x04, "Quad pixel (4 sub-pixels / pixel)"	},
		    {    0, NULL				}
		};
		printf("\t  Sub-Pixel Configuration:    %s\n",
			fbc_predid_tagged_string(
				edid_block[0x0F], subpix_config, "Reserved"));
	}
	{
		const fbc_tag_str_t subpix_shape[] = {
		    { 0x00, "Not defined"	},
		    { 0x01, "Round"		},
		    { 0x02, "Square"		},
		    { 0x03, "Rectangular"	},
		    { 0x04, "Oval"		},
		    { 0x05, "Elliptical"	},
		    {    0, NULL		}
		};
		printf("\t  Sub-Pixel Shape:            %s\n",
			fbc_predid_tagged_string(
				edid_block[0x10], subpix_shape, "Reserved"));
	};

	/*
	 * Dot/Pixel Pitch
	 */
	printf("\t  Horizontal Dot/Pixel Pitch: %u.%02u mm\n",
		edid_block[0x11] / 100,
		edid_block[0x11] % 100);
	printf("\t  Vertical Dot/Pixel Pitch:   %u.%02u mm\n",
		edid_block[0x12] / 100,
		edid_block[0x12] % 100);

	/*
	 * Major Display Device Characteristics
	 */
	{
		const char *const view_direction[4] = {
		    "Not specified",
		    "Direct View",
		    "Reflected View",
		    "Directed & Reflected View"
		};
		const char *const phys_implementation[4] = {
		    "Not specified",
		    "Large image device (group viewing)",
		    "Desktop or personal display",
		    "Eyepiece type personal display"
		};
		printf("\t  Fixed Pixel Format:         %s\n",
			FBC_YES_NO(edid_block[0x13], 0x80));
		printf("\t  View Direction:             %s\n",
		       view_direction[(edid_block[0x13] >> 5) & 0x03]);
		printf("\t  Transparent Background:     %s\n",
			FBC_YES_NO(edid_block[0x13], 0x10));
		printf("\t  Physical Implementation:    %s\n",
			phys_implementation[(edid_block[0x13] >> 2) & 0x03]);
		printf("\t  DDC/CI support:             %s\n",
			FBC_YES_NO(edid_block[0x13], 0x02));
	};

}	/* fbc_predid_diext_display_device() */


/*
 * fbc_predid_diext_capabilities()
 *
 *    Display Capabilities & Feature Support Set (analog and/or digital)
 */

void
fbc_predid_diext_capabilities(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x14) */
	unsigned int	end_addr)	/* Ending   byte address (0x36) */
{
	unsigned int	frequency;	/* Frame Rate Conversion frequency */

	/*
	 * Miscellaneous Display Capabilities
	 */
	printf("\t  Legacy Timing Mode support: %s\n",
				FBC_YES_NO(edid_block[0x14], 0x80));
	{
		const fbc_tag_str_t stereo_video[] = {
		    { 0, "No direct stereo"				},
		    { 1, "Field seq. stereo via stero sync signal"	},
		    { 2, "Auto-stereoscopic, column interleave"		},
		    { 3, "Auto-stereoscopic, line interleave"		},
		    { 0, NULL						}
		};
		printf("\t  Stereo Video:               %s\n",
			fbc_predid_tagged_string(
					(edid_block[0x14] >> 4) & 0x07,
					stereo_video,
					"Reserved"));
	}
	printf("\t  Scaler On Board:            %s\n",
				FBC_YES_NO(edid_block[0x14], 0x08));
	printf("\t  Image Centering:            %s\n",
				FBC_YES_NO(edid_block[0x14], 0x04));
	printf("\t  Conditional Update:         %s\n",
				FBC_YES_NO(edid_block[0x14], 0x02));
	printf("\t  Interlaced Video:           %s\n",
				FBC_YES_NO(edid_block[0x14], 0x01));

	/*
	 * Frame Lock and Frame Rate Conversion
	 */
	printf("\t  Frame Lock Support:         %s\n",
				FBC_YES_NO(edid_block[0x15], 0x80));
	{
		const char *const frame_rate_cnv[4] = {
		    "Not supported",
		    "Vertical converted to single frequency",
		    "Horizontal converted to single frequency",
		    "Vert & Horiz converted to single freqs"
		};
		printf("\t  Frame Rate Conversion:      %s\n",
			frame_rate_cnv[(edid_block[0x15] >> 5) & 0x03]);
	}

	frequency = sun_edid_get_le_short(&edid_block[0x16]);
	printf("\t  Vertical Frequency:         %u.%02u Hz%s\n",
		frequency / 100,
		frequency % 100,
		(frequency == 0xFFFF) ? " (Reserved)" : "");
	frequency = sun_edid_get_le_short(&edid_block[0x18]);
	printf("\t  Horizontal Frequency:       %u.%02u Hz%s\n",
		frequency / 100,
		frequency % 100,
		(frequency == 0xFFFF) ? " (Reserved)" : "");

	/*
	 * Display/Scan Orientation
	 */
	{
		const char *const display_orientation[4] = {
		    "Not defined",
		    "Fixed orientation (doesn't rotate)",
		    "Rotates (single EDID extension table)",
		    "Rotates (multiple EDID extension tables)"
		};
		printf("\t  Display/Scan Orientation:   %s\n",
			display_orientation[(edid_block[0x1A] >> 6) & 0x03]);
	}
	{
		const char *const screen_orientation[2] = {
		    "Landscape",
		    "Portrait"
		};
		printf("\t  Screen Orientation:         %s\n",
			screen_orientation[(edid_block[0x1A] >> 5) & 0x01]);
	}
	{
		const char *const zero_pixel_loc[4] = {
		    "Upper left",
		    "Upper right",
		    "Lower left",
		    "Lower right"
		};
		printf("\t  Zero Pixel Location:        %s\n",
			zero_pixel_loc[(edid_block[0x1A] >> 3) & 0x03]);
	}
	{
		const char *const scan_direction[4] = {
		    "Not defined",
		    "Fast on Major, Slow on Minor",
		    "Fast on Minor, Slow on Major",
		    "Undefined"
		};
		printf("\t  Scan Direction:             %s\n",
			scan_direction[(edid_block[0x1A] >> 1) & 0x03]);
	}
	printf("\t  Standalone Projector:       %s\n",
				FBC_YES_NO(edid_block[0x1A], 0x01));

	/*
	 * Default Color/Luminescence Coding Description
	 */
	{
		const fbc_tag_str_t def_color_lum[] = {
		    { 0x00, "Not defined"			},
		    { 0x01, "BGR (additive color)"		},
		    { 0x02, "Y/C (S-Video) NTSC"		},
		    { 0x03, "Y/C (S-Video) PAL"			},
		    { 0x04, "Y/C (S-Video) SECAM"		},
		    { 0x05, "YCrCb (4:4:4)"			},
		    { 0x06, "YCrCb (4:2:2)"			},
		    { 0x07, "YCrCb (4:2:0)"			},
		    { 0x08, "YCrCb (Legacy HDTV)"		},
		    { 0x09, "YPbPr (Legacy HDTV)"		},
		    { 0x0A, "YCrCb (Modern HDTV)"		},
		    { 0x0B, "YPbPr (Modern HDTV)"		},
		    { 0x0C, "Y B-Y R-Y BetaCam (Sony)"		},
		    { 0x0D, "Y B-Y R-Y M-2 (Matsushita)"	},
		    { 0x0E, "Monochrome"			},
		    {    0, NULL				}
		};
		printf("\t  Default Color/Luminescence:   %s\n",
			fbc_predid_tagged_string(
				edid_block[0x1B], def_color_lum, "Reserved"));
	}

	/*
	 * Preferred Color/Luminescence Coding Description
	 */
	{
		const fbc_tag_str_t pref_color_lum[] = {
		    { 0x00, "Default Color/Lum only"		},
		    { 0x01, "BGR (additive color)"		},
		    { 0x02, "Y/C (S-Video) xxxx color"		},
		    { 0x03, "Yxx (SMPTE 2xxM) Color Diff)"	},
		    { 0x04, "Monochrome"			},
		    {    0, NULL				}
		};
		printf("\t  Preferred Color/Luminescence: %s\n",
			fbc_predid_tagged_string(
				edid_block[0x1C], pref_color_lum, "Reserved"));
	}

	/*
	 * Color/Luminescence Decoding Capabilities Description
	 */
	{
		const char *const capabilities[16] = {
		    "BGR (additive color)",
		    "Y/C (S-Video) NTSC color",
		    "Y/C (S-Video) PAL color",
		    "Y/C (S-Video) SECAM color",
		    "YCrCb (4:4:4)",
		    "YCrCb (4:2:2)",
		    "YCrCb (4:2:0)",
		    "YCrCb (Legacy HDTV)",
		    "YpbPr (Legacy HDTV)",
		    "YCrCb (Modern HDTV)",
		    "YpbPr (Modern HDTV)",
		    "Y B-Y R-Y BetaCam (Sony)",
		    "Y B-Y R-Y M-2 (Matsushita)",
		    "Monochrome",
		    "Undefined (Bit 1)",
		    "Undefined (Bit 0)"
		};
		printf("\t  Color/Luminescence Decoding Capabilities:\n");
		if ((edid_block[0x1D] | edid_block[0x1E]) == 0x00) {
			printf("\t\tNot defined\n");
		} else {
			int bit_off;	/* Bit offset */
			for (bit_off = 0; bit_off < 16; bit_off += 1) {
				if (sun_edid_bit_set(
						&edid_block[0x1D], bit_off)) {
					printf("\t\t%s\n",
						capabilities[bit_off]);
				}
			}
		}
	}

	/*
	 * Monitor Color Depth
	 */
	printf("\t  Dithering:                  %s\n",
				FBC_YES_NO(edid_block[0x1F], 0x80));
	{
		const char *const color[6] = {
		    "Blue:",
		    "Green:",
		    "Red:",
		    "Cb/Pb:",
		    "Y:",
		    "Cr/Pr:"
		};
		int	i;
		printf("\t  Monitor Color Depth:\n");
		for (i = 0; i < 6; i += 1) {
			printf("\t\t%-6s %2u %s\n",
				color[i],
				edid_block[0x20 + i],
				(edid_block[0x20 + i] == 0x00)
					? "- No Color Depth information"
					: "bits per color");
		}
	}

	/*
	 * Aspect Ratio Conversion Modes
	 */
	{
		const char *const aspect_modes[8] = {
		    "Full mode",
		    "Zoom mode",
		    "Squeeze mode",
		    "Variable (Expand/Shrink) mode",
		    "Reserved (Bit 3)",
		    "Reserved (Bit 2)",
		    "Reserved (Bit 1)",
		    "Reserved (Bit 0)"
		};
		printf("\t  Aspect Ratio Conversion Modes:\n");
		if (edid_block[0x26] == 0x00) {
			printf("\t\tNot supported\n");
		} else {
			int bit_off;	/* Bit offset */
			for (bit_off = 0; bit_off < 8; bit_off += 1) {
				if (sun_edid_bit_set(
						&edid_block[0x26], bit_off)) {
					printf("\t\t%s\n",
						aspect_modes[bit_off]);
				}
			}
		}
	}

	/*
	 * Packetized Digital Video Support Information (reserved)
	 */

}	/* fbc_predid_diext_capabilities() */


/*
 * fbc_predid_diext_gamma()
 *
 *    Display Transfer Characteristic - Gamma (analog and/or digital)
 */

void
fbc_predid_diext_gamma(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x51) */
	unsigned int	end_addr)	/* Ending   byte address (0x7E) */
{
	const char *const curve_white[] =
			{ "White", NULL };
	const char *const curve_color[] =
			{ "Color 0", "Color 1", "Color 2", NULL };
	unsigned int	addr;		/* Curve byte address */
	const char *const *curve_name;	/* White or color curve name */
	unsigned int	entries;	/* Number of Luminance Entries */
	int		i;		/* Loop counter / entry number */
	unsigned int	max_entries;	/* Max number of Luminance Entries */

	printf("\t  Combined or Separate:  ");
	curve_name  = &curve_white[0];
	max_entries = 45;
	switch (edid_block[0x51] >> 6) {
	case 0:
		printf("Not defined\n");
		return;
	case 1:
		printf("Single White Curve\n");
		break;
	case 2:
		printf("Three Color Curves\n");
		curve_name  = &curve_color[0];
		max_entries = 15;
		break;
	case 3:
		printf("Reserved\n");
		return;
	}

	entries = edid_block[0x51] & 0x3F;
	printf("\t  Luminance Entries:     %u\n", entries);
	if (entries > max_entries) {
		entries = max_entries;	/* Avoid using invalid EDID data */
	}

	addr = 0x52;
	for (; *curve_name != NULL; curve_name += 1) {
		printf("\t  %s Curve:", *curve_name);
		for (i = 0; i < entries; i += 1) {
			printf(((i % 16) == 0) ? "\n\t\t" : " ");
			printf("%02X", edid_block[addr + i]);
		}
		putchar('\n');
		addr += 15;		/* For next color curve */
	}

}	/* fbc_predid_diext_gamma() */


/* End of fbc_predid_diext.c */
