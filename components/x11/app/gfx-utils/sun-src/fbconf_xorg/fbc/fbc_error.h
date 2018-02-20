/*
 * Copyright (c) 2004, 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_error - Error reporting
 */



#ifndef	_FBC_ERROR_H
#define	_FBC_ERROR_H


/*
 * Program exit codes
 */
enum {
	FBC_EXIT_SUCCESS	= 0,	/* No errors */
	FBC_EXIT_USAGE		= 1,	/* Usage error */
	FBC_EXIT_FAILURE	= 2	/* Program execution error */
};


/*
 * Error codes
 *
 *    These values often do not have special significance, aside from
 *    being zero vs. non-zero return codes and as potential debugging
 *    aids.
 */
enum {
	FBC_SUCCESS = 0,		/* No errors */
	FBC_ERR_NOMEM,			/* Insufficient memory */
	FBC_ERR_PATH_LEN,		/* Pathname is too long */
	FBC_ERR_NAME_LEN,		/* Name (e.g., device) is too long */
	FBC_ERR_READLINK,		/* Symbolic link resolution error */
	FBC_ERR_STAT,			/* File status query error */
	FBC_ERR_OPEN,			/* File open error */
	FBC_ERR_IOCTL,			/* File I/O control error */
	FBC_ERR_SEEK,			/* File positioning error */
	FBC_ERR_READ,			/* File input error */
	FBC_ERR_ACCESS,			/* File access permissions error */
	FBC_ERR_RENAME,			/* File renaming error */
	FBC_ERR_KWD_INVALID,		/* Invalid keyword */
	FBC_ERR_KWD_AMBIGUOUS,		/* Ambiguous keyword */
	FBC_ERR_OPT_CONFLICT,		/* Conflicting command line option */
	FBC_ERR_GAMMA_VALUE,		/* Invalid gamma correction value */
	FBC_ERR_GAMMA_COUNT,		/* Wrong number of gamma values */
	FBC_ERR_GAMMA_PACK,		/* Gamma value packing error */
	FBC_ERR_GENERAL			/* (*TBD*) All-purpose non-zero code */
};


extern const char	*fbc_prog_name;	/* Program name */


void fbc_errormsg(const char *format, ...);


#endif	/* _FBC_ERROR_H */


/* End of fbc_error.h */
