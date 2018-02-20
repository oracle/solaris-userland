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
 * fbc_predid_ceaext - Display EDID CEA-EXT data
 */


#include <sys/types.h>		/* uint8_t */
#include <stdio.h>		/* printf() */

#include "fbc_predid.h"		/* Display EDID data */
#include "fbc_predid_ceaext.h"	/* Display EDID CEA-EXT data */


/*
 * fbc_predid_ceaext_layout()
 *
 *    CEA-EXT Data Structure Layout
 */

void
fbc_predid_ceaext_layout(
	const uint8_t	edid_block[],	/* EDID CEA-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x02) */
	unsigned int	end_addr)	/* Ending   byte address (0x04) */
{

	/*
	 * CEA 861 Series Extension (CEA-EXT) layout
	 */
	printf("\t  Detailed Timing Descriptor offset:  0x%02X\n",
		edid_block[0x02]);

}	/* fbc_predid_ceaext_layout() */


/*
 * fbc_predid_ceaext_xxx(
 *
 *    ??? Need the CEA 861 Series Extension (CEA-EXT) spec in order to
 *    ??? interpret these bytes.
 */

void
fbc_predid_ceaext_xxx(
	const uint8_t	edid_block[],	/* EDID CEA-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	unsigned int	e_addr;		/* Ending byte address */

	printf("    CEA 861 Series data\n");
	e_addr = 0x02 + edid_block[0x02];
	if (e_addr > 0x7F) {
		e_addr = 0x7F;
	}
	fbc_predid_dump_bytes(edid_block, 0x03, e_addr - 1);

}	/* fbc_predid_ceaext_xxx() */


/*
 * fbc_predid_ceaext_data()
 *
 *    CEA 861 Series Extension (CEA-EXT) free format data bytes.
 */

void
fbc_predid_ceaext_data(
	const uint8_t	edid_block[],	/* EDID CEA-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address */
	unsigned int	end_addr)	/* Ending   byte address */
{
	unsigned int	e_addr;		/* Ending byte address */
	unsigned int	i;		/* Detailed Timing Block # */
	unsigned int	s_addr;		/* Starting byte address */

	/*
	 * Detailed Timing Descriptors (??? or 18-Byte Data Blocks ???)
	 *
	 *    ??? Need the CEA 861 Series Extension (CEA-EXT) spec in
	 *    ??? order to understand how the Video Image Size bytes can
	 *    ??? be interpreted as Displayed Image Aspect Ratio bytes.
	 */
	printf("    Detailed Timing Descriptors\n");
	i = 0;
	for (s_addr = 0x02 + edid_block[0x02]; ; s_addr += 18) {
		e_addr = s_addr + 18 - 1;
		if ((e_addr >= 0x7F) ||
		    ((edid_block[s_addr+0] | edid_block[s_addr+1]) == 0)) {
			break;
		}
		i += 1;
		printf("      Detailed Timing Block #%u\n", i);
		fbc_predid_det_timing(edid_block, s_addr, e_addr);
		fbc_predid_dump_bytes(edid_block, s_addr, e_addr);
	}

	/*
	 * Unused Bytes
	 */
	printf("    Unused Bytes (Reserved)\n");
	fbc_predid_dump_bytes(edid_block, s_addr, 0x7F - 1);

}	/* fbc_predid_ceaext_data() */


/* End of fbc_predid_ceaext.c */
