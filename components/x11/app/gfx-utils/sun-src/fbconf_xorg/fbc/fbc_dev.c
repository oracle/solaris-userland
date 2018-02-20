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
 * fbc_dev - Identify the graphics device (-dev opt)
 */


#include <sys/param.h>		/* MAXPATHLEN */
#include <ctype.h>		/* isdigit() */
#include <errno.h>		/* errno */
#include <stdlib.h>		/* strchr(), strtol() */
#include <string.h>		/* memset(), strcasecmp(), strerror(), ... */
#include <unistd.h>		/* readlink() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_open_device.h"	/* Open the frame buffer device */


/*
 * fbc_get_device_arg()
 *
 *    Scan the fbconf_xorg(1M) program command line options in order to
 *    find the (first) frame buffer device name (-dev) argument, if any.
 *    Return a pointer to the -dev argument string, else a NULL pointer.
 *
 *    Considerations:
 *        * The -dev option must be fully spelled out, not abbreviated.
 *          Until the device type is known, we don't know what other
 *          command line options might be supported.  At least one of
 *          -defaults, -defdepth, -deflinear, -defoverlay, or
 *          -deftransparent is likely to be supported, in which case
 *          the full spelling of -dev would be needed anyway.
 *        * No command line option is likely to be given a "-dev"
 *          argument.
 */

int
fbc_get_device_arg(
	const int	argc,		/* Program argument count */
	char	* const	argv[],		/* Program argument vector */
	const char	**device_arg)	/* Returned effective arg to -dev */

{
	int		arg;		/* Program cmd line arg index */

	/*
	 * Find the (first, if any) -dev option and return its argument
	 *
	 *    The last argv[] string is ignored.  The -dev option
	 *    requires an argument, so "-dev" can't legitimately be the
	 *    last argv[] string.  The fbc_getargs() function should
	 *    handle the "Option requires a value" error.
	 */
	*device_arg = NULL;
	for (arg = 1; arg < (argc - 1); arg += 1) {
		if (strcasecmp(argv[arg], "-dev") == 0) {
			*device_arg = argv[arg+1];
			break;
		}
	}

	return (FBC_SUCCESS);

}	/* fbc_get_device_arg() */


/*
 * fbc_resolve_device_links()
 *
 *
 *    The device_path_buf buffer is assumed to be unused.
 */

static
int
fbc_resolve_device_links(
	const char	*default_path,	/* Default device symlink path */
	char		*device_path_buf, /* Ptr to device path buffer */
	size_t		device_path_buflen, /* Device path buffer length */
	fbc_dev_t	*device)	/* Returned device names, etc. */
{
	int		i;		/* Symlink loop counter */
	ssize_t		len;		/* Pathname length (signed) */
	char		*ptr;		/* Ptr to pathname component */
	char		respath_buf[MAXPATHLEN]; /* Symlink path buffer */
	char		symlink_buf[MAXPATHLEN]; /* Resolution path buffer */

	/*
	 * Resolve the symlink to a "/devices/...:<devname>" pathname
	 *
	 *    A resolved symlink string could resemble one of these (or
	 *    some else unhelpful):
	 *        fbs/kfb0
	 *        /dev/fbs/kfb0
	 *        /devices/pci@1f,700000/SUNW,XVR-2500@0:kfb0
	 *    Examples like the first one are only acceptable as
	 *    intermediate resolutions.  Examples like the second are
	 *    what we want ultimately, but might not encounter.
	 *    Examples like the third should be the resolution of the
	 *    final symlink (e.g. second exmple).
	 */
	len = strlen(default_path);
	if (len >= sizeof (symlink_buf)) {
		return (FBC_ERR_READLINK);
	}
	memcpy(symlink_buf, default_path, len+1);

	for (i = 16; ; i -= 1) {
		if (i <= 0) {
			return (FBC_ERR_READLINK);	/* ELOOP */
		}

		/*
		 * Resolve this symbolic link (if that's what it is)
		 */
		memset(respath_buf, '\0', sizeof (respath_buf));
		len = readlink(symlink_buf,
				respath_buf, sizeof (respath_buf) - 1);
		if (len < 0) {
			if (errno == EINVAL) {
				break;	/* Not a symbolic link */
			}
			fbc_errormsg("%s, %s\n",
					strerror(errno), symlink_buf);
			return (FBC_ERR_READLINK);
		}

		/*
		 * Make sure the end result is a full pathname
		 */
		ptr = &symlink_buf[0];	/* To overwrite the entire link path */
		if (respath_buf[0] != '/') {
			ptr = strrchr(symlink_buf, '/');
			if (ptr == NULL) {
				ptr = &symlink_buf[0];
			} else {
				ptr += 1;
			}
		}
		if ((ptr - &symlink_buf[0] + len) >= sizeof (respath_buf)) {
			return (FBC_ERR_READLINK);
		}
		memcpy(ptr, respath_buf, len+1);
	}

	/*
	 * Convert "/devices/...:<devname>" to <devname>
	 *
	 *    Merely assume that the final resolution pathname specifies
	 *    the correct "/devices/..." directory, realizing that it
	 *    actually might look something like this:
	 *        /dev/fb/../../devices/pci@1f,700000/SUNW,XVR-2500@0:kfb0
	 *
	 *    The simple filename component must match "*:<devname>".
	 */
	ptr = strrchr(symlink_buf, ':');
	if (ptr == NULL) {
		return (FBC_ERR_READLINK);
	}
	ptr += 1;

	/*
	 * Construct the device pathname and point to the simple filename
	 */
	len = strlen(FBC_DEVICE_DIR "/");
	if ((len + strlen(ptr)) >= device_path_buflen) {
		return (FBC_ERR_READLINK);
	}
	memcpy(device_path_buf, FBC_DEVICE_DIR "/", len);
	device->path = device_path_buf;
	strcpy(device_path_buf + len, ptr);
	device->name = device_path_buf + len;

	return (FBC_SUCCESS);

}	/* fbc_resolve_device_links() */


