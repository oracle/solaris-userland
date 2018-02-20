/*
 * Copyright (c) 2006, Oracle and/or its affiliates. All rights reserved.
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

#ifndef _LIBXFBVTS_H
#define _LIBXFBVTS_H

/**************************************************/
/* library header file for an Example Framebuffer */
/*
 * When implementing new graphics framebuffers, you
 * must use the below interfaces.
 * If you change them, then you need to update the
 * mapfile and the graphics_svts.c dlopen to use the
 * new 'version'. See Solaris docs on the Linker for
 * more info on doing this: docs.eng.sun.com     
 */


/* standard test masks */
#define GRAPHICS_TEST_OPEN  0x00000001
#define GRAPHICS_TEST_DMA   0x00000002
#define GRAPHICS_TEST_MEM   0x00000004
#define GRAPHICS_TEST_CHIP  0x00000008
#define GRAPHICS_TEST_MASK  0x0000000f

#define CONNECTIVITY_TEST -1

/* Return Packet */
/* this is a standard return type for all test functions */
typedef struct return_packet_t {
    int error_count; /* number of errors encountered before test abort */
    int message_count; /* total number of messages */
	int number_of_message_codes; /* the array length */
	int *message_codes;  /* the message codes */
	char **message_strings; /* the string to stick into the  mesg */
} return_packet;


typedef return_packet *(*gfxtest_function)(int); /* function ptr declaration */
/*: gfxtest_function(int filedescription) returning ptr to return_packet */

/* Test Info */
/* This structure has these members:
   - count  : the number of tests defined
   - this_test_mask : the test mask for test[0..count-1]
   - this_test_mesg : the test verbose message for test[0..count-1]
   - this_test_function : the actual test for test[0..count-1]

 An example:
  count = 1;
  this_test_mask = 0x1;
  this_test_mesg = VTS_DEFINED_VERBOSE_MESG_SUBTEST_VIDEO;
  this_test_function = subtest_video; 
  */

typedef struct gfxtest_info_t {
	int count;
	int *this_test_mask;
	int *this_test_mesg;
	gfxtest_function *this_test_function;
	gfxtest_function connection_test_function;
} gfxtest_info;

typedef int (*gfxtest_func_ptr)(gfxtest_info *);

/* You Must Implement these functions */
/* Get Tests:
   copies the array of masks, messages, and function ptrs into the
   gfxtest_info structure. The library does the malloc, so call cleanup
   before exit.
   Return: 0 for success, errno for failure.
   */
extern int get_tests(gfxtest_info *tests);
/* Cleanup Tests:
   free any memory allocated
   call to avoid memory leaks
   */
extern int cleanup_tests(gfxtest_info *tests);

#endif /* _LIBXFBVTS_H */
