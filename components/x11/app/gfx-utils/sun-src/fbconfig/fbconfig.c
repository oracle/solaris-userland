/*
 * Copyright (c) 1999, 2015, Oracle and/or its affiliates. All rights reserved.
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



#include <sys/param.h>		/* MAXPATHLEN */
#include <sys/types.h>
#include <libscf.h>		/* Service Configuration Facility */
#include <stdarg.h>		/* va_end(), va_start(), vfprintf() */
#include <stdio.h>		/* fprintf(), printf() */
#include <stdlib.h>		/* exit(), free(), malloc() */
#include <string.h>		/* strerror(), str[l]cpy(), strstr(), ... */
#include <unistd.h>		/* close(), ioctl() */
#include <dirent.h>		/* opendir(), readdir(), closedir() */
#include <sys/stat.h>		/* stat() */
#include <sys/visual_io.h>	/* VISUAL environment device identifier */
#include <fcntl.h>		/* open() */
#include <nl_types.h>
#include <errno.h>		/* errno */

#include "gfx_common.h"		/* Frame buffer model name */


#define	_DEBUG_FB		/* _DEBUG_FB is merely DEBUG_FB disabled */


/*
 * Frame buffer device file names  (/dev/fb[0]?, /dev/fbs/[a-z]fb[0-9][ab]?)
 */
#define	DEVICE_SYMLINK_DIR	"/dev"		/* Device symlink directory */
#define	DEVICE_SYMLINK_NAME	"fb"		/* Device symlink name */
#define	DEVICE_SYMLINK_NAME_0	DEVICE_SYMLINK_NAME "0"
#define	DEVICE_SYMLINK_PATH	DEVICE_SYMLINK_DIR "/" DEVICE_SYMLINK_NAME
#define	DEVICE_SYMLINK_PATH_0	DEVICE_SYMLINK_DIR "/" DEVICE_SYMLINK_NAME_0

#define	DEVICE_DIR		"/dev/fbs"	/* Graphics device directory */

#define	MAX_DEV_PATH_LEN	128		/* Max device path length */

#define	STREAM_SUFFIX_CHARS	"ab"		/* Dev stream suffix chars */
#define MAX_SUFFIX_LIST_LEN	16		/* Ample room for " [a|b]" */

/*
 * Frame buffer configuration software directory
 */
#define	FBC_LIB_DIR	"/usr/lib/fbconfig"	/* fbconfig software dir */

/*
 * fbconfig invokes the dcmtool script (which in turn invokes java)
 */
#define	DCMTOOL_LOCATION FBC_LIB_DIR "/SUNWdcm/bin/dcmtool"


/* globals */
static nl_catd		catfd;		/* Message catalog fd (obsolete) */

/*
 * PrintError()
 *
 *    Write a variable format error message to stderr, prefixed by the
 *    program name.
 */

static
void
PrintError(const char *format, ...)
{
	va_list		ap;		/* Variable argument pointer */

	va_start(ap, format);
	fprintf(stderr, "fbconfig: ");
	vfprintf(stderr, format, ap);
	fprintf(stderr, "\n");
	va_end(ap);

}	/* PrintError() */


/*
 * IdentifyXServer()
 *
 *    Determine what X server is currently configured (Xsun, Xorg, ...).
 *
 *    Note that this is not necessarily the X server that is currently
 *    running.
 *
 *    Related svccfg(1M) "set" and "list" commands:
 *
 *        svccfg -s svc:/application/x11/x11-server \
 *                        setprop options/server=/usr/openwin/bin/Xsun
 *        svccfg -s svc:/application/x11/x11-server \
 *                        setprop options/server=/usr/bin/Xorg
 *
 *        svccfg -s svc:/application/x11/x11-server listprop 'options/server'
 */

#define	XSRV_SERVICE_NAME	"application/x11/x11-server"
#define	XSRV_PROP_GROUP_NAME	"options"
#define	XSRV_PROP_NAME		"server"

typedef enum {
	XSERVER_UNKNOWN = -1,		/* No idea */
	XSERVER_XSUN,			/* Xsun server */
	XSERVER_XORG			/* Xorg server */
} xserv_t;

#define GFX_DEV_M64     0x0001
#define GFX_DEV_FFB	0x0002
#define GFX_DEV_AFB	0x0004
#define GFX_DEV_IFB	0x0008
#define GFX_DEV_JFB	0x0010
#define GFX_DEV_PFB	0x0100
#define GFX_DEV_NFB	0x0200
#define GFX_DEV_EFB	0x0400
#define GFX_DEV_KFB	0x0800
#define GFX_DEV_AST	0x1000

#define GFX_DEV_XSUN	GFX_DEV_M64 | GFX_DEV_FFB | GFX_DEV_AFB | GFX_DEV_IFB | \
			GFX_DEV_JFB | GFX_DEV_PFB | GFX_DEV_NFB | GFX_DEV_EFB | GFX_DEV_KFB

#if OSVER==510
#define GFX_DEV_XORG	GFX_DEV_PFB | GFX_DEV_NFB | GFX_DEV_EFB | GFX_DEV_AST
#else
#define GFX_DEV_XORG	GFX_DEV_PFB | GFX_DEV_NFB | GFX_DEV_EFB | GFX_DEV_KFB | GFX_DEV_AST
#endif

const char *xserver_str[]  = {"Xsun", "Xorg"};
const char *xserver_path[] = {"/usr/openwin/bin/Xsun", "/usr/bin/Xorg"};
unsigned int xserver_device[] = { GFX_DEV_XSUN, GFX_DEV_XORG };

static
xserv_t
IdentifyXServer(void)
{
	const char	*filename;	/* Ptr to X server simple filename */
	char		pathname[MAXPATHLEN]; /* X server pathname */
	scf_property_t	*prop;		/* SCF property */
	scf_propertygroup_t *prop_group; /* SCF property group */
	scf_handle_t	*scf_handle;	/* SCF handle */
	scf_scope_t	*scope;		/* SCF scope */
	scf_service_t	*service;	/* SCF service */
	scf_value_t	*value;		/* SCF property value */
	xserv_t		x_server;	/* Returned X server identity */

	/*
	 * X, the unknown
	 */
	x_server = XSERVER_UNKNOWN;

	/*
	 * Allocate and initialize the necessary SCF data structures
	 */
	scf_handle = scf_handle_create(SCF_VERSION);
	scope      = scf_scope_create(scf_handle);
	service    = scf_service_create(scf_handle);
	prop_group = scf_pg_create(scf_handle);
	prop       = scf_property_create(scf_handle);
	value      = scf_value_create(scf_handle);
	if ((value      == NULL) ||
	    (prop       == NULL) ||
	    (prop_group == NULL) ||
	    (service    == NULL) ||
	    (scope      == NULL) ||
	    (scf_handle == NULL)) {
#ifdef DEBUG_FB
		PrintError("SCF resource creation, %s",
				scf_strerror(scf_error()));
#endif
		goto clean_up;
	}

	/*
	 * Retrieve the Nul-terminated X server pathname string
	 */
	if ((scf_handle_bind(scf_handle)                              == -1) ||
	    (scf_handle_get_scope(scf_handle, SCF_SCOPE_LOCAL, scope) == -1) ||
	    (scf_scope_get_service(scope, XSRV_SERVICE_NAME, service) == -1) ||
	    (scf_service_get_pg(service, XSRV_PROP_GROUP_NAME, prop_group)
								      == -1) ||
	    (scf_pg_get_property(prop_group, XSRV_PROP_NAME, prop)    == -1) ||
	    (scf_property_get_value(prop, value)                      == -1) ||
	    (scf_value_get_astring(value, pathname, sizeof(pathname)) == -1)) {
#ifdef DEBUG_FB
		PrintError("SCF value retrieval, %s",
				scf_strerror(scf_error()));
#endif
		goto clean_up;
	}

	/*
	 * Evaluate the simple filename
	 */
	filename = strrchr(pathname, '/');
	if (filename == NULL) {
		filename = pathname;
	} else {
		filename += 1;
	}
	if (strcmp(filename, "Xsun") == 0) {
		x_server = XSERVER_XSUN;
	} else
	if (strcmp(filename, "Xorg") == 0) {
		x_server = XSERVER_XORG;
	}

	/*
	 * Destroy our resources
	 */
clean_up:
	if (value != NULL) {
		scf_value_destroy(value);
	}
	if (prop != NULL) {
		scf_property_destroy(prop);
	}
	if (prop_group != NULL) {
		scf_pg_destroy(prop_group);
	}
	if (service != NULL) {
		scf_service_destroy(service);
	}
	if (scope != NULL) {
		scf_scope_destroy(scope);
	}
	if (scf_handle != NULL) {
		scf_handle_destroy(scf_handle);
	}

	/*
	 * Return the identity of the X server
	 */
	return (x_server);

}	/* IdentifyXServer() */


