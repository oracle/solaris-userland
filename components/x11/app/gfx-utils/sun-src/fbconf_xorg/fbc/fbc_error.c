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



#include <stdarg.h>		/* va_end(), va_start(), vfprintf() */
#include <stdio.h>		/* fprintf() */

#include "configProcs.h"	/* Private function, etc. declarations */

#include "fbc_error.h"		/* Error reporting */


#if !defined(FBC_PROG_NAME)		/* Permit the Makefile to have a say */
#define	FBC_PROG_NAME	"fbconf_xorg"
#endif

const char	*fbc_prog_name = FBC_PROG_NAME;	/* Program name */


/*
 * fbc_errormsg()
 *
 *    Write a variable format error message to stderr, prefixed by the
 *    program name.
 */

void
fbc_errormsg(const char *format, ...)
{
	va_list		ap;		/* Variable argument pointer */

	fprintf(stderr, "%s: ", fbc_prog_name);
	va_start(ap, format);
	vfprintf(stderr, format, ap);
	va_end(ap);

}	/* fbc_errormsg() */


/*
 *
 * Copyright (c) 1997  Metro Link Incorporated
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE X CONSORTIUM BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
 * OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Except as contained in this notice, the name of the Metro Link shall not be
 * used in advertising or otherwise to promote the sale, use or other dealings
 * in this Software without prior written authorization from Metro Link.
 *
 */

/*
 * Error reporting functions (declared in configProcs.h) required by the
 * XFree86 configuration file parser:
 */

/*
 * ErrorF()
 *
 *    Write a variable format diagnostic message string, not prefixed by
 *    the program name, to stderr.
 */

void
ErrorF(const char *format, ...)
{
	va_list		ap;		/* Variable argument pointer */

	va_start(ap, format);
	vfprintf(stderr, format, ap);
	va_end(ap);
}


/*
 * VErrorF()
 *
 *    Write a variable format diagnostic message string, not prefixed by
 *    the program name, to stderr.  The variable argument list is
 *    provided by the caller's caller.
 *    (See scan.c of the XFree86 parser.)
 */

void
VErrorF(const char *format, va_list ap)
{
	vfprintf(stderr, format, ap);
}


/* End of fbc_error.c */
