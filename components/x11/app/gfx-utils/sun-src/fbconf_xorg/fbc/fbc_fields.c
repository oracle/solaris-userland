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
 * fbc_fields - Measure aligned whitespace fields
 */


#include <string.h>		/* memcpy(), memset() */

#include "fields.h"		/* Write aligned whitespace and text fields */

#include "fbc_fields.h"		/* Measure aligned whitespace fields */


/*
 * fbc_measure_whitespace()
 *
 *    Scan the first couple of whitespace fields in a non-comment
 *    configuration line.  Save versions of of these fields that have
 *    the text strings (non-whitespace) removed.  The xf86printFields()
 *    function can fill in other text strings, which may have different
 *    lengths.
 */

void
fbc_measure_whitespace(
	const char * const configBuf,	/* Configuration file line buffer */
	fbc_wspace_t	*wspace_chars)	/* Line's whitespace characteristics */
{
	int		column;		/* Zero-relative text column number */
	const char	*cptr;		/* Ptr into config file line buffer */
	const char	*cptr0;		/* Ptr into config file line buffer */
	int		field;		/* Whitespace field counter */
	char		wspace_char;	/* Whitespace char: Space or Tab */
	int		wspace_count;	/* Text string len in Spaces or Tabs */
	char		*wspace_ptr;	/* Ptr into whitespace buffer */

	/*
	 * Initialize to start scanning the configuration line
	 */
	cptr         = configBuf;
	column       = 0;
	wspace_char  = ' ';
	wspace_count = 0;
	wspace_ptr   = wspace_chars->whitespace_buf;

	/*
	 * Examine the first couple of whitespace fields of this line
	 */
	for (field = 0; field < FBC_WSPACE_FIELDS; field += 1) {
		/*
		 * Count the chars in the (possibly empty) whitespace string
		 */
		cptr0 = cptr;
		for ( ; ; cptr += 1) {
			if (*cptr == '\t') {
				column = (column / XF86_TAB_WIDTH + 1)
							* XF86_TAB_WIDTH;
				continue;
			}
			if (*cptr == ' ') {
				column += 1;
				continue;
			}
			break;		/* Nul or other non-whitespace */
		}

		/*
		 * Ignore comment lines (since those don't get modified)
		 */
		if ((*cptr == '#') && (field == 0)) {
			return;
		}

		/*
		 * Don't overrun the whitespace string buffer
		 */
		if ((wspace_count + (cptr - cptr0) + 1)
				> sizeof (wspace_chars->whitespace_buf)) {
			wspace_chars->whitespace[field] =
						xf86whitespace_1[field];
			continue;	/* Maybe the next string will fit */
		}

		/*
		 * Save this whitespace string pointer for possible future use
		 */
		wspace_chars->whitespace[field] = wspace_ptr;

		/*
		 * Make a string of Spaces or Tabs long as the prev text string
		 *
		 *    Note that there will be no previous text string on the
		 *    first iteration.
		 */
		memset(wspace_ptr, wspace_char, wspace_count);
		wspace_ptr += wspace_count;

		/*
		 * Append a copy of the just scanned whitespace string
		 */
		wspace_count = cptr - cptr0;
		memcpy(wspace_ptr, cptr0, wspace_count);
		wspace_ptr += wspace_count;
		*wspace_ptr = '\0';
		wspace_ptr += 1;

		/*
		 * Scan the text string that occupies this field
		 *
		 *    We want to get the equivalent length of the text
		 *    string, measured as a number (wspace_count) of
		 *    Spaces or Tabs (wspace_char), whichever character
		 *    follows the text string.
		 *      * Getting the length as an equivalent number of
		 *        Spaces is straightforward.
		 *      * Getting the length in Tabs actually means
		 *        counting the Tab Stops that are crossed by the
		 *        text string.
		 *
		 *    We also want to scan past the text string.
		 *
		 *    We're expecting to see the Space or Tab, but a
		 *    line terminator musn't be allowed to cause havoc.
		 *    (Inserting an Option line after an EndSubsection
		 *    line works, but it isn't formatted well.)
		 *
		 *    We're assuming that the text string doesn't
		 *    include whitespace (e.g. "Screen 0").  If it does,
		 *    the worst that can happen is a strangely formatted
		 *    output file.
		 */
		wspace_char  = ' ';
		wspace_count = 0;
		for ( ;
		    (*cptr != '\0') && (*cptr != ' ') && (*cptr != '\n');
		    cptr += 1) {
			if (*cptr == '\t') {
				wspace_char  = '\t';
				wspace_count = (column / XF86_TAB_WIDTH)
						- ((column - wspace_count)
							/ XF86_TAB_WIDTH);
				break;
			}
			column       += 1;
			wspace_count += 1;
		}
	}

	/*
	 * Mark the end of the whitespace array
	 */
	wspace_chars->whitespace[field] = NULL;

}	/* fbc_measure_whitespace() */


/* End of fbc_fields.c */
