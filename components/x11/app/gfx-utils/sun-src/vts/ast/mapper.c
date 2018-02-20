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
 * ast_test_open()
 *
 *    This test will open the device, read and write some registers
 *    after mmaping in the register and frame buffer spaces.
 */

return_packet *
ast_test_open(
    register int const fd)
{
	static return_packet rp;
	int rc = 0;
	struct vis_identifier vis_identifier;

	memset(&rp, 0, sizeof (return_packet));

	if (gfx_vts_check_fd(fd, &rp))
		return (&rp);

	TraceMessage(VTS_TEST_STATUS, "ast_test_open", "check_fd passed.\n");

	/* vis identifier will do this */
	rc = ioctl(fd, VIS_GETIDENTIFIER, &vis_identifier);

	TraceMessage(VTS_TEST_STATUS, "ast_test_open", "rc = %d\n", rc);

	if (rc != 0) {
		gfx_vts_set_message(&rp, 1, GRAPHICS_ERR_OPEN, NULL);
		return (&rp);
	}

	if (strncmp(vis_identifier.name, "SUNWast", 7) != 0 &&
	    strncmp(vis_identifier.name, "ORCLast", 7) != 0) {
		gfx_vts_set_message(&rp, 1, GRAPHICS_ERR_OPEN, NULL);
		return (&rp);
	}

	ast_block_signals();

	ast_lock_display();

	map_me(&rp, fd);

	ast_unlock_display();

	ast_restore_signals();

	TraceMessage(VTS_DEBUG, "ast_test_open", "Open completed OK\n");

	return (&rp);

}	/* ast_test_open() */


/*
 * map_me()
 */

int
map_me(
    register return_packet *const rp,
    register int const fd)
{
	unsigned int	 value, chipType;

	memset(&ast_info, 0, sizeof (ast_info));
	ast_info.ast_fd = fd;

	/*
	 * map the registers & frame buffers memory
	 */
	if (ast_map_mem(rp, GRAPHICS_ERR_OPEN) != 0)
		return (-1);

	if (ast_test_scratch(rp, GRAPHICS_ERR_OPEN) != 0) {
		ast_unmap_mem(NULL, GRAPHICS_ERR_OPEN);
		return (-1);
	}
	value = ast_mmio_read32(0x1207c);
	chipType = value & 0x0300;
	TraceMessage(VTS_DEBUG, "ast_test_chip",
	    "chip type 0x%x\n", chipType);

	/*
	 * Unmap the registers & frame buffers memory
	 */
	if (ast_unmap_mem(rp, GRAPHICS_ERR_OPEN) != 0)
		return (-1);

	return (0);
}	/* map_me() */


int
ast_test_scratch(
    register return_packet *const rp,
    register int const test)
{
	uchar_t scratch;
	uchar_t newscratch;

	if (ast_get_index_reg(&scratch, CRTC_PORT, 0x90) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get scratch");
		return (-1);
	}

	if (ast_set_index_reg(CRTC_PORT, 0x90, scratch ^ 0x33) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to set scratch");
		return (-1);
	}

	if (ast_get_index_reg(&newscratch, CRTC_PORT, 0x90) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get newscratch");
		return (-1);
	}

	if ((scratch ^ 0x33) != newscratch) {
		gfx_vts_set_message(rp, 1, test, "scratch mismatch");
		return (-1);
	}

	if (ast_set_index_reg(CRTC_PORT, 0x90, scratch) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to set scratch");
		return (-1);
	}

	return (1);
}


/* End of mapper.c */
