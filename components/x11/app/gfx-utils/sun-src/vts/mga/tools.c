/*
 * Copyright (c) 2006, 2015, Oracle and/or its affiliates. All rights reserved.
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

hrtime_t mga_loop_time = (hrtime_t) 10 * NANOSEC;    /* time to busy wait */

#if !defined(_BIG_ENDIAN)
int mga_big_endian = 0;
#else /* defined(_BIG_ENDIAN) */
int mga_big_endian = 1;
#endif /* defined(_BIG_ENDIAN) */

int
mga_map_mem(
    register return_packet *const rp,
    register int const test)
{
	if (mga_get_pci_info() != 0) {
		gfx_vts_set_message(rp, 1, test, "get pci info failed");
		return (-1);
	}

	if (mga_map_fb() != 0) {
		gfx_vts_set_message(rp, 1, test, "map framebuffer failed");
		return (-1);
	}

	if (mga_map_control() != 0) {
		gfx_vts_set_message(rp, 1, test, "map control failed");
		return (-1);
	}

	if (mga_map_iload() != 0) {
		gfx_vts_set_message(rp, 1, test, "map iload failed");
		return (-1);
	}

	return (0);
}

int
mga_get_pci_info(
    void)
{
	struct gfx_pci_cfg pciconfig;

	if (ioctl(mga_info.mga_fd, GFX_IOCTL_GET_PCI_CONFIG,
	    &pciconfig) != 0)
		return (-1);

	mga_info.mga_vendor = pciconfig.VendorID;
	mga_info.mga_device = pciconfig.DeviceID;

	mga_info.mga_fb_addr = pciconfig.bar[0] & PCI_BASE_M_ADDR_M;
	mga_info.mga_fb_size = MGASIZE_FB;

	mga_info.mga_control_addr = pciconfig.bar[1] & PCI_BASE_M_ADDR_M;
	mga_info.mga_control_size = MGASIZE_CONTROL;

	mga_info.mga_iload_addr = pciconfig.bar[2] & PCI_BASE_M_ADDR_M;
	mga_info.mga_iload_size = MGASIZE_ILOAD;

	if (gfx_vts_debug_mask & VTS_DEBUG) {
		printf("mga_vendor = 0x%04x, mga_device = 0x%04x\n",
		    mga_info.mga_vendor, mga_info.mga_device);
		printf("fb_addr = 0x%08llx, mga_fb_size = 0x%08lx\n",
		    (unsigned long long) mga_info.mga_fb_addr,
		    (unsigned long) mga_info.mga_fb_size);
		printf("control_addr = 0x%08llx, mga_control_size = 0x%08lx\n",
		    (unsigned long long) mga_info.mga_control_addr,
		    (unsigned long) mga_info.mga_control_size);
		printf("iload_addr = 0x%08llx, mga_iload_size = 0x%08lx\n",
		    (unsigned long long) mga_info.mga_iload_addr,
		    (unsigned long) mga_info.mga_iload_size);
	}

	return (0);
}

int
mga_map_fb(
    void)
{
	if (mga_info.mga_fb_ptr == NULL) {
		register void *ptr;

		ptr = mmap(NULL, mga_info.mga_fb_size,
		    PROT_READ | PROT_WRITE, MAP_SHARED,
		    mga_info.mga_fd, mga_info.mga_fb_addr);

		if (ptr == MAP_FAILED)
			return (-1);

		mga_info.mga_fb_ptr = (char *) ptr;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG)
		printf("mga_fb_ptr = 0x%llx\n",
		    (unsigned long long) mga_info.mga_fb_ptr);

	return (0);
}

int
mga_map_control(
    void)
{
	if (mga_info.mga_control_ptr == NULL) {
		register void *ptr;

		ptr = mmap(NULL, mga_info.mga_control_size,
		    PROT_READ | PROT_WRITE, MAP_SHARED,
		    mga_info.mga_fd, mga_info.mga_control_addr);

		if (ptr == MAP_FAILED)
			return (-1);

		mga_info.mga_control_ptr = (mga_t volatile *) ptr;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG)
		printf("mga_control_ptr = 0x%llx\n",
		    (unsigned long long) mga_info.mga_control_ptr);

	return (0);
}

