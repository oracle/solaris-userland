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

#include "libvtsSUNWast.h"

hrtime_t ast_loop_time = (hrtime_t)10 * NANOSEC;	/* time to busy wait */


int
ast_map_mem(
    register return_packet *const rp,
    register int const test)
{
	register int const pagesize = getpagesize();

	if (ast_get_pci_info() != 0) {
		gfx_vts_set_message(rp, 1, test, "get pci info failed");
		return (-1);
	}


	ast_info.ast_fb_size = (ast_info.ast_fb_size + pagesize - 1) /
	    pagesize * pagesize;

	/*
	 * Map framebuffer
	 */

	if (ast_map_fb() != 0) {
		gfx_vts_set_message(rp, 1, test, "map framebuffer failed");
		return (-1);
	}


	ast_info.ast_mmio_size = (ast_info.ast_mmio_size + pagesize - 1) /
	    pagesize * pagesize;

	/*
	 * Map MMIO
	 */
	if (ast_map_mmio() != 0) {
		gfx_vts_set_message(rp, 1, test, "map MMIO failed");
		return (-1);
	}

	return (0);
}


int
ast_get_pci_info(
    void)
{
	struct gfx_pci_cfg pciconfig;
	int i;
	uint_t bar;
	uint_t bar_hi;
	offset_t mem_base[6];
	offset_t io_base[6];
	int type[6];
	uchar_t pots;

	if (ioctl(ast_info.ast_fd, GFX_IOCTL_GET_PCI_CONFIG,
	    &pciconfig) != 0) {
		return (-1);
	}

	ast_info.ast_vendor = pciconfig.VendorID;
	ast_info.ast_device = pciconfig.DeviceID;

	for (i = 0; i < 6; i++) {
		type[i] = 0;
		mem_base[i] = 0;
		io_base[i] = 0;
	}

	for (i = 0; i < 6; i++) {
		bar = pciconfig.bar[i];
		if (bar != 0) {
			if (bar & PCI_MAP_IO) {
				io_base[i] = PCIGETIO(bar);
				type[i] = bar & PCI_MAP_IO_ATTR_MASK;
			} else {
				type[i] = bar & PCI_MAP_MEMORY_ATTR_MASK;
				mem_base[i] = PCIGETMEMORY(bar);
				if (PCI_MAP_IS64BITMEM(bar)) {
					if (i == 5) {
						mem_base[i] = 0;
					} else {
						bar_hi = pciconfig.bar[i+1];
						mem_base[i] |=
						    ((offset_t)bar_hi << 32);
						++i;
					}
				}
			}
		}
	}

	ast_info.ast_fb_addr = mem_base[0] & 0xfff00000;
	ast_info.ast_fb_size = 0;

	ast_info.ast_mmio_addr = mem_base[1] & 0xffff0000;
	ast_info.ast_mmio_size = AST_MMIO_SIZE;

	ast_info.ast_relocate_io = io_base[2];

	if (ast_open_key() != 0)
		return (-1);

	if (ast_get_index_reg(&pots, CRTC_PORT, 0xAA) != 0)
		return (-1);

	switch (pots & 0x03) {
	case 0x00:
		ast_info.ast_fb_size = AST_VRAM_SIZE_08M;
		break;

	case 0x01:
		ast_info.ast_fb_size = AST_VRAM_SIZE_16M;
		break;

	case 0x02:
		ast_info.ast_fb_size = AST_VRAM_SIZE_32M;
		break;

	case 0x03:
		ast_info.ast_fb_size = AST_VRAM_SIZE_64M;
		break;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG) {
		printf("ast_vendor = 0x%04x, ast_device = 0x%04x\n",
		    ast_info.ast_vendor, ast_info.ast_device);
		printf("ast_fb_addr 0x%llx, ast_fb_size 0x%lx\n",
		    (unsigned long long)ast_info.ast_fb_addr,
		    (unsigned long)ast_info.ast_fb_size);
		printf("ast_mmio_addr 0x%llx, ast_mmio_size 0x%lx\n",
		    (unsigned long long)ast_info.ast_mmio_addr,
		    (unsigned long)ast_info.ast_mmio_size);
		printf("ast_relocate_io 0x%llx\n",
		    (unsigned long long)ast_info.ast_relocate_io);
	}

	return (0);
}

