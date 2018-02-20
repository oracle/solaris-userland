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



#ifndef	_FBC_KEYWDS_H
#define	_FBC_KEYWDS_H


int fbc_search_keywds(
	void		*keywd_table,	/* Table of recognized keywords */
	int		table_ent_len,	/* Keyword table entry length */
	const char * const keywd,	/* Keyword string to look up */
	const void	**match_ent_ptr); /* Returned ptr to matching entry */

void fbc_print_matching_keywds(
	void		*keywd_table,	/* Table of recognized keywords */
	int		table_ent_len,	/* Keyword table entry length */
	const char * const keywd);	/* Ambiguous keyword abbreviation */


#endif	/* _FBC_KEYWDS_H */


/* End of fbc_keywds.h */