int
mga_map_iload(
    void)
{
	if (mga_info.mga_iload_ptr == NULL) {
		register void *ptr;

		ptr = mmap(NULL, mga_info.mga_iload_size,
		    PROT_READ | PROT_WRITE, MAP_SHARED,
		    mga_info.mga_fd, mga_info.mga_iload_addr);

		if (ptr == MAP_FAILED)
			return (-1);

		mga_info.mga_iload_ptr = (char volatile *) ptr;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG)
		printf("mga_iload_ptr = 0x%llx\n",
		    (unsigned long long) mga_info.mga_iload_ptr);

	return (0);
}

int
mga_init_info(
    register return_packet *const rp,
    register int const test)
{
	register mga_t volatile *mgaptr;

	if (mga_get_fb_size() == 0) {
		gfx_vts_set_message(rp, 1, test, "get fb size failed");
		return (-1);
	}

	if (mga_get_screen_size() == 0) {
		gfx_vts_set_message(rp, 1, test, "get resolution failed");
		return (-1);
	}

	mgaptr = mga_info.mga_control_ptr;
	mga_info.mga_opmode = mga_get_uint32(&mgaptr->mga_opmode);

	return (0);
}

#define	MGA_FB_STEP	(16 * 1024)

size_t
mga_get_fb_size(
    void)
{
	register uint32_t volatile *fbptr;
	register size_t offset;
	register uint32_t word;

	for (offset = 0, fbptr = (uint32_t volatile *) mga_info.mga_fb_ptr;
	    offset < mga_info.mga_fb_size;
	    offset += MGA_FB_STEP, fbptr += MGA_FB_STEP / sizeof (uint32_t)) {
		word = *fbptr;
		*fbptr = ~word;
		if (*fbptr != ~word) {
			*fbptr = word;
			break;
		}
		*fbptr = word;
		if (*fbptr != word)
			break;
	}

	mga_info.mga_fb_real_size = offset;

	if (gfx_vts_debug_mask & VTS_DEBUG)
		printf("mga_fb_real_size = %lu\n", (unsigned long) offset);

	return (offset);
}


