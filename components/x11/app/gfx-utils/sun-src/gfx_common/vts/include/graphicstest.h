/*
 * Copyright (c) 2006, 2015, Oracle and/or its affiliates. All rights reserved.
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

#ifndef _GRAPHICSTEST_H
#define _GRAPHICSTEST_H

#include <sys/param.h>
#include <kvm.h>
#include <fcntl.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/mman.h>
#include <sys/time.h>
#include <sys/resource.h>

#define TEST_ERROR 1	/*A non-zero exit value signals fatal error. */

extern void graphicstest_finish(int const flag);

#define GRAPHICS_ERROR 1


/* define Message IDs */
#define TEST_RUN_VMSG 	1
#define	TEST_USAGE_INFOMSG 	2000
#define	GRAPHICS_SUB_TESTS   	2001
#define	GRAPHICS_TEST_INFO_1 	2002
#define	GRAPHICS_TEST_INFO_2 	2003

#define	TEST_ARGUMENT_ERRMSG  	6000	
#define	BAD_OPTIONS_ERRMSG 	6001
#define	SUBTEST_ERRMSG  	6002 
#define	TEST_SAMPLE_ERRMSG  	6003
#define	TEST_FINAL_ERRMSG 	6004


#define GRAPHICS_INFO_UNKNOWN_MESSAGE     2114
#define GRAPHICS_INFO_MESSAGE_STRING      2115
#define GRAPHICS_INFO_ENV_MSG             2116
#define GRAPHICS_OPEN_LIBRARY             2117

/* standard test messages */
#define GRAPHICS_TEST_OPEN_MESG	2900
#define GRAPHICS_TEST_DMA_MESG	2901
#define GRAPHICS_TEST_MEM_MESG	2902
#define GRAPHICS_TEST_CHIP_MESG	2903
#define GRAPHICS_TEST_VIDEO_MESG	2904
#define GRAPHICS_TEST_EMPTY_MESG	2910

#define GRAPHICS_INFO_MEM_TEST_0   3328  /* -------- Random Data Test -------- */
#define GRAPHICS_INFO_MEM_TEST_1   3329  /* ---------- Address Test ---------- */
#define GRAPHICS_INFO_MEM_TEST_2   3330  /* --------- Increment Test --------- */

#define	TEST_WARNMSG 	      4000
#define GRAPHICS_WARN_DMA_CMP      4001
#define GRAPHICS_WARN_DMA_SAVE     4002
#define GRAPHICS_WARN_DMA_REF_OPEN 4003

/*
 * ERRORs
 */
#define	GRAPHICS_ERR_RESET				        6107
#define	GRAPHICS_ERR_LOAD				        6108
#define	GRAPHICS_ERR_OPEN_LIBRARY			        6109
#define	GRAPHICS_ERR_NULL_CODES				        6110
#define	GRAPHICS_ERR_NULL_STRING			        6111
#define	GRAPHICS_ERR_MMAP			                6112
#define GRAPHICS_ERR_DMA_CMP 				        6204
#define GRAPHICS_ERR_OPEN_MSG 				        6205
#define GRAPHICS_ERR_DMA_MSG 				        6206
#define GRAPHICS_ERR_MEMORY_MSG 			        6207
#define GRAPHICS_ERR_CHIP_MSG 				        6208
#define GRAPHICS_ERR_OPEN 				        6209
#define GRAPHICS_ERR_DMA 				        6210
#define GRAPHICS_ERR_MEMORY 				        6211
#define GRAPHICS_ERR_CHIP 				        6212
#define GRAPHICS_ERR_CONNECTIVITY 			        6213
#define GRAPHICS_ERR_CONNECTIVITY_MSG 			        6214


#define GRAPHICS_ERR_1           7681  /* Error: @ x=, y=, expected, read  */
#define GRAPHICS_ERR_FILE        7682  /* Couldn't open file on host for writing */
#define GRAPHICS_ERR_2           7683  /* Error: @ x=, y=, expected, read  */
#define GRAPHICS_ERR_3           7684  /* More errors!!! */
#define GRAPHICS_ERR_BITS_1      7687  /* Bit: Package U / IO / Pin */
#define GRAPHICS_ERR_BITS_2      7688  /* Bit: Package U / IO / Pin */
#define GRAPHICS_ERR_MALLOC_FAIL 7689  /* !!!! malloc() failed!!!! */
#define GRAPHICS_ERR_ABORT       7690  /* Errors detected -- aborting*/

#endif /* _GRAPHICSTEST_H */
