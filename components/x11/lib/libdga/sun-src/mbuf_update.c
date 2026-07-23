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
** mbuf_update.c
**
** Routines of the update phase for multibuffers.
*/

#include "dga_incls.h"

/*
** Note: On every alias or mbufset change, we will report the following
** types of changes. See comment at start of win_update.c for reason why we
** don't try to optimize change reporting.
**
**	site
**	clip
**	curs
**      bstore
**	cache (nonviewable mbufs only)
**
** TODO: ISSUE: since an alias change occurs on every multibuffer frame,
** if we don't optimize for multibuffers this could add unwanted per-frame
** overhead.  Is it significant?  If so, we are forced to optimize alias
** change reporting.  Composition changes are so infrequent that it still
** won't be worth optimizing the reporting of them. (Note: this issue
** doesn't apply to windows.)
*/


/*
** ENTRY ROUTINE FOR MULTIBUFFER UPDATE PHASE
*/

int
dgai_mbuf_update (_Dga_window dgawin _X_UNUSED, short bufIndex _X_UNUSED)
{
    return (0);
}


/*
** Current lock subject is a viewable multibuffer. Synchronize with changes.
*/

void
dgai_vmbuf_syncChanges (_Dga_window dgawin _X_UNUSED,
			DgaLastSeqsPtr pLastSeqs _X_UNUSED,
			short bufIndex _X_UNUSED)
{
    return;
}


/*
** Current lock subject is a non-viewable multibuffer. Synchronize with changes.
*/

void
dgai_nmbuf_syncChanges (_Dga_window dgawin _X_UNUSED)
{
    return;
}


void
dgai_nmbuf_cache_update (_Dga_window dgawin _X_UNUSED)
{
    return;
}

void
dgai_nmbuf_devinfo_update (_Dga_window dgawin _X_UNUSED)
{
    return;
}