/*
 * CallConfigProgram()
 *
 *    Become the actual device configuration program, executing it with
 *    the caller-provided argument vector.  This function does not
 *    return.
 */

static
void
CallConfigProgram(char **argv)
{
#ifdef DEBUG_FB
	if (argv == NULL) {
		printf("CallConfigProgram(argv is NULL)\n");
		exit(1);
	}
	{
		int	i;

		for (i = 0; argv[i] != NULL; i++) {
			printf("argv[%d]=%s\n", i, argv[i]);
		}
	}
#endif

	if (argv[0] == NULL) {
		PrintError(catgets(catfd, 1, 1,
			    "No configuration program pathname"));
	} else {
		(void) execvp(argv[0], argv);
		PrintError("Cannot run config program, %s", strerror(errno));
	}

	exit(1);

}	/* CallConfigProgram() */


/*
 * get_device_model()
 *
 *    Return the frame buffer model name, else an empty string, in the
 *    caller-supplied device_model[GFX_MAX_MODELNAME_LEN] name buffer.
 *
 *    Note that ioctl(GFX_IOCTL_GET_IDENTIFIER) might not be supported
 *    by older drivers (e.g., Xsun drivers).
 */

static
void
get_device_model(
	int		device_fd,	/* Device file descriptor number */
	char		*device_model)	/* Returned device model name */
{
	const char *const SUNW_ = "SUNW,"; /* Prefix on model & part strings */
	struct gfx_identifier gfx_ident; /* Graphics identifier */
	const char	*model_name;	/* Frame buffer model name */

	/*
	 * Get the frame buffer model name w/o any leading "SUNW," substring
	 */
	model_name = "";
	if (ioctl(device_fd, GFX_IOCTL_GET_IDENTIFIER, &gfx_ident) == 0) {
		if (gfx_ident.flags & GFX_IDENT_MODELNAME) {
			model_name = &gfx_ident.model_name[0];
			if (strstr(model_name, SUNW_) != NULL) {
				model_name += strlen(SUNW_);
			}
		}
	}

	/*
	 * Return the frame buffer model name, else an empty string
	 */
	(void) strlcpy(device_model, model_name, GFX_MAX_MODELNAME_LEN);

}	/* get_device_model() */


/*
 * get_device_identification()
 *
 *    Given a /dev/fb or /dev/fbs/... pathname, make sure it's for a
 *    character special file.  If the caller has provided the necessary
 *    pointer, return the (struct stat).st_rdev value.  Open the file
 *    and return the VISUAL environment device identifier name.  For
 *    a device such as "/dev/fbs/jfb0", the identifier name should be
 *    "SUNWjfb".  If the caller has provided the necessary
 *    device_model[GFX_MAX_MODELNAME_LEN] name buffer, get and return
 *    the frame buffer model name.
 *
 *    In the event of an error, return an errno-style error code.  An
 *    EACCES code may be of special interest to the caller.
 */

/*
 * Mask for stat_buf.st_rdev member
 */
#define	MINOR_MASK	0xFFFF		/* Invert to get major/type bits */

static
int
get_device_identification(
	const char	*device_path,	/* Device pathname */
	int		*st_rdev,	/* Optionally returned st_rdev value */
	struct vis_identifier *vis_ident, /* Returned VISUAL env identifier */
	char		*device_model)	/* Optionally returned model name */
{
	int		error_code;	/* Returned errno-style error code */
	int		device_fd;	/* Frame buffer file descriptor # */
	struct stat	stat_buf;	/* stat() buffer for device file */

	/*
	 * Make sure this is a character special file
	 */
	if (stat(device_path, &stat_buf) != 0) {
	        return (errno);
	}
	if ((stat_buf.st_mode & S_IFCHR) == 0) {
		return (ENODEV);	/* "No such device" almost says it */
	}

	/*
	 * Return the st_rdev value if the caller wants it
	 */
	if (st_rdev != NULL) {
		*st_rdev = stat_buf.st_rdev;
	}

	/*
	 * Open the existing device file
	 */
	device_fd = open(device_path, O_RDONLY);
	if (device_fd == -1) {
		return (errno);		/* Error code, e.g. EACCES */
	}

	/*
	 * Get the VISUAL environment device identifier name
	 */
	error_code = 0;
	if (ioctl(device_fd, VIS_GETIDENTIFIER, vis_ident) == -1) {
		error_code = errno;
	}

	/*
	 * If the caller wants it, return the frame buffer model name
	 */
	if (device_model != NULL) {
		get_device_model(device_fd, device_model);
	}

	close(device_fd);

	return (error_code);

}	/* get_device_identification() */


typedef struct {
	char		*pathname;	/* Full pathname   (e.g. "/dev/fb") */
	char		*filename;	/* Simple filename (e.g. "fb")      */
} path_file_t;

static const path_file_t default_device[] = {
	{ DEVICE_SYMLINK_PATH,    DEVICE_SYMLINK_NAME	},
	{ DEVICE_SYMLINK_PATH_0,  DEVICE_SYMLINK_NAME_0	},
	{ NULL,			  NULL			}
};


/*
 * GetDefaultDevicePathname()
 *
 *    This function looks for a default device and returns the pathname
 *    of the first default frame buffer device that is found and can be
 *    opened and provide a VISUAL environment device identifier.  The
 *    possible return values are:
 *         Zero   - Success; a default device exists and can be accessed
 *         ENOENT - No frame buffer device was found
 *         EACCES - Something was found, but the user can't access it
 */

