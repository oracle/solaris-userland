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

#ifndef _LIBVTSSUNWAST_H
#define	_LIBVTSSUNWAST_H

#include <sys/types.h>
#include <sys/param.h>		/* MAXPATHLEN */
#include <errno.h>
#include <memory.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <setjmp.h>
#include <stropts.h>		/* ioctl() */
#include <sys/fbio.h>
#include <sys/mman.h>
#include <sys/systeminfo.h>	/* sysinfo() */
#include <sys/pci.h>
#include <sys/time.h>
#include <sys/visual_io.h>
#include <X11/Xmd.h>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/extensions/dpms.h>
#include "libvtsSUNWxfb.h"	/* Common VTS library definitions */
#undef Status
#define	Status pciStatus
#include "gfx_common.h"
#undef Status
#define	Status int
#include "graphicstest.h"
#include "gfx_vts.h"

#include "astio.h"
#include "ast.h"

#define	VIS_TEXT	0	/* Use text mode when displaying data */
#define	VIS_PIXEL	1	/* Use pixel mode when displaying data */

typedef struct ast_info {
	char const *ast_name;
	int ast_fd;
	uint16_t ast_vendor;
	uint16_t ast_device;
	offset_t ast_fb_addr;
	size_t ast_fb_size;
	uchar_t *ast_fb_ptr;
	offset_t ast_mmio_addr;
	size_t ast_mmio_size;
	uchar_t *ast_mmio_ptr;
	offset_t ast_relocate_io;
	int ast_endian;
	uchar_t ast_pcicr2;
	uint_t ast_remap_base;
	uint_t ast_prot_key;
	uchar_t ast_misc_control;
	uint_t ast_mode;
	uint_t ast_width;
	uint_t ast_height;
	uint_t ast_depth;
	uint_t ast_pixelsize;
	uint_t ast_linesize;
	int ast_palet_changed;
	uchar_t ast_red[256];
	uchar_t ast_green[256];
	uchar_t ast_blue[256];
	uint_t ast_queue;
	uint_t ast_dst_base;
	uint_t ast_dst_pitch;
	uint_t ast_dst_xy;
	uint_t ast_line_err;
	uint_t ast_rect_xy;
	uint_t ast_fg;
	uint_t ast_bg;
	uint_t ast_mono1;
	uint_t ast_mono2;
	uint_t ast_clip1;
	uint_t ast_clip2;
	} ast_info_t;


typedef struct ast_xw_struct {
	sigset_t xw_procmask;
	sigjmp_buf xw_sigjmpbuf;
	char const *xw_dispname;
	Display *xw_display;
	int xw_screen;
	Window xw_window;
	Cursor xw_cursor;
	Bool xw_grab_server;
	Bool xw_grab_keyboard;
	Bool xw_grab_pointer;
	Bool xw_ss_saved;
	Bool xw_ss_disabled;
	int xw_ss_timeout;
	int xw_ss_interval;
	int xw_ss_prefer_blanking;
	int xw_ss_allow_exposures;
	Status xw_dpms_saved;
	CARD16 xw_dpms_power;
	BOOL xw_dpms_state;
	Bool xw_dpms_disabled;
	} ast_xw_t;