int
mga_get_screen_size(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint8_t save_crtc_index;
	register uint8_t save_crtcext_index;
	register uint8_t save_palwtadd;
	register uint8_t save_gctl_index;
	register uint8_t miscout;
	register uint8_t horiz_total;
	register uint8_t horiz_display_end;
	register uint8_t vert_total;
	register uint8_t vert_display_end;
	register uint8_t overflow;
	register uint8_t offset;
	register uint8_t addr_gen_ext;
	register uint8_t hor_counter_ext;
	register uint8_t vert_counter_ext;
	register uint8_t xmulctrl;
	register uint8_t misc;
	register uint8_t graphic_mode;
	register uint8_t miscellaneous;
	register uint32_t freq;
	register uint8_t m;
	register uint8_t n;
	register uint8_t p;
	register uint_t mode;
	register uint_t width;
	register uint_t height;
	register uint_t depth;
	register uint_t pixelsize;
	register uint_t pclk;
	register uint_t htotal;
	register uint_t vtotal;
	register uint_t hz;
	register uint_t pitch;

	/* Get the miscellaneous output register */

	miscout = mgaptr->mga_miscout_read;

	/* Save the crtc index. */

	save_crtc_index = mgaptr->mga_crtc_index;

	/* Get the horizontal total */

	mgaptr->mga_crtc_index = MGA_CRTC_HORIZ_TOTAL;
	horiz_total = mgaptr->mga_crtc_data;

	/* Get the horizontal display end. */

	mgaptr->mga_crtc_index = MGA_CRTC_HORIZ_DISPLAY_END;
	horiz_display_end = mgaptr->mga_crtc_data;

	/* Get the vertical total */

	mgaptr->mga_crtc_index = MGA_CRTC_VERT_TOTAL;
	vert_total = mgaptr->mga_crtc_data;

	/* Get the vertical display end. */

	mgaptr->mga_crtc_index = MGA_CRTC_VERT_DISPLAY_END;
	vert_display_end = mgaptr->mga_crtc_data;

	/* Get the overflow */

	mgaptr->mga_crtc_index = MGA_CRTC_OVERFLOW;
	overflow = mgaptr->mga_crtc_data;

	/* Get the offset */

	mgaptr->mga_crtc_index = MGA_CRTC_OFFSET;
	offset = mgaptr->mga_crtc_data;

	/* Restore the crtc index. */

	mgaptr->mga_crtc_index = save_crtc_index;

	/* Save the crtcext index. */

	save_crtcext_index = mgaptr->mga_crtcext_index;

	/* Get the address generator extensions */

	mgaptr->mga_crtcext_index = MGA_CRTCEXT_ADDR_GEN_EXT;
	addr_gen_ext = mgaptr->mga_crtcext_data;

	/* Get the horizontal counter extensions */

	mgaptr->mga_crtcext_index = MGA_CRTCEXT_HOR_COUNT_EXT;
	hor_counter_ext = mgaptr->mga_crtcext_data;

	/* Get the vertical counter extensions */

	mgaptr->mga_crtcext_index = MGA_CRTCEXT_VERT_COUNT_EXT;
	vert_counter_ext = mgaptr->mga_crtcext_data;

	/* Get the miscellaneous register */

	mgaptr->mga_crtcext_index = MGA_CRTCEXT_MISC;
	misc = mgaptr->mga_crtcext_data;

	/* Restore the crtcext index. */

	mgaptr->mga_crtcext_index = save_crtcext_index;

	/* Save the dac index. */

	save_palwtadd = mgaptr->mga_palwtadd;

	/* Get the multiplex control. */

	mgaptr->mga_palwtadd = MGA_XDATA_XMULCTRL;
	xmulctrl = mgaptr->mga_x_datareg;

	/* Get the appropriate clock values */

	switch (miscout & MGA_MISCOUT_CLKSEL_MASK) {
	    case MGA_MISCOUT_CLKSEL_25MHZ:	/* 0x00 */
		freq = MGA_XPIXPLLPA_REFCLK;

		/* Get pixpllam register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLAM;
		m = mgaptr->mga_x_datareg;

		/* Get pixpllan register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLAN;
		n = mgaptr->mga_x_datareg;

		/* Get pixpllap register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLAP;
		p = mgaptr->mga_x_datareg;
		break;

	    case MGA_MISCOUT_CLKSEL_28MHZ:	/* 0x04 */
		freq = MGA_XPIXPLLPB_REFCLK;

		/* Get pixpllbm register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLBM;
		m = mgaptr->mga_x_datareg;

		/* Get pixpllbn register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLBN;
		n = mgaptr->mga_x_datareg;

		/* Get pixpllbp register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLBP;
		p = mgaptr->mga_x_datareg;
		break;

	    case MGA_MISCOUT_CLKSEL_MGAPIXEL0:	/* 0x08 */
	    case MGA_MISCOUT_CLKSEL_MGAPIXEL1:	/* 0x0c */
		freq = MGA_XPIXPLLPC_REFCLK_G200E;

		/* Get pixpllcm register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLCM;
		m = mgaptr->mga_x_datareg;

		/* Get pixpllcn register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLCN;
		n = mgaptr->mga_x_datareg;

		/* Get pixpllcp register */

		mgaptr->mga_palwtadd = MGA_XDATA_XPIXPLLCP;
		p = mgaptr->mga_x_datareg;
		break;
	    }

	/* Restore the dac index. */

	mgaptr->mga_palwtadd = save_palwtadd;

	/* Save the gctl index. */

	save_gctl_index = mgaptr->mga_gctl_index;

	/* Get the graphic mode register. */

	mgaptr->mga_gctl_index = MGA_GCTL_GRAPHIC_MODE;
	graphic_mode = mgaptr->mga_gctl_data;

	/* Get the miscellaneous register */

	mgaptr->mga_gctl_index = MGA_GCTL_MISCELLANEOUS;
	miscellaneous = mgaptr->mga_gctl_data;

	/* Restore the gctl index. */

	mgaptr->mga_gctl_index = save_gctl_index;

	/* Compute the width. */

	width = ((uint_t) horiz_display_end + 1) * 8;

	/* Compute the height. */

	height = (uint_t) vert_display_end;
	height |= (((uint_t) overflow >>
	    MGA_CRTC_OVERFLOW_VDISPEND8_SHIFT) & 1) << 8;
	height |= (((uint_t) overflow >>
	    MGA_CRTC_OVERFLOW_VDISPEND9_SHIFT) & 1) << 9;
	height |= (((uint_t) vert_counter_ext >>
	    MGA_CRTCEXT_VCOUNT_VDISPEND10_SHIFT) & 1) << 10;
	height++;

	if (addr_gen_ext & MGA_CRTCEXT_ADDR_GEN_INTERLACE)
		height *= 2;

	if (!(misc & MGA_CRTCEXT_MISC_MGAMODE)) {
		if (!(miscellaneous & MGA_GCTL_MISC_GCGRMODE)) {
			mode = VIS_TEXT;
			depth = 4;
			width /= 8;
			height /= 16;
			pixelsize = 2;

		} else {
			mode = VIS_PIXEL;
			if (!(graphic_mode & MGA_GCTL_GRMODE_MODE256))
				depth = 4;
			else
				depth = 8;
			pixelsize = 1;
		}

	} else {
		mode = VIS_PIXEL;

		/* Compute the depth. */

		switch (xmulctrl & MGA_XMULCTRL_DEPTH_MASK) {
		    case MGA_XMULCTRL_DEPTH_8BPP:		/* 0x00 */
			depth = 8;
			pixelsize = 1;
			break;

		    case MGA_XMULCTRL_DEPTH_15BPP_1BPP_OVERLAY:	/* 0x01 */
			depth = 15;
			pixelsize = 2;
			break;

		    case MGA_XMULCTRL_DEPTH_16BPP:		/* 0x02 */
			depth = 16;
			pixelsize = 2;
			break;

		    case MGA_XMULCTRL_DEPTH_24BPP:		/* 0x03 */
			depth = 24;
			pixelsize = 3;
			break;

		    case MGA_XMULCTRL_DEPTH_32BPP_8BPP_OVERLAY:	/* 0x04 */
		    case MGA_XMULCTRL_DEPTH_32BPP_8BPP_UNUSED:	/* 0x07 */
			depth = 32;
			pixelsize = 4;
			break;

		    default:
			return (0);
		}
	}

	pclk = (unsigned long long) freq *
	    (unsigned long long) (n + 1) /
	    (unsigned long long) ((m & MGA_XPIXPLLM_MASK) + 1) /
	    (unsigned long long) ((p & MGA_XPIXPLLP_PIXPLLP_MASK) + 1);

	htotal = ((horiz_total |
	    ((hor_counter_ext & MGA_CRTCEXT_HCOUNT_HTOTAL8) << 8)) + 5) * 8;

	vtotal = (vert_total |
	    ((overflow & MGA_CRTC_OVERFLOW_VTOTAL8) << 8) |
	    (((overflow >> MGA_CRTC_OVERFLOW_VTOTAL9_SHIFT) & 1) << 9) |
	    ((vert_counter_ext & MGA_CRTCEXT_VCOUNT_VTOTAL10_11) << 10)) + 2;

	hz = (pclk + (htotal * vtotal / 2)) / (htotal * vtotal);

	pitch = ((((addr_gen_ext & MGA_CRTCEXT_ADDR_GEN_OFFSET8_9) >>
	    MGA_CRTCEXT_ADDR_GEN_OFFSET8_9_SHIFT) << 8) + offset) * 8 * 2;

	mga_info.mga_mode = mode;
	mga_info.mga_width = width;
	mga_info.mga_height = height;
	mga_info.mga_depth = depth;
	mga_info.mga_hz = hz;
	mga_info.mga_pixelsize = pixelsize;
	mga_info.mga_linesize = pitch;

	return (1);
}


