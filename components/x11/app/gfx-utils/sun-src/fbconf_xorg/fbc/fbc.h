/*
 * Copyright (c) 2008, 2011, Oracle and/or its affiliates. All rights reserved.
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
 * fbc - Common fbconf_xorg(1M) definitions
 */

#ifndef	_FBC_H
#define	_FBC_H


/*
 * Boolean data type  (mapped onto int)
 */
#ifndef	FALSE
#define	FALSE	(0 != 0)	/* Boolean False */
#endif
#ifndef	TRUE
#define	TRUE	(!FALSE)	/* Boolean True */
#endif

/*
 * Current API version used between fbconf_xorg(1M) and libSUNW*_conf.so
 */
typedef	unsigned long fbc_api_ver_t;	/* fbconf_xorg(1M) API version type */

#define	FBC_API_VERSION	((fbc_api_ver_t)(1)) /* fbconf_xorg(1M) API version */

#define	FBC_API_VERSION_FMT "%s_api_version" /* API version symbol format */

/*
 * Home directory for fbconfig software
 */
#define	FBC_LIB_DIR	"/usr/lib/fbconfig"	/* fbconfig software dir */
#define	FBC_LIB_NAME_FMT "lib%s_conf.so"
#define	FBC_LIB_PATH_FMT FBC_LIB_DIR "/" FBC_LIB_NAME_FMT

/*
 * Frame buffer device file names  (/dev/fb, /dev/fbs/[a-z]fb[0-9][ab]?)
 */
#define	FBC_DEVICE_SYMLINK_DIR	"/dev"		/* Device symlink directory */
#define	FBC_DEVICE_SYMLINK_NAME	"fb"		/* Device symlink name */
#define	FBC_DEVICE_SYMLINK_NAME_0 \
			FBC_DEVICE_SYMLINK_NAME "0"
#define	FBC_DEVICE_SYMLINK_PATH	\
			FBC_DEVICE_SYMLINK_DIR "/" FBC_DEVICE_SYMLINK_NAME
#define	FBC_DEVICE_SYMLINK_PATH_0 \
			FBC_DEVICE_SYMLINK_DIR "/" FBC_DEVICE_SYMLINK_NAME_0

#define	FBC_DEVICE_DIR		"/dev/fbs"	/* Graphics device directory */

#define	FBC_MAX_DEV_PATH_LEN	128	/* Max device pathname length */

#define	FBC_STREAM_SUFFIX_CHARS	"ab"	/* Device name stream suffix chars */
#define	FBC_MAX_STREAMS		2	/* Max streams supported */

/*
 * Masks for stat_buf.st_rdev member  (fbc_open_device(), fbc_open_master())
 */
#define	FBC_CLONE_MASK	0xFF00		/* Inverted to discard clone bits */
#define	FBC_MINOR_MASK	0xFFFF		/* Inverted to get major/type bits */

/*
 * Configuration file location  (-file machine|system|<pathname>)
 */
#define	FBC_FILE_KEYWD_MACHINE	"machine"
#define	FBC_FILE_PATH_MACHINE	"/etc/X11/xorg.conf"

#define	FBC_FILE_KEYWD_SYSTEM	"system"
#define	FBC_FILE_PATH_SYSTEM	"/usr/lib/X11/xorg.conf"

#define	FBC_DEFAULT_CONFIG_LOC	FBC_FILE_KEYWD_MACHINE	/* "machine" */

/*
 * New configuration file modes (644) and ownership (root.root)
 */
#define	FBC_CONFIG_FILE_MODE	(S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH);
#define	FBC_CONFIG_FILE_UID	(0)	/* root */
#define	FBC_CONFIG_FILE_GID	(0)	/* root */

/*
 * Default gamma (-g) value
 */
#define	FBC_GAMMA_DEFAULT	2.22	/* ??? Officially defined where ??? */
#define	FBC_GAMMA_DEFAULT_STR "2.22"

#define	GAMMA_TABLE_EXT	".gamma"	/* Packed gamma table file extension */


/*
 * Video mode properties (from -res <video_mode>, xorg.conf, and/or EDID)
 */
#define	FBC_MAX_MODE_NAME_LEN	256	/* Max mode name length (arbitrary) */

typedef struct {
	const char	*name;		/* Ptr to video mode name string */
	int		width;		/* Horizontal addressable pixels */
	int		height;		/* Vertical addressable lines */
	int		frequency;	/* Vertical frequency */
} fbc_video_mode_t;


/*
 * Seconds of new video mode trial for the "-res <video-mode> try" option
 */
#define	FBC_TRIAL_TIME	10


/*
 * Line indentation used with -prconf and -propt
 */
#define	FBC_PR_INDENT	"    "		/* Four Spaces (columns) */
#define	FBC_PR_INDENT_LEN (sizeof(FBC_PR_INDENT) - 1) /* Columns (w/o Nul) */


#endif	/* _FBC_H */


/* End of fbc.h */
