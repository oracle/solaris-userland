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
 * fbc_gamma_table - Read, pack, and write a gamma table
 */


#include <sys/types.h>
#include <ctype.h>		/* isspace() */
#include <fcntl.h>
#include <stdio.h>		/* fclose(), feof(), fgets(), fopen(), ... */
#include <stdlib.h>		/* free(), malloc(), strchr(), strtoul() */
#include <string.h>		/* strcat(), strcpy(), strlen(), strrchr() */
#include <sys/stat.h>		/* stat() */

#include "gfx_gamma_pack.h"	/* gfx_pack_gamma_string_16() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_gamma_table.h"	/* Read, pack, and write a gamma table table */


#define	MAX_LINE_LEN	1024		/* Max length of gamma file line */

#define	NUM_COLORS	3		/* # of colors in RGB triplet */

#define	MAX_GAMMA_VALUE	0x0FFF		/* Maximum gamma value */


/*
 * fbc_read_users_gamma_table()
 *
 *    Read a text file containing the user's Red-Green-Blue gamma
 *    correction value triplets.  Return arrays of Red, Green, and Blue
 *    gamma binary values.
 *
 *    Gamma file syntax:
 *        <file>    =:: <line>...
 *        <line>    =:: [<sp>][<number>[<sp><number>]...]<eol>
 *        <sp>      =:: ' '|'\t'...
 *                   # Whitespace character recognized by isspace()
 *        <number>  =:: <octal_int> | <decimal_int> | <hexadecimal_int>
 *                   # Numeric string recognized by strtoul(,,0)
 *        <eol>     =:: [<comment>]'\n'
 *        <comment> =:: '#'[<text>]
 *
 *    Gamma file example:
 *        #
 *        # Gamma correction table for fictitious FB device
 *        #
 *
 *        0x000   0x000   0x000   #    0
 *        0x001   0x001   0x001   #    1
 *        0x002   0x002   0x002   #    2
 *         ...     ...     ...    . ...
 *        0x3FF   0x3FF   0x3FF   # 1023
 *
 *        # End of gamma_file.txt
 */