int
mga_mgamode(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint8_t crtcext_index;
	register uint8_t misc;

	/* Save the crtcext index. */

	crtcext_index = mgaptr->mga_crtcext_index;

	/* Get the miscellaneous register */

	mgaptr->mga_crtcext_index = MGA_CRTCEXT_MISC;
	misc = mgaptr->mga_crtcext_data;

	/* Restore the crtcext index. */

	mgaptr->mga_crtcext_index = crtcext_index;

	if (!(misc & MGA_CRTCEXT_MISC_MGAMODE))
		return (0);
	else
		return (1);
}

int
mga_init_graphics(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint32_t maccess;
	register uint32_t opmode = MGA_OPMODE_DIRDATASIZ_8BPP;
	static short endian = 1;

	if (!mga_wait_fifo(11))
		return (0);

	switch (mga_info.mga_depth) {
	    case 8:
		maccess = MGA_MACCESS_PWIDTH_PW8;
		break;

	    case 15:
	    case 16:
		maccess = MGA_MACCESS_PWIDTH_PW16;
		if (!*(char const *)&endian)    /* big endian */
			opmode = MGA_OPMODE_DIRDATASIZ_16BPP;
		break;

	    case 24:
		maccess = MGA_MACCESS_PWIDTH_PW24;
		break;

	    case 32:
		maccess = MGA_MACCESS_PWIDTH_PW32;
		if (!*(char const *)&endian)    /* big endian */
			opmode = MGA_OPMODE_DIRDATASIZ_32BPP;
		break;
	    }

	mga_put_uint32(&mgaptr->mga_maccess, maccess);
	mga_put_uint32(&mgaptr->mga_opmode, opmode);
	mga_put_uint32(&mgaptr->mga_pitch, mga_info.mga_linesize /
	    mga_info.mga_pixelsize);
	mga_put_uint32(&mgaptr->mga_dstorg, 0);
	mga_put_uint32(&mgaptr->mga_ydstorg, 0);
	mga_put_uint32(&mgaptr->mga_cxbndry, (mga_info.mga_width - 1) << 16);
	mga_put_uint32(&mgaptr->mga_ytop, 0);
	mga_put_uint32(&mgaptr->mga_ybot, (mga_info.mga_height - 1) *
	    mga_info.mga_linesize);
	mga_put_uint32(&mgaptr->mga_plnwt, 0xffffffff);
	mga_put_uint32(&mgaptr->mga_fcol, 0);
	mga_put_uint32(&mgaptr->mga_bcol, 0xffffffff);

	return (1);
}