static
int
GetDefaultDevicePathname(
	char		**device_path)	/* Returned default device pathname */
{
	const path_file_t *default_dev;	/* Ptr to a default_device[] element */
	int		err_code;	/* get_device_identification() code */
	int		error_code;	/* Return EACCES, ENOENT, or zero */
	struct vis_identifier vis_ident; /* Device vis identifier */

	*device_path = NULL;
	error_code   = ENOENT;

	/*
	 * See whether any default device will open and identify itself
	 */
	for (default_dev = &default_device[0];
	     default_dev->pathname != NULL;
	     default_dev += 1) {
		err_code = get_device_identification(
				default_dev->pathname, NULL, &vis_ident, NULL);
		if (err_code == 0) {
			*device_path = default_dev->pathname;
			return (0);	/* At least one FB device exists */
		}
		if (err_code == EACCES) {
			error_code = EACCES; /* Caller may have to complain */
			if (*device_path == NULL) {
				*device_path = default_dev->pathname;
			}
		}
	}

	return (error_code);

}	/* GetDefaultDevicePathname() */


/*
 * GetDevicePathname()
 *
 *    Given the pathname or simple filename of a real or default frame
 *    buffer device, return the fully qualified pathname.
 *
 *    Partial pathnames will be treated arbitrarily in nonsense-in,
 *    nonsense-out fashion.
 *
 *    The caller-supplied buffer will be used if it is necessary to
 *    construct a fully qualified pathname from path components.
 */

static
char *
GetDevicePathname(
	char		*device_name,	/* Free-form device name */
	char		*device_path_buf, /* Ptr to device pathname buffer */
	size_t		device_path_buflen) /* Device path buffer length */
{
	const path_file_t *default_dev;	/* Ptr to a default_device[] element */

#if (0)	/* Currently unused */
	/*
	 * If there's no device name, return the most likely default pathname
	 */
	if (device_name == NULL) {
		(void) GetDefaultDevicePathname(&device_name);
		if (device_name == NULL) {
			device_name = default_device[0].pathname;
		}
		return (device_name);
	}

#endif	/* Currently unused */
	/*
	 * Convert a default device name to a full pathname
	 */
	for (default_dev = &default_device[0];
	     default_dev->pathname != NULL;
	     default_dev += 1) {
		if ((strcmp(device_name, default_dev->pathname) == 0) ||
		    (strcmp(device_name, default_dev->filename) == 0)) {
			return (default_dev->pathname);
		}
	}

	/*
	 * Try to convert a real device filename to a full pathname
	 */
	if (*device_name != '/') {
		const char *const device_dir = DEVICE_DIR "/";

		if (strlen(device_dir) + strlen(device_name)
						< device_path_buflen) {
			strcpy(device_path_buf, device_dir);
			strcat(device_path_buf, device_name);
			device_name = device_path_buf;
		}
	}

	/*
	 * Return the full pathname or whatever
	 */
	return (device_name);

}	/* GetDevicePathname() */


/*
 * GetConfigProgramPath()
 *
 *    Given the current X server and the identifier for the frame buffer
 *    device, construct the full pathname of the relevant configuration
 *    program.  Return the program pathname and a sense of whether it
 *    exists (ENOENT), is accessible (EACCES), etc.
 *
 *    The caller is responsible for freeing the returned pathname
 *    string.
 */

static
int
GetConfigProgramPath(
	xserv_t		x_server,	/* X server: Xsun, Xorg, ... */
	const char	*vis_ident_name, /* VISUAL env device identifier */
	char		**config_prog_path) /* Returned config program path */
{
	const char *const xsun_prog_fmt  = FBC_LIB_DIR "/%s_config";
	const char *const xorg_prog_fmt  = FBC_LIB_DIR "/%s_conf";
	const char *const xorg_lib_fmt   = FBC_LIB_DIR "/lib%s_conf.so";
	const char *const xorg_prog_path = FBC_LIB_DIR "/fbconf_xorg";
	int		error_code;	/* Error code (see errno.h) */
	size_t		len;		/* String length temp */
	size_t		len_ident;	/* Length of device identifier name */
	size_t		len_path;	/* Max length of path memory needed */

	*config_prog_path = NULL;
	error_code        = 0;

	/*
	 * Build server-specific pathnames of config programs
	 */
	len_ident = strlen(vis_ident_name);

	switch (x_server) {

	default:
		/*
		 * Commandeer EINVAL to indicate that the X server is unknown
		 */
		return (EINVAL);	/* Invalid x_server argument */

	case XSERVER_XSUN:
		*config_prog_path = malloc(strlen(xsun_prog_fmt) + len_ident);
		if (*config_prog_path == NULL) {
			return (ENOMEM);
		}
		sprintf(*config_prog_path, xsun_prog_fmt, vis_ident_name);
		break;

	case XSERVER_XORG:
		/*
		 * Allocate memory to contain any one of the pathnames:
		 *    * any device-specific config program
		 *    * the device-specific library used by fbconf_xorg
		 *    * the multi-device config program, fbconf_xorg
		 *
		 *    Note that the two-character "%s" conversion spec
		 *    in the sprintf() format string is replaced by the
		 *    vis_ident_name string.  Its trifling length could
		 *    be ignored but we'll count it against the length
		 *    of the Nul terminator.
		 */
		len_path = strlen(xorg_lib_fmt);
		len      = strlen(xorg_prog_fmt);
		if (len_path < len) {
			len_path = len;
		}
		len_path += len_ident;
		len = strlen(xorg_prog_path) + 1;
		if (len_path < len) {
			len_path = len;
		}

		*config_prog_path = malloc(len_path);
		if (*config_prog_path == NULL) {
			return (ENOMEM);
		}

		/*
		 * See if a config program exists, accessible or not
		 */
		sprintf(*config_prog_path, xorg_prog_fmt, vis_ident_name);
		if (access(*config_prog_path, X_OK) == 0) {
			return (0);	/* Have a device-specific program */
		}
		if (errno != ENOENT) {
			return (errno);	/* Have a program w/ encumbrances */
		}

		/*
		 * Make a note of whether a device-specific library exists
		 *
		 *    We'll return the multi-device config program path
		 *    in any case.  The caller can decide, based on the
		 *    error code, whether and how it could be useful.
		 */
		sprintf(*config_prog_path, xorg_lib_fmt, vis_ident_name);
		if (access(*config_prog_path, X_OK) != 0) {
			error_code = errno;
		}

		/*
		 * Construct the multi-device config program pathname
		 *
		 *    It's assumed that the states of existence and
		 *    accessibility of the config program, fbconf_xorg,
		 *    also hold true for its common library,
		 *    libfbconf_xorg.so.
		 */
		strcpy(*config_prog_path, xorg_prog_path);
		break;
	}

	/*
	 * See if the config program exists and allows the user to execute it
	 */
	if (access(*config_prog_path, X_OK) != 0) {
		if (error_code != ENOENT) {
			error_code = errno; /* Supersede an Xorg lib error */
		}
	}

	return (error_code);

}	/* GetConfigProgramPath() */


/*
 * FindConfigProgram()
 *
 *    Return the full pathname of the configuration program associated
 *    with this X server and fully qualified device pathname.
 *
 *    In the event of an error, an error code from errno.h space will be
 *    returned, along with a NULL pathname pointer.
 *
 *    The caller is responsible for freeing the returned pathname
 *    string.
 */