static
int
fbc_read_users_gamma_table(
	const char	*gfile_in_path,	/* Pathname of input gamma file */
	int		lut_size,	/* Gamma look-up table size */
	unsigned short	gamma_red[],	/* Returned Red   gamma values */
	unsigned short	gamma_green[],	/* Returned Green gamma values */
	unsigned short	gamma_blue[])	/* Returned Blue  gamma values */
{
	char		*end_ptr;	/* Ptr to terminator char */
	int		error_code;	/* Returned error code */
	int		gamma_count;	/* # of gamma values encountered */
	FILE		*gamma_in_stream; /* Gamma file stream descriptor */
	unsigned long	gamma_value;	/* Current gamma value */
	int		i;		/* RGB array indices */
	char		line_buf[MAX_LINE_LEN + 1]; /* Gamma line buffer */
	int		line_num;	/* Gamma file line number */
	char		*line_ptr;	/* Ptr into gamma file line buffer */

	/*
	 * Assume no errors
	 */
	error_code = FBC_SUCCESS;

	/*
	 * Open the user's text file containing a gamma correction table
	 */
	gamma_in_stream = fopen(gfile_in_path, "r");
	if (gamma_in_stream == NULL) {
		fbc_errormsg("Can't open input gamma file, %s\n",
				gfile_in_path);
		return (FBC_ERR_OPEN);
	}

	/*
	 * Read the gamma table, parsing a lut_size number of RGB triplets
	 */
	line_num  = 0;
	line_ptr  = &line_buf[0];
	*line_ptr = '\0';		/* Empty line buffer */
	for (gamma_count = 0; ; ) {
		/*
		 * Get the next non-whitespace, non-comment character
		 */
		if ((*line_ptr == '\0') || (*line_ptr == '#')) {
			/*
			 * Read a text line from the gamma file
			 */
			line_num += 1;
			if (fgets(line_buf, MAX_LINE_LEN, gamma_in_stream)
						== NULL) {
				if (feof(gamma_in_stream) == 0) {
					error_code = FBC_ERR_READ;
					fbc_errormsg(
				"Error reading gamma file, %s, line %d\n",
						gfile_in_path, line_num);
					break;	/* Gamma file input error */
				}

				/*
				 * Check for correct # of RGB triplets
				 */
				if (gamma_count !=
					(NUM_COLORS * lut_size)) {
					/* Wrong # of gamma values */
					error_code = FBC_ERR_GAMMA_COUNT;
					fbc_errormsg(
				"Too few gamma values in file, %s, line %d\n",
						gfile_in_path, line_num);
				}
				break;	/* End of gamma file */
			}
			line_ptr = &line_buf[0];
			continue;
		}
		if (isspace(*line_ptr)) {
			line_ptr += 1;
			continue;
		}

		/*
		 * Parse the hexadecimal, decimal, or octal value
		 */
		gamma_value = strtoul(line_ptr, &end_ptr, 0);
		if ((end_ptr <= line_ptr) || (gamma_value > MAX_GAMMA_VALUE)) {
			error_code = FBC_ERR_GAMMA_VALUE;
			fbc_errormsg("Invalid gamma value, %s, line %d\n",
					gfile_in_path, line_num);
			break;
		}
		line_ptr = end_ptr;

		/*
		 * Make sure gamma file doesn't contain too many gamma values
		 */
		i = gamma_count / NUM_COLORS;
		if (i >= lut_size) {
			error_code = FBC_ERR_GAMMA_COUNT;
			fbc_errormsg(
				"Too many gamma values in file, %s, line %d\n",
					gfile_in_path, line_num);
			break;
		}

		/*
		 * Save the Red, Green, or Blue gamma correction value
		 */
		switch (gamma_count % NUM_COLORS) {
		case 0:
			gamma_red[i]   = (unsigned short)gamma_value;
			break;
		case 1:
			gamma_green[i] = (unsigned short)gamma_value;
			break;
		case 2:
			gamma_blue[i]  = (unsigned short)gamma_value;
			break;
		}
		gamma_count += 1;
	}

	/*
	 * Close the input gamma file
	 */
	fclose(gamma_in_stream);

	return (error_code);

}	/* fbc_read_users_gamma_table() */


/*
 * fbc_read_gamma_table()
 *
 *    Read a text file containing the user's gamma correction table,
 *    consisting of a lut_size number of Red-Green-Blue triplet values.
 *    Return pointers to dynamically allocated packed strings of Red,
 *    Green, and Blue gamma correction values.
 */

int
fbc_read_gamma_table(
	const char	*gfile_in_path,	/* Pathname of input gamma file */
	int		lut_size,	/* # of RGB triplets in gamma file */
	char		**gamma_string_red, /* Returned packed Red values */
	char		**gamma_string_green, /* Returned packed Green vals */
	char		**gamma_string_blue) /* Returned packed Blue values */
{
	int		error_code;	/* Returned error code */
	uint16_t	*gt_data_red;	/* Red   gamma input values array */
	uint16_t	*gt_data_green;	/* Green gamma input values array */
	uint16_t	*gt_data_blue;	/* Blue  gamma input values array */

	/*
	 * Show that the strings for packed gamma values aren't allocated yet
	 *
	 *    Our caller may have done this already, since the caller is
	 *    responsible for releasing the memory.
	 */
	*gamma_string_red   = NULL;
	*gamma_string_green = NULL;
	*gamma_string_blue  = NULL;

	/*
	 * Allocate arrays for the input gamma table data
	 */
	gt_data_red = (uint16_t *)malloc(
				lut_size * NUM_COLORS * sizeof (uint16_t));
	if (gt_data_red == NULL) {
		fbc_errormsg("Insufficient memory, %s\n", gfile_in_path);
		return (FBC_ERR_NOMEM);
	}
	gt_data_green = gt_data_red   + lut_size;
	gt_data_blue  = gt_data_green + lut_size;

	/*
	 * Read the gamma correction table data from the user's gamma file
	 */
	error_code = fbc_read_users_gamma_table(
				gfile_in_path, lut_size,
				gt_data_red, gt_data_green, gt_data_blue);
	if (error_code == FBC_SUCCESS) {
		/*
		 * Pack the gamma correction values into dynamic strings
		 */
		if ((gfx_pack_gamma_string_16(
			gamma_string_red, lut_size, gt_data_red) <= 0) ||
		    (gfx_pack_gamma_string_16(
			gamma_string_green, lut_size, gt_data_green) <= 0) ||
		    (gfx_pack_gamma_string_16(
			gamma_string_blue, lut_size, gt_data_blue) <= 0)) {
		  	/*
			 * Handle a gamma data packing error
			 */
			fbc_free_gamma_strings(*gamma_string_red,
						*gamma_string_green,
						*gamma_string_blue);
			*gamma_string_red   = NULL;
			*gamma_string_green = NULL;
			*gamma_string_blue  = NULL;
			fbc_errormsg("Error packing gamma table data, %s\n",
					gfile_in_path);
			error_code = FBC_ERR_GAMMA_PACK;
		}
	}

	/*
	 * Release the input gamma table data arrays
	 */
	free(gt_data_red);

	return (error_code);

}	/* fbc_read_gamma_table() */