void
mga_save_palet(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint_t coloron;
	register uint8_t const save_palrdadd = mgaptr->mga_palrdadd;

	mgaptr->mga_palrdadd = 0;

	for (coloron = 0; coloron < 256; coloron++) {
		mga_info.mga_red[coloron] = mgaptr->mga_paldata;
		mga_info.mga_green[coloron] = mgaptr->mga_paldata;
		mga_info.mga_blue[coloron] = mgaptr->mga_paldata;
	}

	mgaptr->mga_palrdadd = save_palrdadd;
}


int
mga_set_palet(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint_t coloron;
	register uint8_t save_palwtadd;
	uchar_t new_red[256];
	uchar_t new_green[256];
	uchar_t new_blue[256];

	switch (mga_info.mga_depth) {
	    case 8:	/* 3, 3, 2 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)(((coloron >> 5) & 0x7) * 255 / 7);
			new_green[coloron] =
			    (uint8_t)(((coloron >> 2) & 0x7) * 255 / 7);
			new_blue[coloron] =
			    (uint8_t)((coloron & 0x3) * 255 / 3);
		}
		break;

	    case 15:	/* 5, 5, 5 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)((coloron & 0x1f) * 255 / 31);
			new_green[coloron] =
			    (uint8_t)((coloron & 0x1f) * 255 / 31);
			new_blue[coloron] =
			    (uint8_t)((coloron & 0x1f) * 255 / 31);
		}
		break;

	    case 16:	/* 5, 6, 5 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)((coloron & 0x1f) * 255 / 31);
			new_green[coloron] =
			    (uint8_t)((coloron & 0x3f) * 255 / 63);
			new_blue[coloron] =
			    (uint8_t)((coloron & 0x1f) * 255 / 31);
		}
		break;

	    default:	/* 8, 8, 8 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] = (uint8_t) coloron;
			new_green[coloron] = (uint8_t) coloron;
			new_blue[coloron] = (uint8_t) coloron;
		}
		break;
	}

	/* Don't set the palet if it matches what we will set. */

	for (coloron = 0; coloron < 256; coloron++) {
		if ((mga_info.mga_red[coloron] != new_red[coloron]) ||
		    (mga_info.mga_green[coloron] != new_green[coloron]) ||
		    (mga_info.mga_blue[coloron] != new_blue[coloron]))
			break;
	}

	if (coloron == 256)
		return (0);

	mga_info.mga_palet_changed = 1;
	save_palwtadd = mgaptr->mga_palwtadd;

	mgaptr->mga_palwtadd = 0;

	for (coloron = 0; coloron < 256; coloron++) {
		mgaptr->mga_paldata = new_red[coloron];
		mgaptr->mga_paldata = new_green[coloron];
		mgaptr->mga_paldata = new_blue[coloron];
	}

	mgaptr->mga_palwtadd = save_palwtadd;
	return (1);
}


int
mga_restore_palet(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint_t coloron;
	register uint8_t save_palwtadd;

	if (!mga_info.mga_palet_changed)
		return (0);

	save_palwtadd = mgaptr->mga_palwtadd;

	mgaptr->mga_palwtadd = 0;

	for (coloron = 0; coloron < 256; coloron++) {
		mgaptr->mga_paldata = mga_info.mga_red[coloron];
		mgaptr->mga_paldata = mga_info.mga_green[coloron];
		mgaptr->mga_paldata = mga_info.mga_blue[coloron];
	}

	mgaptr->mga_palwtadd = save_palwtadd;

	mga_info.mga_palet_changed = 0;
	return (1);
}


uint_t
mga_color(
    register uint_t const red,
    register uint_t const green,
    register uint_t const blue)
{
	register uint_t value;

	switch (mga_info.mga_depth) {
	    case 8:	/* 3, 3, 2 */
		value = ((red >> 5) & 0x7) << 5;
		value |= ((green >> 5) & 0x7) << 2;
		value |= (blue >> 6) & 0x3;
		break;

	    case 15:	/* 5, 5, 5 */
		value = ((red >> 3) & 0x1f) << 10;
		value |= ((green >> 3) & 0x1f) << 5;
		value |= (blue >> 3) & 0x1f;
		break;

	    case 16:	/* 5, 6, 5 */
		value = ((red >> 3) & 0x1f) << 11;
		value |= ((green >> 2) & 0x3f) << 5;
		value |= (blue >> 3) & 0x1f;
		break;

	    default:	/* 8, 8, 8 */
		value = (red & 0xff) << 16;
		value |= (green & 0xff) << 8;
		value |= blue & 0xff;
		break;
	}

	return (value);
}

void
mga_finish_graphics(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;

	mga_put_uint32(&mgaptr->mga_opmode, mga_info.mga_opmode);
}


int
mga_fill_solid_rect(
    register int const x1,
    register int const y1,
    register int const x2,
    register int const y2,
    register uint_t const fg)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;

	if (!mga_wait_fifo(5))
		return (0);

	mga_put_uint32(&mgaptr->mga_fcol, fg);
	mga_put_uint32(&mgaptr->mga_plnwt, 0xffffffff);
	mga_put_uint32(&mgaptr->mga_dwgctl,
	    MGA_DWGCTL_BOP_COPY | MGA_DWGCTL_SHFTZERO |
	    MGA_DWGCTL_SGNZERO | MGA_DWGCTL_ARZERO |
	    MGA_DWGCTL_SOLID | MGA_DWGCTL_ZMODE_NOZCMP |
	    MGA_DWGCTL_ATYPE_RPL | MGA_DWGCTL_OPCOD_TRAP);
	mga_put_uint32(&mgaptr->mga_fxbndry,
	    (x2 << 16) | (x1 & 0xffff));
	mga_put_uint32(&mgaptr->mga_draw_ydstlen,
	    (y1 << 16) | ((y2 - y1) & 0xffff));

	return (1);
}


