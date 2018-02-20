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
 * fbc_line_er - External Representation of config lines
 */



#ifndef	_FBC_LINE_ER_H
#define	_FBC_LINE_ER_H


#include <sys/types.h>		/* off_t */
#include <stdio.h>		/* FILE */


/*
 * Configuration line editing status (External Representation)
 */
typedef enum {
	FBC_LINE_ORIGINAL = 0,		/* Line is unchanged */
	FBC_LINE_INSERTED,		/* Line is new */
	FBC_LINE_MODIFIED,		/* Line is modified */
	FBC_LINE_DELETED		/* Line is deleted */
} line_stat_t;

/*
 * Configuration line indentation levels (incrementable) for inserted lines
 */
enum {
	FBC_INDENT_0	= 0,		/* Indentation level 0 */
	FBC_INDENT_1,			/* Indentation level 1 */
	FBC_INDENT_2,			/* Indentation level 2 */
	FBC_INDENT_ENTRY		/* Option in a section or subsection */
};

/*
 * Configuration line's xf86printXxxxx() function
 */
typedef	void xf86_print_fn_t(
		FILE	*config_stream_out, /* Config file output stream */
		void	*ir_ptr,	/* Ptr to Internal Rep data */
		const	char *const whitespace[]); /* Line indentation */

/*
 * Configuration line's original or modified External Representation
 */
typedef struct fbc_line_elem_st {
	struct fbc_line_elem_st *next_ptr; /* Ptr to next line element */
	struct fbc_line_elem_st *prev_ptr; /* Ptr to previous line element */
	FILE		*config_stream_in; /* Config file input stream */
	off_t		line_pos;	/* Position of line in config file */
	void		*ir_ptr;	/* Ptr to IR data, else NULL */
	xf86_print_fn_t	*print_fn;	/* Configuration line print function */
	unsigned char	status;		/* Line status: FBC_LINE_XXXXX */
	unsigned char	indent_level;	/* Indentation level: FBC_INDENT_n */
} fbc_line_elem_t;

typedef struct {
	fbc_line_elem_t *head_ptr;	/* Ptr to first line list element */
	fbc_line_elem_t *tail_ptr;	/* Ptr to last  line list element */
} fbc_line_list_t;

extern fbc_line_list_t	fbc_line_ER_list; /* Config line External Reps */


#define	FBC_FIRST_ER	fbc_ER_list_first() /* Start of the ER list */
#define	FBC_LAST_ER	NULL		/* End of the ER list */


fbc_line_elem_t *fbc_ER_list_first(void);

void fbc_list_free(
	fbc_line_list_t *linePosList);	/* List of configuration data lines */

void fbc_save_line_location(
	FILE		*config_stream_in, /* Config file input stream */
	off_t		line_pos);	/* Position of line in config file */

fbc_line_elem_t *fbc_get_current_line_ER(void);

void fbc_link_line_ER(
	fbc_line_elem_t *er_ptr,	/* Ptr to ER data for a config line */
	void		*ir_ptr,	/* Ptr to IR data for a config line */
	xf86_print_fn_t	*print_fn,	/* Configuration line print function */
	unsigned char	indent_level);	/* Indentation level: FBC_INDENT_n */

fbc_line_elem_t *fbc_insert_line_ER(
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	void		*ir_ptr,	/* Ptr to IR data for a config line */
	xf86_print_fn_t	*print_fn,	/* Configuration line print function */
	unsigned char	indent_level);	/* Indentation level: FBC_INDENT_n */

void fbc_modify_line_ER(
	fbc_line_elem_t *line_er);	/* Ptr to ER data for a config line */

void fbc_edit_line_ER(
	fbc_line_elem_t **line_er,	/* Ptr to ER data for a config line */
	fbc_line_elem_t *next_line_er,	/* Ptr to ER for a config line */
	void		*ir_ptr,	/* Ptr to IR context for a line */
	xf86_print_fn_t	*print_fn,	/* Configuration line print function */
	unsigned char	indent_level);	/* Indentation level: FBC_INDENT_n */

void fbc_delete_line_ER(
	fbc_line_elem_t *line_er);	/* Ptr to ER data for a config line */

void fbc_close_down_config(void);


#endif	/* _FBC_LINE_ER_H */


/* End of fbc_line_er.h */
