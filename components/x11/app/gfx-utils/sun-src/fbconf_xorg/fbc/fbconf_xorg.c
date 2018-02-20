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
 * fbconf_xorg - Frame buffer configuration program for Xorg
 */


#include <sys/param.h>		/* MAXPATHLEN */
#include <sys/types.h>
#include <sys/stat.h>		/* stat(), umask() */
#include <libgen.h>		/* basename() */
#include <stdio.h>		/* fprintf(), printf(), putc() */
#include <stdlib.h>		/* exit() */
#include <string.h>		/* memcpy(), strcat(), strcpy() */
#include <unistd.h>		/* geteuid(), getuid(), seteuid(), unlink() */

#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"		/* Private definitions, xf86confcalloc() ... */
#include "configProcs.h"	/* Private function, etc. declarations */

#include "sun_edid.h"		/* EDID data parsing */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_xorg.h"		/* Edit config file data representations */

#include "fbc_Device.h"		/* Edit Device sections */
#include "fbc_Option.h"		/* Edit Option lists */
#include "fbc_ask.h"		/* User interaction */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_edit_config.h"	/* Write an updated config file */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_gamma_table.h"	/* Read, pack, and write a gamma table */
#include "fbc_getargs.h"	/* Program command line processing */
#include "fbc_get_properties.h"	/* Get fbconf_xorg(1M) program properties */
#include "fbc_mode_list.h"	/* List of Modes from the config file */
#include "fbc_open_device.h"	/* Open the frame buffer device */
#include "fbc_propt.h"		/* Display the current option settings */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_res.h"		/* Video modes/resolutions (-res option) */
#include "fbc_write_config.h"	/* Write an updated config file */


/*
 * fbc_check_args()
 *
 *    Make sure all program command line argument strings are properly
 *    terminated within a reasonable number of characters.  See Bug
 *    4031253, reported for ffbconfig circa 10 Feb 1997.
 *
 *    Command line option strings generally don't exceed 16 characters
 *    (e.g., "-deftransparent").  The longest argument strings would be
 *    pathnames (e.g. for -gfile).  A string longer than MAXPATHLEN
 *    (typically 1024) characters would be expected to fail anyway for
 *    one reason or another.
 *
 *    If this function segfaults despite all precautions, the caller has
 *    insured that it'll happen while the user is executing as himself.
 *
 *    Note that the fbc_prog_name string used by fbc_errormsg() has been
 *    set at build time to something useable.  The argv[0] string isn't
 *    trusted until everything checks out.
 */

#define	MAX_ARG_LEN	(MAXPATHLEN + 32) /* Reasonable length plus slack */

static
void
fbc_check_args(
	const int	argc,		/* Program argument count */
	char	*const	argv[])		/* Program argument vector */
{
	int		arg;		/* Program command line arg index */
	size_t		len;		/* Length of argument string */
	const char	*ptr;		/* Pointer into argument string */

	/*
	 * Make sure something exists resembling an argument vector
	 */
	if ((argc <= 0) || (argv == NULL)) {
		fbc_errormsg("Program argument vector is missing\n");
		exit(FBC_EXIT_USAGE);
	}

	/*
	 * Make sure all argument strings are properly Nul-terminated, etc.
	 */
	for (arg = 0; arg < argc; arg += 1) {
		if (argv[arg] == NULL) {
			fbc_errormsg("Program argument %d is missing\n", arg);
			exit(FBC_EXIT_USAGE);
		}
		len = 0;
		for (ptr = argv[arg]; *ptr != '\0'; ptr += 1) {
			if (len >= MAX_ARG_LEN) {
				fbc_errormsg(
				"Program argument %d is unacceptably long\n",
						arg);
				exit(FBC_EXIT_USAGE);
			}
			len += 1;
		}
	}

	/*
	 * Make sure the argument vector is NULL-terminated
	 */
	if (argv[argc] != NULL) {
		fbc_errormsg("Program argument vector is not terminated\n");
		exit(FBC_EXIT_USAGE);
	}

}	/* fbc_check_args() */


/*
 * main()
 *
 *    Main function for the fbconf_xorg(1M) frame buffer configuration
 *    program for Xorg.
 */

