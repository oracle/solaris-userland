/* Copyright (c) 1996, 2026, Oracle and/or its affiliates.
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


/*
 * dga_ab.c - the client side code for Ancillary Buffers (ABMG )
 */

#include "dga_incls.h"

/*
 * Name    : dga_draw_grab_buffer
 * Synopsis: This function requests the window system to provide
 * ancillary buffer service for the grabbed drawable name in the
 * dgadraw argument.  The call requests  the type of the buffer
 * specified to be grabbed to the client.  If buffer_site is
 * DGA_SITE_SYSTEM, server allocates the buffer in the shared
 * memory.  If it is DGA_SITE_DEVICE, the server tries to grab
 * hardware buffers.  If the device does not support the given
 * buffer type in hardware, the request fails.
 * The drawable must have been grabbed previously via XDgaGrabDrawable.
 */

Dga_buffer
dga_draw_grab_buffer(Dga_drawable dgadraw _X_UNUSED,
		     Dga_buffer_type type _X_UNUSED,
		     int buffer_site _X_UNUSED)
{
    return NULL;
}

/*
 * Name    : dga_draw_ungrab_buffer
 * Synopsis: This function ungrabs the buffer for the specified drawable
 * which has been grabbed previously. Note that ungrabbing a buffer does
 * not necessarily cause it to be freed.  If any of these steps fail,
 * zero is returned.  True is returned upon success.
 */
int
dga_draw_ungrab_buffer(Dga_drawable dgadraw _X_UNUSED,
		       Dga_buffer_type type _X_UNUSED)
{
    return 0;
}

/*
 * Name    : dga_draw_get_buffers
 * Synopsis: This function returns the number of ancillary buffers
 * associated with the specified dgadraw and an arry of buffer
 * pointers.  Note that only buffers which have been grabbed by
 * the client are returned.  Buffers which might exist (because of
 * grabs by other clients or the server) are not returned.
 */
int
dga_draw_get_buffers(Dga_drawable dgadraw _X_UNUSED,
		     Dga_buffer **pBufs  _X_UNUSED)
{
    return 0;
}


/*
 * Name    : dga_buffer_type
 * Synopsis: This function returns the type of the buffer specified.
 */
Dga_buffer_type
dga_buffer_type(Dga_buffer bufferp _X_UNUSED)
{
    return -1;
}


/*
 * Name    : dga_buffer_site (Lock Only)
 * Synopsis: This function returns the site of the buffer specified.
 * The values are the same as those returned by dga_draw_site().
 * DGA_SITE_SYSTEM, DGA_SITE_DEVICE and DGA_SITE_NULL.
 */
int
dga_buffer_site(Dga_buffer bufferp _X_UNUSED)
{
    return DGA_SITE_NULL;
}


/*
 * Name    : dga_draw_bufferchg
 * Synopsis: This function returns True if any of the buffers
 * associated with the dgadraw have undergone a state change
 * since the last lock.  When dga_draw_bufferchg returns True,
 * the client should call dga_buffer_sitechg for each of the
 * Drawable's buffers.
 */
int
dga_draw_bufferchg(Dga_drawable dgadraw _X_UNUSED)
{
    return False;
}

/*
 * Name    : dga_buffer_sitechg
 * Synopsis: This function returns True if the buffer has sitechg
 * flag set.  Note that this function always returns False for
 * device buffers.  Only memory buffers ever have a site chagne.
 * dga_buffer_sitechg() also returns the reason for site change.
 * Currenly the only possible values for reason are DGA_SITECHG_INITIAL,
 * which is reported the first time a Drawable is locaked after a buffer
 * has been created and DGA_SITECHG_CACHE which indicates that the
 * buffer has been resized since the time that the Dga_drawable was last
 * locked.
 */
int
dga_buffer_sitechg(Dga_buffer bufferp _X_UNUSED,
		   int *reason _X_UNUSED)
{
    return False;
}

/*
 * Name    : dga_buffer_address (Lock Only)
 * Synopsis: This function returns the data pointer from the shared
 * buffer page of the buffer specified.  An address will be returned
 * only for buffers which are located in system memory.
 * If dga_buffer_address is called on a buffer located with
 * DGA_SITE_DEVICE, NULL will be returned.  The value returned
 * remains valid across locks until a sitechg is reported as
 * described above.
 */
void *
dga_buffer_address(Dga_buffer bufferp _X_UNUSED)
{
    return NULL;
}

/*
 * Name    : dga_buffer_linebytes
 * Synopsis: This function returns the number of bytes per scanline
 * of the buffer specified.  Only buffers which are located in
 * system memory are addressable.  If dga_buffer_linebytes is called
 * for a buffer located on the device, "0" is returned.
 */
int
dga_buffer_linebytes(Dga_buffer bufferp _X_UNUSED)
{
    return 0;
}

/*
 * Name    : dga_buffer_bitsperpixel
 * Synopsis: This function returns bitsperpixel of the buffer
 * specified if the buffer is located in system memory.  If the
 * buffer is located on the device, zero is returned.  Note that
 * the value might be different than the number of significant bits.
 * For example, an unpacked 4 bit stencil buffer would return
 * 8 bits per pixel, and a 24 bit Z buffer would return
 * 32 bits per pixel.
 */
int
dga_buffer_bitsperpixel(Dga_buffer bufferp _X_UNUSED)
{
    return 0;
}

void
dga_draw_buffer_swap(Dga_drawable dgadraw _X_UNUSED,
		     int (*visfunc)(Dga_window) _X_UNUSED)
{
    return;
}

int
dga_draw_swap_check(Dga_drawable dgadraw _X_UNUSED)
{
    return 0;
}
