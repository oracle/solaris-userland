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
**
** win_update.c
**
** Routines of the update phase for windows.
*/

#include "dga_incls.h"


/*
** Note: for the sake of simplicity, we always report the following
** types of changes whenever an alias or mbufset composition change
** occurs.  We could try to optimize the change reporting and only
** report an attribute change if we know that the attribute has definitely
** changed since the last lock.  But this requires a lot of comparison
** between the current and previous lock subjects and the decision
** tree gets quite large.  This method of "over reporting" may result 
** in some redundant change reports.  If we want to do this type of optimization
** in the future, we still can.  But for now we keep it simple.
**
** These are the window changes that are automatically reported whenever
** an alias or mbufset composition change occurs.
**
**	site
**	clip
**	curs
**      bstore
*/


/*
** ENTRY ROUTINE FOR WINDOW UPDATE PHASE 
*/

int
dgai_win_update (_Dga_window dgawin _X_UNUSED, short bufIndex _X_UNUSED)
{
    return (0);
}


/*
** Current lock subject is a window. Synchronize with changes.
*/

void
dgai_win_syncChanges (_Dga_window dgawin _X_UNUSED,
		      DgaLastSeqsPtr pLastSeqs _X_UNUSED)
{
    return;
}




