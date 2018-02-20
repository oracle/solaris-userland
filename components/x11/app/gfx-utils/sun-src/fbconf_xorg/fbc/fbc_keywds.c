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
 * fbc_keywds - Command line keyword look-up
 */


#include <stdio.h>		/* fprintf(), fputs() */
#include <string.h>		/* strlen(), strncasecmp() */

#include "fbc_error.h"		/* Error reporting */
#include "fbc_keywds.h"		/* Command line keyword look-up */


/*
 * fbc_search_keywds()
 *
 *    Given a table of recognized keywords and a user-submitted keyword
 *    string, search the table for a matching keyword.  The search is
 *    case insensitive and unique abbreviations are accepted.  Keyword
 *    table entries must be of uniform length and begin with a (char *)
 *    pointer to the keyword string.
 */

int
fbc_search_keywds(
	void		*keywd_table,	/* Table of recognized keywords */
	int		table_ent_len,	/* Keyword table entry length */
	const char * const keywd,	/* Keyword string to look up */
	const void	**match_ent_ptr) /* Returned ptr to matching entry */
{
	int		error_code;	/* Error code */
	size_t		keywd_len;	/* Len of user-submitted keywd */
	const void	*table_ent_ptr;	/* Ptr to keyword entry in table */
	size_t		table_keywd_len; /* Length of keyword from table */

	/*
	 * No matching keyword found yet
	 */
	*match_ent_ptr = NULL;
	error_code     = FBC_ERR_KWD_INVALID;

	/*
	 * Examine each entry in the keyword table for a match
	 */
	keywd_len = strlen(keywd);
	for (table_ent_ptr = keywd_table;
		*(char **)table_ent_ptr != NULL;
		table_ent_ptr =
			(void *)((char *)table_ent_ptr + table_ent_len)) {

		table_keywd_len = strlen(*(char **)table_ent_ptr);
		if ((keywd_len <= table_keywd_len) &&
			(strncasecmp(keywd, *(char **)table_ent_ptr, keywd_len)
					== 0)) {
			error_code = FBC_SUCCESS;  /* Tentative match */
			if (*match_ent_ptr != NULL) {
				error_code = FBC_ERR_KWD_AMBIGUOUS;
			}
			*match_ent_ptr = table_ent_ptr;
			if (keywd_len == table_keywd_len) {
				return (FBC_SUCCESS);  /* Exact match */
			}
		}

	}

	/*
	 * Return with a table entry for a unique abbreviation or with an error
	 */
	return (error_code);

}	/* fbc_search_keywds() */


/*
 * fbc_print_matching_keywds()
 *
 *    Given a table of recognized keywords and an ambiguous keyword
 *    abbreviation (as flagged by fbc_search_keywds()), display on
 *    stderr all of the keywords in the table that match the
 *    abbreviation.  Keyword table entries must be of uniform length and
 *    begin with a (char *) pointer to the keyword string.
 */

void
fbc_print_matching_keywds(
	void		*keywd_table,	/* Table of recognized keywords */
	int		table_ent_len,	/* Keyword table entry length */
	const char	* const	keywd)	/* Ambiguous keyword abbreviation */
{
	size_t		keywd_len;	/* Len of user-submitted keywd */
	const void	*table_ent_ptr;	/* Ptr to keyword entry in table */
	size_t		table_keywd_len; /* Length of keyword from table */

	/*
	 * Examine each entry in the keyword table for a match
	 */
	keywd_len = strlen(keywd);
	for (table_ent_ptr = keywd_table;
		*(char **)table_ent_ptr != NULL;
		table_ent_ptr =
			(void *)((char *)table_ent_ptr + table_ent_len)) {

		table_keywd_len = strlen(*(char **)table_ent_ptr);
		if ((keywd_len <= table_keywd_len) &&
			(strncasecmp(keywd, *(char **)table_ent_ptr, keywd_len)
					== 0)) {
			fprintf(stderr, "\t%s\n", *(char **)table_ent_ptr);
		}

	}

}	/* fbc_print_matching_keywds() */


/* End of fbc_keywds.c */
