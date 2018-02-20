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
 * fbc_write_config - Write an updated configuration file
 */


#include <sys/types.h>		/* off_t */
#include <sys/param.h>		/* MAXPATHLEN */
#include <errno.h>		/* errno */
#include <stdio.h>		/* fdopen(), fprintf(), fseeko(), ... */
#include <stdlib.h>		/* mkstemp() */
#include <string.h>		/* strcat(), strcpy(), strlen(), strerror() */
#include <unistd.h>
#include <sys/stat.h>		/* stat() */

#include "xf86Parser.h"		/* Public function, etc. declatations */
#include "Configint.h"		/* Private definitions, etc. */
#include "configProcs.h"	/* Private function, etc. declarations */
#include "fields.h"		/* Write aligned whitespace and text fields */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_fields.h"		/* Measure aligned whitespace fields */
#include "fbc_line_er.h"	/* External Representation of config lines */
#include "fbc_write_config.h"	/* Write an updated configuration file */


/*
 * fbc_reread_config_line()
 *
 *    Reread a line from an xorg.conf input file.  Measure the
 *    indentation whitespace (to be used when modifying this current
 *    line or when inserting subsequent lines).
 */

static
int
fbc_reread_config_line(
	FILE		*config_stream_in, /* Config file input stream */
	off_t		line_pos,	/* Configuration line file position */
	char 		**configBuf,	/* Config file line buffer */
	int		*configBufLen,	/* Line buffer length */
	fbc_wspace_t	*wspace_chars)	/* Line's whitespace characteristics */
{

	/*
	 * Position the input configuration file to the line in question
	 */
	if (fseeko(config_stream_in, line_pos, SEEK_SET) != 0) {
		return (FBC_ERR_SEEK);
	}

	/*
	 * Reread the line from the input configuration file
	 */
	if (xf86getNextLine(configBuf, configBufLen, config_stream_in)
					== NULL) {
		return (FBC_ERR_READ);
	}

	/*
	 * Measure the first whitespace fields if this is a non-comment line
	 */
	fbc_measure_whitespace(*configBuf, wspace_chars);

	return (FBC_SUCCESS);

}	/* fbc_reread_config_line() */


/*
 * fbc_print_config_text()
 *
 *    Write a text string, typically a single line, to the output
 *    configuration file.
 *
 *    This is considered to be an xf86_print_fn_t typed function.
 */

void
fbc_print_config_text(
	FILE		*config_stream_out, /* Config file output stream */
	const char	*text,		/* Text string */
	const char *const whitespace[]) /* Line indentation, ignored */
{

	fputs(text, config_stream_out);

}	/* fbc_print_config_text() */


static void
fbc_write_config_modes(
	FILE			*config_stream_out, /* Config file output stream */
	XF86ConfigPtr		configIR,	    /* Ptr to config file Internal Rep */
	XF86ConfMonitorPtr 	monitor_sectn_ptr)
{
        XF86ConfModesPtr modes_sectn_ptr; /* Ptr to Modes section IR */
        XF86ConfModeLinePtr modes, mode;
	char text[100];

        modes_sectn_ptr = xf86findModes("SunModes", configIR->conf_modes_lst);
        if (modes_sectn_ptr == NULL)
                return;

        modes = modes_sectn_ptr->mon_modeline_lst;

	if (modes != NULL) {
		fprintf(config_stream_out, "Section \"Modes\"\n");
		fprintf(config_stream_out, "\tIdentifier \"SunModes_%s\"\n", 
				monitor_sectn_ptr->mon_identifier);
	}

	mode = modes;
	while (mode != NULL) {

		xf86printMxxxSectionMode(config_stream_out, mode, xf86whitespace_1, xf86whitespace_2);
	
		mode = mode->list.next;
	}

	if (modes != NULL) {
		fprintf(config_stream_out, "\nEndSection\n");
	}
}


/*
 * fbc_write_config_file()
 *
 *    Write the updated configuration data to a file.
 */