int
mga_fill_pattern_rect(
    register int const x1,
    register int const y1,
    register int const x2,
    register int const y2,
    register uint_t const bg,
    register uint_t const fg,
    register uint64_t const pat)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register int const width = x2 - x1;
	register int const height = y2 - y1;
	register int x;
	register int y;
	register uint32_t value;
	register uint32_t iloadon = 0;
	register uint32_t volatile *iloadptr =
	    (uint32_t volatile *) mga_info.mga_iload_ptr;
	register int status;

	if (!mga_wait_fifo(11))
		return (0);

	mga_put_uint32(&mgaptr->mga_opmode, MGA_OPMODE_DIRDATASIZ_8BPP |
	    MGA_OPMODE_DMADATASIZ_8BPP | MGA_OPMODE_DMAMOD_BLIT);
	mga_put_uint32(&mgaptr->mga_plnwt, 0xffffffff);
	mga_put_uint32(&mgaptr->mga_shift, 0);
	mga_put_uint32(&mgaptr->mga_bcol, bg);
	mga_put_uint32(&mgaptr->mga_fcol, fg);
	mga_put_uint32(&mgaptr->mga_dwgctl,
	    MGA_DWGCTL_BLTMOD_BMONOLEF | MGA_DWGCTL_BOP_COPY |
	    MGA_DWGCTL_SHFTZERO | MGA_DWGCTL_SGNZERO |
	    MGA_DWGCTL_ZMODE_NOZCMP | MGA_DWGCTL_LINEAR |
	    MGA_DWGCTL_ATYPE_RSTR | MGA_DWGCTL_OPCOD_ILOAD);
	mga_put_uint32(&mgaptr->mga_ar0, ((width + 31) / 32 * 32) *
	    height - 1);
	mga_put_uint32(&mgaptr->mga_ar3, 0);
	mga_put_uint32(&mgaptr->mga_ar5, (width + 31) / 32);
	mga_put_uint32(&mgaptr->mga_fxbndry,
	    ((x2 - 1) << 16) | (x1 & 0xffff));
	mga_put_uint32(&mgaptr->mga_draw_ydstlen,
	    (y1 << 16) | (height & 0xffff));

	for (y = 0; y < height; y++) {
		value = 0;

		for (x = 0; x < width; x++) {
			value |= ((pat >> (((y + y1) & 7) * 8 +
			    ((x + x1) & 7))) & 1) << (x & 0x1f);

			if ((x & 0x1f) == 0x1f || x == width - 1) {
				mga_put_uint32(iloadptr, value);

				iloadon += sizeof (uint32_t);
				if (iloadon < mga_info.mga_iload_size)
					iloadptr++;
				else {
					iloadon = 0;
					iloadptr = (uint32_t volatile *)
					    mga_info.mga_iload_ptr;
				}
				value = 0;
			}
		}
	}

	status = mga_wait_idle();
	return (status);
}