int
ast_map_mmio(
    void)
{
	if (ast_info.ast_mmio_ptr == NULL) {
		register void *ptr;

		ptr = mmap(NULL, ast_info.ast_mmio_size,
		    PROT_READ | PROT_WRITE, MAP_SHARED,
		    ast_info.ast_fd, ast_info.ast_mmio_addr);

		if (ptr == MAP_FAILED)
			return (-1);

		ast_info.ast_mmio_ptr = (uchar_t *)ptr;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG)
		printf("ast_mmio_ptr = 0x%llx\n",
		    (unsigned long long)ast_info.ast_mmio_ptr);

	return (0);
}


int
ast_map_fb(
    void)
{
	if (ast_info.ast_fb_ptr == NULL) {
		register void *ptr;

		ptr = mmap(NULL, ast_info.ast_fb_size,
		    PROT_READ | PROT_WRITE, MAP_SHARED,
		    ast_info.ast_fd, ast_info.ast_fb_addr);

		if (ptr == MAP_FAILED)
			return (-1);

		ast_info.ast_fb_ptr = (uchar_t *)ptr;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG)
		printf("ast_fb_ptr = 0x%llx\n",
		    (unsigned long long)ast_info.ast_fb_ptr);

	return (0);
}


int
ast_init_info(
    register return_packet *const rp,
    register int const test)
{
	register uint_t mode;
	register uint_t width;
	register uint_t height;
	register uint_t depth;
	register uint_t pixelsize;
	register uint_t offset;
	register uint_t memsize;
	uchar_t save_gctl;
	uchar_t misc;
	uchar_t hde;
	uchar_t ovf;
	uchar_t vde;
	uchar_t off;
	uchar_t undloc;
	uchar_t modectl;
	uchar_t pcicr3;
	uchar_t ecm;
	uchar_t xhovf;
	uchar_t xvovf;
	uchar_t offovf;
	unsigned int status = 0;

	/*
	 * first check if the hardware is already initialized.
	 * If not, abort
	 */
	if (ioctl(ast_info.ast_fd, AST_GET_STATUS_FLAGS, &status) != 0) {
		gfx_vts_set_message(rp, 1, test,
		    "AST_GET_STATUS_FLAGS failed");
		return (-1);
	}

	if (!(status & AST_STATUS_HW_INITIALIZED)) {
		gfx_vts_set_message(rp, 1, test,
		    "AST_GET_STATUS_FLAGS not initialized");
		return (-1);
	}

	if (ast_open_key() != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to open key");
		return (-1);
	}

	if (ast_get_reg(&save_gctl, GR_PORT) != 0) {
		gfx_vts_set_message(rp, 1, test,
		    "unable to get the gctl index");
		return (-1);
	}

	if (ast_get_index_reg(&misc, GR_PORT, 0x06) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the misc");
		return (-1);
	}

	if (ast_set_reg(GR_PORT, save_gctl) != 0) {
		gfx_vts_set_message(rp, 1, test,
		    "unable to set the gctl index");
		return (-1);
	}

	if (ast_get_index_reg(&hde, CRTC_PORT, 0x01) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the hde");
		return (-1);
	}

	if (ast_get_index_reg(&ovf, CRTC_PORT, 0x07) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the ovf");
		return (-1);
	}

	if (ast_get_index_reg(&vde, CRTC_PORT, 0x12) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the vde");
		return (-1);
	}

	if (ast_get_index_reg(&off, CRTC_PORT, 0x13) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the offset");
		return (-1);
	}

	if (ast_get_index_reg(&undloc, CRTC_PORT, 0x14) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the undloc");
		return (-1);
	}

	if (ast_get_index_reg(&modectl, CRTC_PORT, 0x17) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the modectl");
		return (-1);
	}

	if (ast_get_index_reg(&pcicr3, CRTC_PORT, 0xa2) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the pcicr3");
		return (-1);
	}

	if (ast_get_index_reg(&ecm, CRTC_PORT, 0xa3) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the ecm");
		return (-1);
	}

	if (ast_get_index_reg(&xhovf, CRTC_PORT, 0xac) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the xhovf");
		return (-1);
	}

	if (ast_get_index_reg(&xvovf, CRTC_PORT, 0xae) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the xvovf");
		return (-1);
	}

	if (ast_get_index_reg(&offovf, CRTC_PORT, 0xb0) != 0) {
		gfx_vts_set_message(rp, 1, test, "unable to get the offovf");
		return (-1);
	}

	width = (((((uint_t)xhovf & 0x4) >> 2 << 8) |
	    (uint_t)hde) + 1) << 3;

	height = ((((uint_t)xvovf & 0x2) >> 1 << 10) |
	    (((uint_t)ovf & 0x40) >> 6 << 9) |
	    (((uint_t)ovf & 0x02) >> 1 << 8) |
	    (uint_t)vde) + 1;

	offset = (((uint_t)offovf & 0x3f) << 8) | (uint_t)off;

	memsize = (undloc & 0x40) ? 4 :
	    ((modectl & 0x40) ? 1 : 2);

	if (!(misc & 0x01)) {
		if (!(ecm & 0x01)) {
			mode = VIS_TEXT;
			depth = 4;
			width /= 8;
			height /= 16;
			pixelsize = 2;
		} else {
			mode = VIS_PIXEL;
			depth = 8;
			pixelsize = 1;
		}
	} else {
		mode = VIS_PIXEL;

		switch (ecm & 0xf) {
		case 0x01:
			/* enable enhanced 256 color display mode */
			depth = 8;
			pixelsize = 1;
			break;

		case 0x02:
			/* enable 15-bpp high color display mode (rgb:555) */
			depth = 15;
			pixelsize = 2;
			break;

		case 0x04:
			/* enable 16-bpp high color display mode (rgb:565) */
			depth = 16;
			pixelsize = 2;
			break;

		case 0x08:
			/* enable 32-bpp true color display mode (argb:8888) */
			depth = 32;
			pixelsize = 4;
			break;

		default:
			gfx_vts_set_message(rp, 1, test, "invalid ecm");
			return (-1);
		}
	}

	ast_info.ast_mode = mode;
	ast_info.ast_width = width;
	ast_info.ast_height = height;
	ast_info.ast_depth = depth;
	ast_info.ast_pixelsize = pixelsize;
	ast_info.ast_linesize = offset * memsize * 2;

	switch (pcicr3 & 0xc0) {
	case 0x00:	/* little endian */
	case 0x40:
		ast_info.ast_endian = 0;
		break;

	case 0x80:	/* big endian 32 */
		ast_info.ast_endian = 2;
		break;

	case 0xc0:	/* big endian 16 */
		ast_info.ast_endian = 1;
		break;
	}

	if (gfx_vts_debug_mask & VTS_DEBUG) {
		printf("width=%d height=%d depth=%d pitch=%d\n",
		    ast_info.ast_width, ast_info.ast_height,
		    ast_info.ast_depth, ast_info.ast_linesize);
	}

	return (0);
}


