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
 * dga_db.c - the client side code for DGA double buffering
 */


#include "dga_incls.h"

int
dga_db_access(Dga_window wg_clientpi _X_UNUSED)
{
    return 0;
}

void
dga_db_release(Dga_window wg_clientpi _X_UNUSED)
{
    return;
}


void
dga_db_write(
    Dga_window wg_clientpi _X_UNUSED,
    int buffer _X_UNUSED,
    int (*writefunc)(void*, Dga_window, int) _X_UNUSED,
    void* data _X_UNUSED)
{
    return;
}

void
dga_db_read(
     Dga_window wg_clientpi _X_UNUSED,
     int buffer _X_UNUSED,
     int (*readfunc)(void*, Dga_window, int) _X_UNUSED,
     void* data _X_UNUSED)
{
    return;
}


void
dga_db_display(
     Dga_window wg_clientpi _X_UNUSED,
     int buffer _X_UNUSED,
     int (*visfunc)(void*, Dga_window, int) _X_UNUSED,
     void* data  _X_UNUSED)
{
    return;
}

void
dga_db_interval(
     Dga_window wg_clientpi _X_UNUSED,
     int interval _X_UNUSED)		/* number of milliseconds */
{
    return;
}


void
dga_db_interval_wait(Dga_window wg_clientpi _X_UNUSED)
{
    return;
}

int
dga_db_interval_check(Dga_window wg_clientpi _X_UNUSED)
{
    return(1);
}

int
dga_db_write_inquire(Dga_window wg_clientpi)
{
    _Dga_window wg_clientp = (struct dga_window *)wg_clientpi;
     return(wx_infop(wg_clientp)->wx_dbuf.write_buffer);
}

int
dga_db_read_inquire(Dga_window wg_clientpi)
{
    _Dga_window wg_clientp = (struct dga_window *)wg_clientpi;

     return(wx_infop(wg_clientp)->wx_dbuf.read_buffer);
}

int
dga_db_display_inquire(Dga_window wg_clientpi)
{
    _Dga_window wg_clientp = (struct dga_window *)wg_clientpi;
     return(wx_infop(wg_clientp)->wx_dbuf.display_buffer);
}

/* INTERNAL INTERFACE */
int
dga_db_display_complete(
    Dga_window wg_clientpi _X_UNUSED,
    int flag _X_UNUSED)
{
    return 0;
}

/* New routines that will be exposed to the public */

int
dga_db_display_done(
    Dga_window wg_clientpi _X_UNUSED,
    int flag _X_UNUSED,
    int (*display_done_func)(Dga_window)  _X_UNUSED)
{
    return -1;
}

/* Returns 0 on fail and non-zero on success */
int
dga_db_grab(
    Dga_window clientpi _X_UNUSED,
    int nbuffers _X_UNUSED,
    int (*vrtfunc)(Dga_window) _X_UNUSED,
    u_int *vrtcounterp)
{
    return (0);
}

/* Returns 0 on failure and non-zero on success */
int
dga_db_ungrab(Dga_window clientpi _X_UNUSED)
{
    return (0);
}