int
mga_draw_solid_line(
    register int const x1,
    register int const y1,
    register int const x2,
    register int const y2,
    register uint_t const fg)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;

	if (!mga_wait_fifo(5))
		return (0);

	mga_put_uint32(&mgaptr->mga_fcol, fg);
	mga_put_uint32(&mgaptr->mga_plnwt, 0xffffffff);
	mga_put_uint32(&mgaptr->mga_dwgctl,
	    MGA_DWGCTL_BOP_COPY | MGA_DWGCTL_SOLID |
	    MGA_DWGCTL_ZMODE_NOZCMP | MGA_DWGCTL_ATYPE_RPL |
	    MGA_DWGCTL_OPCOD_AUTOLINE_CLOSE);
	mga_put_uint32(&mgaptr->mga_xystrt, x1 | (y1 << 16));
	mga_put_uint32(&mgaptr->mga_draw_xyend, x2 | (y2 << 16));

	return (1);
}


int
mga_wait_fifo(
    register int const fifocount)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint32_t fifostatus;
	register hrtime_t starttime;
	register hrtime_t curtime;
	register hrtime_t endtime;
	register ulong_t count = 0;

	starttime = gethrtime();
	endtime = starttime + mga_loop_time;

	do {
		count++;
		fifostatus = mga_get_uint32(&mgaptr->mga_fifostatus);
		if ((fifostatus & MGA_FIFOSTATUS_FIFOCOUNT_MASK) >= fifocount)
			break;
		curtime = gethrtime();
	} while (curtime < endtime);

	if ((fifostatus & MGA_FIFOSTATUS_FIFOCOUNT_MASK) < fifocount) {
		count++;
		fifostatus = mga_get_uint32(&mgaptr->mga_fifostatus);
	}

	if ((fifostatus & MGA_FIFOSTATUS_FIFOCOUNT_MASK) < fifocount)
		return (0);

	return (1);
}


