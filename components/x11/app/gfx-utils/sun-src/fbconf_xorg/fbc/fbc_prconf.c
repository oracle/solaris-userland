/*
 * Copyright (c) 2004, 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_prconf - Display current hardware configuration
 */


#include <ctype.h>		/* isprint() */
#include <stdio.h>		/* printf(), putchar() */
#include <string.h>		/* strlen(), strstr() */
#include <unistd.h>		/* ioctl() */

#include "gfx_common.h"		/* Model name, part number, cur video mode */

#include "sun_edid.h"		/* EDID data parsing */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_prconf.h"		/* Display current hardware configuration */


static const char *const FBC_Unavailable = "Unavailable";


/*
 * fbc_prconf_model()
 *
 *    Display the frame buffer model name and part number.
 */

void
fbc_prconf_model(
	int		device_fd)	/* Device file descriptor number */
{
	const char *const SUNW_ = "SUNW,"; /* Prefix on model & part strings */
	struct gfx_identifier gfx_ident; /* Graphics identifier */
	const char	*model_name;	/* Frame buffer model name */
	const char	*part_number;	/* Frame buffer part number */

	/*
	 * Display the model name and part number
	 */
	model_name  = FBC_Unavailable;
	part_number = FBC_Unavailable;
	if (ioctl(device_fd, GFX_IOCTL_GET_IDENTIFIER, &gfx_ident) >= 0) {
		if (gfx_ident.flags & GFX_IDENT_MODELNAME) {
			model_name = &gfx_ident.model_name[0];
			if (strstr(model_name, SUNW_) != NULL) {
				model_name += strlen(SUNW_);
			}
		}
		if (gfx_ident.flags & GFX_IDENT_PARTNUM) {
			part_number = &gfx_ident.part_number[0];
			if (strstr(part_number, SUNW_) != NULL) {
				part_number += strlen(SUNW_);
			}
		}
	}
	printf("Model name:  %s\n", model_name);
	printf("Part number: %s\n", part_number);

}	/* fbc_prconf_model() */


/*
 * fbc_prconf_edid_product_id()
 *
 *    Display the Vendor & Product Identification, etc. found in the
 *    EDID Base block.
 */

static
void
fbc_prconf_edid_product_id(
	uint8_t		edid_data[])	/* EDID Base block */
{
	uint16_t	product_code;	/* ID Product Code */
	uint32_t	serial_num;	/* ID Serial Number, else zero */
	char		string_buf[14];	/* ID Manufacturer, Serial #, etc. */
	int		week;		/* Week of Manufacture (or flag) */
	int		year;		/* Year of Manufacture or Model Year */

	sun_edid_vendor(edid_data, string_buf, &product_code, &serial_num);
	printf(FBC_PR_INDENT "Monitor manufacturer: %s\n", string_buf);

	printf(FBC_PR_INDENT "Product Code:  %u\n", product_code);
	if (sun_edid_product_name(edid_data, string_buf) == 0) {
		printf(FBC_PR_INDENT "Product Name:  %s\n", string_buf);
	}

	if ((sun_edid_serial_number(edid_data, string_buf) == 0) ||
	    (serial_num != 0)) {
		printf(FBC_PR_INDENT "Serial Number:");
		if (serial_num != 0) {
			printf(" %u", serial_num);
		}
		if (string_buf[0] != '\0') {
			printf(" %s", string_buf);
		}
		putchar('\n');
	}

	sun_edid_mdate(edid_data, &week, &year);
	if (week == 0xFF) {
		printf(FBC_PR_INDENT "Model year:    %d\n", year);
	} else {
		printf(FBC_PR_INDENT "Manufacture date: %d", year);
		if (week != 0) {
			printf(", week %d", week);
		}
		putchar('\n');
	}

}	/* fbc_prconf_edid_product_id() */


/*
 * fbc_prconf_edid_version()
 *
 *    Display the EDID Structure Version & Revision, obtained from EDID
 *    Base block bytes 0x12 and 0x13, respectively.
 */

static
void
fbc_prconf_edid_version(
	uint8_t		edid_data[])	/* EDID Base block */
{

	printf(FBC_PR_INDENT "EDID Version:  %u.%u\n",
		edid_data[0x12],	/* EDID version byte */
		edid_data[0x13]);	/* EDID revision byte */

}	/* fbc_prconf_edid_version() */


/*
 * fbc_prconf_edid_basic_display()
 *
 *    Display the Basic Display Parameters & Features of the display
 *    device.  This is obtained from the EDID Base block.
 */

