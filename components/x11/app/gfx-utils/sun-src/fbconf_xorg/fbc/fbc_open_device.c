/*
 * Copyright (c) 2004, 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_open_device - Open the frame buffer device
 */


#include <sys/types.h>
#include <errno.h>		/* errno */
#include <fcntl.h>
#include <string.h>		/* strerror() */
#include <unistd.h>		/* ioctl() */
#include <sys/stat.h>		/* stat() */
#include <sys/visual_io.h>	/* VISUAL environment device identifier */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */

#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_open_device.h"	/* Open the frame buffer device */


/*
 * fbc_open_device()
 *
 *    Verify that the frame buffer device pathname specifies an
 *    existing, character special device.  Open the existing graphics
 *    device and get the VISUAL environment identifier name (e.g.
 *    "SUNWkfb").  Return the identifier name and the file descriptor
 *    number upon success.  Return an FBC_ERR_XXXXX code otherwise.
 */

int
fbc_open_device(
	fbc_dev_t	*device)	/* Frame buffer device info (-dev) */
{
	dev_t		device_rdev_id;	/* Device type and number */
	int		fd;		/* Graphics device file descriptor # */
	struct stat	stat_buf;	/* stat() buffer for device */

	device->fd = -1;
	memset(device->vis_ident.name, 0, sizeof (device->vis_ident.name));
	device->is_default = FALSE;

	/*
	 * Make sure this is a character special file
	 */
	if (stat(device->path, &stat_buf) != 0) {
	        fbc_errormsg("Unable to get status, %s, %s\n",
				strerror(errno), device->path);
		return (FBC_ERR_STAT);
	}
	if ((stat_buf.st_mode & S_IFCHR) == 0) {
		fbc_errormsg("Not a character special file, %s\n",
				device->path);
		return (FBC_ERR_STAT);
	}

	/*
	 * Open the existing device file
	 */
	fd = open(device->path, O_RDWR);
	if (fd == -1) {
		fbc_errormsg("Unable to open device, %s, %s\n",
				strerror(errno), device->path);
		return (FBC_ERR_OPEN);
	}

	/*
	 * Get the VISUAL environment device identifier name
	 */
	if (ioctl(fd, VIS_GETIDENTIFIER, &device->vis_ident.name[0]) < 0) {
		fbc_errormsg("Unable to get device identifier, %s, %s\n",
					strerror(errno), device->path);
		close(fd);
		return (FBC_ERR_IOCTL);
	}

	device->fd = fd;

	/*
???"the" * Find out whether this is the default device
	 *
	 *    This would determine whether or not the Screen section for
	 *    this device is potentially the active Screen section, and,
	 *    if the section is missing, where in the configuration it
	 *    should be inserted.
	 */
	device_rdev_id     = stat_buf.st_rdev & ~FBC_CLONE_MASK;
	device->is_default =
		((stat(FBC_DEVICE_SYMLINK_PATH, &stat_buf) == 0) &&
		((stat_buf.st_mode & S_IFCHR) != 0) &&
		((stat_buf.st_rdev & ~FBC_CLONE_MASK) == device_rdev_id));

	return (FBC_SUCCESS);

}	/* fbc_open_device() */


/* End of fbc_open_device.c */
