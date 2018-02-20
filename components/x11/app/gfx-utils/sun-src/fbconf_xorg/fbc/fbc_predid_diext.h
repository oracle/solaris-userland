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



#ifndef FBC_PREDID_DIEXT_H
#define	FBC_PREDID_DIEXT_H


#include <sys/types.h>		/* uint8_t, uint16_t, uint32_t */ 


void fbc_predid_diext_display_interface(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x02) */
	unsigned int	end_addr);	/* Ending   byte address (0x0D) */

void fbc_predid_diext_display_device(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x0E) */
	unsigned int	end_addr);	/* Ending   byte address (0x13) */

void fbc_predid_diext_capabilities(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x14) */
	unsigned int	end_addr);	/* Ending   byte address (0x36) */

void fbc_predid_diext_gamma(
	const uint8_t	edid_block[],	/* EDID DI-EXT Extension block */
	unsigned int	start_addr,	/* Starting byte address (0x51) */
	unsigned int	end_addr);	/* Ending   byte address (0x7E) */


#endif	/* FBC_PREDID_DIEXT_H */


/* End of fbc_predid_diext.h */
