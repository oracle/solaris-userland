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

#include "libvtsSUNWast.h"	/* VTS library definitions for ast device */

/*
 * ast_test_chip()
 *
 *    Test Chip, functional tests.
 */

return_packet *
ast_test_chip(
    register int const fd)
{
	static return_packet rp;

	memset(&rp, 0, sizeof (return_packet));

	if (gfx_vts_debug_mask & GRAPHICS_VTS_CHIP_OFF)
		return (&rp);

	TraceMessage(VTS_DEBUG, "ast_test_chip",
	    "ast_test_chip running\n");

	ast_block_signals();

	ast_lock_display();

	chip_test(&rp, fd);

	ast_unlock_display();

	ast_restore_signals();

	TraceMessage(VTS_DEBUG, "ast_test_chip",
	    "ast_test_chip completed\n");

	return (&rp);

}       /* ast_test_chip() */


int
chip_test(
    register return_packet *const rp,
    register int const fd)
{
	register uint_t black;
	register uint_t white;

	memset(&ast_info, 0, sizeof (ast_info));
	ast_info.ast_fd = fd;

	if (ast_map_mem(rp, GRAPHICS_ERR_CHIP) != 0)
		return (-1);

	if (ast_init_info(rp, GRAPHICS_ERR_CHIP) != 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (ast_init_graphics() < 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (0);
	}

	if (ast_save_palet() < 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (0);
	}

	if (ast_set_palet() < 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (0);
	}

	/* Clear screen black */

	black = ast_color(0x00, 0x00, 0x00);
	if (!ast_fill_solid_rect(0, 0,
	    ast_info.ast_width, ast_info.ast_height, black)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (!ast_wait_idle()) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	/* line test */

	if (!draw_lines(ast_info.ast_width, ast_info.ast_height)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (!ast_wait_idle()) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (ast_sleep(2)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	/* fill rectangle test */

	if (!draw_cascaded_box(ast_info.ast_width, ast_info.ast_height)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (!ast_wait_idle()) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (ast_sleep(2)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	/* Clear screen white */

	white = ast_color(0xff, 0xff, 0xff);
	if (!ast_fill_solid_rect(0, 0,
	    ast_info.ast_width, ast_info.ast_height, white)) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	if (!ast_wait_idle()) {
		ast_restore_palet();
		ast_finish_graphics();
		ast_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		return (-1);
	}

	ast_sleep(2);

	ast_restore_palet();
	ast_finish_graphics();

	/*
	 * Unmap the registers & frame buffers memory
	 */

	if (ast_unmap_mem(rp, GRAPHICS_ERR_CHIP) != 0)
		return (-1);

	return (0);
}
int
draw_lines(
    register uint_t const width,
    register uint_t const height)
{
	register uint_t x1;
	register uint_t y1;
	register uint_t x2;
	register uint_t y2;
	register uint_t color;
	register uint_t lineon;
	register uint_t const numlines = 128;

	for (lineon = 0; lineon < numlines; lineon++) {
		color = ast_color(0xaf, lineon, lineon);

		x1 = (uint_t)((width * lineon) / numlines);
		x2 = x1;
		y1 = 0;
		y2 = height;

		if (!ast_draw_solid_line(x1, y1, x2, y2, color))
			return (0);
	}

	for (lineon = 0; lineon < numlines; lineon++) {
		color = ast_color(0xaf, lineon, lineon);

		x1 = 0;
		x2 = width;
		y1 = (uint_t)((height * lineon) / numlines);
		y2 = y1;

		if (!ast_draw_solid_line(x1, y1, x2, y2, color))
			return (0);
	}
	return (1);
}

int
draw_cascaded_box(
    register uint_t const width,
    register uint_t const height)
{
	register uint_t x1;
	register uint_t y1;
	register uint_t x2;
	register uint_t y2;
	register uint_t color;
	register uint_t recton;
	register uint_t const numrects = 256;

	for (recton = 0; recton < numrects; recton++) {

		x1 = (uint_t)((width * recton) / 512);
		x2 = width - x1;

		y1 = (uint_t)((height * recton) / 512);
		y2 = height - y1;

		color = ast_color(recton, recton, recton);

		if (!ast_fill_solid_rect(x1, y1, x2, y2, color))
			return (0);
	}

	return (1);
}
