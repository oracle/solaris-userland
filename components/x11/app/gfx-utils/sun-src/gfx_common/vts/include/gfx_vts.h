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


#ifndef	_GFX_VTS_H
#define	_GFX_VTS_H


#include "libvtsSUNWxfb.h"	/* VTS library definitions for ast device */
#include <X11/Xlib.h>
#include <X11/Xutil.h>


/*
 * Debug & trace flags used with TraceMessage() and gfx_vts_debug_mask
 */
#define	VTS_DEBUG_OFF		0x0000
#define	VTS_DEBUG		0x0001
#define	VTS_TEST_STATUS		0x0002
#define	GRAPHICS_VTS_MEM_OFF	0x0004
#define	GRAPHICS_VTS_CHIP_OFF	0x0008
#define	GRAPHICS_VTS_SLOCK_OFF	0x0010
#define	GRAPHICS_VTS_DEV	0x0020

extern int	gfx_vts_debug_mask;	/* Debugging categories bit mask */


void gfx_vts_set_debug_mask(void);

void TraceMessage(
	int		flags,		/* Current debug categories bit mask */
	const char	*func,		/* Name of function to report */
	const char	*format,	/* printf()-style format string */
			...);		/* printf()-style variable arguments */

void gfx_vts_set_message(
	return_packet	*rp,		/* VTS test return packet */
	int		count,
	int		mesg_num,
	char		*string);	/* Message string, else NULL */

int gfx_vts_check_fd(
	int		fd,		/* File descriptor number */
	return_packet	*rp);		/* VTS test return packet */

void gfx_vts_free_tests(
	gfxtest_info	*tests);

void gfx_vts_console_interrupt(
	Display		*dpy);		/* Connection to the X server */


#endif	/* _GFX_VTS_H */


/* End of gfx_vts.h */