static
int
FindConfigProgram(
	xserv_t		x_server,	/* X server: Xsun, Xorg, ... */
	const char	*device_path,	/* Device pathname */
	char		**config_prog_path) /* Returned config program path */
{
	int		error_code;	/* Error code (see errno.h) */
	struct vis_identifier vis_ident; /* VISUAL env device identifier */

	*config_prog_path = NULL;

	/*
	 * Validate the device and get its VISUAL environment identifier
	 */
	error_code = get_device_identification(
					device_path, NULL, &vis_ident, NULL);
	if (error_code != 0) {
		PrintError("%s, %s", strerror(error_code), device_path);
		if (error_code != EACCES) {
			PrintError(catgets(catfd, 12, 1,
				    "Not a configurable device. "
				    " Use -list to show valid devices."));
		}
		return (error_code);
	}

	/*
	 * Get the config program to use with this X server and device type
	 */
	error_code = GetConfigProgramPath(
				x_server, vis_ident.name, config_prog_path);
	if (error_code != 0) {
		PrintError("%s, %s", strerror(error_code),
				(*config_prog_path == NULL) ?
					"config program" : *config_prog_path);
		free(*config_prog_path);	/* Release any memory */
		*config_prog_path = NULL;
	}

	return (error_code);

}	/* FindConfigProgram() */


/*
 * PathToGUI()
 *
 *    Return the pathname of the DCM Tool GUI script and an errno-style
 *    error code indicating whether the pathname is useable.
 */

static
int
PathToGUI(
	const char	**gui_path)	/* Returned GUI script pathname */
{
	int		error_code;	/* Error code (see errno.h) */

	*gui_path  = DCMTOOL_LOCATION;
	error_code = 0;
	if (access(*gui_path, X_OK) < 0) {
		error_code = errno;
#ifdef DEBUG_FB
		printf("PathToGUI: %s\n", strerror(error_code));
#endif
	}
	return (error_code);

}	/* PathToGUI() */


/*
 * PrintHelp()
 *
 *    Display this program's command line syntax.  Include the -gui
 *    option only if PathToGUI() returns a non-zero error code,
 *    indicating that the returned GUI pathname is useable.  Then invoke
 *    the actual device configuration program, iff known, to display its
 *    own -help text.  (The device configuration program must implement
 *    the -dev and the -help option.)
 */

static
void
PrintHelp(
	xserv_t		x_server,	/* X server: Xsun, Xorg, ... */
	char		*device_path)	/* Device pathname */
{
	char		*config_prog_path; /* Device config program pathname */
	int		error_code;	/* Error code from PathToGUI() */
	const char	*gui_path;	/* DCM Tool GUI pathname (ignored) */
	const char	*gui_synopsis;	/* -gui synopsis text, if any */

	/*
	 * Decide whether to show the -gui option synopsis and description
	 */
	gui_synopsis = "";
#if (1)	/* ??? Cover for temporarily absent functionality ??? */
	error_code = EINVAL;
	if (x_server == XSERVER_XSUN) {
#endif
	error_code = PathToGUI(&gui_path);
	if (error_code == 0) {
		gui_synopsis = catgets(catfd, 13, 1, " [-gui]");
	}
#if (1)	/* ??? Cover for temporarily absent functionality ??? */
	}
#endif

	/*
	 * Display synopsis (usage) and description text
	 */
	printf(catgets(catfd, 2, 1,
		"Usage:\n"
		"\tfbconfig [-dev devname] [-help] [-list]%s\n"
		"\t         [device-specific-options]\n"
		"\t-dev\t\tSpecify the frame buffer device file name.\n"
		"\t-help\t\tDisplay this help text.\n"
		"\t-list\t\tList installed and configurable frame buffers.\n"
		"\t-xserver [Xorg | Xsun]\tConfigure the Xserver to the specified program.\n"),
		gui_synopsis);
	if (error_code == 0) {
		printf(catgets(catfd, 15, 1,
		    "\t-gui\t\tInvoke Graphical User Interface (SUNWdcm)\n"
		    "\t\t\tto configure devices and update Xservers file.\n"));
	}
	printf("\n"
		"\tdevice-specific-options are implemented by the device\n"
		"\t\t\tconfiguration program.\n"
		"\n");

	/*
	 * Invoke the device config program to display its own -help text
	 */
	if (device_path != NULL) {
		static char *argv[] = { NULL, "-dev", NULL, "-help", NULL };

		(void) FindConfigProgram(
				x_server, device_path, &config_prog_path);
		if (config_prog_path != NULL) {
			argv[0] = config_prog_path;
			argv[2] = device_path;
			CallConfigProgram(argv);
		}
	}

}	/* PrintHelp() */


/*
 * ListDevices_StreamCheck()
 *
 *    See whether the specified "device" name and "stream" name are in
 *    fact a device file and a stream file for the same device.  (It is
 *    possible that the device file is actually a stream for a previous
 *    device.  The stream file could be any frame buffer entity.)  If a
 *    device/stream relationship exists, return the stream suffix
 *    character.  Return a Nul character otherwise.
 */
static
char
ListDevices_StreamCheck(
	const char	*device_name,	/* Device file name */
	int		device_rdev,	/* st_rdev value returned by stat() */
	struct vis_identifier *device_vis_ident, /* Device VIS identifier */
	const char	*stream_name)	/* Potential stream file name */
{
	size_t		device_len;	/* Length of device file name */
	size_t		stream_len;	/* Length of potential stream name */
	char		stream_path[MAX_DEV_PATH_LEN]; /* Stream pathname */
	int		stream_rdev;	/* st_rdev value returned by stat() */
	struct vis_identifier stream_vis_ident; /* Stream VIS env identifier */

	/*
	 * See if the potential stream name is the device name w/ a stream char
	 */
	device_len = strlen(device_name);
	stream_len = strlen(stream_name);
	if ((stream_len != device_len + 1) ||
	    (strncmp(stream_name, device_name, device_len) != 0) ||
	    (strchr(STREAM_SUFFIX_CHARS, *(stream_name + device_len))
						== NULL)) {
		return ('\0');		/* The name strings are unrelated */
	}

	/*
	 * See if the potential stream has the same device identifiers
	 *
	 *    Note that our caller, ListDevices(), has compared
	 *    this pathname length to the buffer length.  Oversized
	 *    names were rejected.
	 */
	strcpy(stream_path, DEVICE_DIR "/");
	strcat(stream_path, stream_name);
	if (get_device_identification(
		    stream_path, &stream_rdev, &stream_vis_ident, NULL) != 0) {
		return ('\0');		/* Decline to pursue this */
	}
	if (((stream_rdev & ~MINOR_MASK) != (device_rdev & ~MINOR_MASK)) ||
	    (strcmp(stream_vis_ident.name, device_vis_ident->name) != 0)) {
		return ('\0');		/* Device identifiers don't match */
	}

	/*
	 * Return with the stream suffix character
	 */
	return (*(stream_name + device_len));

}	/* ListDevices_StreamCheck() */


