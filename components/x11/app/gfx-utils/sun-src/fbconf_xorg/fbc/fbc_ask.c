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
 * fbc_ask - User interaction
 */


#include <ctype.h>		/* iscntrl(), toupper() */
#include <stdarg.h>		/* va_end(), va_start(), vfprintf() */
#include <stdio.h>		/* fflush(), fgets(), fprintf() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_ask.h"		/* User interaction */
#include "fbc_error.h"		/* Error reporting */


/*
 * fbc_ask_yes_no()
 *
 *    Ask a variable format yes/no question of the user, read the reply,
 *    and return TRUE iff the reply seems to be in the affirmative.
 */

int
fbc_ask_yes_no(
	const char	*format,	/* Prompt format string */
	...)				/* Variable argument list for prompt */
{
	va_list		ap;		/* Variable argument pointer */
	char		input_buf[128];	/* Yes/no input buffer */
	int		reply;		/* TRUE => Affirmative response */

	/*
	 * Flush any fbc_errormsg() messages that might explain why we're here
	 */
	fflush(stderr);

	/*
	 * Ask the question until an answer makes sense
	 */
	va_start(ap, format);

	reply = FALSE;
	for (;;) {
		/*
		 * Display the variable format yes/no prompt
		 */
		(void) fprintf(stdout, "%s: ", fbc_prog_name);
		(void) vfprintf(stdout, format, ap);

		/*
		 * Read the reply, and return the sense of the answer
		 *
		 *    Ignore any but the first input character.
		 *    Treat 'Y' or 'y' as affirmative.
		 *    Treat 'N' or 'n' as negative.
		 *    Treat Newline, Nul, or any other control character
		 *    as negative.
		 *    Treat EOF or any input error as negative.
		 *    Loop again if the cat stepped on some other key.
		 */
		if ((fgets(input_buf, sizeof (input_buf), stdin) == NULL) ||
		    iscntrl(input_buf[0]) ||
		    (toupper(input_buf[0]) == 'N')) {
			break;
		}
		if (toupper(input_buf[0]) == 'Y') {
			reply = TRUE;
			break;
		}
	}

	va_end(ap);

	return (reply);

}	/* fbc_ask_yes_no() */


/* End of fbc_ask.c */