int
ast_init_graphics(
    void)
{
	unsigned int ulData;
	register int status = 0;

	/*
	 * Enable MMIO
	 */

	if (ast_get_index_reg(&ast_info.ast_pcicr2, CRTC_PORT, 0xA1) != 0)
		return (-1);

	if (ast_set_index_reg(CRTC_PORT, 0xA1, 0x4) != 0)
		return (-1);

	ast_info.ast_remap_base = ast_mmio_read32(0xF004);
	ast_info.ast_prot_key = ast_mmio_read32(0xF000);
	if (ast_get_index_reg(&ast_info.ast_misc_control, CRTC_PORT, 0xA4) != 0)
		return (-1);

	ast_mmio_write32(0xF004, 0x1e6e0000);
	ast_mmio_write32(0xF000, 0x1);

	ulData = ast_mmio_read32(0x1200c);
	ast_mmio_write32(0x1200c, ulData & 0xFFFFFFFD);

	if (!(ast_info.ast_misc_control & 0x01)) {
		if (ast_set_index_reg(CRTC_PORT, 0xA4,
		    ast_info.ast_misc_control | 0x01) != 0)
			return (-1);
		status = 1;
	}

	if (!ast_wait_idle())
		return (-1);

	ast_info.ast_queue = ast_mmio_read32(MMIOREG_QUEUE);
	ast_info.ast_dst_base = ast_mmio_read32(MMIOREG_DST_BASE);
	ast_info.ast_dst_pitch = ast_mmio_read32(MMIOREG_DST_PITCH);
	ast_info.ast_dst_xy = ast_mmio_read32(MMIOREG_DST_XY);
	ast_info.ast_line_err = ast_mmio_read32(MMIOREG_LINE_ERR);
	ast_info.ast_rect_xy = ast_mmio_read32(MMIOREG_RECT_XY);
	ast_info.ast_fg = ast_mmio_read32(MMIOREG_FG);
	ast_info.ast_bg = ast_mmio_read32(MMIOREG_BG);
	ast_info.ast_mono1 = ast_mmio_read32(MMIOREG_MONO1);
	ast_info.ast_mono2 = ast_mmio_read32(MMIOREG_MONO2);
	ast_info.ast_clip1 = ast_mmio_read32(MMIOREG_CLIP1);
	ast_info.ast_clip2 = ast_mmio_read32(MMIOREG_CLIP2);

	if (!(ast_info.ast_queue & QUEUE_MEMORY_MAP)) {
		ast_mmio_write32(MMIOREG_QUEUE,
		    ast_info.ast_queue | QUEUE_MEMORY_MAP);
		status = 1;
	}

	if (!ast_store_mmio(MMIOREG_CLIP1,
	    ((0 & MASK_CLIP) << 16) |
	    (0 & MASK_CLIP)))
		return (-1);

	if (!ast_store_mmio(MMIOREG_CLIP2,
	    ((ast_info.ast_width & MASK_CLIP) << 16) |
	    (ast_info.ast_height & MASK_CLIP)))
		return (-1);

	return (status);
}


