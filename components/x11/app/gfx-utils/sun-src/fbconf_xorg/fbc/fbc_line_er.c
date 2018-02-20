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


#include <sys/types.h>		/* off_t */
#include <stdio.h>		/* NULL */
#include <stdlib.h>		/* exit(), free(), malloc() */

#include "xf86Parser.h"		/* Public function, etc. declatations */
#include "Configint.h"		/* Private definitions, etc. */
#include "configProcs.h"	/* Private function, etc. declarations */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_line_er.h"	/* External Representation of config lines */


/*
 * The External Representation of the configuration file is used to
 * maintain the order and formatting of the lines from the input file.
 * The XFree86 parser code has not been designed to preserve
 * configuration file text that has not been modified.  Consequently,
 * the high-level xf86printXxxxx() functions are not used to write the
 * output file.
 */


/*
 * Doubly-linked list of config line External Representations
 */
fbc_line_list_t	fbc_line_ER_list = {
	NULL,		/* Ptr to first config line ER */
	NULL,		/* Ptr to last  config line ER */
};


/*
 * fbc_ER_list_first()
 *
 *    Return a pointer to the first config line External Representation
 *    in the list, else NULL.
 */

fbc_line_elem_t *
fbc_ER_list_first(void)
{

	return (fbc_line_ER_list.head_ptr);

}	/* fbc_ER_list_first() */


/*
 * fbc_list_append()
 *
 *    Append a new config line External Representation to the doubly-
 *    linked list.
 */

static
void
fbc_list_append(
	fbc_line_list_t *line_ER_list,	/* List of configuration data lines */
	fbc_line_elem_t *element)	/* Ptr to new element */
{

	element->next_ptr = NULL;
	element->prev_ptr = line_ER_list->tail_ptr;
	if (line_ER_list->tail_ptr == NULL) {
		line_ER_list->head_ptr = element;
	} else {
		line_ER_list->tail_ptr->next_ptr = element;
	}
	line_ER_list->tail_ptr = element;

}	/* fbc_list_append() */


/*
 * fbc_list_insert_prev()
 *
 *    Insert a new element into the doubly-linked list, making it the
 *    previous element of the specified element.
 */

static
void
fbc_list_insert_prev(
	fbc_line_list_t *line_ER_list,	/* List of configuration data lines */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	fbc_line_elem_t *new_line_er)	/* Ptr to ER for new config line */
{

	new_line_er->next_ptr  = next_line_er;
	new_line_er->prev_ptr  = next_line_er->prev_ptr;
	next_line_er->prev_ptr = new_line_er;
	if (line_ER_list->head_ptr == next_line_er) {
		line_ER_list->head_ptr = new_line_er;
	} else {
		new_line_er->prev_ptr->next_ptr = new_line_er;
	}

}	/* fbc_list_insert_prev() */


/*
 * fbc_list_free()
 *
 *    Free the elements of the doubly-linked list of configuration
 *    lines.
 */

void
fbc_list_free(
	fbc_line_list_t *line_ER_list)	/* List of configuration data lines */
{
	fbc_line_elem_t *cur_line_er;	/* Ptr to current list element */
	fbc_line_elem_t *next_ptr;	/* Ptr to  next   list element */

	for (cur_line_er = line_ER_list->head_ptr;
	    cur_line_er != NULL;
	    cur_line_er = next_ptr) {
		next_ptr = cur_line_er->next_ptr;
		free(cur_line_er);
	}

	line_ER_list->head_ptr = NULL;
	line_ER_list->tail_ptr = NULL;

}	/* fbc_list_free() */


/*
 * fbc_save_line_location()
 *
 *    Create, initialize, and append a new config line element to the
 *    doubly-linked list.
 */