static
void
fbc_prconf_edid_basic_display(
	uint8_t		edid_data[])	/* EDID Base block */
{
	float		aspect;		/* Aspect ratio, else zero */
	float		gamma;		/* Gamma value, else zero */
	int		horizontal;	/* Horizontal screen size (cm), etc. */
	int		vertical;	/* Vertical screen size (cm), etc. */
	sun_edid_viddef_t video_def;	/* Video Input Definition */

#if (0)	/* Made redundant by -predid */
	/*
	 * Video Input Definition (sync support info)
	 *
	 *    Check for Analog Video Signal Interface
	 */
	sun_edid_video_input(edid_data, &video_def);
	if (!video_def.digital) {
		const char *const Supported      = "Supported";
		const char *const Not_supported  = "Not supported";

		/*
		 * Display Synchronization Types for this analog display device
		 */
		printf(FBC_PR_INDENT
			"Separate sync H & V signals:  %s\n",
			(video_def.alg.sync_separate) ?
				Supported : Not_supported);
		printf(FBC_PR_INDENT
			"Composite sync on Horizontal: %s\n",
			(video_def.alg.sync_composite) ?
				Supported : Not_supported);
		printf(FBC_PR_INDENT
			"Composite sync on Green:      %s\n",
			(video_def.alg.sync_green) ?
				Supported : Not_supported);
	}

#endif	/* Made redundant by -predid */
	/*
	 * Horizontal & Vertical Screen Size or Aspect Ratio
	 *
	 *    The returned aspect ratio value (introduced in EDID 1.4)
	 *    is only valid iff positive.  Aspect ratios are rounded to
	 *    the hundredth decimal place.
	 */
	sun_edid_screen_size(edid_data, &horizontal, &vertical, &aspect);
	if ((horizontal != 0) && (vertical != 0)) {
		printf(FBC_PR_INDENT "Monitor dimensions: %dx%d cm\n",
			horizontal, vertical);
	} else
	if (aspect > 0.0) {
		if (horizontal != 0) {
			printf(FBC_PR_INDENT
				"Monitor aspect ratio (Landscape): %4.2f:1\n",
				aspect);
		} else {
			printf(FBC_PR_INDENT
				"Monitor aspect ratio (Portrait): %4.2f:1\n",
				aspect);
		}
	}

	/*
	 * Display Transfer Characteristic (Gamma)
	 */
	sun_edid_gamma(edid_data, &gamma);
	if (gamma > 0.0) {
		printf(FBC_PR_INDENT "Default Gamma: %4.2f\n", gamma);
	}

}	/* fbc_prconf_edid_basic_display() */


/*
 * fbc_prconf_edid_display_descriptor()
 *
 *    Display any EDID Display Descriptor information that isn't handled
 *    elsewhere.
 */

static
void
fbc_prconf_edid_display_descriptor(
	uint8_t		edid_data[])	/* EDID Base block */
{
	char		string_buf[14];	/* Display Descriptor strings buffer */

	if (sun_edid_alphanum_data(edid_data, string_buf) == 0) {
		printf(FBC_PR_INDENT "Alphanumeric Data String: %s\n",
			string_buf);
	}

}	/* fbc_prconf_edid_display_descriptor() */


/*
 * fbc_prconf_edid_modes()
 *
 *    Display the list of display-supported resolution names obtained
 *    from EDID timings data.  The caller must have made sure that the
 *    list exists.  Mode names can be filtered (excluded or substituted)
 *    based on the edid_mode_mods[] array.
 */