static
int
fbc_write_config_file(
	FILE		*config_stream_out, /* Config file output stream */
	fbc_line_list_t	*line_list,	    /* List of configuration data lines */
	XF86ConfigPtr	configIR,	    /* Ptr to config file Internal Rep */
	fbc_varient_t	*fbvar)		    /* fbconf_xorg(1M) varient data */
{
	int		error_code;	/* Error code */
	fbc_line_elem_t	*line_ptr;	/* Ptr to ER data for a config line */
	const char *const *whitespace;	/* Whitespace strings */
	fbc_wspace_t	wspace_chars;	/* Line's whitespace characteristics */
	int		wspace_measured; /* TRUE => Input whitespace seen */

	/*
	 * Initial line indentation
	 */
	wspace_measured = FALSE;

	wspace_chars.whitespace[0] = xf86whitespace_0[0];
	wspace_chars.whitespace[1] = xf86whitespace_0[1];
	wspace_chars.whitespace[2] = xf86whitespace_0[2];

	/*
	 * Repeat for each configuration line in the External Representation
	 */
	for (line_ptr = line_list->head_ptr;
	    line_ptr != NULL;
	    line_ptr = line_ptr->next_ptr) {
		/*
		 * Copy, modify, or delete the current config line
		 */
		switch (line_ptr->status) {
		default:
			/*
			 * Unlikely internal error
			 */
			fbc_errormsg(
		    "Internal error; unknown config line status code, %d\n",
				line_ptr->status);
			fprintf(config_stream_out,
				"### The following line was copied verbatim"
				" due to an unknown status code, %d\n",
				line_ptr->status);
			/*FALLTHROUGH*/
		case FBC_LINE_ORIGINAL:
			/*
			 * Go copy the original configuration line
			 */
			break;

		case FBC_LINE_INSERTED:
			/*
			 * See whether we know what we're doing
			 */
			if (line_ptr->print_fn == NULL) {
				fbc_errormsg(
		    "Internal error; no print function for inserted line\n");
				fprintf(config_stream_out,
				"### A line to be inserted here was discarded"
				" for lack of a print function\n");
				continue; /* Discard the unknown line */
			}

			/*
			 * Attempt to match the original indentation style
			 *
			 *    The original heuristic assumed that a line
			 *    to be inserted should be indented to match
			 *    the line that precedes it.  This works for
			 *    a line to be inserted at the end of an
			 *    existing and well-formed section.  Now
			 *    we support insertion of omitted sections
			 *    and subsections in empty and in existing
			 *    config files.  Tricksy it is, yessss.
			 */
			whitespace = wspace_chars.whitespace;
			if (!wspace_measured ||
			    (line_ptr->indent_level == FBC_INDENT_0)) {
				/*
				 * Nothing to match, so use the default style
				 */
				switch (line_ptr->indent_level) {
				case FBC_INDENT_0:
					wspace_measured = FALSE;
					whitespace = xf86whitespace_0;
					break;
				case FBC_INDENT_1:
				case FBC_INDENT_ENTRY:
					whitespace = xf86whitespace_1;
					break;
				case FBC_INDENT_2:
				default:
					whitespace = xf86whitespace_2;
					break;
				}
			}

			/*
			 * Insert a new configuration line
			 */
			(line_ptr->print_fn)(config_stream_out,
					    line_ptr->ir_ptr,
					    whitespace);
			continue;

		case FBC_LINE_MODIFIED:
			/*
			 * Measure the whitespace (then discard the input line)
			 */
			(void) fbc_reread_config_line(
						line_ptr->config_stream_in,
						line_ptr->line_pos,
						&xf86configBuf,
						&xf86configBufLen,
						&wspace_chars);
			wspace_measured = TRUE;

			/*
			 * Insert a replacement configuration line
			 */
			if (line_ptr->print_fn == NULL) {
				fbc_errormsg(
		    "Internal error; no print function for modified line\n");
				fprintf(config_stream_out,
				    "### The following line was not modified"
				    " for lack of a print function\n");
				break;	/* Copy the unknown line */
			}
			(line_ptr->print_fn)(config_stream_out,
					    line_ptr->ir_ptr,
					    wspace_chars.whitespace);
			continue;

		case FBC_LINE_DELETED:
			/*
			 * Discard the configuration line
			 */
			continue;
		}

		/*
		 * Copy the original configuration line
		 */
		error_code = fbc_reread_config_line(line_ptr->config_stream_in,
						    line_ptr->line_pos,
						    &xf86configBuf,
						    &xf86configBufLen,
						    &wspace_chars);
		if (error_code != FBC_SUCCESS) {
			fbc_errormsg("Configuration file input error\n");
			return (error_code);
		}
		wspace_measured = TRUE;
		fputs(xf86configBuf, config_stream_out);
	}

	/*
	 * Lastly output the device specific SunModes section
	 */
        if (fbvar->xf86_entry_mods.video_mode.name != FBC_NO_MODE_NAME) {
		fbc_write_config_modes(config_stream_out, configIR, fbvar->active.monitor_sectn);
	}


	return (FBC_SUCCESS);

}	/* fbc_write_config_file() */


