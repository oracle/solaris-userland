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
 * fbc_predid_vtbext - Display EDID VTB-EXT data
 */


#include <sys/types.h>		/* uint8_t */
#include <stdio.h>		/* printf() */

#include "fbc_predid.h"		/* Display EDID data */
#include "fbc_predid_vtbext.h"	/* Display EDID VTB-EXT data */


/*
 * Conversions from EDID flag bit value to output text string
 */
static const char	*const fbc_No  = "No";
static const char	*const fbc_Yes = "Yes";

#define	FBC_YES_NO(_byte, _mask) \
		((_byte) & (_mask)) ? fbc_Yes : fbc_No


/*
 * fbc_predid_vtbext_layout()
 *
 *    VTB Data Structure Layout
 */

void
fbc_predid_vtbext_layout(
	const uint8_t	edid_block[],	/* EDID VTB-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x02) */
	unsigned int	end_addr)	/* Ending   byte address (0x04) */
{

	/*
	 * VTB Data Structure Layout
	 */
	printf("\t  Detailed Timing Blocks:                %u\n",
		edid_block[0x02]);
	printf("\t  Coordinated Video Timing Descriptions: %u\n",
		edid_block[0x03]);
	printf("\t  Standard Timings Descriptions:         %u\n",
		edid_block[0x04]);

}	/* fbc_predid_vtbext_layout() */


/*
 * fbc_predid_coord_video_timing()
 *
 *    Coordinated Video Timing (CVT) Descriptions.
 */

static
void
fbc_predid_coord_video_timing(
	const uint8_t	edid_block[],	/* EDID VTB-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x0E) */
	unsigned int	end_addr)	/* Ending   byte address (0x13) */
{

	printf("\t  Active vertical lines (VSize): %u\n",
	       (((unsigned int)edid_block[start_addr + 1] & 0xF0) << 4)
					| edid_block[start_addr + 0]);
	{
		const char *const aspect_ratio[4] = {
		    "4:3",
		    "16:9",
		    "16:10",
		    "Undefined (reserved)"
		};
		printf("\t  Aspect ratio:                  %s\n",
		       aspect_ratio[(edid_block[start_addr + 1] >> 2) & 0x03]);
	}
	{
		const char *const preferred_rate[4] = {
		    "50",
		    "60",
		    "75",
		    "85"
		};
		printf("\t  Preferred refresh rate:        %s Hz\n",
			preferred_rate[(edid_block[start_addr + 2] >> 5)
							& 0x03]);
	}
	printf("\t  Supported refresh rates:\n");
	printf("\t\t50 Hz:                   %s\n",
		FBC_YES_NO(edid_block[start_addr + 2], 0x10));
	printf("\t\t60 Hz:                   %s\n",
		FBC_YES_NO(edid_block[start_addr + 2], 0x08));
	printf("\t\t75 Hz:                   %s\n",
		FBC_YES_NO(edid_block[start_addr + 2], 0x04));
	printf("\t\t85 Hz:                   %s\n",
		FBC_YES_NO(edid_block[start_addr + 2], 0x02));
	printf("\t\t60 Hz Reduced Blanking:  %s\n",
		FBC_YES_NO(edid_block[start_addr + 2], 0x01));

}	/* fbc_predid_coord_video_timing() */


/*
 * fbc_predid_vtbext_data()
 *
 *    Video Timing Block (VTB) free format data bytes.
 */

void
fbc_predid_vtbext_data(
	const uint8_t	edid_block[],	/* EDID VTB-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	unsigned int	e_addr;		/* Ending   byte addr of description */
	unsigned int	i;		/* DTB/CVT/ST loop counter */
	unsigned int	s_addr;		/* Starting byte addr of description */

	/*
	 * Start of VTB data area
	 */
	s_addr = 0x05;

	/*
	 * Detailed Timing Blocks (DTB)
	 */
	printf("    Detailed Timing Blocks (DTB)\n");
	for (i = 1; i <= edid_block[0x02]; i += 1) {
		e_addr = s_addr + 18 - 1;
		if (e_addr >= 0x7F) {
			break;
		}
		printf("      Detailed Timing Block #%u\n", i);
		fbc_predid_det_timing(edid_block, s_addr, e_addr);
		fbc_predid_dump_bytes(edid_block, s_addr, e_addr);
		s_addr += 18;		/* 0x12=18 bytes per DTB */
	}

	/*
	 * Coordinated Video Timing (CVT) Descriptions
	 */
	printf("    Coordinated Video Timing (CVT) Descriptions\n");
	for (i = 1; i <= edid_block[0x03]; i += 1) {
		e_addr = s_addr + 3 - 1;
		if (e_addr >= 0x7F) {
			break;
		}
		printf("      CVT Descriptor #%u\n", i);
		fbc_predid_coord_video_timing(edid_block, s_addr, e_addr);
		fbc_predid_dump_bytes(edid_block, s_addr, e_addr);
		s_addr += 3;		/* 3 bytes per CVT */
	}

	/*
	 * Standard Timings (ST) Descriptions
	 */
	printf("    Standard Timings (ST) Descriptions\n");
	e_addr = s_addr + edid_block[0x04] * 2 - 1; /* 2 bytes per ST */
	if (e_addr >= 0x7F) {
		e_addr = 0x7F;		/* Avoid overruns */
	}
	fbc_predid_std_timings(edid_block, s_addr, e_addr);
	fbc_predid_dump_bytes(edid_block, s_addr, e_addr);

	/*
	 * Unused Bytes
	 */
	printf("    Unused Bytes (Reserved)\n");
	fbc_predid_dump_bytes(edid_block, e_addr + 1, 0x7F - 1);

}	/* fbc_predid_vtbext_data() */


/* End of fbc_predid_vtbext.c */