void
fbc_save_line_location(
	FILE		*config_stream_in, /* Config file input stream */
	off_t		line_pos)	/* Position of line in config file */
{
	fbc_line_elem_t *line_er;	/* Ptr to ER data for a config line */

	/*
	 * Check for ftell() error encountered by xf86getToken() in scan.c
	 */
	if (line_pos < 0) {
		fbc_errormsg("Invalid file offset for configuration line\n");
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Save the External Representation of the configuration line
	 */
	line_er = malloc(sizeof (fbc_line_elem_t));
	if (line_er == NULL) {
		fbc_errormsg(
		"Insufficient memory while saving config line at offset %d\n",
		       line_pos);
		exit(FBC_EXIT_FAILURE);
	}
	line_er->config_stream_in = config_stream_in;
	line_er->line_pos         = line_pos;
	line_er->ir_ptr           = NULL;	/* No Internal Rep data yet */
	line_er->print_fn         = NULL;	/* No Internal Rep data yet */
	line_er->status           = FBC_LINE_ORIGINAL;

	fbc_list_append(&fbc_line_ER_list, line_er);

}	/* fbc_save_line_location() */


/*
 * fbc_get_current_line_ER()
 *
 *    Return the pointer to the External Representation of the current
 *    line.  This facilitates the linking of the External and Internal
 *    Representations of this line of the configuration file.
 */

fbc_line_elem_t *
fbc_get_current_line_ER(void)
{

	return (fbc_line_ER_list.tail_ptr);

}	/* fbc_get_current_line_ER() */


/*
 * fbc_link_line_ER()
 *
 *    Store the opaque pointer to the config line's Internal
 *    Representation with the line's External Representation.
 */

void
fbc_link_line_ER(
	fbc_line_elem_t *er_ptr,	/* Ptr to ER data for a config line */
	void		*ir_ptr,	/* Ptr to IR data for a config line */
	xf86_print_fn_t	*print_fn,	/* Configuration line print function */
	unsigned char	indent_level)	/* Indentation level: FBC_INDENT_n */
{

	er_ptr->ir_ptr       = ir_ptr;
	er_ptr->print_fn     = print_fn;
	er_ptr->indent_level = indent_level;

}	/* fbc_link_line_ER() */


/*
 * fbc_insert_line_ER()
 *
 *    Insert the specfied External Representation of a config line and
 *    mark it as inserted.  Return a pointer to the new line's ER.
 */

fbc_line_elem_t *
fbc_insert_line_ER(
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	void		*ir_ptr,	/* Ptr to IR data for a config line */
	xf86_print_fn_t	*print_fn,	/* Configuration line print function */
	unsigned char	indent_level)	/* Indentation level: FBC_INDENT_n */
{
	fbc_line_elem_t *new_line_er;	/* Ptr to ER data for a config line */

	new_line_er = malloc(sizeof (fbc_line_elem_t));
	if (new_line_er == NULL) {
		fbc_errormsg(
			"Insufficient memory, inserting line IR\n");
	} else {
		new_line_er->config_stream_in = NULL;
		new_line_er->line_pos         = -1;
		new_line_er->ir_ptr           = ir_ptr;
		new_line_er->print_fn         = print_fn;
		new_line_er->status           = FBC_LINE_INSERTED;
		new_line_er->indent_level     = indent_level;

		if (next_line_er == NULL) {
			fbc_list_append(&fbc_line_ER_list, new_line_er);
		} else {
			if (indent_level == FBC_INDENT_ENTRY) {
				/*
				 * Determine the real indentation of this line
				 *
				 *    Entries are indented by one level
				 *    (FBC_INDENT_1) within sections, by
				 *    two levels (FBC_INDENT_2) in
				 *    subsections, etc.  We happen to
				 *    know that new entry lines are
				 *    always inserted just before the
				 *    existing EndSection or
				 *    EndSubsection line, the
				 *    indentation of which is known.
				 */
				new_line_er->indent_level =
					next_line_er->indent_level + 1;
			}
			fbc_list_insert_prev(
				&fbc_line_ER_list, next_line_er, new_line_er);
		}
	}

	return (new_line_er);

}	/* fbc_insert_line_ER() */


/*
 * fbc_modify_line_ER()
 *
 *    In the External Representation, mark the specified line as
 *    modified.
 */

void
fbc_modify_line_ER(
	fbc_line_elem_t *line_er)	/* Ptr to ER data for a config line */
{

	line_er->status = FBC_LINE_MODIFIED;

}	/* fbc_modify_line_ER() */


/*
 * fbc_edit_line_ER()
 *
 *    Arrange to insert or to modify the External Representation of the
 *    specified config line.
 */

void
fbc_edit_line_ER(
	fbc_line_elem_t **line_er,	/* Ptr to ER data for a config line */
	fbc_line_elem_t *next_line_er,	/* Ptr to ER for a config line */
	void		*ir_ptr,	/* Ptr to IR context for a line */
	xf86_print_fn_t	*print_fn,	/* Configuration line print function */
	unsigned char	indent_level)	/* Indentation level: FBC_INDENT_n */
{

	/*
	 * Distinguish between inserting and modifying a config line
	 */
	if (*line_er == NULL) {
		/*
		 * Insert a new config line
		 */
		*line_er = fbc_insert_line_ER(
				next_line_er, ir_ptr, print_fn, indent_level);
	} else {
		/*
		 * Modify the existing config line
		 */
		fbc_modify_line_ER(*line_er);
	}

}	/* fbc_edit_line_ER() */


/*
 * fbc_delete_line_ER()
 *
 *    Mark the  External Representation of the specified config line as
 *    deleted (unless it already doesn't exist).
 */

void
fbc_delete_line_ER(
	fbc_line_elem_t *line_er)	/* Ptr to ER data for a config line */
{

	if (line_er != NULL) {
		line_er->ir_ptr = NULL;	/* Assignment should be redundant */
		line_er->status = FBC_LINE_DELETED;
	}

}	/* fbc_delete_line_ER() */


/*
 * fbc_close_down_config()
 *
 *    Close the input configuration file(s) and release memory for the
 *    list of config line External Representations.
 *
 *    This function mimics the relevant features of and is used in place
 *    of the xf86closeConfigFile() function in scan.c, and must be
 *    maintained accordingly.  (Note that the "builtinConfig" stuff is
 *    not relevant.)
 */

void
fbc_close_down_config(void)
{
	FILE		*config_stream_in; /* Config file input stream */
	fbc_line_elem_t *line_er;	/* Ptr to current list element */

	/*
	 * Close each input configuration file stream recorded in the list
	 *
	 *    Note that xf86closeConfigFile() in scan.c closes only one
	 *    config file stream, while the line ER list may know of two
	 *    or more.
	 */
	config_stream_in = NULL;
	for (line_er = fbc_line_ER_list.head_ptr;
	    line_er != NULL;
	    line_er = line_er->next_ptr) {
		if ((line_er->status != FBC_LINE_INSERTED) &&
		    (config_stream_in != line_er->config_stream_in)) {
			config_stream_in = line_er->config_stream_in;
			fclose(config_stream_in);
		}
	}

	/*
	 * Free the configuration line External Representation list
	 */
	fbc_list_free(&fbc_line_ER_list);

	/*
	 * Free the memory used in scanning the configuration file(s)
	 */
	xf86confScanFree();

}	/* fbc_close_down_config() */


/* End of fbc_line_er.c */
