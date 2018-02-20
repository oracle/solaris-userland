/*
 * Copyright (c) 2004, Oracle and/or its affiliates. All rights reserved.
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

#ifndef _SUNGFX_GAMMA_PACK_H
#define _SUNGFX_GAMMA_PACK_H

/*
 * gfx_gamma_pack.h:  Declarations for gamma string packing.
 */


#include <sys/types.h>



/* Function Prototypes */

extern int
gfx_pack_gamma_string_16 (char     **gamma_string,
                          int        gamma_entries,
                          uint16_t  *gt_data);


extern int
gfx_unpack_gamma_string_16 (char      *str,
                            int        max_entries,
                            uint16_t  *gt_data);



#endif /* _SUNGFX_GAMMA_PACK_H */