#ifdef __cplusplus
extern "C" {
#endif

/* chip.c */

extern return_packet *ast_test_chip(
    int const fd);

extern int chip_test(
    return_packet *const rp,
    int const fd);

extern int draw_lines(
    uint_t const width,
    uint_t const height);

extern int draw_cascaded_box(
    uint_t const width,
    uint_t const height);

/* dma.c */

extern return_packet *ast_test_dma(
    register int const fd);

extern int dma_test(
    return_packet *const rp,
    int const fd);

/* mapper.c */

extern return_packet *ast_test_open(
    int const fd);

extern int map_me(
    return_packet *const rp,
    int const fd);

extern int ast_test_scratch(
    return_packet *const rp,
    int const test);

/* memory.c */

extern return_packet *ast_test_memory(
    int const fd);

extern int memory_test(
    return_packet *const rp,
    int const fd);

extern void check_plane(
    int const num_planes,
    int const access_mode,
    int const fb_pitch,
    int const fb_height,
    int const fb_width,
    int const bytepp,
    caddr_t const base);

extern void init_data(
    int const num_planes);

extern uint_t test_data(
    void);

extern boolean_t write_read(
    int const xoff,
    int const yoff,
    boolean_t const complement,
    int const access_mode,
    boolean_t const pass,
    int const fb_pitch,
    int const bytepp,
    caddr_t const base);

/* tools.c */

extern int ast_map_mem(
    return_packet *const rp,
    int const test);

extern int ast_get_pci_info(
    void);

extern int ast_map_mmio(
    void);

extern int ast_map_fb(
    void);

extern int ast_init_info(
    return_packet *const rp,
    int const test);

extern int ast_init_graphics(
    void);

extern int ast_finish_graphics(
    void);

extern int ast_save_palet(
    void);

extern int ast_set_palet(
    void);

extern int ast_restore_palet(
    void);

extern uint_t ast_color(
    uint_t const red,
    uint_t const green,
    uint_t const blue);

extern int ast_open_key(
    void);

extern int ast_fill_solid_rect(
    uint_t const x1,
    uint_t const y1,
    uint_t const x2,
    uint_t const y2,
    uint_t const fg);

extern int ast_fill_pattern_rect(
    uint_t const x1,
    uint_t const y1,
    uint_t const x2,
    uint_t const y2,
    uint_t const bg,
    uint_t const fg,
    uint64_t const pat);

extern int ast_draw_solid_line(
    uint_t const x1,
    uint_t const y1,
    uint_t const x2,
    uint_t const y2,
    uint_t const fg);

extern int ast_unmap_mem(
    return_packet *const rp,
    int const test);

extern int ast_unmap_fb(
    void);

extern int ast_unmap_mmio(
    void);

extern int ast_store_mmio(
    uint_t const port,
    uint_t const value);

extern int ast_get_index_reg(
    uchar_t *const valueptr,
    uchar_t const offset,
    uchar_t const index);

extern int ast_set_index_reg(
    uchar_t const offset,
    uchar_t const index,
    uchar_t const value);

extern int ast_get_reg(
    uchar_t *const valueptr,
    uchar_t const offset);

extern int ast_set_reg(
    uchar_t const offset,
    uchar_t const value);

extern uint_t ast_mmio_read32(
    uint_t const port);

extern void ast_mmio_write32(
    uint_t const port,
    uint_t const val);

extern int ast_wait_idle(
    void);

/* libvtsSUNWast.c */

extern ast_info_t ast_info;

extern ast_xw_t ast_xw;

extern void ast_block_signals(
    void);

extern void ast_restore_signals(
    void);

extern int ast_lock_display(
    void);

extern int ast_unlock_display(
    void);

extern int ast_open_display(
    void);

extern int ast_create_cursor(
    void);

extern int ast_create_window(
    void);

extern int ast_grab_server(
    void);

extern int ast_ungrab_server(
    void);

extern int ast_grab_keyboard(
    void);

extern int ast_ungrab_keyboard(
    void);

extern int ast_grab_pointer(
    void);

extern int ast_ungrab_pointer(
    void);

extern int ast_disable_screensaver(
    void);

extern int ast_restore_screensaver(
    void);

extern int ast_disable_dpms(
    void);

extern int ast_restore_dpms(
    void);

extern int ast_sleep(
    uint_t const seconds);

extern void ast_signal_routine(
    int const signo);

extern int ast_check_for_interrupt(
    void);

extern void graphicstest_finish(
    int const flag);

#ifdef __cplusplus
}
#endif

#endif	/* _LIBVTSSUNWAST_H */

/* End of libvtsSUNWast.h */