/*
 * ListDevices()
 *
 *    In response to the -list option, display the frame buffer device
 *    files found in the /dev/fbs directory, along with the frame
 *    buffer configuration program appropriate for the type of device.
 *    If there is some obvious problem with the device or the config
 *    program, a diagnostic message may be displayed instead of the
 *    program file name.
 *
 *    Illustrative -list output, assuming Xorg is configured:
 *
 *      Device File Name            Device Model     Config Program
 *      ----------------            ------------     --------------
 *      /dev/fbs/cgsix0                              not configurable
 *      /dev/fbs/ffb0                                not configurable
 *      /dev/fbs/ffb1                                not configurable
 *      /dev/fbs/kfb0               XVR-2500         SUNWkfb_config
 *      /dev/fbs/kfb1               XVR-2500         SUNWkfb_config
 *      /dev/fbs/m640                                not configurable
 *      /dev/fbs/nfb0 [a|b]         XVR-300          not configurable
 *      /dev/fbs/pfb0 [a|b]         XVR-100          not configurable
 *      /dev/fbs/efb0               XVR-300          SUNWefb_config
 *      /dev/fbs/efb1               XVR-100          SUNWefb_config
 *      /dev/fbx/ast0		    AST-2100         SUNWast_config
 *
 *    This and the FindConfigurableDevices() function are similar and
 *    can be maintained together.
 */

/* Entry in a sorted, singly-linked list of potential device names */
typedef struct devent_st {
	struct devent_st *next;		/* Ptr to next device entry in list */
	char		name[1];	/* Name of potential device file */
} dev_ent_t;

static
unsigned int
get_device_mask(char * device_path)
{
	if (strstr(device_path, "ast")) {
		return GFX_DEV_AST;
	} else if (strstr(device_path, "efb")) {
		return (GFX_DEV_EFB | GFX_DEV_NFB | GFX_DEV_PFB);
	} else if (strstr(device_path, "nfb")) {
		return GFX_DEV_NFB;
	} else if (strstr(device_path, "pfb")) {
		return GFX_DEV_PFB;
	} else if (strstr(device_path, "kfb")) {
		return GFX_DEV_KFB;
	} else if (strstr(device_path, "ifb")) {
		return GFX_DEV_IFB;
	} else if (strstr(device_path, "jfb")) {
		return GFX_DEV_JFB;
	} else if (strstr(device_path, "ffb")) {
		return GFX_DEV_FFB;
	} else if (strstr(device_path, "m64")) {
		return GFX_DEV_M64;
	} else {
		return 0;
	}
}

static
void
ListDevices(
	xserv_t		x_server,	/* Xserver: Xsun, Xorg */
	boolean_t	probe_only,	/* 1 - probe the devices only, no output */
	unsigned int	*device_mask)	/* bit set for each listed device */
{
	char		device_model[GFX_MAX_MODELNAME_LEN]; /* Model_name */
	char		device_path[MAX_DEV_PATH_LEN + MAX_SUFFIX_LIST_LEN];
	struct dirent	*dir_entry;	/* Device directory entry */
	DIR		*dir_fd;	/* Device directory file descriptor */
	size_t		dir_len;	/* Length of "/dev/fbs/" */
	dev_ent_t	*dev_list;	/* Head of device name list */
	dev_ent_t	*dev_entry;	/* Ptr to current device name entry */
	dev_ent_t	**dev_ent_pptr;	/* Ptr to ptr to current entry */
	dev_ent_t	*dev_next;	/* Ptr to next device name entry */
	size_t		file_len;	/* Length of simple filename */
	boolean_t	found = B_FALSE; /* TRUE => Device(s) displayed */

	/*
	 * Open the /dev/fbs device directory
	 */
	dir_fd = opendir(DEVICE_DIR);
	if (dir_fd == NULL) {
		PrintError(catgets(catfd, 6, 1,
				"Cannot open the " DEVICE_DIR " directory"));
		exit(1);
	}

	/*
	 * Insert each file name in the /dev/fbs directory into a sorted list
	 */
	dir_len  = strlen(DEVICE_DIR "/");
	dev_list = NULL;
	for (;;) {
		/*
		 * Read the next directory entry
		 */
		dir_entry = readdir(dir_fd);
		if (dir_entry == NULL) {
			if ((errno != 0) && (errno != ENOENT)) {
				PrintError("%s, while reading " DEVICE_DIR,
						strerror(errno));
			}
			break;
		}

		/*
		 * Ignore anything that clearly isn't a device name
		 */
		if ((strcmp(dir_entry->d_name, ".") == 0) ||
		    (strcmp(dir_entry->d_name, "..") == 0)) {
			continue;	/* Directories aren't devices */
		}
		file_len = strlen(dir_entry->d_name);
		if (dir_len + file_len >= MAX_DEV_PATH_LEN) {
			continue;	/* Too long for a device pathname */
		}

		/*
		 * Create a list entry for this potential device name
		 */
		dev_entry = malloc(sizeof(dev_ent_t) + file_len);
		if (dev_entry == NULL) {
			PrintError("Insufficient memory, %s",
					dir_entry->d_name);
			exit(1);
		}
		strcpy(dev_entry->name, dir_entry->d_name);

		/*
		 * Insert the new name into the sorted list of names
		 */
		for (dev_ent_pptr = &dev_list;
		    ;
		    dev_ent_pptr = &dev_next->next) {
			dev_next = *dev_ent_pptr;
			if ((dev_next == NULL) ||
			    (strcmp(dev_entry->name, dev_next->name) < 0)) {
				dev_entry->next = dev_next;
				*dev_ent_pptr   = dev_entry;
				break;
			}
		}
	}

	closedir(dir_fd);

	/*
	 * Display information for each list entry that looks like a device
	 */
	strncpy(device_path, DEVICE_DIR "/", MAX_DEV_PATH_LEN);
	for (dev_entry = dev_list; dev_entry != NULL; dev_entry = dev_next) {
		char	*config_prog_path; /* Device config program pathname */
		int	error_code;	/* Error code (see errno.h) */
		const char *program_field; /* Config prog name or msg text */
		char	suffix_char;	/* Stream suffix char, else Nul */
		char	*suffix_ptr;	/* Suffix list ptr in dev path buf */
		char	suffix_punct;	/* Punctuation for suffix char list */
		int	st_rdev;	/* st_rdev value returned by stat() */
		struct vis_identifier vis_ident; /* Device vis identifier */

		/*
		 * Construct the full pathname for this potential device
		 *
		 *    Note that this pathname length was compared to the
		 *    buffer length in the previous loop.  Oversized
		 *    names were rejected.
		 */
		file_len = strlen(dev_entry->name);
		strcpy(&device_path[dir_len], dev_entry->name);

		/*
		 * Discard this list entry
		 */
		dev_next = dev_entry->next;
		free(dev_entry);

		/*
		 * See if this file is a device and get its identifications
		 */
		device_model[0] = '\0';
		error_code = get_device_identification(
				device_path,
				&st_rdev, &vis_ident, &device_model[0]);

		if (error_code == 0) {
			*device_mask |= get_device_mask(device_path);
		}

		if (probe_only == B_TRUE)
			continue;

		/*
		 * Determine the "Config Program" field contents
		 */
		config_prog_path = NULL;	/* For free() */
		program_field    = "";		/* For falling thru cracks */
		if (error_code != 0) {
			if (error_code != EACCES) {
				continue;	/* Not a convincing device */
			}
			/* No VISUAL env identifier with which to proceed */
			program_field = "device access denied";
		} else {
			/*
			 * Get the config program pathname for this device
			 */
			error_code = GetConfigProgramPath(x_server,
							vis_ident.name,
							&config_prog_path);
			if (error_code != 0) {
				/*
				 * Provide a diagnostic message
				 */
				switch (error_code) {
				case EINVAL:	/* Invalid x_server value */
					program_field = catgets(catfd, 7, 1,
						"X server not known");
					break;
				case ENOENT:	/* Config program not found */
					program_field = catgets(catfd, 7, 1,
						"program not available");
					break;
				case EACCES:	/* User can't access program */
					program_field =
						"program access denied";
					break;
				default:	/* Some other mischief */
					program_field = strerror(error_code);
					break;
				}
			} else {
				/*
				 * Find the simple filename of the config prog
				 */
				program_field = strrchr(config_prog_path, '/');
				if (program_field == NULL) {
					program_field = config_prog_path;
				} else {
					program_field += 1;
				}
			}
		}

		/*
		 * Check for streams that can be consolidated with this device
		 *
		 *    It is assumed that the device name list is sorted
		 *    such that all names for a given device are
		 *    adjacent, with the plain device name first and any
		 *    stream-suffixed names following.  It's also
		 *    assumed that a stream name is the device name with
		 *    a one-character suffix from the set,
		 *    STREAM_SUFFIX_CHARS.
		 */
		suffix_ptr   = &device_path[dir_len + file_len]; /* The Nul */
		suffix_punct = '[';
		while (dev_next != NULL) {
			/*
			 * See if the next list entry has a related stream name
			 */
			dev_entry = dev_next;
			suffix_char = ListDevices_StreamCheck(
						&device_path[dir_len],
						st_rdev,
						&vis_ident,
						dev_entry->name);
			if (suffix_char == '\0') {
				break;		/* Not a related stream name */
			}

			/*
			 * Append this stream suffix character to the substring
			 */
			*(suffix_ptr+1) = suffix_punct;	/* '[' or '|' */
			*(suffix_ptr+2) = suffix_char;	/* 'a', 'b', ... */
			suffix_ptr += 2;
			suffix_punct = '|';

			/*
			 * Free this now-consolidated stream entry
			 */
			dev_next = dev_entry->next;
			free(dev_entry);
		}
		if (suffix_punct != '[') {
			/*
			 * Terminate the non-empty stream suffix char substring
			 */
			*(suffix_ptr+1) = ']';
			*(suffix_ptr+2) = '\0';

			/*
			 * Append the stream suffix character substring
			 */
			device_path[dir_len + file_len] = ' '; /* Was Nul */
		}

		/*
		 * Display the file & any streams, model, and config prog field
		 */
		if (!found) {
			found = B_TRUE;
#ifdef DEBUG_FB	/* Show VISUAL environment identifier also */
			printf("  -------");
#endif
			printf(catgets(catfd, 8, 1,
	"  Device File Name            Device Model     Config Program\n"
	"  ----------------            ------------     --------------\n"));
		}
#ifdef DEBUG_FB	/* Show VISUAL environment identifier also */
		printf("  %-7.7s", vis_ident.name);
#endif
		printf("  %-27.27s %-16.16s %s\n",
			device_path, device_model, program_field);

		free(config_prog_path);
	}

	/*
	 * If nothing was found then say so (before returning and terminating)
	 */
	if (!probe_only && !found) {
		printf(catgets(catfd, 9, 1,
				"No configurable devices found in "
					DEVICE_DIR " directory\n"));
	}

}	/* ListDevices() */


