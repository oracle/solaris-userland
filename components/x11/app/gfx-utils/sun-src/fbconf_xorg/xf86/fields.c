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

/* fields - Write aligned whitespace and text fields */

#include <stdarg.h>		/* Variable argument lists */
#include <stdio.h>		/* fprintf() */
#include <string.h>		/* strlen() */

#include "fields.h"		/* Config file output line fields */


/* Generic line indentation level 0  (e.g. Section line) */
const char * const xf86whitespace_0[] = {
	"",
	" ",
	" ",
	NULL
};


/* Generic line indentation level 1  (e.g. section entry line) */
const char * const xf86whitespace_1[] = {
	"\t",
	"\t\t",
	" ",
	NULL
};

/* Generic line indentation level 2  (e.g. subsection entry line) */
const char * const xf86whitespace_2[] = {
	"\t\t",
	"\t\t",
	" ",
	NULL
};


/*
 * xf86printFields()
 *
 *    Write whitespace and text fields such that each text field is
 *    left-aligned with the intended character column.
 *
 *    The end of the whitespace[] array is marked by a NULL element.
 *    The end of the text field string arguments (...) is marked by a
 *    NULL pointer.  The whitespace[0] string is written before the
 *    first text field.  The cycle of writing whitespace and text
 *    strings is terminated once either NULL is reached.
 */

void
xf86printFields(
	FILE		*cf,		/* Config file output stream */
	const char * const whitespace[], /* Array of whitespace strings */
	...)				/* NULL-terminated text field args */
{
	int		cur_col;	/* Current character column */
	int		field;		/* Loop counter / array index */
	int		field_col;	/* Character column of field */
	va_list		text_arg;	/* Ptr to text string arg */
	char		*text_ptr;	/* Ptr to text string */
	const char	*wspace;	/* Ptr into writable whitespace */
	int		wspace_len;	/* Column with of whitespace char */
	const char	*wspace_ptr;	/* Ptr into whitespace[] string */

	/*
	 * Initialize a pointer to the text string field arguments
	 */
	va_start(text_arg, whitespace);

	/*
	 * Repeat for each whitespace and (optional) text field pair
	 */
	field_col = 0;
	cur_col   = 0;
	text_ptr  = "";
	for (field = 0; whitespace[field] != NULL; field += 1) {
		/*
		 * Determine the column following the text string
		 */
		cur_col += strlen(text_ptr); /* Assume no ctrl chars, etc. */

		/*
		 * Scan the whitespace of the current field
		 */
		wspace = whitespace[field];
		for (wspace_ptr = wspace;
			*wspace_ptr != '\0';
			wspace_ptr += 1) {
			/*
			 * Ignore whitespace that is displaced by text
			 */
			if (field_col <= cur_col) {
				wspace = wspace_ptr;
			}

			/*
			 * Tally the column width of this whitespace character
			 */
			wspace_len = 1;	/* Assume it's a Space, not a Tab */
			if (*wspace_ptr == '\t') {
				wspace_len = XF86_TAB_WIDTH
						- (field_col % XF86_TAB_WIDTH);
			}
			field_col += wspace_len;
		}

		/*
		 * Write the text (if any) and the whitespace that follows
		 */
		if ((field > 0) && (field_col <= cur_col)) {
			wspace = " ";
			cur_col += 1;
		} else {
			cur_col = field_col;
		}
		fputs(text_ptr, cf);
		fputs(wspace, cf);

		/*
		 * Get the next text string, if any
		 */
		text_ptr = va_arg(text_arg, char *);
		if (text_ptr == NULL) {
			break;
		}
	}

	/*
	 * Stop pointing to the text string field arguments
	 */
	va_end(text_arg);

}	/* xf86printFields() */


/* End of fields.c */
