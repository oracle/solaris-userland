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
** draw_inquiry.c - state inquiry routines for drawable veneer.
*/

#include "dga_incls.h"

Display *
dga_draw_display (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

Drawable
dga_draw_id (Dga_drawable dgadraw _X_UNUSED)
{
    return (None);
}

int
dga_draw_type (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

char *
dga_draw_devname (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

int
dga_draw_devfd (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_depth (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

void
dga_draw_set_client_infop (
    Dga_drawable dgadraw _X_UNUSED,
    void *client_info_ptr _X_UNUSED)
{
    return;
}

void *
dga_draw_get_client_infop (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

int
dga_draw_devinfochg (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

void *
dga_draw_devinfo (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

int
dga_draw_sitechg (Dga_drawable dgadraw _X_UNUSED, int *reason _X_UNUSED)
{
    return (-1);
}

void
dga_draw_sitesetnotify (
    Dga_drawable dgadraw _X_UNUSED,
    DgaSiteNotifyFunc site_notify_func _X_UNUSED,
    void *client_data _X_UNUSED)
{
    return;
}

void
dga_draw_sitegetnotify (
    Dga_drawable dgadraw _X_UNUSED,
    DgaSiteNotifyFunc *site_notify_func _X_UNUSED,
    void **client_data _X_UNUSED)
{
    return;
}

int
dga_draw_site (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

void *
dga_draw_address (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

int
dga_draw_linebytes (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_bitsperpixel (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_clipchg (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

void
dga_draw_bbox(Dga_drawable dgadraw _X_UNUSED,
	      int *xp _X_UNUSED,
	      int *yp _X_UNUSED,
	      int *widthp _X_UNUSED,
	      int *heightp _X_UNUSED)
{
    return;
}

int
dga_draw_visibility (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_empty (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

short *
dga_draw_clipinfo (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}


int
dga_draw_singlerect (Dga_drawable dgadraw _X_UNUSED)
{
    return (1);
}

int
dga_draw_obscured (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}


/* CONSOLIDATION PRIVATE */
u_short
dga_draw_borderwidth (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

void
dga_draw_curshandle (Dga_drawable dgadraw _X_UNUSED,
		     DgaCursTakeDownFunc take_down_func _X_UNUSED,
		     void *client_data _X_UNUSED)
{
    return;
}


int
dga_draw_rtngrab (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

int
dga_draw_rtnungrab (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

int
dga_draw_rtnchg (Dga_drawable dgadraw _X_UNUSED)
{
    return (1);
}

int
dga_draw_rtnactive (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

int
dga_draw_rtncached (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

void *
dga_draw_rtndevinfop (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

/* This routine is for compatibility only. In the old interface both
 * the "p" and the "non-p" version were in but the "p" version was the
 * one that was documented. */
void *
dga_draw_rtndevinfo (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

void
dga_draw_rtndevtype (Dga_drawable dgadraw _X_UNUSED,
		     u_char *type,
		     char **name)
{
    *type = (u_char) 0;
    *name = NULL;
    return;
}

void
dga_draw_rtndimensions (Dga_drawable dgadraw _X_UNUSED, short *width,
			short *height, u_int *linebytes)
{
    *width = 0;
    *height = 0;
    *linebytes = 0;
    return;
}

int
dga_draw_rtnbitsperpixel (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

void *
dga_draw_rtnpixels (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}

Dga_widinfo *
dga_draw_widinfop (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}


/* Note: the following routines are consolidation private.  They are not
   a part of the public interface. */

int
dga_draw_mbchg (Dga_drawable dgadraw _X_UNUSED, int *reason _X_UNUSED)
{
    return (0);
}

void
dga_draw_mbsetnotify (Dga_drawable dgadraw _X_UNUSED,
		      DgaMbNotifyFunc mb_notify_func _X_UNUSED,
		      void *client_data _X_UNUSED)
{
    return;
}

void
dga_draw_mbgetnotify (Dga_drawable dgadraw _X_UNUSED,
		      DgaMbNotifyFunc *mb_notify_func _X_UNUSED,
		      void **client_data _X_UNUSED)
{
    return;
}


int
dga_draw_mbaccessmode (Dga_drawable dgadraw _X_UNUSED)
{
    return (DGA_MBACCESS_NONE);
}

int
dga_draw_mbsitetypeconst (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

void
dga_draw_mbsetrendbufnotify (Dga_drawable dgadraw _X_UNUSED,
			     DgaRendBufNotifyFunc rb_notify_func _X_UNUSED,
			     void *client_data _X_UNUSED)
{
    return;
}

void
dga_draw_mbgetrendbufnotify (Dga_drawable dgadraw _X_UNUSED,
			     DgaRendBufNotifyFunc *rb_notify_func _X_UNUSED,
			     void **client_data _X_UNUSED)
{
    return;
}


int
dga_draw_ovlstatechg (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

int
dga_draw_ovlstate (Dga_drawable dgadraw _X_UNUSED)
{
    return (DGA_OVLSTATE_CONFLICT);
}

void
dga_draw_ovlstatesetnotify (
    Dga_drawable dgadraw _X_UNUSED,
    DgaOvlStateNotifyFunc ovlstate_notify_func _X_UNUSED,
    void *client_data _X_UNUSED)
{
    return;
}

void
dga_draw_ovlstategetnotify (
    Dga_drawable dgadraw _X_UNUSED,
    DgaOvlStateNotifyFunc *ovlstate_notify_func _X_UNUSED,
    void **client_data _X_UNUSED)
{
    return;
}