/*
 * fbc_parse_device_filename()
 *
 *    Decompose the device simple filename into:
 *      * Device type/driver name
 *      * Device "unit" number, if specified, else -1 (arbitrary)
 *      * Device stream/screen character: '\0', 'a', 'b', ...
 *    Return a non-zero error code, FBC_ERR_NAME_LEN, if the
 *    caller's buffer isn't long enough.
 */

static
int
fbc_parse_device_filename(
	char		*device_type_buf, /* Ptr to device type buffer */
	size_t		device_type_buflen, /* Device type buffer length */
	fbc_dev_t	*device)	/* Returned device names, etc. */
{
	const char *const stream_suffix_chars = FBC_STREAM_SUFFIX_CHARS;
	const char	*cp;		/* Ptr into device name string */
	int		len;		/* Length of device type substring */
	const char	*suffix_cp;	/* Ptr to suffix char, else NULL */

	/*
	 * Parse the video stream suffix, if any
	 *
	 *    If present, the video stream suffix is generally a lower
	 *    case letter, 'a' or 'b', following the unit number, as the
	 *    last character of the simple device name (e.g. 'a' in
	 *    "efb0a").  No video stream suffix will be found if the
	 *    unit number is not present.  If no video stream suffix is
	 *    found then store a Nul.
	 *
	 *    The set of valid video stream suffix characters is
	 *    contained in the FBC_STREAM_SUFFIX_CHARS string.  If the
	 *    device name has a video stream suffix that isn't
	 *    appropriate for the device (e.g. 'b' in "kfb0b"), the
	 *    subsequent fbc_open_device() call can be expected to fail.
	 *
	 *    The actual device->max_streams value should be provided
	 *    later via fbc_get_properties().  We'll use a "safe" value
	 *    until fbc_get_properties() and fbc_revise_device_info()
	 *    can be called.
	 */
	device->stream_char = '\0';	/* Represents all video streams */
	device->stream_lo   = 0;	/* First video stream */
	device->stream_hi   = 0;	/* Bounded by device->max_streams */
	device->max_streams = 1;	/* Provided via fbc_get_properties() */

	len = strlen(device->name);
	if ((len >= 2) && (isdigit(*(device->name + len - 2)))) {
		cp = device->name + len - 1;
		suffix_cp =  strchr(stream_suffix_chars, *cp);
		if (suffix_cp != NULL) {
			device->stream_char = *cp;
			device->stream_lo   = suffix_cp - stream_suffix_chars;
			device->stream_hi   = device->stream_lo;
			len -= 1;
		}
	}

	/*
	 * Parse the frame buffer "unit" number, if any
	 */
	for (cp = device->name + len; cp > device->name; cp -= 1) {
		if (!isdigit(*(cp-1))) {
			break;
		}
	}
	device->number = -1;
	if (*cp != '\0') {
		device->number = (int)strtol(cp, NULL, 10);
	}

	/*
	 * Copy the device type/driver substring into the caller's buffer
	 */
	device->type = device_type_buf;
	len = cp - device->name;
	if (len >= device_type_buflen) {
		*device_type_buf = '\0'; /* Empty string */
		return (FBC_ERR_NAME_LEN); /* Device type name is too long */
	}
	memcpy(device_type_buf, device->name, len);
	*(device_type_buf + len) = '\0';

	/*
	 * Return a pointer to the device type/driver string
	 */
	return (FBC_SUCCESS);

}	/* fbc_parse_device_filename() */


