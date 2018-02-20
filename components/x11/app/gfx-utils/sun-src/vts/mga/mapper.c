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

/*
 * mga_test_open()
 *
 *    This test will open the device, read and write some registers
 *    after mmaping in the register and frame buffer spaces.
 */

return_packet *
mga_test_open(
    register int const fd)
{
	static return_packet rp;
	int		rc = 0;
	struct vis_identifier vis_identifier;

	memset(&rp, 0, sizeof (return_packet));

	if (gfx_vts_check_fd(fd, &rp)) {
		return (&rp);
	}

	TraceMessage(VTS_TEST_STATUS, "mga_test_open",
	    "check_fd passed.\n");

	rc = ioctl(fd, VIS_GETIDENTIFIER, &vis_identifier);

	TraceMessage(VTS_TEST_STATUS, "mga_test_open",
	    "rc = %d\n", rc);

	if (rc != 0) {
		gfx_vts_set_message(&rp, 1, GRAPHICS_ERR_OPEN, NULL);
		return (&rp);
	}

	if (strcmp(vis_identifier.name, "SUNWmga") != 0 &&
	    strcmp(vis_identifier.name, "ORCLmga") != 0) {
		gfx_vts_set_message(&rp, 1, GRAPHICS_ERR_OPEN, NULL);
		return (&rp);
	}

	mga_block_signals();

	mga_lock_display();

	map_me(&rp, fd);

	mga_unlock_display();

	mga_restore_signals();

	TraceMessage(VTS_DEBUG, "mga_test_open",
	    "Open completed OK\n");

	return (&rp);

}


int
map_me(
    register return_packet *const rp,
    register int const fd)
{
	memset(&mga_info, 0, sizeof (mga_info));
	mga_info.mga_fd = fd;

	if (mga_map_mem(rp, GRAPHICS_ERR_OPEN) != 0) {
		close(fd);
		return (-1);
	}

	if (mga_init_info(rp, GRAPHICS_ERR_OPEN) != 0) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_OPEN);
		close(fd);
		return (-1);
	}

	if (mga_test_status(rp, GRAPHICS_ERR_OPEN) != 0) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_OPEN);
		close(fd);
		return (-1);
	}

	if (!mga_test_cursor(rp, GRAPHICS_ERR_OPEN)) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_OPEN);
		close(fd);
		return (-1);
	}

	if (!mga_test_dac(rp, GRAPHICS_ERR_OPEN)) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_OPEN);
		close(fd);
		return (-1);
	}

	if (mga_unmap_mem(rp, GRAPHICS_ERR_OPEN) != 0) {
		close(fd);
		return (-1);
	}

	if (close(fd) != 0) {
		gfx_vts_set_message(rp, 1, GRAPHICS_ERR_OPEN,
		    "error closing device\n");
		return (-1);
	}

	return (0);
}


#define	STATUS_XOR_VALUE	MGA_STATUS_SWFLAG_MASK

int
mga_test_status(
    register return_packet *const rp,
    register int const test)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint32_t save_status;
	register uint32_t new_status;

	/*
	 * Test the software bits of the status register.
	 * Complement the bits, and see if they read back
	 * complemented.
	 */

	/* Save the original status. */

	save_status = mga_get_uint32(&mgaptr->mga_status);

	/* Write the status with the software bits complemented. */

	mga_put_uint32(&mgaptr->mga_status, save_status ^ STATUS_XOR_VALUE);

	/* Get the new status. */

	new_status = mga_get_uint32(&mgaptr->mga_status);

	/* Restore the old status. */

	mga_put_uint32(&mgaptr->mga_status, save_status);

	/* Check if the software bits did complement. */

	if ((save_status & MGA_STATUS_SWFLAG_MASK) !=
	    ((new_status ^ STATUS_XOR_VALUE) & MGA_STATUS_SWFLAG_MASK)) {
		printf("status 0x%08lx 0x%08lx 0x%08lx\n",
		    (ulong_t) save_status, (ulong_t) new_status,
		    (ulong_t) save_status ^ STATUS_XOR_VALUE);

		gfx_vts_set_message(rp, 1, test, "status test failed");
		return (0);
	}

	return (1);
}

#define	MGA_XOR_CURSOR_LOC_HIGH	0x38
#define	MGA_XOR_CURSOR_LOC_LOW	0xf1

