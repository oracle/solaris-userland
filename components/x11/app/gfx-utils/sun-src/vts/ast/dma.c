/*
 * Copyright (c) 2006, 2013, Oracle and/or its affiliates. All rights reserved.
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

#include "libvtsSUNWast.h"

/*
 * ast_test_dma
 *
 *    This test will open the device, allocate the dma buffers to
 *    separate memory spaces, and read/write the data, verifying it.
 */

return_packet *
ast_test_dma(
    register int const fd)
{
	static return_packet rp;

	memset(&rp, 0, sizeof (return_packet));

	TraceMessage(VTS_DEBUG, "ast_test_dma",
	    "ast_test_dma running\n");

	ast_block_signals();

	ast_lock_display();

	dma_test(&rp, fd);

	TraceMessage(VTS_DEBUG, "ast_test_dma",
	    "ast_test_dma completed\n");

	ast_unlock_display();

	ast_restore_signals();

	return (&rp);
}


int
dma_test(
    register return_packet *const rp,
    register int const fd)
{
	register uint_t fg;
	register uint_t bg;

	memset(&ast_info, 0, sizeof (ast_info));
	ast_info.ast_fd = fd;

	/*
	 * map the registers & frame buffers memory
	 */
	if (ast_map_mem(rp, GRAPHICS_ERR_DMA) != 0)
		return (-1);

	if (ast_init_info(rp, GRAPHICS_ERR_DMA) != 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		return (-1);
	}

	if (ast_init_graphics() < 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		return (-1);
	}

	if (ast_save_palet() < 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		return (-1);
	}

	if (ast_set_palet() < 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		return (-1);
	}

	fg = ast_color(0xff, 0x00, 0x00);
	bg = ast_color(0xff, 0xff, 0xff);

	/* Do pattern fill */

	if (!ast_fill_pattern_rect(0, 0,
	    ast_info.ast_width, ast_info.ast_height,
	    fg, bg, 0x77ddbbee77ddbbee)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		return (-1);
	}

	if (!ast_wait_idle()) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_DMA);
		return (-1);
	}

	ast_sleep(2);

	ast_restore_palet();
	ast_finish_graphics();

	if (ast_unmap_mem(rp, GRAPHICS_ERR_DMA) != 0)
		return (-1);

	return (0);
}
