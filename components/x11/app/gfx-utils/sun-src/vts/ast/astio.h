/*
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
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


#ifndef _ASTIO_H
#define	_ASTIO_H

#ifdef __cplusplus
extern "C" {
#endif

#include <sys/types.h>
#include <sys/fbio.h>

#define	ASTIOC			('Y' << 8)

#define	AST_SET_IO_REG		(ASTIOC | 1)
#define	AST_GET_IO_REG		(ASTIOC | 2)
#define	AST_ENABLE_ROM		(ASTIOC | 3)
#define	AST_DISABLE_ROM		(ASTIOC | 4)
#define	AST_DEBUG_VIS_TEST	(ASTIOC | 5)
#define	AST_DEBUG_GET_VIS_BUF	(ASTIOC | 6)
#define	AST_DEBUG_GET_VIS_IMAGE	(ASTIOC | 7)
#define	AST_DEBUG_TEST		(ASTIOC | 8)
#define	AST_GET_STATUS_FLAGS	(ASTIOC | 10)
#define	AST_GET_INDEX		(ASTIOC | 14)
#define	AST_SET_INDEX		(ASTIOC | 15)

#define	AST_STATUS_HW_INITIALIZED	0x01


typedef struct {
	uchar_t offset;
	uchar_t value;
	uchar_t	offset1;
	uchar_t value1;
} ast_io_reg;

struct ast_vis_cmd_buf {
	int			cmd;
	int			row;
	int			col;
	int			width;
	int			height;
	int			pad0;
	unsigned long		word1;
	unsigned long		word2;
};

#ifdef __cplusplus
}
#endif

#endif /* _ASTIO_H */