/*
 * FindConfigurableDevices()
 *
 *    This function checks /dev/fb and searches /dev/fbs until a
 *    frame buffer device is found that can be opened and provide a
 *    VISUAL environment device identifier.  The possible return values
 *    are:
 *         Zero   - Success; at least one device exists and can be accessed
 *         ENOENT - No frame buffer device was found
 *         EACCES - Something was found, but the user can't access it
 *
 *    The -gui option will not launch the DCM Tool if this function
 *    returns a non-zero value.
 *
 *    This and the ListDevices() function are similar and can be
 *    maintained together.
 */

static
int
FindConfigurableDevices(void)
{
	char		*default_path;	/* Default device pathname (dummy) */
	char		device_path[MAX_DEV_PATH_LEN];
	struct dirent	*dir_entry;	/* Device directory entry */
	DIR		*dir_fd;	/* Device directory file descriptor */
	size_t		dir_len;	/* Length of "/dev/fbs/" */
	int		err_code;	/* Error code (see errno.h) */
	int		error_code;	/* Return EACCES, ENOENT, or zero */
	size_t		file_len;	/* Length of simple filename */
	struct vis_identifier vis_ident; /* Device VISUAL env identifier */

	error_code = ENOENT;

	/*
	 * See whether any default device will open and identify itself
	 */
	err_code = GetDefaultDevicePathname(&default_path);
	if (err_code == 0) {
		return (0);		/* At least one FB device exists */
	}
	if (err_code == EACCES) {
		error_code = EACCES;	/* Caller may have to complain */
	}

	/*
	 * Open the /dev/fbs device directory
	 */
	dir_fd = opendir(DEVICE_DIR);
	if (dir_fd == NULL) {
		PrintError(catgets(catfd, 6, 1,
				"Cannot open the " DEVICE_DIR " directory"));
		exit(1);
	}

	/*
	 * Examine each file in /dev/fbs until a working FB device is found
	 */
	dir_len = strlen(DEVICE_DIR "/");
	for (;;) {
		/*
		 * Read the next directory entry
		 */
		dir_entry = readdir(dir_fd);
		if (dir_entry == NULL) {
			if ((errno != 0) && (errno != ENOENT)) {
				PrintError("%s, while reading " DEVICE_DIR,
						strerror(errno));
			}
			break;
		}

		/*
		 * Ignore anything that clearly isn't a device
		 */
		if ((strcmp(dir_entry->d_name, ".") == 0) ||
		    (strcmp(dir_entry->d_name, "..") == 0)) {
			continue;	/* Directories aren't devices */
		}
		file_len = strlen(dir_entry->d_name);
		if (dir_len + file_len >= MAX_DEV_PATH_LEN) {
			continue;	/* Too long for a device pathname */
		}

		/*
		 * Construct the full pathname for the device
		 */
		strcpy(&device_path[dir_len], dir_entry->d_name);

		/*
		 * See if this file is a frame buffer device
		 */
		err_code = get_device_identification(
					device_path, NULL, &vis_ident, NULL);
		if (err_code == 0) {
			error_code = 0;
			break;		/* At least one FB device exists */
		}
		if (err_code == EACCES) {
			error_code = EACCES; /* Caller may have to complain */
		}
	}

	closedir(dir_fd);

	return (error_code);

}	/* FindConfigurableDevices() */


/*
 * InvokeGUI()
 *
 *    Implement the -gui option:
 *      -gui  Executes the Graphics User Interface program DCMTool
 *	      if it is available.
 *
 *    This is done by invoking:
 *        pfexec /usr/lib/fbconfig/SUNWdcm/bin/dcmtool
 *	  (RBAC's exec_attr entry makes that program setuid root.)
 *
 *    If successful, this function does not return.  A non-zero exit
 *    code is returned otherwise.
 */