typedef struct {
	char		*pathname;	/* Full pathname    (e.g. "/dev/fb") */
	char		*filename;	/* Simple filename  (e.g. "fb")      */
} fbc_path_file_t;

static const fbc_path_file_t fbc_default_device[] = {
	{ FBC_DEVICE_SYMLINK_PATH,	FBC_DEVICE_SYMLINK_NAME  	},
	{ FBC_DEVICE_SYMLINK_PATH_0,	FBC_DEVICE_SYMLINK_NAME_0	},
	{ NULL,				NULL				}
};


/*
 * fbc_get_default_device()
 *
 *    Determine the most likely default frame buffer device (e.g.
 *    "/dev/fb" or "/dev/fb0") and return pointers to:
 *      * Full pathname of the device   (e.g. "/dev/fbs/efb0a")
 *      * Simple device filename        (e.g. "efb0a")
 *      * Device type/driver name       (e.g. "efb")
 *      * Device "unit" number, if specified, else -1 (arbitrary)
 *      * Device stream/screen character: '\0', 'a', 'b', ...
 */

int
fbc_get_default_device(
	char		*device_path_buf, /* Ptr to device path buffer */
	size_t		device_path_buflen, /* Device path buffer length */
	char		*device_type_buf, /* Ptr to device type buffer */
	size_t		device_type_buflen, /* Device type buffer length */
	fbc_dev_t	*device)	/* Returned device name components */
{
	const fbc_path_file_t *default_dev; /* Ptr into fbc_default_device[] */
	int		error_code;	/* Error code (see errno.h) */

	/*
	 * See whether any default device will open and identify itself
	 */
	for (default_dev = &fbc_default_device[0]; ; default_dev += 1) {
		if (default_dev->pathname == NULL) {
			return (FBC_ERR_OPEN); /* No default device found */
		}
		device->path = default_dev->pathname;
		if (fbc_open_device(device) == FBC_SUCCESS) {
			break;
		}
	}

	/*
	 * Resolve symbolic links and construct the device file pathname
	 */
	error_code = fbc_resolve_device_links(default_dev->pathname,
						device_path_buf,
						device_path_buflen,
						device);
	if (error_code != FBC_SUCCESS) {
		return (error_code);
	}

	/*
	 * Decompose the simple filename of the frame buffer device
	 */
	return (fbc_parse_device_filename(
			device_type_buf, device_type_buflen, device));

}	/* fbc_get_default_device() */


/*
 * fbc_get_device_name()
 *
 *    Given a -dev argument string, a device pathname buffer, and a
 *    device type/driver name buffer, return pointers to:
 *      * Full pathname of the device   (e.g. "/dev/fbs/efb0a")
 *      * Simple device filename        (e.g. "efb0a")
 *      * Device type/driver name       (e.g. "efb")
 *      * Device "unit" number, if specified, else -1 (arbitrary)
 *      * Device stream/screen character: '\0', 'a', 'b', ...
 *
 *    A caller-supplied buffer might be needed in order to construct the
 *    full pathname string.  Return NULL if the caller's buffer is
 *    needed but isn't long enough.
 *
 *    The device name string will be extracted into a second, caller-
 *    supplied buffer.  Return an error code if the caller's buffer
 *    isn't long enough.
 */

