/* Copyright (c) 1993, 2026, Oracle and/or its affiliates.
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
 * dga_Xrequests.c - the client side code for DGA X11 requests
 */

/*
 *-----------------------------------------------------------------------
 *
 * This code uses the standard extension mechanism for sending
 * SUN_DGA private extension requests.
 *
 *-----------------------------------------------------------------------
 */

#include <X11/X.h>

#include "dga.h"
#include "dga_incls.h"

#include "XineramaInfo.h"

#ifdef MT
mutex_t	dgaGlobalMutex;
mutex_t	dgaGlobalPixmapMutex;
int	dgaThreaded;	/* 1 == linked with libthread, else 0 */
int	dgaMTOn;	/* 1 == MT per-drawable locking is turned on, else 0 */
#endif
int	_dga_client_version = -1;

void
dga_init_version(int ver _X_UNUSED)
{
#ifdef MT
	mutex_init(&dgaGlobalMutex, USYNC_THREAD, NULL);
	mutex_init(&dgaGlobalPixmapMutex, USYNC_THREAD, NULL);
#endif
}

Dga_token
XDgaGrabWindow(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED)
{
    return 0;
}

int
XDgaUnGrabWindow(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED)
{
    return 0;
}


Dga_token
XDgaGrabColormap(
    Display	*dpy _X_UNUSED,
    Colormap	cmap _X_UNUSED)
{
    return 0;
}

int
XDgaUnGrabColormap(
    Display	*dpy _X_UNUSED,
    Colormap	cmap _X_UNUSED)
{
    return 0;
}

int
XDgaDrawGrabWids(
    Display	*dpy _X_UNUSED,
    Drawable 	drawid _X_UNUSED,
    int		nwids _X_UNUSED)
{
    return 0;
}

int
XDgaGrabWids(
    Display	*dpy _X_UNUSED,
    Window 	win _X_UNUSED,
    int		nwids _X_UNUSED)
{
    return 0;
}

int
XDgaDrawGrabFCS(
    Display	*dpy _X_UNUSED,
    Drawable	drawid _X_UNUSED,
    int		nfcs _X_UNUSED)
{
    return 0;
}

int
XDgaGrabFCS(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED,
    int		nfcs _X_UNUSED)
{
    return 0;
}

int
XDgaDrawGrabZbuf(
    Display	*dpy _X_UNUSED,
    Drawable	drawid _X_UNUSED,
    int		nzbuftype _X_UNUSED)
{
    return 0;
}

int
XDgaGrabZbuf(
    Display	*dpy _X_UNUSED,
    Drawable	drawid _X_UNUSED,
    int		nzbuftype _X_UNUSED)
{
    return 0;
}

int
XDgaDrawGrabStereo(
    Display	*dpy _X_UNUSED,
    Drawable	drawid _X_UNUSED,
    int		st_mode _X_UNUSED)
{
    return 0;
}

int
XDgaGrabStereo(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED,
    int		st_mode _X_UNUSED)
{
    return 0;
}

int
XDgaGrabABuffers(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED,
    int		type _X_UNUSED,
    int		buffer_site _X_UNUSED)
{
    return 0;
}

int
XDgaUnGrabABuffers(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED,
    int		type _X_UNUSED)
{
    return 0;
}

int
XDgaGrabBuffers(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED,
    int		nbuffers _X_UNUSED)
{
    return 0;
}


int
XDgaUnGrabBuffers(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED)
{
    return 0;
}


int
XDgaGrabRetainedWindow(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED)
{
    return 0;
}


int
XDgaUnGrabRetainedWindow(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED)
{
    return 0;
}


int
XDgaGetRetainedPath(
    Display	*dpy _X_UNUSED,
    Window	win _X_UNUSED,
    char	*path _X_UNUSED)
{
    return 0;
}


int
XDgaQueryVersion(
    Display	*dpy _X_UNUSED,
    int		*major_versionp _X_UNUSED,
    int		*minor_versionp _X_UNUSED)
{
    return 0;
}


Dga_token
XDgaGrabPixmap(
    Display	*dpy _X_UNUSED,
    Pixmap	d _X_UNUSED)
{
    return 0;
}


int
XDgaUnGrabPixmap(
    Display	*dpy _X_UNUSED,
    Pixmap	d _X_UNUSED)
{
    return 0;
}



Dga_drawable
XDgaGrabDrawable(
    Display *dpy _X_UNUSED,
    Drawable drawid _X_UNUSED)
{
    return (NULL);
}



int
XDgaUnGrabDrawable(Dga_drawable dgadraw _X_UNUSED)
{
    return BadDrawable;
}


void *
_dga_is_X_window(
    Dga_token	token _X_UNUSED,
    Display	**dpyp _X_UNUSED,
    Window	*winp _X_UNUSED)
{
    return 0;
}

int
dga_pixlist_add(
    Dga_token	token _X_UNUSED,
    Display    *dpy _X_UNUSED,
    Pixmap     pix _X_UNUSED)
{
    return 0;
}

void *
_dga_is_X_pixmap(
    Pixmap	pix _X_UNUSED,
    Display	**dpyp _X_UNUSED)
{
    return 0;
}

/************************************

Addition to DGA for Xinerama extension.

	This code allows the client to mine out
	the window ID's that would normaly be
	hidden from the user in Xinerama mode.

	Xinerama keeps a list of WIDs that are
	connected to a virtual WID that the user
	gets to handle.

**************************************/


BOOL
XDgaGetXineramaInfo(
    Display	*dpy  _X_UNUSED,
    XID		VirtualWID _X_UNUSED,
    XineramaInfo *info)
{
    return 0;
}
