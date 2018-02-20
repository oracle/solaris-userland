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

#ifndef _LIBVTSSUNWMGA_H
#define	_LIBVTSSUNWMGA_H


#include <sys/types.h>
#include <sys/param.h>		/* MAXPATHLEN */
#include <errno.h>
#include <memory.h>
#include <pwd.h>		/* getpwuid() */
#include <signal.h>
#include <stdio.h>		/* snprintf() */
#include <stdlib.h>		/* exit(), malloc() */
#include <string.h>		/* strcat(), strcpy() */
#include <unistd.h>		/* sleep() */
#include <signal.h>
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
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/extensions/dpms.h>
#include "libvtsSUNWxfb.h"	/* Common VTS library definitions */
#undef Status
#define	Status	pciStatus
#include "gfx_common.h"
#undef Status
#define	Status	int
#include "graphicstest.h"
#include "gfx_vts.h"		/* VTS Graphics Test common routines */

#include "mga.h"

#define	VIS_TEXT	0	/* Use text mode when displaying data */
#define	VIS_PIXEL	1	/* Use pixel mode when displaying data */

typedef struct mga_info {
	char const *mga_name;
	int mga_fd;
	uint16_t mga_vendor;
	uint16_t mga_device;
	int mga_mode;
	uint_t mga_width;
	uint_t mga_height;
	uint_t mga_depth;
	uint_t mga_hz;
	uint_t mga_pixelsize;
	uint_t mga_linesize;
	uint32_t mga_opmode;
	offset_t mga_fb_addr;
	size_t mga_fb_size;
	char *mga_fb_ptr;
	size_t mga_fb_real_size;
	offset_t mga_control_addr;
	size_t mga_control_size;
	mga_t volatile *mga_control_ptr;
	offset_t mga_iload_addr;
	size_t mga_iload_size;
	char volatile *mga_iload_ptr;
	int mga_palet_changed;
	uchar_t mga_red[256];
	uchar_t mga_green[256];
	uchar_t mga_blue[256];
	} mga_info_t;

typedef struct mga_xw_struct {
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
	} mga_xw_t;

#ifdef	__cplusplus
extern "C" {
#endif

/* chip.c */

extern return_packet *mga_test_chip(
    register int const fd);

extern int chip_test(
    return_packet *const rp,
    int const fd);

extern int draw_cascaded_box(
    unsigned int const width,
    unsigned int const height);

extern int draw_lines(
    unsigned int const width,
    unsigned int const height);

extern int box(
    int const srcx1,
    int const srcy1,
    int const srcx2,
    int const srcy2,
    unsigned int const color);

/* dma.c */

extern return_packet *mga_test_dma(
    register int const fd);

extern int dma_test(
    return_packet *const rp,
    int const fd);

/* mapper.c */

extern return_packet *mga_test_open(
    int const fd);

extern int map_me(
    return_packet *const rp,
    int const fd);

extern int mga_test_status(
    return_packet *const rp,
    int const test);

extern int mga_test_cursor(
    return_packet *const rp,
    int const test);

extern int mga_test_dac(
    return_packet *const rp,
    int const test);

/* memory.c */

extern return_packet *mga_test_memory(
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

extern u_int test_data(
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

extern int mga_map_mem(
    return_packet *const rp,
    int const test);

extern int mga_get_pci_info(
    void);

extern int mga_map_fb(
    void);

extern int mga_map_control(
    void);

extern int mga_map_iload(
    void);

extern int mga_init_info(
    return_packet *const rp,
    int const test);

extern size_t mga_get_fb_size(
    void);

extern int mga_get_screen_size(
    void);

extern int mga_mgamode(
    void);

extern void mga_save_palet(
    void);

extern int mga_set_palet(
    void);

extern int mga_restore_palet(
    void);

extern uint_t mga_color(
    uint_t const red,
    uint_t const green,
    uint_t const blue);

extern int mga_init_graphics(
    void);

extern void mga_finish_graphics(
    void);

extern int mga_fill_solid_rect(
    int const x1,
    int const y1,
    int const x2,
    int const y2,
    uint_t const color);

extern int mga_fill_pattern_rect(
    int const x1,
    int const y1,
    int const x2,
    int const y2,
    uint_t const bg,
    uint_t const fg,
    uint64_t const pat);

extern int mga_draw_solid_line(
    int const x1,
    int const y1,
    int const x2,
    int const y2,
    uint_t const color);

extern int mga_wait_fifo(
    int const fifocount);

extern int mga_wait_idle(
    void);

extern int mga_unmap_mem(
    return_packet *const rp,
    int const test);

extern int mga_unmap_fb(
    void);

extern int mga_unmap_control(
    void);

extern int mga_unmap_iload(
    void);

extern uint32_t mga_get_uint32(
    uint32_t volatile const *const uint32ptr);

extern void mga_put_uint32(
    uint32_t volatile *const uint32ptr,
    uint32_t const value);

/* libvtsSUNWmga.c */

extern mga_info_t mga_info;

extern mga_xw_t mga_xw;

extern void mga_block_signals(
    void);

extern void mga_restore_signals(
    void);

extern int mga_lock_display(
    void);

extern int mga_unlock_display(
    void);

extern int mga_open_display(
    void);

extern int mga_create_cursor(
    void);

extern int mga_create_window(
    void);

extern int mga_grab_server(
    void);

extern int mga_ungrab_server(
    void);

extern int mga_grab_keyboard(
    void);

extern int mga_ungrab_keyboard(
    void);

extern int mga_grab_pointer(
    void);

extern int mga_ungrab_pointer(
    void);

extern int mga_disable_screensaver(
    void);

extern int mga_restore_screensaver(
    void);

extern int mga_disable_dpms(
    void);

extern int mga_restore_dpms(
    void);

extern int mga_sleep(
    unsigned int const seconds);

extern void mga_signal_routine(
    int const signo);

extern void graphicstest_finish(
    int const flag);

#ifdef	__cplusplus
}
#endif

#endif	/* _LIBVTSSUNWMGA_H */