int
mga_wait_idle(
    void)
{
	register mga_t volatile *const mgaptr = mga_info.mga_control_ptr;
	register uint32_t fifostatus;
	register hrtime_t starttime;
	register hrtime_t curtime;
	register hrtime_t endtime;
	register ulong_t count = 0;

	starttime = gethrtime();
	endtime = starttime + mga_loop_time;

	do {
		count++;
		fifostatus = mga_get_uint32(&mgaptr->mga_fifostatus);
		if (fifostatus & MGA_FIFOSTATUS_BEMPTY)
			break;
		curtime = gethrtime();
	} while (curtime < endtime);

	if (!(fifostatus & MGA_FIFOSTATUS_BEMPTY)) {
		count++;
		fifostatus = mga_get_uint32(&mgaptr->mga_fifostatus);
	}

	if (!(fifostatus & MGA_FIFOSTATUS_BEMPTY))
		return (0);

	return (1);
}


int
mga_unmap_mem(
    register return_packet *const rp,
    register int const test)
{
	if (mga_unmap_fb() != 0) {
		gfx_vts_set_message(rp, 1, test, "unmap framebuffer failed");
		return (-1);
	}

	if (mga_unmap_control() != 0) {
		gfx_vts_set_message(rp, 1, test, "unmap control failed");
		return (-1);
	}

	if (mga_unmap_iload() != 0) {
		gfx_vts_set_message(rp, 1, test, "unmap iload failed");
		return (-1);
	}

	return (0);
}

int
mga_unmap_fb(
    void)
{
	register int status;

	if (mga_info.mga_fb_ptr == NULL)
		return (0);

	status = munmap((char *) mga_info.mga_fb_ptr, mga_info.mga_fb_size);
	mga_info.mga_fb_ptr = NULL;

	return (status);
}


int
mga_unmap_control(
    void)
{
	register int status;

	if (mga_info.mga_control_ptr == NULL)
		return (0);

	status = munmap((char *) mga_info.mga_control_ptr,
	    mga_info.mga_control_size);
	mga_info.mga_control_ptr = NULL;

	return (status);
}


int
mga_unmap_iload(
    void)
{
	register int status;

	if (mga_info.mga_iload_ptr == NULL)
		return (0);

	status = munmap((char *) mga_info.mga_iload_ptr,
	    mga_info.mga_iload_size);
	mga_info.mga_iload_ptr = NULL;

	return (status);
}

uint32_t
mga_get_uint32(
    register uint32_t volatile const *const uint32ptr)
{
	register uint32_t value = *uint32ptr;

	if (!mga_big_endian)
		return (value);

	else
		return (((value & 0xff) << 24) |
		    ((value & 0xff00) << 8) |
		    ((value & 0xff0000) >> 8) |
		    ((value & 0xff000000) >> 24));
}

void
mga_put_uint32(
    register uint32_t volatile *const uint32ptr,
    register uint32_t const value)
{
	register uint32_t newvalue;

	if (!mga_big_endian)
		newvalue = value;
	else
		newvalue = ((value & 0xff) << 24) |
		    ((value & 0xff00) << 8) |
		    ((value & 0xff0000) >> 8) |
		    ((value & 0xff000000) >> 24);

	*uint32ptr = newvalue;
}