static
int
InvokeGUI(void)
{
	const char	*pfexec_path = "/usr/bin/pfexec";
	const char	*gui_path;	/* DCM Tool GUI script pathname */
	int		error_code;	/* Error code (see errno.h) */

	/*
	 * Make sure the GUI will have at least one device
	 *
	 *    The error_code returned by FindConfigurableDevices()
	 *    will be EACCES, ENOENT, or zero.
	 */
	error_code = FindConfigurableDevices();
	if (error_code != 0) {
		if (error_code == EACCES) {
			PrintError(catgets(catfd, 21, 2,
			    "You do not have access to configure"
			    " graphics devices on this system.\n"
			    "You will have access if you log in"
			    " to the console or you are superuser (root)."));
			return (2);
		}
		printf(catgets(catfd, 9, 1,
			"No configurable devices found in "
			DEVICE_DIR " directory\n"));
		return (1);
	}

	/*
	 * Get the pathname of the DCM Tool GUI script
	 */
	error_code = PathToGUI(&gui_path);
	if (error_code != 0) {
		if (error_code == ENOENT) {
			PrintError(catgets(catfd, 20, 1,
				"GUI not present. Install SUNWdcm package."));
		} else {
			PrintError("%s, %s", strerror(error_code), gui_path);
		}
		return (1);
	}

	(void) execl(pfexec_path, pfexec_path, gui_path, NULL);

	/* execl() should not return; if it did, it failed */
#ifdef DEBUG_FB
	PrintError("execl() failed, errno=%d: %s", errno, strerror(errno));
#endif
	return (2);

}	/* InvokeGUI() */


static
int
IsXserverSupported(xserv_t xserver_arg, unsigned int device_mask)
{
	struct stat	stat_buf;	/* stat() buffer for device file */

	if (stat(xserver_path[xserver_arg], &stat_buf) != 0) {
		printf("Fails to configure xserver to %s, no such file\n", xserver_path[xserver_arg]);
		return 0;
	}

	if (device_mask & ~xserver_device[xserver_arg]) {
		printf("Fails to configure xserver to %s, not all graphics devices in the system can be configured to run with this xserver\n",
				xserver_path[xserver_arg]);
		return 0;
	}

	return 1;
}

static
void
SetXServer(xserv_t x_server, xserv_t xserver_arg, unsigned int device_mask)
{
	struct stat	stat_buf;	/* stat() buffer for device file */
	char efb_path[40] = "/kernel/drv/sparcv9/efb";	
	char nfb_path[40] = "/kernel/drv/sparcv9/nfb";	
	char pfb_path[40] = "/kernel/drv/sparcv9/pfb";	

	if (xserver_arg == XSERVER_XORG) {

		/*
		 * First check if all the listed devices supports Xorg. 
		 * If not, setting to Xorg will be denied.
		 */
		if (!IsXserverSupported(xserver_arg, device_mask)) {
			return;
		}

		/*
		 * If there is a XVR-50, XVR-100, XVR-300, check if efb driver exists
		 */
		if (device_mask & (GFX_DEV_NFB | GFX_DEV_PFB | GFX_DEV_EFB)) {
			if (stat(efb_path, &stat_buf) != 0) {
				printf("Fails to configure xserver to %s, efb driver is not installed\n",
						xserver_path[xserver_arg]);
				return;
			}
		}

		system("svccfg -s svc:/application/x11/x11-server setprop options/server=/usr/bin/Xorg");

		if (stat(efb_path, &stat_buf) == 0) {
			system("rem_drv nfb 2>/dev/null&");
			system("rem_drv pfb 2>/dev/null&");
			system("add_drv -n -m '* 0666 root sys' -i \"SUNW,XVR-50 SUNW,XVR-100 SUNW,XVR-300\" efb 2>/dev/null&");
			printf("A reboot needs to be performed to complete the reconfiguration to run Xorg\n");
		} else {
			printf("Fails to switch to efb driver. Please check to see if SUNWefb is installed.\n");
		}

	} else if (xserver_arg == XSERVER_XSUN) {

		int pfb_exists = 0;

		/*
		 * First check if all the listed devices supports Xsun. 
		 * If not, setting to Xsun will be denied.
		 */
		if (!IsXserverSupported(xserver_arg, device_mask)) {
			return;
		}

#if OSVER==510
		if ((stat("/platform/sun4u/kernel/drv/sparcv9/pfb", &stat_buf) == 0) ||
		    (stat("/platform/sun4v/kernel/drv/sparcv9/pfb", &stat_buf) == 0) ||
		    (stat("/platform/sun4us/kernel/drv/sparcv9/pfb", &stat_buf) == 0)) {
			pfb_exists = 1;
		}
#else
		if (stat(pfb_path, &stat_buf) == 0) {
			pfb_exists = 1;
}
#endif

		/*
		 * If there is a XVR-300, check if nfb driver exists
		 */
		if (device_mask & GFX_DEV_NFB) {
			if (stat(nfb_path, &stat_buf) != 0) {
				printf("Fails to configure xserver to %s, nfb driver is not installed\n",
						xserver_path[xserver_arg]);
				return;
			}
		}

		/*
		 * If there is a XVR-50, XVR-100, check if pfb driver exists
		 */
		if (device_mask & GFX_DEV_PFB) {
			if (pfb_exists == 0) {
				printf("Fails to configure xserver to %s, pfb driver is not installed\n",
						xserver_path[xserver_arg]);
				return;
			}
		}

		system("svccfg -s svc:/application/x11/x11-server setprop options/server=/usr/openwin/bin/Xsun");

		if (stat(efb_path, &stat_buf) == 0) {
			system("rem_drv efb 2>/dev/null&");
		}

		if (stat(nfb_path, &stat_buf) == 0) {
			system("add_drv -n -m '* 0666 root sys' -i \"SUNW,XVR-300\" nfb 2>/dev/null&");
		}

		if (pfb_exists) {
			system("add_drv -n -m '* 0666 root sys' -i \"SUNW,XVR-50 SUNW,XVR-100\" pfb 2>/dev/null&");
		}

		printf("A reboot needs to be performed to complete the reconfiguration to run Xsun\n");

	} else {
		printf("Default Xserver: %s\n", xserver_path[x_server]);
	}
}	/* SetXServer() */


/*
 * main() for fbconfig(1M)
 *
 *    Do exactly one of the following, in order of precedence, depending
 *    on options in the program command line (argv[]):
 *      * Display fbconfig(1M) help text (-help) along with any
 *        configuration program help text (-dev, -help) and then
 *        terminate.
 *      * Display the installed frame buffer devices and the
 *        corresponding configuration program for each (-list) and then
 *        terminate.
 *      * Become the dcmtool GUI (-gui).
 *      * Repackage the program argument vector and become the
 *        appropriate device configuration program (-dev).
 *      * Report a fatal error and terminate.
 */