/*
 * fbc_write_config()
 *
 *    Write the updated configuration data to a new output file having a
 *    temporary name.  Close the input configuration file, if any.
 *    Replace any input configuration file with the output configuration
 *    file, preserving the original file name, modes, and ownership.
 */

int
fbc_write_config(
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	XF86ConfigPtr	configIR)	/* Ptr to config file Internal Rep */
{
	int		config_fd_out;	/* Config file output fd */
	char		config_path_out[MAXPATHLEN]; /* Output file pathname */
	FILE		*config_stream_out; /* Config file output stream */
	int		error_code;	/* Error code */
	mode_t		orig_umask;	/* Original file creation mask */

	/*
	 * Generate the template for the temporary name of the output file
	 *
	 *    The temporary pathname is the concatenation of the input
	 *    config file pathname, "XXXXXX", and a Nul terminator.
	 */
	if ((strlen(fbvar->config_file_path) + 6 + 1)
					> sizeof (config_path_out)) {
		fbc_errormsg("Configuration file pathname is too long, %s\n",
				fbvar->config_file_path);
		fbc_close_down_config();
		return (FBC_ERR_PATH_LEN); /* Output name would be too long */
	}
	strcpy(config_path_out, fbvar->config_file_path);
	strcat(config_path_out, "XXXXXX");

	/*
	 * Create and open the output config file using the temporary name
	 */
	orig_umask = umask(0177);
	config_fd_out = mkstemp(config_path_out);
	umask(orig_umask);
	if (config_fd_out == -1) {
	        fbc_errormsg("%s, %s\n", strerror(errno), config_path_out);
		fbc_close_down_config();
		return (FBC_ERR_OPEN);
	}
	config_stream_out = fdopen(config_fd_out, "w");
	if (config_stream_out == NULL) {
	        fbc_errormsg("%s, %s\n", strerror(errno), config_path_out);
		close(config_fd_out);
		fbc_close_down_config();
		return (FBC_ERR_OPEN);
	}

	/*
	 * Write the configuration data to the output file
	 */
	error_code =
		fbc_write_config_file(config_stream_out, &fbc_line_ER_list, configIR, fbvar);

	/*
	 * Close the input config file(s), release resources, etc.
	 */
	fbc_close_down_config();

	if (error_code == FBC_SUCCESS) {
		struct stat stat_buf;	/* Input config file status */

		/*
		 * Get any input cfg file mode and ownership, else use defaults
		 */
		if (stat(fbvar->config_file_path, &stat_buf) == -1) {
			stat_buf.st_mode = FBC_CONFIG_FILE_MODE;
			stat_buf.st_uid  = FBC_CONFIG_FILE_UID;
			stat_buf.st_gid  = FBC_CONFIG_FILE_GID;
		}

		/*
		 * Set the mode and ownership of the output config file
		 */
		if (fchmod(config_fd_out, stat_buf.st_mode) == -1) {
		        fbc_errormsg("%s, %s\n",
					strerror(errno), config_path_out);
			error_code = FBC_ERR_ACCESS;
		}
		if (fchown(config_fd_out, stat_buf.st_uid, stat_buf.st_gid)
					== -1)
		{
		        fbc_errormsg("%s, %s\n",
					strerror(errno), config_path_out);
			error_code = FBC_ERR_ACCESS;
		}
	}

	/*
	 * Close the output config file (whether or not all went well)
	 */
	fclose(config_stream_out);

	/*
	 * Delete the input file, if any, replacing it with the output file
	 */
	if (error_code == FBC_SUCCESS) {
		if (rename(config_path_out, fbvar->config_file_path) != 0) {
			fbc_errormsg("%s, %s\n", strerror(errno),
					fbvar->config_file_path);
			error_code = FBC_ERR_RENAME;
		}
	}
	if (error_code != FBC_SUCCESS) {
		/*
		 * Just delete the temporary output file
		 */
		(void) unlink(config_path_out);
	}

	/*
	 * Return, indicating whether or not all went well
	 */
	return (error_code);

}	/* fbc_write_config() */


/* End of fbc_write_config.c */