int
mga_test_cursor(
    register return_packet *const rp,
    register int const test)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint8_t save_crtc_index;
	register uint8_t save_cursor_loc_low;
	register uint8_t save_cursor_loc_high;
	register uint8_t new_cursor_loc_low;
	register uint8_t new_cursor_loc_high;

	/*
	 * Test the software bits of the crtc cursor registers.
	 * Complement the bits, and see if they read back
	 * complemented.
	 */

	/* Save the index. */

	save_crtc_index = mgaptr->mga_crtc_index;

	/* Save the cursor location. */

	mgaptr->mga_crtc_index = MGA_CRTC_CURSOR_LOC_LOW;
	save_cursor_loc_low = mgaptr->mga_crtc_data;
	mgaptr->mga_crtc_index = MGA_CRTC_CURSOR_LOC_HIGH;
	save_cursor_loc_high = mgaptr->mga_crtc_data;

	/* Write the cursor location with the bits complemented. */

	mgaptr->mga_crtc_data = save_cursor_loc_high ^
	    MGA_XOR_CURSOR_LOC_HIGH;
	mgaptr->mga_crtc_index = MGA_CRTC_CURSOR_LOC_LOW;
	mgaptr->mga_crtc_data = save_cursor_loc_low ^
	    MGA_XOR_CURSOR_LOC_LOW;

	/* Read back the new cursor location. */

	new_cursor_loc_low = mgaptr->mga_crtc_data;
	mgaptr->mga_crtc_index = MGA_CRTC_CURSOR_LOC_HIGH;
	new_cursor_loc_high = mgaptr->mga_crtc_data;

	/* Restore the old cursor location, */

	mgaptr->mga_crtc_index = MGA_CRTC_CURSOR_LOC_LOW;
	mgaptr->mga_crtc_data = save_cursor_loc_low;
	mgaptr->mga_crtc_index = MGA_CRTC_CURSOR_LOC_HIGH;
	mgaptr->mga_crtc_data = save_cursor_loc_high;

	/* Restore the index */

	mgaptr->mga_crtc_index = save_crtc_index;

	if (save_cursor_loc_low !=
	    (new_cursor_loc_low ^ MGA_XOR_CURSOR_LOC_LOW) ||
	    save_cursor_loc_high !=
	    (new_cursor_loc_high ^ MGA_XOR_CURSOR_LOC_HIGH)) {
		printf("loc 0x%02x 0x%02x 0x%02x, 0x%02x 0x%02x 0x%02x\n",
		    save_cursor_loc_low, new_cursor_loc_low,
		    new_cursor_loc_low ^ MGA_XOR_CURSOR_LOC_LOW,
		    save_cursor_loc_high, new_cursor_loc_high,
		    new_cursor_loc_high ^ MGA_XOR_CURSOR_LOC_HIGH);

		gfx_vts_set_message(rp, 1, test, "cursor test failed");
		return (0);
	}

	return (1);
}


#define	RED_XOR_VALUE	0x11
#define	GREEN_XOR_VALUE	0x22
#define	BLUE_XOR_VALUE	0x44

int
mga_test_dac(
    register return_packet *const rp,
    register int const test)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint8_t save_palwtadd;
	register uint8_t save_xcurcol15red;
	register uint8_t save_xcurcol15green;
	register uint8_t save_xcurcol15blue;
	register uint8_t new_xcurcol15red;
	register uint8_t new_xcurcol15green;
	register uint8_t new_xcurcol15blue;

	/*
	 * Test the dac by modifying cursor color 15.  Complement
	 * some of the bits, and see if they read back
	 * complemented.
	 *
	 */

	/* Save the original dac index. */

	save_palwtadd = mgaptr->mga_palwtadd;

	/* Save cursor 15 red/green/blue palet values. */

	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15RED;
	save_xcurcol15red = mgaptr->mga_x_datareg;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15GREEN;
	save_xcurcol15green = mgaptr->mga_x_datareg;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15BLUE;
	save_xcurcol15blue = mgaptr->mga_x_datareg;

	/* Set cursor 15 red/green/blue values to the complement. */

	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15GREEN;
	mgaptr->mga_x_datareg = save_xcurcol15green ^ GREEN_XOR_VALUE;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15BLUE;
	mgaptr->mga_x_datareg = save_xcurcol15blue ^ BLUE_XOR_VALUE;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15RED;
	mgaptr->mga_x_datareg = save_xcurcol15red ^ RED_XOR_VALUE;

	/* Get the new cursor 15 red/green/blue palet values. */

	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15BLUE;
	new_xcurcol15blue = mgaptr->mga_x_datareg;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15GREEN;
	new_xcurcol15green = mgaptr->mga_x_datareg;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15RED;
	new_xcurcol15red = mgaptr->mga_x_datareg;

	/* Restore the original cursor 15 red/green/blue palet values. */

	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15RED;
	mgaptr->mga_x_datareg = save_xcurcol15red;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15GREEN;
	mgaptr->mga_x_datareg = save_xcurcol15green;
	mgaptr->mga_palwtadd = MGA_XDATA_XCURCOL15BLUE;
	mgaptr->mga_x_datareg = save_xcurcol15blue;

	/* Restore the original dac index. */

	mgaptr->mga_palwtadd = save_palwtadd;

	/* Check if the software bits did complement. */

	if (save_xcurcol15red != (new_xcurcol15red ^ RED_XOR_VALUE) ||
	    save_xcurcol15green != (new_xcurcol15green ^ GREEN_XOR_VALUE) ||
	    save_xcurcol15blue != (new_xcurcol15blue ^ BLUE_XOR_VALUE)) {
		printf("red 0x%02x 0x%02x 0x%02x, "
		    "green 0x%02x 0x%02x 0x%02x, "
		    "blue 0x%02x 0x%02x 0x%02x\n",
		    save_xcurcol15red, new_xcurcol15red,
		    new_xcurcol15red ^ RED_XOR_VALUE,
		    save_xcurcol15green, new_xcurcol15green,
		    new_xcurcol15green ^ GREEN_XOR_VALUE,
		    save_xcurcol15blue, new_xcurcol15blue,
		    new_xcurcol15blue ^BLUE_XOR_VALUE);

		gfx_vts_set_message(rp, 1, test, "dac test failed");
		return (0);
	}

	return (1);
}