int
main(
	const int	argc,		/* Program argument count */
	char	*const	argv[])		/* Program argument vector */
{
	const char	*config_file_path; /* Name from xf86openConfigFile() */
	XF86ConfigPtr	configIR;	/* Config file Internal Rep */
	fbc_dev_t	device;		/* Frame buffer device info (-dev) */
	const char	*device_arg;	/* Effective argument to -dev option */
	char		device_path_buf[FBC_MAX_DEV_PATH_LEN];
	char		device_type_buf[FBC_MAX_DEV_PATH_LEN];
	uid_t		euid;		/* Effective user ID */
	int		exit_code;	/* Program exit code */
	fbc_varient_t	fbvar;		/* fbconf_xorg(1M) varient data */
	char		gfile_out_path[MAXPATHLEN]; /* Gamma table path */
	char		mode_name_buf[FBC_MAX_MODE_NAME_LEN]; /* Video mode */
	sectn_mask_t	ref_config;	/* Referenced config sections, etc. */
	uid_t		uid;		/* Real user ID */

	/*
	 * For security, neutralize the EUID except when accessing system files
	 */
	euid = geteuid();
	uid  = getuid();
	if (euid != uid) {
		if (seteuid(uid) != 0) {
			fbc_errormsg("Unable to change effective user ID\n");
			return (FBC_EXIT_FAILURE);
		}
	}

	/*
	 * Safely validate all command line argument strings
	 *
	 *    This is an suid program.  Bug 4031253 involves a buffer
	 *    overflow attack that uses an exec(2) call to pass a
	 *    non-string argument to ffbconfig, which is invoked with
	 *    superpowers.
	 */
	fbc_check_args(argc, argv);

	/*
	 * Zero all of the fbconf_xorg(1M) parameters
	 */
	memset(&fbvar, 0, sizeof (fbvar));

	/*
	 * Get the program name for diagnostic messages
	 */
	fbvar.prog_name = basename(argv[0]);	/* For usage display */
	fbc_prog_name   = fbvar.prog_name;	/* For error messages */

	/*
	 * Use generic fbconf_xorg properties until the actual device is known
	 *
	 *    This enables minimal usage text display, sets basic
	 *    defaults, etc.
	 */
	fbc_get_base_properties(&fbvar);

	/*
	 * Determine the device pathname (-dev argument) and open it
	 *
	 *    The device pathname (explicitly named or resolved from the
	 *    "/dev/fb" or "/dev/fb0" symbolic link) does the following:
	 *      * Specifies which device file to open, which in turn
	 *        yeilds the VISUAL identifier string (e.g. "SUNWkfb"):
	 *          * Helps to confirm the device's validity
	 *          * Determines which device-specific library to
	 *            dynamically open and use (e.g. libSUNWkfb_conf.so)
	 *          * Helps to match master and slave devices
	 *      * Specifies which Device section to find (or create) in
	 *        the configuration file
	 *      * Gives the name for the Device section's Driver entry
	 *        (e.g. "kfb")
	 *      * Contains a unit number (which may have a future use)
	 *      * May may include a stream letter (e.g. "a" or "b")
	 */
	(void) fbc_get_device_arg(argc, argv, &device_arg);
	if (device_arg == NULL) {
		/*
		 * Determine the default device, which includes opening it
		 */
		if (fbc_get_default_device(device_path_buf,
					sizeof (device_path_buf),
					device_type_buf,
					sizeof (device_type_buf),
					&device) != FBC_SUCCESS) {
			fbc_errormsg("Unable to open default device\n");
			return (FBC_EXIT_FAILURE);
		}
	} else {
		/*
		 * Parse the -dev device name argument
		 */
		if (fbc_get_device_name(device_arg,
				device_path_buf, sizeof (device_path_buf),
				device_type_buf, sizeof (device_type_buf),
				&device) != FBC_SUCCESS) {
			fbvar.usage(stderr, &fbvar);
			return (FBC_EXIT_USAGE);
		}

		/*
		 * Open the -dev device and get the VISUAL env identifier name
		 *
		 *    The VISUAL environment identifier, rather than the
		 *    device name, determines which libSUNWxxx_conf.so
		 *    library is needed with this frame buffer device.
		 *    The device name still should agree with the
		 *    identifier name (e.g."kfb0" w/ "SUNWkfb").
		 */
		if (fbc_open_device(&device) != FBC_SUCCESS) {
			/* Error message has been displayed, so just exit */
			return (FBC_EXIT_FAILURE);
		}
	}

	/*
	 * Initialize the default state for the -file command line option
	 *
	 *    The configuration file location is not likely to be device
	 *    dependent, but it could be changed via the call to
	 *    fbc_get_properties() below.
	 */
	fbvar.config_file_loc    = fbc_keywds_file[0].argv_name;
	fbvar.config_file_path   = fbc_keywds_file[0].conf_name;
	fbvar.config_search_path = fbc_config_search_path;

	/*
	 * Establish device-specific properties and fbconf_xorg(1M) behavior
	 */
	if (fbc_get_properties(&device, &fbvar) != FBC_SUCCESS) {
		return (FBC_EXIT_FAILURE);	/* Unknown device type, etc. */
	}
	fbc_revise_device_info(&device);	/* Revise the streams info */

	/*
	 * Communicate gamma table pathname info with the -gfile option handler
	 */
	fbvar.gfile_in_path  = NULL;		/* No input gamma file path */
	fbvar.gfile_out_path = NULL;		/* No output gamma file path */

	/*
	 * No dynamically allocated gamma table packed data strings yet
	 */
	fbvar.gamma_string_red   = NULL;
	fbvar.gamma_string_green = NULL;
	fbvar.gamma_string_blue  = NULL;

	/*
	 * Evaluate the program command line
	 *
	 *    The fbc_get_properties() code path above is able to
	 *    provide a wrapper for fbc_getargs() or to replace it
	 *    altogether, should that be necessary.
	 */
	fbvar.getargs(argc, argv, &fbvar);

	/*
	 * If the program command line is a no-op, display usage and terminate
	 *
	 *    The command line is a no-op if none of these operations
	 *    has been requested:
	 *      * Display help text (-help)
	 *      * Display the frame buffer device configuration (-prconf)
	 *      * Display EDID data from the display device (-predid)
	 *      * Display the software configuration (-propt)
	 *      * Display a video modes/resolutions list (-res ?)
	 *      * Modify one or more entries in the configuration file
	 *
	 *    It would be a no-op, for instance, if only -dev and/or
	 *    -file is specified.
	 */
	if (!fbvar.option_set.help &&
	    !fbvar.option_set.prconf &&
	    !(fbvar.option_set.predid_raw || fbvar.option_set.predid_parsed) &&
	    !fbvar.option_set.propt &&
	    !fbvar.option_set.res_list &&
	    (fbvar.modify_config == FBC_SECTION_NONE)) {
		fbvar.usage(stderr, &fbvar);
		return (FBC_EXIT_SUCCESS);
	}

	/*
	 * If -help was specified, display device-specific program help text
	 *
	 *    If -help and/or -res ? was specified, the program will
	 *    terminate immediately upon satisfying those request(s).
	 */
	if (fbvar.option_set.help) {
		fbvar.help(&fbvar);
		if (!fbvar.option_set.res_list) {
			return (FBC_EXIT_SUCCESS);
		}
	}

	/*
	 * Restore the effective UID while reading the config file
	 */
	if (euid != uid) {
		(void) seteuid(euid);
	}

	/*
	 * Search for and open the input configuration file
	 */
	config_file_path = xf86openConfigFile(fbvar.config_search_path,
						fbvar.config_file_path,
						NULL);
	if (config_file_path != NULL) {
		/*
		 * Save the pathname of the opened input config file
		 */
		fbvar.config_file_path = config_file_path;

		/*
		 * Read the input configuration file
		 */
		configIR = xf86readConfigFile();
		if (configIR == NULL) {
			fbc_errormsg("Error in configuration file\n");
			fbc_close_down_config();
			return (FBC_EXIT_FAILURE);
		}
	}

	/*
	 * Neutralize the EUID again
	 */
	if (euid != uid) {
		if (seteuid(uid) != 0) {
			fbc_errormsg("Unable to change effective user ID\n");
			return (FBC_EXIT_FAILURE);
		}
	}

	/*
	 * If no config file, allocate and zero the config IR structure
	 */
	if (config_file_path == NULL) {
		configIR = xf86confcalloc(1, sizeof (XF86ConfigRec));
		if (configIR == NULL)
		{
			fbc_errormsg("Insufficient memory\n");
			return (FBC_EXIT_FAILURE);
		}
	}

	/*
	 * Find the active/target config sections for this device
	 *
	 *    Sections that are required by Xorg or that are referenced
	 *    based on the command line will be created if they are not
	 *    found.  The -res option is an implied reference to the
	 *    Monitor section or the Modes sections it may reference.
	 */
	ref_config = fbvar.modify_config;
	if (fbvar.option_set.res_list ||
	    (fbvar.xf86_entry_mods.video_mode.name != NULL)) {
		ref_config |= FBC_SECTION_Monitor;
	}
	if (fbc_find_active_sections(&device, &fbvar, configIR, ref_config)
					!= 0) {
		fbc_close_down_config();
		return (FBC_EXIT_FAILURE);
	}

	/*
	 * If -res ? was specified, display the video mode names and terminate
	 */
	if (fbvar.option_set.res_list) {
		fbc_res_list_modes(&device, &fbvar, configIR);
		fbc_close_down_config();
		return (FBC_EXIT_SUCCESS);
	}

	/*
	 * If -res <video_mode> was specified, validate & canonicalize the mode
	 *
	 *    The video mode name is passed to and from the function via
	 *    the fbvar.xf86_entry_mods.video_mode structure.  The
	 *    mode_name_buf buffer may be needed for canonicalization.
	 */
	if (fbvar.xf86_entry_mods.video_mode.name != FBC_NO_MODE_NAME) {
		if (!fbc_res_validate_mode(configIR,
					&device,
					&fbvar,
					mode_name_buf,
					sizeof (mode_name_buf),
					&fbvar.xf86_entry_mods.video_mode)) {
			fbc_close_down_config();
			return (FBC_EXIT_USAGE);  /* Invalid video mode name */
		}
	}

	/*
	 * See if there's any work to do involving a gamma file (-gfile)
	 */
	if (fbvar.gfile_in_path != NULL) {
		/*
		 * Construct the output gamma table pathname for this device
		 *
		 *    This must be done after xf86openConfigFile() is
		 *    called, so the config file pathname will be known,
		 *    and before the call to fbc_edit_active_sections(),
		 *    which might use this gamma table pathname as the
		 *    "GFile" Option entry value.
		 */
		if (fbc_build_gamma_table_path(fbvar.config_file_path,
						device.name,
						gfile_out_path,
						sizeof (gfile_out_path))
					!= FBC_SUCCESS) {
			fbc_close_down_config();
			return (FBC_EXIT_FAILURE);
		}

		/*
		 * See if we'll be removing an old file or creating a new one
		 */
		if (*fbvar.gfile_in_path != '\0') {
			/*
			 * Read and pack the gamma correction table
			 */
			if (fbc_read_gamma_table(fbvar.gfile_in_path,
						fbvar.lut_size,
						&fbvar.gamma_string_red,
						&fbvar.gamma_string_green,
						&fbvar.gamma_string_blue)
					!= 0) {
				fbc_close_down_config();
				return (FBC_EXIT_FAILURE);
			}

			/*
			 * Fix the modification descriptor for the "GFile" Opt
			 *
			 *    See commentary in fbc_Option_GFile().
			 */
			if (fbvar.gfile_out_path != NULL) {
				*fbvar.gfile_out_path = gfile_out_path;
			}
		}
	}

	/*
	 * See whether we're modifying the configuration
	 */
	if (fbvar.modify_config != FBC_SECTION_NONE) {
		/*
		 * Edit the in-memory copy of the config sections
		 */
		(void) fbc_edit_active_sections(
			configIR, &fbvar.active, &fbvar.xf86_entry_mods);

		/*
		 * Apply any constraints on the results (e.g., memory limits)
		 */
		if (fbvar.revise_settings != NULL) {
			if (fbvar.revise_settings(&fbvar) != FBC_SUCCESS) {
				fbc_close_down_config();
				return (FBC_EXIT_FAILURE);
			}
		}

		/*
		 * Do any device initialization
		 */
		if (fbvar.init_device != NULL) {
			if (fbvar.init_device(&device, &fbvar)
					!= FBC_SUCCESS) {
				fbc_close_down_config();
				return (FBC_EXIT_FAILURE);
			}
		}

		/*
		 * If "-res try", give the new video mode a 10-second trial
		 *
		 *    The "try" keyword should not have been recognized
		 *    if there is no res_mode_try() function.  Treat
		 *    such an anomoly as an unsuccessful trial (drawing
		 *    attention to the need to fix the code in
		 *    SUNWxxx_get_properties(), etc.).
		 */
		if (fbvar.option_set.res_mode_try) {
			if ((fbvar.res_mode_try == NULL) ||
			    !fbvar.res_mode_try(
				&device, &fbvar.xf86_entry_mods.video_mode)) {
				fbc_errormsg(
			"Unsuccessful video mode trial.  No changes made!\n");
				fbc_close_down_config();
				return (FBC_EXIT_FAILURE);
			}
			printf("Video resolution will be set to \"%s\"\n",
				fbvar.xf86_entry_mods.video_mode.name);
		}
	}

	/*
	 * Identify the active video Mode, if any
	 *
	 *    This is done for the benefit of the -propt display code.
	 *    It must be done after the -res <video-mode> has been
	 *    executed.
	 */
	(void) fbc_find_active_mode(fbvar.modify_config, &fbvar.active);

	/*
	 * If -prconf was specified, display current hardware configuration
	 */
	if (fbvar.option_set.prconf) {
		printf("\n--- Hardware Configuration for %s ---\n\n",
			device.path);
		fbvar.prconf(&device, &fbvar, configIR);
		putc('\n', stdout);
	}

	/*
	 * If -predid was specified, display the EDID data
	 */
	if (fbvar.option_set.predid_raw || fbvar.option_set.predid_parsed) {
		printf("\n--- EDID Data for %s ---\n\n", device.path);
		fbvar.predid(&device, &fbvar);
		putc('\n', stdout);
	}

	/*
	 * If -propt was specified, display the current config option settings
	 *
	 *    This should be executed after any modifications to the in-
	 *    memory configuration are made.
	 */
	if (fbvar.option_set.propt) {
		printf("\n--- Graphics Configuration for %s ---\n",
			device.path);
		fbc_propt(&fbvar);
		putc('\n', stdout);
	}

	/*
	 * Write the updated config and any gamma file, and close everything
	 */
	exit_code = FBC_EXIT_SUCCESS;

	if (fbvar.modify_config != FBC_SECTION_NONE) {
		/*
		 * Announce config file creation if no input file was found
		 */
		if (config_file_path == NULL) {
			printf("New configuration file, %s\n",
				fbvar.config_file_path);
		}

		/*
		 * Set the file mode creation mask to limit modes to 644
		 */
		(void) umask(022);

		/*
		 * Restore the effective UID while writing config & gamma files
		 */
		if (euid != uid) {
			(void) seteuid(euid);
		}

		/*
		 * Write the updated config file and close down config stuff
		 */
		if (fbc_write_config(&fbvar, configIR) != FBC_SUCCESS) {
			fbc_errormsg("Unable to update config file, %s\n",
					fbvar.config_file_path);
			exit_code = FBC_EXIT_FAILURE;
		}

		/*
		 * If -gfile was specified, update the gamma correction table
		 */
		if ((exit_code == FBC_EXIT_SUCCESS) &&
					(fbvar.gfile_in_path != NULL)) {
			if (*fbvar.gfile_in_path == '\0') {
				/*
				 * Delete any now obsolete gamma table file
				 */
				unlink(gfile_out_path);
			} else {
				/*
				 * Create the new packed gamma table file
				 */
				if (fbc_write_packed_gamma_table(
						gfile_out_path,
						fbvar.gamma_string_red,
						fbvar.gamma_string_green,
						fbvar.gamma_string_blue)
							!= FBC_SUCCESS) {
					exit_code = FBC_EXIT_FAILURE;
				}
			}
		}

		/*
		 * Neutralize the effective UID again
		 */
		if (euid != uid) {
			if (seteuid(uid) != 0) {
				fbc_errormsg(
				    "Unable to change effective user ID\n");
				fbc_close_down_config();
				return (FBC_EXIT_FAILURE);
			}
		}
	} else {
		/*
		 * Close down the unmodified config file(s) and IR & ER memory
		 */
		fbc_close_down_config();
	}

	/*
	 * If "-res now" was specified, set the new video mode now
	 */
	if (fbvar.option_set.res_mode_now) {
		if ((fbvar.res_mode_now == NULL) ||
		    (fbvar.res_mode_now(&device,
					&fbvar.xf86_entry_mods.video_mode)
						!= FBC_SUCCESS)) {
			fbc_errormsg("Unable to set new video mode now\n");
			exit_code = FBC_EXIT_FAILURE;
		} else {
			printf("Video mode has been set to \"%s\"\n",
				fbvar.xf86_entry_mods.video_mode.name);
		}
	}

	/*
	 * Release the config file pathname
	 */
	xf86conffree((char *)config_file_path);

	/*
	 * Release any packed gamma correction value strings
	 */
	fbc_free_gamma_strings(fbvar.gamma_string_red,
				fbvar.gamma_string_green,
				fbvar.gamma_string_blue);

	/*
	 * Terminate ourselves, indicating the state of things
	 */
	return (exit_code);

}	/* main() */


/* End of fbconf_xorg.c */
