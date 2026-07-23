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
** mbsmemb_inquiry.c - state inquiry routines for mbufset members.
*/

#include "dga_incls.h"

Display *
dgai_mbsmemb_display (_Dga_window dgawin)
{
    return (dgawin->w_dpy);
}

char *
dgai_mbsmemb_devname (_Dga_window dgawin _X_UNUSED)
{
    return (NULL);
}

int
dgai_mbsmemb_devfd (_Dga_window dgawin)
{
    return(dgawin->w_devfd);
}

int
dgai_mbsmemb_depth (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

void
dgai_mbsmemb_set_client_infop (_Dga_window dgawin, void *client_info_ptr)
{
    dgawin->w_client = client_info_ptr;
}

void *
dgai_mbsmemb_get_client_infop (_Dga_window dgawin)
{
    return (dgawin->w_client);
}

void *
dgai_mbsmemb_devinfo (_Dga_window dgawin _X_UNUSED)
{
    return (NULL);
}

int
dgai_mbsmemb_devinfochg (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

int
dgai_mbsmemb_sitechg (_Dga_window dgawin _X_UNUSED, int *reason)
{
    *reason = DGA_SITECHG_UNKNOWN;
    return (0);
}

void
dgai_mbsmemb_sitesetnotify (_Dga_window dgawin, DgaSiteNotifyFunc site_notify_func,
			   void *client_data)
{
    dgawin->siteNotifyFunc = site_notify_func;
    dgawin->siteNotifyClientData = client_data;
}

void
dgai_mbsmemb_sitegetnotify (_Dga_window dgawin, DgaSiteNotifyFunc *site_notify_func,
			   void **client_data)
{
    *site_notify_func = dgawin->siteNotifyFunc;
    *client_data = dgawin->siteNotifyClientData;
}

int
dgai_mbsmemb_site (_Dga_window dgawin _X_UNUSED)
{
    return (DGA_SITE_NULL);
}

void *
dgai_mbsmemb_address (_Dga_window dgawin _X_UNUSED)
{
    return (NULL);
}

int
dgai_mbsmemb_linebytes (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

int
dgai_mbsmemb_bitsperpixel (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

int
dgai_mbsmemb_clipchg (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

void
dgai_mbsmemb_bbox(_Dga_window dgawin _X_UNUSED,
		  int *xp _X_UNUSED, int *yp _X_UNUSED,
		  int *widthp _X_UNUSED, int *heightp _X_UNUSED)
{
    return;
}

int
dgai_mbsmemb_visibility (_Dga_window dgawin _X_UNUSED)
{
    return (DGA_VIS_UNOBSCURED);
}

int
dgai_mbsmemb_empty (_Dga_window dgawin _X_UNUSED)
{
    return (1);
}

short *
dgai_mbsmemb_clipinfo (_Dga_window dgawin _X_UNUSED)
{
    return (NULL);
}


int
dgai_mbsmemb_singlerect (_Dga_window dgawin _X_UNUSED)
{
    return (1);
}

int
dgai_mbsmemb_obscured (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}


u_short
dgai_mbsmemb_borderwidth (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}


typedef void (*DgaCursTakeDownFuncOld)();

void
dgai_mbsmemb_curshandle (_Dga_window dgawin _X_UNUSED,
			 DgaCursTakeDownFunc take_down_func _X_UNUSED,
			 void *client_data _X_UNUSED)
{
    return;
}


int
dgai_mbsmemb_rtngrab (_Dga_window dgawin _X_UNUSED)
{
    return (RTN_FAILED);
}

int
dgai_mbsmemb_rtnungrab (_Dga_window dgawin _X_UNUSED)
{
    return (RTN_FAILED);
}

int
dgai_mbsmemb_rtnchg (_Dga_window dgawin _X_UNUSED)
{
    return (1);
}

int
dgai_mbsmemb_rtnactive (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

int
dgai_mbsmemb_rtncached (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

void *
dgai_mbsmemb_rtndevinfop (_Dga_window dgawin _X_UNUSED)
{
    return (NULL);
}

void
dgai_mbsmemb_rtndevtype (_Dga_window dgawin _X_UNUSED,
			 u_char *type, char **name)
{
    *type = (u_char) 0;
    *name = NULL;
    return;
}

void
dgai_mbsmemb_rtndimensions (_Dga_window dgawin _X_UNUSED,
			    short *width, short *height,
			    u_int *linebytes)
{
    *width =  0;
    *height = 0;
    *linebytes = 0;
    return;
}

int
dgai_mbsmemb_rtnbitsperpixel (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

void *
dgai_mbsmemb_rtnpixels (_Dga_window dgawin _X_UNUSED)
{
    return (NULL);
}


int
dgai_mbsmemb_mbchg (_Dga_window dgawin _X_UNUSED, int *reason)
{
    *reason = DGA_MBCHG_UNKNOWN;
    return (0);
}

void
dgai_mbsmemb_mbsetnotify (_Dga_window dgawin, DgaMbNotifyFunc mb_notify_func,
			   void *client_data)
{
    dgawin->mbNotifyFunc = mb_notify_func;
    dgawin->mbNotifyClientData = client_data;
}

void
dgai_mbsmemb_mbgetnotify (_Dga_window dgawin, DgaMbNotifyFunc *mb_notify_func,
			   void **client_data)
{
    *mb_notify_func = dgawin->mbNotifyFunc;
    *client_data = dgawin->mbNotifyClientData;
}


int
dgai_mbsmemb_mbaccessmode (_Dga_window dgawin _X_UNUSED)
{
    return (DGA_MBACCESS_NONE);
}

int
dgai_mbsmemb_mbsitetypeconst (_Dga_window dgawin _X_UNUSED)
{
    return (1);
}

void
dgai_mbsmemb_mbsetrendbufnotify (_Dga_window dgawin, DgaRendBufNotifyFunc rb_notify_func,
				void *client_data)
{
    dgawin->rendBufNotifyFunc = rb_notify_func;
    dgawin->rendBufNotifyClientData = client_data;
}

void
dgai_mbsmemb_mbgetrendbufnotify (_Dga_window dgawin, DgaRendBufNotifyFunc *rb_notify_func,
				void **client_data)
{
    *rb_notify_func = dgawin->rendBufNotifyFunc;
    *client_data = dgawin->rendBufNotifyClientData;
}

int
dgai_mbsmemb_ovlstatechg (_Dga_window dgawin _X_UNUSED)
{
    return (0);
}

int
dgai_mbsmemb_ovlstate (_Dga_window dgawin _X_UNUSED)
{
    return DGA_OVLSTATE_CONFLICT;
}

void
dgai_mbsmemb_setovlstatenotify (_Dga_window dgawin,
				DgaOvlStateNotifyFunc ovlstate_notify_func,
				void *client_data)
{
    dgawin->ovlStateNotifyFunc = ovlstate_notify_func;
    dgawin->ovlStateNotifyClientData = client_data;
}

void
dgai_mbsmemb_getovlstatenotify (_Dga_window dgawin,
				DgaOvlStateNotifyFunc *ovlstate_notify_func,
				void **client_data)
{
    *ovlstate_notify_func = dgawin->ovlStateNotifyFunc;
    *client_data = dgawin->ovlStateNotifyClientData;
}