static
void
fbc_prconf_edid_modes(
	sun_edid_mode_t	*edid_mode)	/* Display-supported video modes */
{
	const char	*comma_str;	/* Label string or "," */
	size_t		len;		/* Length of Space & mode name */
	size_t		line_len;	/* Line length in text columns */
	const char	*mode_name;	/* EDID video mode name */

	/*
	 * Display the preferred video mode of the display device
	 *
	 *    The display's Preferred Timing Mode should be encoded in
	 *    the first Detailed Timing Descriptor in the EDID Base
	 *    block.  This yeilds the preferred video mode, which should
	 *    be stored in the first element of the edid_mode[] array.
	 *    An empty mode name string ("") means that no Preferred
	 *    Timing was specified (e.g. pre EDID 1.1).
	 */
	mode_name = edid_mode->name;
	if (*mode_name != '\0') {
		printf(FBC_PR_INDENT "Monitor preferred resolution: %s\n",
			mode_name);
	}

	/*
	 * Display the video modes supported by the display device
	 *
	 *    Which mode names will get past the filter isn't yet known.
	 *    Hypothetically, no names might be displayed.  A suitable
	 *    generalization is wanted.
	 *
	 *    A comma preceeds each video mode name except for the
	 *    first.  The first video mode name is preceded by the
	 *    "supported resolutions" label.  The label will be treated
	 *    as an honorary comma so that the loop will be able to
	 *    handle each mode name in the same way.
	 */
	comma_str = FBC_PR_INDENT "Monitor supported resolutions from EDID:";
	line_len  = 0;
	for (; edid_mode->name != NULL; edid_mode += 1) {
		mode_name = edid_mode->name;
		if (*mode_name == '\0') {
			continue;	/* Video mode has been filtered out */
		}
		printf("%s", comma_str); /* Resolutions label string or "," */
		line_len += strlen(comma_str);
		comma_str = ",";
		len = 1 + strlen(mode_name); /* " " & mode_name */
		if (line_len + len + 1 >= FBC_MAX_LINE_LEN) {  /* 1 for "," */
			printf("\n" FBC_PR_INDENT "   ");  /* NL & 7 Spaces */
			line_len =  FBC_PR_INDENT_LEN + 3; /* 7 now, 1 later */
		}
		printf(" %s", mode_name);	/* One Space & mode name */
		line_len += len;
	}
	if (line_len > 0) {
		putchar('\n');
	}

}	/* fbc_prconf_edid_modes() */


/*
 * fbc_prconf_edid()
 *
 *    Display the EDID information for this video stream's display device.
 */

void
fbc_prconf_edid(
	uint8_t		*edid_data,	/* EDID Base & Extension blocks */
	size_t		edid_length,	/* EDID data block(s) length */
	fbc_mode_elem_t	*mode_list)	/* Modes from configuration file */
{
	int		block_num;	/* Zero, else bad Extension block # */
	sun_edid_mode_t	*edid_modes;	/* Display-supported video modes */

#if defined(FBC_EDID_TEST_DATA)
#include "fbc_edid_test_data.h"	/* EDID test data */
#endif

	/*
	 * Validate the EDID Base block and any Extension blocks
	 *
	 *    The Base block is needed in order for this function to do
	 *    anything.  Extension blocks aren't used in the current
	 *    implementation.
	 */
	if (sun_edid_check_base(edid_data, edid_length) != 0) {
		printf(FBC_PR_INDENT
			"EDID Data: EDID Base block is not available\n");
		return;
	}
	block_num = sun_edid_check_extensions(edid_data, edid_length);
	if (block_num != 0) {
		printf(FBC_PR_INDENT
			"EDID Data: Error near EDID Extension block #%d\n",
			block_num);
	}

	/*
	 * Display Vendor & Product ID, Version, Basic Display Params, etc.
	 */
	fbc_prconf_edid_product_id(edid_data);
	fbc_prconf_edid_version(edid_data);
	fbc_prconf_edid_display_descriptor(edid_data);
	fbc_prconf_edid_basic_display(edid_data);

	/*
	 * Get the EDID video mode names for this stream's display device
	 */
	edid_modes = sun_edid_video_modes(edid_data, edid_length, mode_list);

	/*
	 * Display the display-supported video modes (possibly filtered)
	 */
	if ((edid_modes != NULL) && (edid_modes->name != NULL)) {
		fbc_prconf_edid_modes(edid_modes);
	}

	sun_edid_video_modes_free(edid_modes);

}	/* fbc_prconf_edid() */


/*
 * fbc_prconf_cur_mode()
 *
 *    Display the current video mode setting.
 */

void
fbc_prconf_cur_mode(
	int		device_fd)	/* Device file descriptor number */
{
	struct gfx_video_mode gfx_vid_mode; /* Current video mode info */
	const char	*mode_name;	/* Current video mode name */

	/*
	 * Display the current video mode setting
	 */
	mode_name = FBC_Unavailable;
	if (ioctl(device_fd,
		    GFX_IOCTL_GET_CURRENT_VIDEO_MODE,
		    &gfx_vid_mode) >= 0) {
		mode_name = &gfx_vid_mode.mode_name[0];
	}
	printf(FBC_PR_INDENT "Current resolution setting: %s\n", mode_name);

}	/* fbc_prconf_cur_mode() */


/* End of fbc_prconf.c */
