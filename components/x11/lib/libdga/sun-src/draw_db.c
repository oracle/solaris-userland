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
** draw_db.c - Drawable veneer for DGA window buffer control routines
*/

#include "dga_incls.h"

int
dga_draw_db_grab (Dga_drawable dgadraw _X_UNUSED,
		  int nbuffers _X_UNUSED,
		  int (*vrtfunc)(Dga_drawable) _X_UNUSED,
		  u_int *vrtcounterp _X_UNUSED)
{
    return (0);
}

int
dga_draw_db_ungrab (Dga_drawable dgadraw _X_UNUSED)
{
    return (0);
}

void
dga_draw_db_write (Dga_drawable dgadraw _X_UNUSED,
		   int buffer _X_UNUSED,
		   int (*writefunc)(void*, Dga_drawable, int) _X_UNUSED,
		   void *data _X_UNUSED)
{
    return;
}

void
dga_draw_db_read (Dga_drawable dgadraw _X_UNUSED,
		  int buffer _X_UNUSED,
		  int (*readfunc)(void*, Dga_drawable, int) _X_UNUSED,
		  void *data _X_UNUSED)
{
    return;
}

void
dga_draw_db_display (Dga_drawable dgadraw _X_UNUSED,
		     int buffer _X_UNUSED,
		     int (*visfunc)(void*, Dga_drawable, int) _X_UNUSED,
		     void *data _X_UNUSED)
{
    return;
}

void
dga_draw_db_interval (Dga_drawable dgadraw _X_UNUSED, int interval _X_UNUSED)
{
    return;
}

void
dga_draw_db_interval_wait (Dga_drawable dgadraw _X_UNUSED)
{
    return;
}

int
dga_draw_db_interval_check (Dga_drawable dgadraw _X_UNUSED)
{
    return (1);
}

int
dga_draw_db_write_inquire (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_db_read_inquire (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_db_display_inquire (Dga_drawable dgadraw _X_UNUSED)
{
    return (-1);
}

int
dga_draw_db_display_done (Dga_drawable dgadraw _X_UNUSED,
			  int flag _X_UNUSED,
			  int (*display_done_func)(Dga_drawable) _X_UNUSED)
{
    return (1);
}

Dga_dbinfo *
dga_draw_db_dbinfop (Dga_drawable dgadraw _X_UNUSED)
{
    return (NULL);
}