/*
 * fbc_build_gamma_table_path()
 *
 *    Construct the output gamma correction table pathname.  The
 *    directory component will be the same as for the configuration
 *    file.  The file name will be unique for the frame buffer device,
 *    consisting of the device name with a ".gamma" extension.
 */

int
fbc_build_gamma_table_path(
	const char	*config_file_path, /* Configuration file pathname */
	const char	*device_name,	/* Frame buffer device name */
	char		*gfile_path_buf, /* Gamma table output pathname buf */
	int		gfile_path_buf_len) /* Gamma table path buf len */
{
	size_t		dir_len;	/* Length of directory path */
	char		*dir_ptr;	/* Ptr to last "/" in directory path */

	dir_ptr = strrchr(config_file_path, '/');
	dir_len = 0;			/* Case of no directory component */
	if (dir_ptr != NULL) {
		dir_len = dir_ptr - config_file_path + 1;
	}
	if ((dir_len + strlen(device_name) + strlen(GAMMA_TABLE_EXT))
				>= gfile_path_buf_len) {
		fbc_errormsg("Gamma table pathname is too long\n");
		return (FBC_ERR_PATH_LEN);
	}
	memcpy(gfile_path_buf, config_file_path, dir_len);
	strcpy(gfile_path_buf + dir_len, device_name);
	strcat(gfile_path_buf, GAMMA_TABLE_EXT);

	return (FBC_SUCCESS);

}	/* fbc_build_gamma_table_path() */


/*
 * fbc_write_packed_gamma_table()
 *
 *    Write a packed gamma correction table to a newly created file.
 *    The file will contain three lines of characters, each ending with
 *    a Newline character.
 */

int
fbc_write_packed_gamma_table(
	const char	*gfile_out_path, /* Pathname of output gamma file */
	char		*gamma_string_red, /* Packed Red values string */
	char		*gamma_string_green, /* Packed Green values string */
	char		*gamma_string_blue) /* Packed Blue values string */
{
	FILE		*gamma_out_stream; /* Gamma file stream descriptor */

	/*
	 * Delete, create, and open the output packed gamma table file
	 */
	gamma_out_stream = fopen(gfile_out_path, "w");
	if (gamma_out_stream == NULL) {
		fbc_errormsg("Can't create and open output gamma file, %s\n",
				gfile_out_path);
		return (FBC_ERR_OPEN);
	}

	/*
	 * Write the packed gamma correction table to the file
	 */
	fprintf(gamma_out_stream, "%s\n", gamma_string_red);
	fprintf(gamma_out_stream, "%s\n", gamma_string_green);
	fprintf(gamma_out_stream, "%s\n", gamma_string_blue);

	/*
	 * Close the new gamma table file
	 */
	fclose(gamma_out_stream);

	return (FBC_SUCCESS);

}	/* fbc_write_packed_gamma_table() */


