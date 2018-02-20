/*
 * Copyright (c) 2006, 2012, Oracle and/or its affiliates. All rights reserved.
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

#include "libvtsSUNWmga.h"	/* Common VTS library definitions */


return_packet *
mga_test_dma(
    register int const fd)
{
	static return_packet rp;

	memset(&rp, 0, sizeof (return_packet));

	TraceMessage(VTS_DEBUG, "mga_test_dma",
	    "mga_test_dma running\n");

	mga_block_signals();

	mga_lock_display();

	dma_test(&rp, fd);

	TraceMessage(VTS_DEBUG, "mga_test_dma",
	    "mga_dma_memory completed\n");

	mga_unlock_display();

	mga_restore_signals();

	return (&rp);
}


int
dma_test(
    register return_packet *const rp,
    register int const fd)
{
	register int y;
	register int height;
	register int maxwidth;
	register int maxheight;
	register uint32_t fg;
	register uint32_t bg;

	memset(&mga_info, 0, sizeof (mga_info));
	mga_info.mga_fd = fd;

	if (mga_map_mem(rp, GRAPHICS_ERR_DMA) != 0) {
		close(fd);
		return (-1);
	}

	if (mga_init_info(rp, GRAPHICS_ERR_DMA) != 0) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	/* We need to be in mga mode. */

	if (!mga_mgamode()) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		close(fd);
		return (0);
	}

	if (!mga_init_graphics()) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		close(fd);
		return (0);
	}

	mga_save_palet();
	mga_set_palet();

	fg = mga_color(0xff, 0x00, 0x00);
	bg = mga_color(0xff, 0xff, 0xff);

	/* Do pattern fill */

	/*
	 * Can only transfer 0x40000 (262144) pixels, probably due
	 * to limit of the ar0 register.
	 */

	maxwidth = (mga_info.mga_width + 31) / 32 * 32;
	if (maxwidth == 0)
		maxheight = MGA_AR0_MASK + 1;
	else
		maxheight = (MGA_AR0_MASK + 1) / maxwidth;

	for (y = 0; y < mga_info.mga_height; y += height) {
		if (y + maxheight > mga_info.mga_height)
			height = mga_info.mga_height - y;
		else
			height = maxheight;

		if (!mga_fill_pattern_rect(0, y,
		    mga_info.mga_width, y + height,
		    fg, bg, 0x77ddbbee77ddbbee)) {
			mga_restore_palet();
			mga_finish_graphics();
			mga_unmap_mem(NULL, GRAPHICS_ERR_DMA);
			close(fd);
			return (-1);
		}

	}

	mga_sleep(2);

	mga_restore_palet();
	mga_finish_graphics();

	if (mga_unmap_mem(rp, GRAPHICS_ERR_DMA) != 0) {
		close(fd);
		return (-1);
	}

	if (close(fd) != 0) {
		gfx_vts_set_message(rp, 1, GRAPHICS_ERR_DMA,
		    "error closing device\n");
		return (-1);
	}

	return (0);
}