int
main(
	int		argc,		/* Program argument count */
	char		*argv[])	/* Program argument vector */
{
#define	CFG_ARG_1	3		/* Index of initial cfg_argv[] arg */
	boolean_t	dev_opt  = B_FALSE; /* TRUE => Found -dev  option */
	boolean_t	help_opt = B_FALSE; /* TRUE => Found -help option */
	boolean_t	list_opt = B_FALSE; /* TRUE => Found -list option */
	boolean_t	gui_opt  = B_FALSE; /* TRUE => Found -gui  option */
	boolean_t	xserver_opt  = B_FALSE; /* TRUE => Found -xserver  option */
	char		**cfg_argv;	/* Config program argument vector */
	char		*config_prog_path; /* Config program pathname */
	char		*device_path;	/* Device pathname */
	char		device_path_buf[MAX_DEV_PATH_LEN];
	int		i;		/* argv[] argument vector index */
	int		n;		/* cfg_argv[] argument vector index */
	xserv_t		x_server;	/* X server: Xsun, Xorg, ... */
	xserv_t		xserver_arg;	/* -xserver arg: Xsun, Xorg, ... */
	unsigned int	device_mask = 0;

	catfd = catopen("fbconfig", 0);

	/*
	 * Allocate an argument vector to pass to the device config program
	 *
	 *    The config program (child) argument vector must be large
	 *    enough to hold:
	 *      * The config program pathname      (     1 pointer )
	 *      * A default "-dev /dev/fb" option  (     2 pointers)
	 *      * The fbconfig(1M) arguments       (argc-1 pointers)
	 *      * A NULL terminator                (     1 pointer )
	 */
	cfg_argv = calloc((2 + argc + 1), sizeof (char *));
	if (cfg_argv == NULL) {
		PrintError("Insufficient memory for new argument vector");
		return (1);
	}

	/*
	 * Process the fbconfig(1M) program command line arguments
	 *
	 *    Leave room in the child's argument vector to prepend these
	 *    three (CFG_ARG_1) strings:
	 *      * The pathname of the child config program
	 *      * A -dev option and a default frame buffer name
	 */
	n = CFG_ARG_1;
	for (i = 1; i < argc; i += 1) {
		/* Look for -help (for which -dev can be a modifier) */
		if (strncmp(argv[i], "-help", 6) == 0) {
			help_opt = B_TRUE;
			continue;	/* Option isn't passed to child */
		}

		/* Look for a -list option and don't copy it */
		if (strncmp(argv[i], "-list", 6) == 0) {
			list_opt = B_TRUE;
			continue;	/* Option isn't passed to child */
		}

		/* Look for a -list option and don't copy it */
		if (strncmp(argv[i], "-xserver", 9) == 0) {
			xserver_opt = B_TRUE;
			xserver_arg = XSERVER_UNKNOWN;

			i++;
			if (i < argc) {
				if (strncasecmp(argv[i], "Xsun", 4) == 0) {
					xserver_arg = XSERVER_XSUN;
				} else if (strncasecmp(argv[i], "Xorg", 4) == 0) {
					xserver_arg = XSERVER_XORG;
				}
			}
			continue;	/* Option isn't passed to child */
		}

		/* Look for a -gui option and don't copy it */
		if (strncmp(argv[i], "-gui", 5) == 0) {
			gui_opt = B_TRUE;
			continue;	/* Option isn't passed to child */
		}

		/* Look for -dev and save the full device pathname */
		if (strncmp(argv[i], "-dev", 5) == 0) {
			/*
			 * Check for -dev option errors
			 */
			i += 1;
			if (i >= argc) {
				PrintError(catgets(catfd, 11, 1,
					    "Option requires a value, -dev"));
				return (1);
			}
			if (dev_opt) {
				PrintError(catgets(catfd, 10, 1,
						"Duplicate option, -dev %s"),
					    argv[i]);
				return (1);
			}
			dev_opt = B_TRUE;

			/*
			 * Get the fully qualified device pathname
			 */
			device_path = GetDevicePathname(
						argv[i],
						device_path_buf,
						sizeof (device_path_buf));

			/*
			 * Copy the -dev option to the new argument vector
			 */
			cfg_argv[n  ] = argv[i-1];
			cfg_argv[n+1] = device_path;
			n += 2;

			continue;
		}

		/*
		 * Copy this string to the arg vector for the config program
		 */
		cfg_argv[n] = argv[i];
		n += 1;
	}
	cfg_argv[n] = NULL;

	/*
	 * Find out which X server is configured (Xsun, Xorg, ...)
	 *
	 *    If the X server isn't known, the GetConfigProgramPath()
	 *    function can't return a configuration program pathname.
	 *    Options such as -help and -list might still be useful,
	 *    however (and someday -gui will work too).
	 */
	x_server = IdentifyXServer();
	if (x_server == XSERVER_UNKNOWN) {
		PrintError("Unable to identify the configured X server");
	}

	/*
	 * Try to make sure the frame buffer device pathname is known
	 */
	if (!dev_opt) {
		(void) GetDefaultDevicePathname(&device_path);
	}

	/*
	 * If -help was specified or implied, display help text and exit
	 *
	 *    The -help option is implied iff there is no -list or -gui
	 *    option and no option or argument intended for a device
	 *    configuration program (n > CFG_ARG_1).  The -dev option is
	 *    either a modifier for the explicit -help option or is an
	 *    option for the device configuration program.
	 */
	if (help_opt || !(list_opt || xserver_opt || gui_opt || (n > CFG_ARG_1))) {
		PrintHelp(x_server, device_path);
		return (0);
	}

	/*
	 * If -list was specified, display the frame buffer devices and exit
	 */
	if (list_opt) {
		ListDevices(x_server, B_FALSE, &device_mask);
		return (0);
	}

	/*
	 *
	 */
	if (xserver_opt) {
		ListDevices(x_server, B_TRUE, &device_mask);
		SetXServer(x_server, xserver_arg, device_mask);
		return (0);
	}

	/*
	 * If -gui was specified, try to become the GUI (else exit)
	 */
	if (gui_opt) {
		/*
		 * Invoke the GUI (w/o returning), else exit unsuccessfully
		 */
#if (1)	/* ??? Cover for temporarily absent functionality ??? */
		if (x_server != XSERVER_XSUN) {
			PrintError(
		"A GUI interface is available only with the Xsun server");
			return (1);
		}
#endif
		return (InvokeGUI());
	}

	/*
	 * Identify and invoke the device configuration program
	 *
	 *    The default -dev option, if any, should be prepended
	 *    rather than appended to the argument vector.  If the
	 *    user-supplied argument vector ends badly (e.g. the last
	 *    option's argument is missing), the child config program
	 *    should be able to diagnose and report the problem
	 *    correctly, without tripping over an appended -dev option.
	 */
	if ((device_path != NULL) &&
	    (FindConfigProgram(x_server, device_path, &config_prog_path) == 0)
				) {
		n = 2;			/* Index for config program pathname */
		if (!dev_opt) {
			n = 0;		/* Index for config program pathname */
			cfg_argv[1] = "-dev";
			cfg_argv[2] = device_path;
		}
		cfg_argv[n] = config_prog_path;
		CallConfigProgram(&cfg_argv[n]);
	} else {
		PrintError("Unable to find a default device");
	}

	catclose(catfd);	/* Needn't have passed this to a child */

	return (1);		/* Exit unsuccessfully */

}	/* main() */


/* End of fbconfig.c */