int
fbc_get_device_name(
	const char	*device_arg,	/* Device argument (-dev opt) */
	char		*device_path_buf, /* Ptr to device path buffer */
	size_t		device_path_buflen, /* Device path buffer length */
	char		*device_type_buf, /* Ptr to device type buffer */
	size_t		device_type_buflen, /* Device type buffer length */
	fbc_dev_t	*device)	/* Returned device name components */
{
	const fbc_path_file_t *default_dev; /* Ptr into fbc_default_device[] */
	const char	*device_dir;	/* Ptr to "/dev/fbs/" or "/dev/" */
	size_t		device_dir_len;	/* Length of "/dev/fbs/", etc. */
	int		error_code;	/* Error code (zero => success) */
	const char	*sep_ptr;	/* Ptr to pathname seperator char */

	/*
	 * Assume it's the fully qualified path of a real device
	 */
	device->path = device_arg;

	/*
	 * Resolve any default device name
	 */
	for (default_dev = &fbc_default_device[0];
	    default_dev->pathname != NULL;
	    default_dev += 1) {
		if ((strcmp(device_arg, default_dev->pathname) == 0) ||
		    (strcmp(device_arg, default_dev->filename) == 0)) {
			error_code = fbc_resolve_device_links(
						default_dev->pathname,
						device_path_buf,
						device_path_buflen,
						device);
			if (error_code != FBC_SUCCESS) {
				return (error_code);
			}
			device_arg = device->path;
			break;
		}
	}

	/*
	 * Determine the device pathname, simple name, type/driver, etc.
	 */
	sep_ptr = strrchr(device_arg, '/');
	if (sep_ptr == NULL) {
		/*
		 * Decompose the simple device name, yeilding its type, etc.
		 */
		device->name = device_arg;
		error_code   = fbc_parse_device_filename(device_type_buf,
						 	device_type_buflen,
							device);

		/*
		 * Determine the device directory path for this device type
		 *
		 *    We'll handle the "fb" => "/dev/fb" case, but this
		 *    should have been done in fbc_get_device_arg().
		 */
		device_dir = FBC_DEVICE_DIR "/";
		if (strcmp(device->name, FBC_DEVICE_SYMLINK_NAME) == 0) {
			device_dir = FBC_DEVICE_SYMLINK_DIR "/";
		}

		/*
		 * Construct a full pathname (iff it fits in the buffer)
		 */
		device_dir_len = strlen(device_dir);
		if ((device_dir_len + strlen(device_arg))
						>= device_path_buflen) {
			return (FBC_ERR_PATH_LEN); /* Path is too long */
		}
		memcpy(device_path_buf, device_dir, device_dir_len);
		device->path = device_path_buf;
		device->name = device_path_buf + device_dir_len;
		strcpy(device_path_buf + device_dir_len, device_arg);
	} else {
		/*
		 * Point to the simple device name within the device pathname
		 */
		device->name = sep_ptr + 1;

		/*
		 * Decompose the frame buffer's simple device name
		 */
		error_code = fbc_parse_device_filename(device_type_buf,
							device_type_buflen,
							device);
	}

	/*
	 * Return successfully or with a buffer overflow error
	 */
	return (error_code);

}	/* fbc_get_device_name() */


/*
 * fbc_revise_device_info()
 *
 *    Finish the video streams initialization that
 *    fbc_parse_device_filename() didn't have enough information to do.
 *
 *    Before this function can be called, the fbc_get_properties() must
 *    be called in order to fill in the device->max_streams value.
 */

void
fbc_revise_device_info(
	fbc_dev_t	*device)	/* Revised frame buffer device info */
{

	/*
	 * An absent video stream suffix character signifies all streams
	 *
	 *    A video stream suffix character that is out of range (e.g.
	 *    'b' in "kfb0b") can be logically ignored here, since the
	 *    subsequent fbc_open_device() call ought to fail.
	 */
	if ((device->stream_char == '\0') ||
	    (device->stream_hi >= device->max_streams)) {
		device->stream_char   = '\0';
		device->stream_lo = 0;
		device->stream_hi = device->max_streams - 1;
	}

}	/* fbc_revise_device_info() */


/* End of fbc_dev.c */