int
ast_finish_graphics(
    void)
{
	register int status = 0;

	ast_store_mmio(MMIOREG_DST_BASE, ast_info.ast_dst_base);
	ast_store_mmio(MMIOREG_DST_PITCH, ast_info.ast_dst_pitch);
	ast_store_mmio(MMIOREG_DST_XY, ast_info.ast_dst_xy);
	ast_store_mmio(MMIOREG_LINE_ERR, ast_info.ast_line_err);
	ast_store_mmio(MMIOREG_RECT_XY, ast_info.ast_rect_xy);
	ast_store_mmio(MMIOREG_FG, ast_info.ast_fg);
	ast_store_mmio(MMIOREG_BG, ast_info.ast_bg);
	ast_store_mmio(MMIOREG_MONO1, ast_info.ast_mono1);
	ast_store_mmio(MMIOREG_MONO2, ast_info.ast_mono2);
	ast_store_mmio(MMIOREG_CLIP1, ast_info.ast_clip1);
	ast_store_mmio(MMIOREG_CLIP2, ast_info.ast_clip2);

	ast_store_mmio(MMIOREG_QUEUE, ast_info.ast_queue);

	if (!(ast_info.ast_misc_control & 0x01)) {
		if (ast_set_index_reg(CRTC_PORT,
		    0xA4, ast_info.ast_misc_control) != 0)
			status = -1;
		else
			status = 1;
	}

	ast_mmio_write32(0xF004, ast_info.ast_remap_base);
	ast_mmio_write32(0xF000, ast_info.ast_prot_key);

	if (ast_set_index_reg(CRTC_PORT, 0xA1, ast_info.ast_pcicr2) != 0)
		status = -1;

	return (status);
}


