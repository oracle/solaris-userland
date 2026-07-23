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
 * cmap_grab.c - the client side code for DGA colormap grabber
 */


/*
 *
 *	Shared colormap synchronization routines.
 *
 *	Client side
 *
 *
 * Functions:
 *
 *    Dga_cmap
 *    dga_cm_grab(devfd, filesuffix)
 *		int		devfd ;
 *		unsigned long	filesuffix ;
 *
 *	Grab a colormap.  'filesuffix' is the handle returned by
 *	XDgaGrabColormap.  'devfd' is the file descriptor of the frame buffer
 *	if any, -1 otherwise.  If you specify -1, dga_cm_grab will open
 *	the frame buffer.  The frame buffer fd may be inquired from
 *	the returned dga_cmap structure.
 *
 *	Returns a pointer to a dga_cmap structure on success,
 *	NULL on failure.
 *
 *
 *    void
 *    dga_cm_ungrab(cginfo,cflag)
 *		Dga_cmap	cginfo ;
 *		int		cflag ;
 *
 *	Release a colormap.  All resources allocated by dga_cm_grab are
 *	freed.  The application should call XDgaUnGrabColormap after calling
 *	dga_cm_ungrab() so that the server may free the colormap info page
 *	at the other end.
 *
 *	if cflag is nonzero, the framebuffr fd described in the info page
 *	is also closed.  The info page is invalid after this call and
 *	references to it will probably result in a SIGSEGV.
 *
 *
 *
 *
 *    void
 *    dga_cm_get(cginfo,index,count, red,green,blue)
 *		Dga_cmap	cginfo ;
 *		int		index, count ;
 *		u_char		*red, *green, *blue ;
 *
 *	Read colormap values and return them to the application.
 *
 *
 *    void
 *    dga_cm_put(cginfo,index,count, red,green,blue)
 *		Dga_cmap	cginfo ;
 *		int		index, count ;
 *		u_char		*red, *green, *blue ;
 *
 *	Write colormap to hardware if colormap is installed, otherwise
 *	save them in shared memory.
 *
 *
 *
 *    void
 *    dga_cm_write(cginfo,index,count, red,green,blue, putfunc)
 *      Dga_cmap    cginfo ;
 *      int     index, count ;
 *      u_char      *red, *green, *blue ;
 * 		int		(*putfunc)();
 *
 *  Write colormap to hardware by calling the user supplied putfunc
 *  if colormap is installed, otherwise save them in shared memory.
 *
 **    void
 *    dga_cm_read(cginfo,index,count, red,green,blue)
 *      Dga_cmap    cginfo ;
 *      int     index, count ;
 *      u_char      *red, *green, *blue ;
 * 		int		(*putfunc)();
 *
 *	Read colormap values and return them to the application
 *
 *	int
 *	dga_cm_get_devfd(cginfo)
 *	Dga_cmap cginfo;
 *
 *	Return the fd of the device associated with cginfo
 *
 *	void
 *	dga_cm_get_devinfo(cginfo)
 *	Dga_cmap cginfo;
 *
 *	Returns pointer to the device specific info associated with
 *	cginfo. Used to communicate info bet server and client
 *
 *	void
 *	dga_cm_set_client_infop(cginfo, client_info_ptr)
 *	Dga_cmap cginfo;
 *	void*  client_info_ptr;
 *
 *	Sets pointer to client specificr-data associated with cginfo.
 *
 *	void *
 *	dga_cm_get_client_infop(cginfo)
 *	Dga_cmap cginfo;
 *
 *	Returns the client specific data pointer associated with cginfo

 ****/

#include <X11/Xfuncproto.h>
#include "cmap_grab.h"


Dga_cmap
dga_cm_grab(
    int		fd _X_UNUSED,
    Dga_token	filesuffix _X_UNUSED)
{
    return NULL;
}

void
dga_cm_ungrab(
    Dga_cmap	cginfoi _X_UNUSED,
    int		cflag _X_UNUSED)
{
    return;
}

/*
 * Read colormap from shared memory.
 * Shared memory should always be in sync
 * with server's idea of this X11 colormap's
 * contents.
 */

void
dga_cm_get(
    Dga_cmap	cginfoi _X_UNUSED,
    int		index _X_UNUSED,
    int		count  _X_UNUSED,
    u_char	*red _X_UNUSED,
    u_char	*green _X_UNUSED,
    u_char	*blue _X_UNUSED)
{
    return;
}

/* This is the new interface that will be publicly exposed */
void
dga_cm_read(
    Dga_cmap	cginfo _X_UNUSED,
    int		index _X_UNUSED,
    int		count  _X_UNUSED,
    u_char	*red _X_UNUSED,
    u_char	*green _X_UNUSED,
    u_char	*blue _X_UNUSED)
{
    return;
}


/* write colormap to shared memory, and to DACS if appropriate. */

void
dga_cm_put(
    Dga_cmap	cginfoi _X_UNUSED,
    int		index _X_UNUSED,
    int		count  _X_UNUSED,
    u_char	*red _X_UNUSED,
    u_char	*green _X_UNUSED,
    u_char	*blue _X_UNUSED)
{
    return;
}

/* This is the interfce that will be publicly exposed */
void
dga_cm_write(
    Dga_cmap	cginfoi _X_UNUSED,
    int		index _X_UNUSED,
    int		count  _X_UNUSED,
    u_char	*red _X_UNUSED,
    u_char	*green _X_UNUSED,
    u_char	*blue _X_UNUSED,
    void	(*putfunc)(Dga_window, int, int, u_char *, u_char *, u_char *)
		  _X_UNUSED)
{
    return;
}

/* Interfaces that will be exposed to the public */
int
dga_cm_devdfd(Dga_cmap cginfoi)
{

    return (((struct dga_cmap *)cginfoi)->cm_devfd);
}

/* This device info is shared between the server and client */
void *
dga_cm_devinfo(Dga_cmap cginfoi)
{
    _Dga_cmap cginfo = (struct dga_cmap *)cginfoi;
    return ((void *)(((char *)cginfo->cm_info)
			+ CM_INFOP(cginfo)->device_offset));

}

/* Each client may store private info in the client info ptr */
void
dga_cm_set_client_infop(
    Dga_cmap cginfoi,
    void* client_info_ptr)
{
    _Dga_cmap cginfo = (struct dga_cmap *)cginfoi;

    cginfo->cm_client = client_info_ptr;
}

void *
dga_cm_get_client_infop(Dga_cmap cginfoi)
{
    _Dga_cmap cginfo = (struct dga_cmap *)cginfoi;

    return ((void *)cginfo->cm_client);
}


int
_dga_winlockat(
	u_long	cookie _X_UNUSED,
	int	**lockp _X_UNUSED,
	int	**unlockp _X_UNUSED)
{
    return -1;
}



int
_dga_winlockdt(int *lockp _X_UNUSED, int *unlockp _X_UNUSED)
{
    return -1;
}
