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
** pix_inquiry.c - state inquiry routines for pixmaps.
*/

#include "dga_incls.h"

Display *
dgai_pix_display(_Dga_pixmap dgapix _X_UNUSED)
{
    return (NULL);
}

char *
dgai_pix_devname(_Dga_pixmap dgapix _X_UNUSED)
{
    return (NULL);
}

int
dgai_pix_devfd(_Dga_pixmap dgapix _X_UNUSED)
{
    return (-1);
}

int
dgai_pix_depth(_Dga_pixmap dgapix _X_UNUSED)
{
    return (0);
}

void
dgai_pix_set_client_infop(_Dga_pixmap dgapix, void *client_info_ptr)
{
    dgapix->p_client = client_info_ptr;
}

void *
dgai_pix_get_client_infop(_Dga_pixmap dgapix)
{
    return(dgapix->p_client);
}

void *
dgai_pix_devinfo(_Dga_pixmap dgapix _X_UNUSED)
{
    return (NULL);
}

int
dgai_pix_devinfochg(_Dga_pixmap dgapix _X_UNUSED)
{
    return (0);
}

int
dgai_pix_sitechg(_Dga_pixmap dgapix _X_UNUSED, int *reason)
{
    *reason = DGA_SITECHG_UNKNOWN;
    return (0);
}

void
dgai_pix_sitesetnotify(_Dga_pixmap dgapix,
		       DgaSiteNotifyFunc site_notify_func, void *client_data)
{
    dgapix->siteNotifyFunc = site_notify_func;
    dgapix->siteNotifyClientData = client_data;
}

void
dgai_pix_sitegetnotify(_Dga_pixmap dgapix,
		       DgaSiteNotifyFunc *site_notify_func, void **client_data)
{
    *site_notify_func = dgapix->siteNotifyFunc;
    *client_data = dgapix->siteNotifyClientData;
}

int
dgai_pix_site(_Dga_pixmap dgapix _X_UNUSED)
{
    return (DGA_SITE_NULL);
}

void *
dgai_pix_address(_Dga_pixmap dgapix _X_UNUSED)
{
    return (NULL);
}

int
dgai_pix_linebytes(_Dga_pixmap dgapix _X_UNUSED)
{
    return (0);
}

int
dgai_pix_bitsperpixel(_Dga_pixmap dgapix _X_UNUSED)
{
    return (0);
}

int
dgai_pix_clipchg(_Dga_pixmap dgapix _X_UNUSED)
{
    return (0);
}

void
dgai_pix_bbox(_Dga_pixmap dgapix _X_UNUSED,
	      int *xp, int *yp, int *widthp, int *heightp)
{
    *xp = 0;
    *yp = 0;
    *widthp = 0;
    *heightp = 0;
}

int
dgai_pix_empty(_Dga_pixmap dgapix _X_UNUSED)
{
    return (1);
}

short *
dgai_pix_clipinfo(_Dga_pixmap dgapix _X_UNUSED)
{
    return (NULL);
}
