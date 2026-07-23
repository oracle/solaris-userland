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
 * win_grab.c - the client side code for DGA window grabber
 */

/****
 *
 *
 *	Shared window synchronization routines - client side
 *
 *
 *
 * Functions:
 *
 *    Dga_window
 *    dga_win_grab(devfd, token)
 *		int		devfd ;
 *		Dga_token	token ;
 *
 *	Grab a window.  'token' is the window-info handle returned by
 *	XDgaGrabWindow.  'devfd' is the file descriptor of the frame buffer
 *	if known, -1 otherwise.  If you specify -1, dga_win_grab will open the
 *	frame buffer.  The frame buffer fd may be inquired from the returned
 *	Dga_window structure via the dga_win_devfd() routine.
 *
 *	Returns a pointer to the a struct dga_window on success, NULL on
 *	failure.
 *
 *
 *
 *    dga_win_ungrab(infop, cflag)
 *		Dga_window	infop ;
 *		int		cflag ;
 *
 *	Ungrab a window.  All resources allocated by dga_win_grab are freed.
 *	If 'cflag' is nonzero, the framebuffer fd described for the device
 *	is also closed.
 *
 *	The application should call XDgaUnGrabWindow(dpy,win) after
 *	calling dga_win_ungrab() so that the server may free the window-info
 *	page at the other end.
 *
 *
 *
 *	short *
 *	dga_win_clipinfo(win)
 *		Dga_window	win ;
 *
 *	Returns pointer to cliplist.  Replaces old wx_sh_clipinfo_c() macro.
 *
 *
 *
 *	char *
 *	dga_win_fbname(win)
 *		Dga_window	win ;
 *
 *	Returns name of fb.  Replaces old wx_devname_c() macro.
 *
 *
 *
 *	int
 *	dga_win_clipchg(win)
 *		Dga_window	win ;
 *
 *	Returns 1 if cliplist changed since last call.  Replaces old
 *	wx_modif_c() and wx_seen_c() macros.
 *
 *
 *
 *	int
 *	dga_win_curschg(win)
 *		Dga_window	win ;
 *
 *	Returns 1 if cursor changed since last call.
 *
 *
 *
 *	int
 *	dga_win_rtnchg(win)
 *		Dga_window	win ;
 *
 *	Returns 1 if retained info changed since last call.
 *
 *
 *
 *	int
 *	dga_win_devfd(win)
 *		Dga_window	win ;
 *
 *	Returns framebuffer fd.
 *
 *
 *
 *	dga_win_bbox(win, xp, yp, widthp, heightp)
 *		Dga_window win;
 *		int *xp, *yp, *widthp, *heightp;
 *
 *	Returns window bounding box
 *
 *
 *
 *	int
 *	dga_win_singlerect(win)
 *		Dga_window win;
 *
 *	Returns nonzero if the window is a single rectangle.
 *
 *
 *
 *	int
 *	dga_win_empty(win)
 *		Dga_window win;
 *
 *	Returns nonzero if the window is empty.
 *
 *
 *
 *	int
 *	dga_win_obscured(win)
 *		Dga_window win;
 *
 *	Returns nonzero if the window is obscured.
 *
 *
 *
 *	int
 *	dga_win_cursactive(win)
 *		Dga_window win;
 *
 *	Returns nonzero if the cursor grabber is active.
 *
 *
 *
 *	void
 *	dga_win_cursupdate(win, func, data)
 *		Dga_window	win;
 *		void		(*func)();
 *		void*		data;
 *
 *	Decide if the cursor needs to be taken down, and if so, call
 *		(*func)(data, win, x, y, mem)
 *			void*		data ;
 *			Dga_window	win ;
 *			int		x,y ;
 *			Dga_curs_mpr	*mem ;
 *
 *
 *
 *	Dga_dbinfo *
 *	dga_win_dbinfop(win)
 *		Dga_window win;
 *
 *	Return dbinfo pointer.
 *
 *
 *
 *	Dga_widinfo *
 *	dga_win_widinfop(win)
 *		Dga_window win;
 *
 *	Return window id info pointer.
 *
 *      dga_win_depth(win)
 *              Dga_window win;
 *
 *      Return windows depth .
 *
 *
 *      dga_win_borderwidth(win)
 *              Dga_window win;
 *
 *      Return windows borderwidth .
 *
 * 	void
 * 	dga_win_set_client_infop(win, client_info_ptr)
 *		Dga_window win;
 *		void* client_info_ptr;
 *	Sets a client specific pointer in Dga_window
 *
 *
 *      dga_win_get_client_infop(win)
 *              Dga_window win;
 * 	Returns the client specific pointer
 *
 ****/

#include <stdlib.h>
#include "dga_incls.h"

/*bug fix for 4248958: use safe_free_client() to replace free() */
void
safe_free_clientp(_Dga_window  clientp)
{

    if(clientp){
        if(clientp->back) free(clientp->back);
        if(clientp->depth) free(clientp->depth);
        if(clientp->stencil) free(clientp->stencil);
        if(clientp->accum) free(clientp->accum);
        if(clientp->alpha) free(clientp->alpha);
        free(clientp);
    }
}

