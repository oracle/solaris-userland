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
 * fbc_get_properties - Get fbconf_xorg(1M) program properties
 */



#ifndef _FBC_GET_PROPERTIES_H
#define	_FBC_GET_PROPERTIES_H


#include <stdio.h>		/* FILE */

#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_properties.h"	/* Establish fbconf_xorg(1M) properties */


int fbc_get_properties(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar);	/* Returned fbconf_xorg properties */


#endif	/* _FBC_GET_PROPERTIES_H */


/* End of fbc_get_properties.h */