/*
 * fbc_read_packed_gamma_table()
 *
 *    Read the contents of a packed gamma table file into a single
 *    dynamically allocated buffer.  The file should contain three lines
 *    of characters, each ending with a Newline character.  Other than
 *    the presence of Newlines, no assumptions are made concerning the
 *    lengths of the lines.  Each Newline character is replaced by a
 *    Nul.  Pointers to the three RGB Nul-terminated strings are
 *    returned.
 */

int
fbc_read_packed_gamma_table(
	const char	*gfile_in_path,	/* Pathname of input gamma file */
	char		**gamma_string_red, /* Returned packed Red values */
	char		**gamma_string_green, /* Returned packed Green vals */
	char		**gamma_string_blue) /* Returned packed Blue values */
{
	size_t		bytes_read;	/* # of bytes read from gamma file */
	int		error_code;	/* Returned error code */
	FILE		*gamma_in_stream; /* Gamma file stream descriptor */
	struct stat	stat_buf;	/* Gamma file status */

	/*
	 * Measure the gamma file for a new buffer
	 */
	if ((stat(gfile_in_path, &stat_buf) < 0) ||
				(stat_buf.st_size == NUM_COLORS)) {
		fbc_errormsg("Bad gamma file status, %s\n", gfile_in_path);
		return (FBC_ERR_STAT);
	}
	*gamma_string_red = malloc(stat_buf.st_size);
	if (*gamma_string_red == NULL) {
		fbc_errormsg("Insufficient memory, %s\n", gfile_in_path);
		return (FBC_ERR_NOMEM);
	}

	/*
	 * Open the file containing the packed gamma correction table
	 */
	gamma_in_stream = fopen(gfile_in_path, "r");
	if (gamma_in_stream == NULL) {
		fbc_errormsg("Can't open input gamma file, %s\n",
				gfile_in_path);
		error_code = FBC_ERR_OPEN;
		goto read_packed_gamma_error;
	}

	/*
	 * Read the packed gamma table strings
	 */
	bytes_read = fread(*gamma_string_red,
				sizeof (char),
				stat_buf.st_size,
				gamma_in_stream);
	fclose(gamma_in_stream);
	if (bytes_read != stat_buf.st_size) {
		fbc_errormsg("Error reading gamma file, %s\n", gfile_in_path);
		error_code = FBC_ERR_READ;
		goto read_packed_gamma_error;
	}

	/*
	 * Separate the gamma buffer into its component colors and return
	 */
	if (*(*gamma_string_red + stat_buf.st_size - 1) == '\n') {
		*(*gamma_string_red + stat_buf.st_size - 1) = '\0';
		*gamma_string_green = strchr(*gamma_string_red, '\n');
		if (*gamma_string_green != NULL) {
			**gamma_string_green = '\0';
			*gamma_string_green += 1;
			*gamma_string_blue = strchr(*gamma_string_green, '\n');
			if (*gamma_string_blue != NULL) {
				**gamma_string_blue = '\0';
				*gamma_string_blue += 1;
				return (FBC_SUCCESS);
			}
		}
	}
	fbc_errormsg("Gamma file is corrupt, %s\n", gfile_in_path);
	error_code = FBC_ERR_READ;

	/*
	 * Release the buffer and return unsuccessfully
	 */
read_packed_gamma_error:
	free(*gamma_string_red);
	return (error_code);

}	/* fbc_read_packed_gamma_table() */


/*
 * fbc_free_gamma_strings()
 *
 *    Free any packed gamma string memory that was allocated by
 *    gfx_pack_gamma_string_16().
 */

void
fbc_free_gamma_strings(
	char		*gamma_string_red, /* Packed Red values string */
	char		*gamma_string_green, /* Packed Green values string */
	char		*gamma_string_blue) /* Packed Blue values string */
{

	free(gamma_string_red);
	free(gamma_string_green);
	free(gamma_string_blue);

}	/* fbc_free_gamma_strings() */


/* End of fbc_gamma_table.c */