/******************************************
 *
 * dgai_win_grab_common:
 *
 *	create shared memory file for window information
 *	map to lock page
 *
 *	arguments:
 *
 *	int	devfd;	INPUT
 *		file descriptor of graphics device
 *
 *	Dga_token	token;	INPUT
 *		magic cookie supplied by the server
 *
 *	returns a user virtual address for a dga_window structure.
 *	returns NULL if anything goes awry.
 *
 *	'devfd' is the file descriptor of the frame buffer, if known,
 *	-1 otherwise.  If you specify -1, wx_grab will open the
 *	frame buffer.  The frame buffer fd may be inquired from the returned
 *	Dga_window ptr to the struct dga_window via the dga_win_devfd() routine.
 *
 *****************************************/


/*
** Shared between both drawable grabber and window compatibility interface.
*/

Dga_window
dgai_win_grab_common (Display *dpy _X_UNUSED, int devfd _X_UNUSED,
		      Dga_token token _X_UNUSED, int drawableGrabber _X_UNUSED)
{
    return  NULL;
}


Dga_window
dga_win_grab(
    int		devfd _X_UNUSED,
    Dga_token	token _X_UNUSED)
{
    return (NULL);
}


void
dga_win_ungrab(
    Dga_window  clientpi _X_UNUSED,
    int cflag _X_UNUSED)
{
    return;
}

void
dgai_win_ungrab_common(
    _Dga_window	clientp _X_UNUSED,
    int	cflag  _X_UNUSED,
    int drawableGrabber _X_UNUSED)
{
    return;
}

int
dgai_win_check_multiple_grab(
    _Dga_window clientp _X_UNUSED,
    int drawableGrabber _X_UNUSED)
{
    return (0);
}

short *
dga_win_clipinfo(Dga_window wini _X_UNUSED)
{
    return (NULL);
}


char *
dga_win_fbname(Dga_window wini _X_UNUSED)
{
    return (NULL);
}

int
dga_win_clipchg(Dga_window wini _X_UNUSED)
{
    return 0;
}

int
dga_win_curschg(Dga_window wini _X_UNUSED)
{
    return 0;
}

int
dga_win_rtnchg(Dga_window wini _X_UNUSED)
{
    return 0;
}

int
dga_win_devfd(Dga_window wini _X_UNUSED)
{
    return (-1);
}

void
dga_win_bbox(
    Dga_window wini _X_UNUSED,
    int *xp, int *yp, int *widthp, int *heightp)
{
    *xp = 0;
    *yp = 0;
    *widthp = 0;
    *heightp = 0;
}

int
dga_win_singlerect(Dga_window wini _X_UNUSED)
{
    return (0);
}

int
dga_win_empty(Dga_window wini _X_UNUSED)
{
    return (0);
}

u_char
dga_win_depth(Dga_window wini _X_UNUSED)
{
    return 0;
}

u_short
dga_win_borderwidth(Dga_window wini _X_UNUSED)
{
    return 0;
}

int
dga_win_obscured(Dga_window wini _X_UNUSED)
{
    return 0;
}

int
dgai_win_visibility(Dga_window wini _X_UNUSED)
{
    return (DGA_VIS_UNOBSCURED);
}

void
dgai_win_clip_update (_Dga_window clientp _X_UNUSED)
{
    return;
}

void
dgai_win_curs_update(_Dga_window win _X_UNUSED)
{
    return;
}


/*
 *
 *  dgai_rtn_update()
 *
 *  Do anything here that may require unlock/relock, because
 *  it takes so long.  Remap retained info, etc.
 *
 *  DGA Retained Window Information Update.  This function checks that the
 *  shared retained information structure hasn't become obsolete.  If the
 *  structure is found to be obsolete, this routine attempts to free and
 *  re-allocate the resources associated with the retained window.  Nothing
 *  is done in the event that the shared retained information is not obsolete.
 *
 *  Inputs:     Dga_window - Pointer to the dga_window structure for which
 *                           the shared retained info structure is to
 *                           be removed.
 *
 *  Outputs:    None.
 *
 *  Globals:    None.
 *
 */
void
dgai_win_rtn_update (_Dga_window clientp _X_UNUSED)
{
    return;
}

int
dga_win_cursactive(Dga_window wini _X_UNUSED)
{
    return 0;
}

void
dga_win_cursupdate(
    Dga_window	wini _X_UNUSED,
    void	(*func)(void *, Dga_window, int, int, Dga_curs_memimage*)
		 _X_UNUSED,
    void*	data _X_UNUSED)
{
    return;
}

Dga_dbinfo *
dga_win_dbinfop(Dga_window wini _X_UNUSED)
{
    return (NULL);
}

Dga_widinfo *
dga_win_widinfop(Dga_window wini _X_UNUSED)
{
    return (NULL);
}

void
dga_win_set_client_infop(
    Dga_window wini,
    void* client_info_ptr)
{
    _Dga_window win = (struct dga_window *)wini;
    win->w_client = client_info_ptr;
}

void *
dga_win_get_client_infop(Dga_window wini)
{
    _Dga_window win = (struct dga_window *)wini;
    return (void *)(win->w_client);
}

#ifdef MT
int
dgai_unlock(Dga_drawable dgadraw _X_UNUSED)
{
    return BadDrawable;
}
#endif
