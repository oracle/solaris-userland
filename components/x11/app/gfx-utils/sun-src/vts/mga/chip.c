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

#include "libvtsSUNWmga.h"

/*
 * mga_test_chip()
 *
 *    Test Chip, functional tests.
 */

return_packet *
mga_test_chip(
    register int const fd)
{
	static return_packet rp;

	memset(&rp, 0, sizeof (return_packet));

	if (gfx_vts_debug_mask & GRAPHICS_VTS_CHIP_OFF) {
		return (&rp);
	}

	TraceMessage(VTS_DEBUG, "mga_test_chip",
	    "mga_test_chip running\n");

	mga_block_signals();

	mga_lock_display();

	chip_test(&rp, fd);

	mga_unlock_display();

	mga_restore_signals();

	TraceMessage(VTS_DEBUG, "mga_test_chip",
	    "mga_test_chip completed\n");

	return (&rp);

}       /* mga_test_chip() */


int
chip_test(
    register return_packet *const rp,
    register int const fd)
{
	register uint_t black;
	register uint_t white;

	memset(&mga_info, 0, sizeof (mga_info));
	mga_info.mga_fd = fd;

	if (mga_map_mem(rp, GRAPHICS_ERR_CHIP) != 0) {
		close(fd);
		return (-1);
	}

	if (mga_init_info(rp, GRAPHICS_ERR_CHIP) != 0) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	/* We need to be in mga mode. */

	if (!mga_mgamode()) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (0);
	}

	if (!mga_init_graphics()) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (0);
	}

	mga_save_palet();
	mga_set_palet();

	/* Clear screen black */

	black = mga_color(0x00, 0x00, 0x00);
	if (!mga_fill_solid_rect(0, 0,
	    mga_info.mga_width, mga_info.mga_height, black)) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	if (!mga_wait_idle()) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	/* line test */

	if (!draw_lines(mga_info.mga_width, mga_info.mga_height)) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	if (!mga_wait_idle()) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	if (mga_sleep(2)) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	/* fill rectangle test */

	if (!draw_cascaded_box(mga_info.mga_width, mga_info.mga_height)) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	if (!mga_wait_idle()) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	if (mga_sleep(2)) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	/* Clear screen white */

	white = mga_color(0xff, 0xff, 0xff);
	if (!mga_fill_solid_rect(0, 0,
	    mga_info.mga_width, mga_info.mga_height, white)) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	if (!mga_wait_idle()) {
		mga_restore_palet();
		mga_finish_graphics();
		mga_unmap_mem(NULL, GRAPHICS_ERR_CHIP);
		close(fd);
		return (-1);
	}

	mga_sleep(2);

	mga_restore_palet();
	mga_finish_graphics();

	if (mga_unmap_mem(rp, GRAPHICS_ERR_CHIP) != 0) {
		close(fd);
		return (-1);
	}

	if (close(fd) != 0) {
		gfx_vts_set_message(rp, 1, GRAPHICS_ERR_CHIP,
		    "error closing device\n");
		return (-1);
	}

	return (0);
}


int
draw_lines(
    register unsigned int const width,
    register unsigned int const height)
{
	register unsigned int x1;
	register unsigned int y1;
	register unsigned int x2;
	register unsigned int y2;
	register unsigned int color;
	register unsigned int lineon;
	register unsigned int const numlines = 128;

	for (lineon = 0; lineon < numlines; lineon++) {
		color = mga_color(0xaf, lineon, lineon);

		x1 = (unsigned int)((width * lineon) / numlines);
		x2 = x1;
		y1 = 0;
		y2 = height;

		if (!mga_draw_solid_line(x1, y1, x2, y2, color))
			return (0);
	}

	for (lineon = 0; lineon < numlines; lineon++) {
		color = mga_color(0xaf, lineon, lineon);

		x1 = 0;
		x2 = width;
		y1 = (unsigned int)((height * lineon) / numlines);
		y2 = y1;

		if (!mga_draw_solid_line(x1, y1, x2, y2, color))
			return (0);
	}
	return (1);
}

int
draw_cascaded_box(
    register unsigned int const width,
    register unsigned int const height)
{
	register unsigned int x1;
	register unsigned int y1;
	register unsigned int x2;
	register unsigned int y2;
	register unsigned int color;
	register unsigned int recton;
	register unsigned int const numrects = 256;

	for (recton = 0; recton < numrects; recton++) {

		x1 = (unsigned int)((width * recton) / 512);
		x2 = width - x1;

		y1 = (unsigned int)((height * recton) / 512);
		y2 = height - y1;

		color = mga_color(recton, recton, recton);

		if (!box(x1, y1, x2, y2, color))
			return (0);
	}

	return (1);
}


int
box(
    register int const srcx1,
    register int const srcy1,
    register int const srcx2,
    register int const srcy2,
    register unsigned int const color)
{
	register int x1;
	register int y1;
	register int x2;
	register int y2;

	if (srcx1 <= srcx2) {
		x1 = srcx1;
		x2 = srcx2;
	} else {
		x1 = srcx2;
		x2 = srcx1;
	}

	if (srcy1 <= srcy2) {
		y1 = srcy1;
		y2 = srcy2;
	} else {
		y1 = srcy2;
		y2 = srcy1;
	}

	return (mga_fill_solid_rect(x1, y1, x2, y2, color));
}