int
ast_save_palet(
    void)
{
	register uint_t coloron;
	register int status = 1;
	uchar_t junk;

	for (coloron = 0; coloron < 256; coloron++) {
		if (ast_set_reg(DAC_INDEX_READ, coloron) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_get_reg(&ast_info.ast_red[coloron], DAC_DATA) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_get_reg(&ast_info.ast_green[coloron], DAC_DATA) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_get_reg(&ast_info.ast_blue[coloron], DAC_DATA) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;
	}

	return (status);
}


int
ast_set_palet(
    void)
{
	register uint_t coloron;
	register int status = 1;
	register uint_t maxdac;
	uchar_t ramdac_ctrl;
	uchar_t new_red[256];
	uchar_t new_green[256];
	uchar_t new_blue[256];
	uchar_t junk;

	if (ast_get_index_reg(&ramdac_ctrl, CRTC_PORT, 0xA8) != 0)
		return (-1);

	maxdac = (ramdac_ctrl & 0x2) ? 255 : 63;

	switch (ast_info.ast_depth) {
	case 8:		/* 3, 3, 2 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)(((coloron >> 5) & 0x7) * maxdac / 7);
			new_green[coloron] =
			    (uint8_t)(((coloron >> 2) & 0x7) * maxdac / 7);
			new_blue[coloron] =
			    (uint8_t)((coloron & 0x3) * maxdac / 3);
		}
		break;

	case 15:	/* 5, 5, 5 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)((coloron / 8) * maxdac / 31);
			new_green[coloron] =
			    (uint8_t)((coloron / 8) * maxdac / 31);
			new_blue[coloron] =
			    (uint8_t)((coloron / 8) * maxdac / 31);
		}
		break;

	case 16:	/* 5, 6, 5 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)((coloron / 8) * maxdac / 31);
			new_green[coloron] =
			    (uint8_t)((coloron / 4) * maxdac / 63);
			new_blue[coloron] =
			    (uint8_t)((coloron / 8) * maxdac / 31);
		}
		break;

	default:	/* 8, 8, 8 */
		for (coloron = 0; coloron < 256; coloron++) {
			new_red[coloron] =
			    (uint8_t)(coloron * maxdac / 255);
			new_green[coloron] =
			    (uint8_t)(coloron * maxdac / 255);
			new_blue[coloron] =
			    (uint8_t)(coloron * maxdac / 255);
		}
		break;
	}

	/* Don't set the palet if it matches what we will set. */

	for (coloron = 0; coloron < 256; coloron++) {
		if ((ast_info.ast_red[coloron] != new_red[coloron]) ||
		    (ast_info.ast_green[coloron] != new_green[coloron]) ||
		    (ast_info.ast_blue[coloron] != new_blue[coloron]))
			break;
	}

	if (coloron == 256)
		return (0);

	ast_info.ast_palet_changed = 1;

	for (coloron = 0; coloron < 256; coloron++) {
		if (ast_set_reg(DAC_INDEX_WRITE, coloron) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_set_reg(DAC_DATA, new_red[coloron]) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_set_reg(DAC_DATA, new_green[coloron]) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_set_reg(DAC_DATA, new_blue[coloron]) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;
	}

	return (status);
}


int
ast_restore_palet(
    void)
{
	register uint_t coloron;
	register int status = 1;
	uchar_t junk;

	if (!ast_info.ast_palet_changed)
		return (0);

	for (coloron = 0; coloron < 256; coloron++) {
		if (ast_set_reg(DAC_INDEX_WRITE, coloron) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_set_reg(DAC_DATA, ast_info.ast_red[coloron]) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_set_reg(DAC_DATA, ast_info.ast_green[coloron]) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;

		if (ast_set_reg(DAC_DATA, ast_info.ast_blue[coloron]) != 0)
			status = -1;

		if (ast_get_reg(&junk, SEQ_PORT) != 0)
			status = -1;
	}

	ast_info.ast_palet_changed = 0;
	return (status);
}


uint_t
ast_color(
    register uint_t const red,
    register uint_t const green,
    register uint_t const blue)
{
	register uint_t value;

	switch (ast_info.ast_depth) {
	case 8:		/* 3, 3, 2 */
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


int
ast_open_key(
    void)
{
	if (ast_set_index_reg(CRTC_PORT, 0x80, 0xA8) != 0)
		return (-1);
	return (0);
}


int
ast_fill_solid_rect(
    register uint_t const x1,
    register uint_t const y1,
    register uint_t const x2,
    register uint_t const y2,
    register uint_t const fg)
{
	register uint_t cmdreg;

	cmdreg = CMD_BITBLT | CMD_PAT_FGCOLOR | 0xf000;
	switch (ast_info.ast_pixelsize) {
	case 1:
		cmdreg |= CMD_COLOR_08;
		break;
	case 2:
		cmdreg |= CMD_COLOR_16;
		break;
	case 3:
	case 4:
	default:
		cmdreg |= CMD_COLOR_32;
		break;
	}

	if (!ast_store_mmio(MMIOREG_DST_PITCH,
	    (ast_info.ast_linesize << 16) | MASK_DST_HEIGHT))
		return (0);

	if (!ast_store_mmio(MMIOREG_FG, fg))
		return (0);

	if (!ast_store_mmio(MMIOREG_DST_BASE, 0))
		return (0);

	if (!ast_store_mmio(MMIOREG_DST_XY,
	    (x1 << 16) | y1))
		return (0);

	if (!ast_store_mmio(MMIOREG_RECT_XY,
	    ((x2 - x1) << 16) | (y2 - y1)))
		return (0);

	if (!ast_store_mmio(MMIOREG_CMD, cmdreg))
		return (0);

	return (1);
}


int
ast_fill_pattern_rect(
    register uint_t const x1,
    register uint_t const y1,
    register uint_t const x2,
    register uint_t const y2,
    register uint_t const bg,
    register uint_t const fg,
    register uint64_t const pat)
{
	register uint_t cmdreg;

	cmdreg = CMD_BITBLT | CMD_PAT_MONOMASK | 0xf000;
	switch (ast_info.ast_pixelsize) {
	case 1:
		cmdreg |= CMD_COLOR_08;
		break;
	case 2:
		cmdreg |= CMD_COLOR_16;
		break;
	case 3:
	case 4:
	default:
		cmdreg |= CMD_COLOR_32;
		break;
	}

	if (!ast_store_mmio(MMIOREG_DST_PITCH,
	    (ast_info.ast_linesize << 16) | MASK_DST_HEIGHT))
		return (0);

	if (!ast_store_mmio(MMIOREG_FG, fg))
		return (0);

	if (!ast_store_mmio(MMIOREG_BG, bg))
		return (0);

	if (!ast_store_mmio(MMIOREG_MONO1, (uint_t)(pat >> 32)))
		return (0);

	if (!ast_store_mmio(MMIOREG_MONO2, (uint_t)pat))
		return (0);

	if (!ast_store_mmio(MMIOREG_DST_BASE, 0))
		return (0);

	if (!ast_store_mmio(MMIOREG_DST_XY,
	    (x1 << 16) | y1))
		return (0);

	if (!ast_store_mmio(MMIOREG_RECT_XY,
	    ((x2 - x1) << 16) | (y2 - y1)))
		return (0);

	if (!ast_store_mmio(MMIOREG_CMD, cmdreg))
		return (0);

	return (1);
}


int
ast_draw_solid_line(
    register uint_t const x1,
    register uint_t const y1,
    register uint_t const x2,
    register uint_t const y2,
    register uint_t const fg)
{
	register uint_t cmdreg;
	register uint_t GAbsX;
	register uint_t GAbsY;
	register uint_t MM;
	register uint_t mm;
	register int err;
	register int k1;
	register int k2;
	register int xm;

	cmdreg = 0xf000 | CMD_LINEDRAW | CMD_ENABLE_CLIP |
	    CMD_NOT_DRAW_LAST_PIXEL;
	switch (ast_info.ast_pixelsize) {
	case 1:
		cmdreg |= CMD_COLOR_08;
		break;
	case 2:
		cmdreg |= CMD_COLOR_16;
		break;
	case 3:
	case 4:
	default:
		cmdreg |= CMD_COLOR_32;
		break;
	}

	if (x1 < x2)
		GAbsX = x2 - x1;
	else
		GAbsX = x1 - x2;

	if (y1 < y2)
		GAbsY = y2 - y1;
	else
		GAbsY = y1 - y2;

	if (GAbsX >= GAbsY) {
		MM = GAbsX;
		mm = GAbsY;
		xm = 1;
	} else {
		MM = GAbsY;
		mm = GAbsX;
		xm = 0;
	}

	if (x1 >= x2)
		cmdreg |= CMD_X_DEC;

	if (y1 >= y2)
		cmdreg |= CMD_Y_DEC;

	err = (int)(2 * mm) - (int)MM;
	k1 = 2 * mm;
	k2 = (int)(2 * mm) - (int)(2 * MM);

	if (!ast_store_mmio(MMIOREG_DST_BASE, 0))
		return (0);

	if (!ast_store_mmio(MMIOREG_DST_PITCH,
	    (ast_info.ast_linesize << 16) | MASK_DST_HEIGHT))
		return (0);

	if (!ast_store_mmio(MMIOREG_FG, fg))
		return (0);

	if (!ast_store_mmio(MMIOREG_LINE_XY,
	    (x1 << 16) | y1))
		return (0);

	if (!ast_store_mmio(MMIOREG_LINE_ERR,
	    (xm << 24) | (err & MASK_LINE_ERR)))
		return (0);

	if (!ast_store_mmio(MMIOREG_LINE_WIDTH,
	    (MM & MASK_LINE_WIDTH) << 16))
		return (0);

	if (!ast_store_mmio(MMIOREG_LINE_K1,
	    (k1 & MASK_LINE_K1)))
		return (0);

	if (!ast_store_mmio(MMIOREG_LINE_K2,
	    (k2 & MASK_LINE_K2)))
		return (0);

	if (!ast_store_mmio(MMIOREG_CMD, cmdreg))
		return (0);

	return (1);
}

int
ast_unmap_mem(
    register return_packet *const rp,
    register int const test)
{
	if (ast_unmap_fb() != 0) {
		gfx_vts_set_message(rp, 1, test, "unmap framebuffer failed");
		return (-1);
	}

	if (ast_unmap_mmio() != 0) {
		gfx_vts_set_message(rp, 1, test, "unmap MMIO failed");
		return (-1);
	}

	return (0);
}


int
ast_unmap_fb(
    void)
{
	register int status;

	if (ast_info.ast_fb_ptr == NULL)
		return (0);

	status = munmap((char *)ast_info.ast_fb_ptr, ast_info.ast_fb_size);
	ast_info.ast_fb_ptr = NULL;

	return (status);
}


int
ast_unmap_mmio(
    void)
{
	register int status;

	if (ast_info.ast_mmio_ptr == NULL)
		return (0);

	status = munmap((char *)ast_info.ast_mmio_ptr,
	    ast_info.ast_mmio_size);
	ast_info.ast_mmio_ptr = NULL;

	return (status);
}



int
ast_store_mmio(
    register uint_t const port,
    register uint_t const value)
{
	register uint_t readvalue;
	register hrtime_t starttime;
	register hrtime_t curtime;
	register hrtime_t endtime;
	register ulong_t count = 0;

	ast_mmio_write32(port, value);
	readvalue = ast_mmio_read32(port);

	if (readvalue == value)
		return (1);

	starttime = gethrtime();
	endtime = starttime + ast_loop_time;

	do {
		count++;
		ast_mmio_write32(port, value);
		readvalue = ast_mmio_read32(port);

		if (readvalue == value)
			return (1);
		curtime = gethrtime();
	} while (curtime < endtime);

	ast_mmio_write32(port, value);
	readvalue = ast_mmio_read32(port);

	if (readvalue == value)
		return (1);

	return (0);
}

int
ast_get_index_reg(
    register uchar_t *const valueptr,
    register uchar_t const offset,
    register uchar_t const index)
{
	if (ast_set_reg(offset, index) != 0)
		return (-1);

	if (ast_get_reg(valueptr, offset + 1) != 0)
		return (-1);

	return (0);
}


int
ast_set_index_reg(
    register uchar_t const offset,
    register uchar_t const index,
    register uchar_t const value)
{
	if (ast_set_reg(offset, index) != 0)
		return (-1);

	if (ast_set_reg(offset + 1, value) != 0)
		return (-1);

	return (0);
}


int
ast_get_reg(
    register uchar_t *const valueptr,
    register uchar_t const offset)
{
	ast_io_reg io_reg;

	io_reg.offset = offset;
	io_reg.value = (uchar_t)-1;

	if (ioctl(ast_info.ast_fd, AST_GET_IO_REG, &io_reg) != 0)
		return (-1);

	*valueptr = io_reg.value;
	return (0);
}


int
ast_set_reg(
    register uchar_t const offset,
    register uchar_t const value)
{
	ast_io_reg  io_reg;

	io_reg.offset = offset;
	io_reg.value = value;

	if (ioctl(ast_info.ast_fd, AST_SET_IO_REG, &io_reg) != 0)
		return (-1);

	return (0);
}


uint_t
ast_mmio_read32(
    register uint_t const port)
{
	register uint_t volatile const *const addr =
	    (uint_t volatile const *) (ast_info.ast_mmio_ptr + port);
	register uint_t value;

	union {
		uint_t l;
		ushort_t w[2];
		uchar_t b[4];
	} data;

	data.l = *addr;

	switch (ast_info.ast_endian) {
	case 0:	/* little endian */
		value = ((uint_t)data.b[3] << 24) |
		    ((uint_t)data.b[2] << 16) |
		    ((uint_t)data.b[1] << 8) |
		    (uint_t)data.b[0];
		break;

	case 1:	/* big endian 16 */
	case 2:	/* big endian 32 */
		value = ((uint_t)data.b[0] << 24) |
		    ((uint_t)data.b[1] << 16) |
		    ((uint_t)data.b[2] << 8) |
		    (uint_t)data.b[3];
		break;
	}

	return (value);
}



void
ast_mmio_write32(
    register uint_t const port,
    register uint_t const val)
{
	register uint_t volatile *const addr =
	    (uint_t volatile *) (ast_info.ast_mmio_ptr + port);
	register uint_t value;

	union {
		uint_t l;
		ushort_t w[2];
		uchar_t b[4];
	} data;

	data.l = val;

	switch (ast_info.ast_endian) {
	case 0:	/* little endian */
		value = ((uint_t)data.b[3] << 24) |
		    ((uint_t)data.b[2] << 16) |
		    ((uint_t)data.b[1] << 8) |
		    (uint_t)data.b[0];
		break;

	case 1:	/* big endian 16 */
	case 2:	/* big endian 32 */
		value = ((uint_t)data.b[0] << 24) |
		    ((uint_t)data.b[1] << 16) |
		    ((uint_t)data.b[2] << 8) |
		    (uint_t)data.b[3];
		break;
	}

	*addr = value;
}


int
ast_wait_idle(
    void)
{
	register hrtime_t starttime;
	register hrtime_t curtime;
	register hrtime_t endtime;
	register ulong_t count = 0;

	if (!(ast_mmio_read32(MMIOREG_STAT) & STAT_BUSY))
		return (1);

	starttime = gethrtime();
	endtime = starttime + ast_loop_time;

	do {
		count++;
		if (!(ast_mmio_read32(MMIOREG_STAT) & STAT_BUSY))
			return (1);
		curtime = gethrtime();
	} while (curtime < endtime);

	if (!(ast_mmio_read32(MMIOREG_STAT) & STAT_BUSY))
		return (1);

	return (0);
}
