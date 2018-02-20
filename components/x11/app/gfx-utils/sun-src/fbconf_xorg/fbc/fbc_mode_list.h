/*
 * Copyright (c) 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_mode_list - List of Modes from the config file
 */



#ifndef	_FBC_MODE_LIST_H
#define	_FBC_MODE_LIST_H


#include "xf86Parser.h"
#include "configProcs.h"


/*
 * Unintrusive singly-linked ModeLine / Mode-EndMode list element
 */
typedef struct fbc_mode_elem_st {
	GenericListRec list;		/* Ptr to next Mode list element */
	XF86ConfModeLinePtr mode_ptr;	/* ModeLine / Mode-EndMode entry */
} fbc_mode_elem_t;


fbc_mode_elem_t *fbc_get_mode_list(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	const char	*device_type);	/* Device type name (e.g. "nfb") */

void fbc_free_mode_list(
	fbc_mode_elem_t	*mode_list);	/* List of Monitor Mode names */


#endif	/* _FBC_MODE_LIST_H */


/* End of fbc_mode_list.h */
