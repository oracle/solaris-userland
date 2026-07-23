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


#include "dga_incls.h"
#include "pix_grab.h"

/******************************************
 *
 * dga_pix_grab:
 *
 *  create shared memory file for pixmap information
 *  map to lock page
 *
 *  arguments:
 *
 *  Dga_token   token;  INPUT
 *      magic cookie supplied by the server
 *
 *  returns a user virtual address for a dga_window structure.
 *  returns NULL if anything goes awry.
 *
 *****************************************/

Dga_pixmap
dga_pix_grab(
    Dga_token   token _X_UNUSED,
    Pixmap	pix _X_UNUSED)
{
    return (PIX_FAILED);
}

void
dga_pix_ungrab(Dga_pixmap clientpi _X_UNUSED)
{
    return;
}

int 
dga_pix_cachechg(Dga_pixmap clientpi _X_UNUSED)
{
    return 0;
}

int 
dga_pix_cached(Dga_pixmap clientpi _X_UNUSED)
{
    return 0;
}

char *
dga_pix_devname(Dga_pixmap clientpi _X_UNUSED)
{
    return (NULL);
}

void * 
dga_pix_pixels(Dga_pixmap clientpi _X_UNUSED)
{
    return (NULL);
}

int 
dga_pix_linebytes(Dga_pixmap clientpi _X_UNUSED)
{
    return (0);
}


u_char 
dga_pix_depth(Dga_pixmap clientpi _X_UNUSED)
{
    return (0);
}

void * 
dga_pix_devinfo(Dga_pixmap clientpi _X_UNUSED)
{
    return (NULL);
}

