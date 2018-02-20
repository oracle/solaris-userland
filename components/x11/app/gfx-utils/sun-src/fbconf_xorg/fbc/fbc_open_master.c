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
 * fbc_open_master - Find and open the matching device
 */


#include <sys/types.h>
#include <dirent.h>		/* closedir(), opendir(), readdir() */
#include <errno.h>		/* errno */
#include <fcntl.h>
#include <stdio.h>		/* NULL */
#include <string.h>		/* strcmp(), strcpy() */
#include <unistd.h>		/* close(), ioctl() */
#include <sys/stat.h>		/* fstat(), stat() */
#include <sys/visual_io.h>	/* VISUAL environment device identifier */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_open_master.h"	/* Find and open the matching device */


/*
 * fbc_open_master()
 *
 *    Given a VISUAL environment identifier (e.g. "SUNWkfb") and the
 *    file number of an open FB device, search the /dev/fbs directory
 *    for a second, matching FB device and open it.  Return the file
 *    number of this second device, else -1.
 *
 *    Note that the caller knows the slave device and wants to find the
 *    master, but this function doesn't care which device will be which.
 */

int
fbc_open_master(
	const char *const ident_name,	/* VISUAL identifier name */
	int		slave_fd)	/* Slave device fd */
{
	DIR		*dir;		/* Directory stream */
	struct dirent	*entry;		/* Directory entry */
	char		*filename;	/* Ptr to filename within pathname[] */
	char		pathname[FBC_MAX_DEV_PATH_LEN]; /* Master dev path */
	int		master_fd;	/* File number of master device */
	dev_t		slave_rdev_id;	/* Slave device type and number */
	dev_t		slave_rdev_type; /* Slave device type */
	struct stat	stat_buf;	/* File status information */
	int		temp_fd;	/* File number of potential master */
	struct vis_identifier vis_ident; /* VISUAL env device identifier */

	/*
	 * Get the st_rdev device info
	 */
	if (fstat(slave_fd, &stat_buf) < 0) {
		return (-1);
	}
	slave_rdev_id   = stat_buf.st_rdev & ~FBC_CLONE_MASK;
	slave_rdev_type = slave_rdev_id    & ~FBC_MINOR_MASK;

	/*
	 * Initialize to build fully qualified /dev/fbc/... pathnames
	 */
	strcpy(pathname, FBC_DEVICE_DIR "/");
	filename = pathname + strlen(pathname);

	/*
	 * Open the /dev/fbs frame buffer device directory
	 */
	dir = opendir(FBC_DEVICE_DIR);
	if (dir == NULL) {
		return (-1);
	}

	/*
	 * Examine each /dev/fbs entry to see if it's the same type of device
	 */
	master_fd = -1;
	while ((entry = readdir(dir))) {
		/*
		 * Ignore dot files
		 */
		if (entry->d_name[0] == '.') {
			continue;
		}

		/*
		 * Build the pathname unless it would overflow the buffer
		 */
		if (strlen(entry->d_name) >=
				&pathname[FBC_MAX_DEV_PATH_LEN] - filename) {
			continue;
		}
		strcpy(filename, entry->d_name);

		/*
		 * Get the device file status, ignoring it if there's an error
		 */
		if (stat(pathname, &stat_buf) < 0) {
			continue;
		}

		/*
		 * Ignore this device file if:
		 *    * it's not a character special file
		 *    * it's not the same type of FB as the slave device
		 *    * it's the self-same slave device
		 */
		if (((stat_buf.st_mode & S_IFCHR) == 0) ||
		    ((stat_buf.st_rdev & ~FBC_MINOR_MASK) != slave_rdev_type) ||
		    ((stat_buf.st_rdev & ~FBC_CLONE_MASK) == slave_rdev_id)) {
			continue;
		}

		/*
		 * Open the device file, ignoring it if it won't open
		 */
		temp_fd = open(pathname, O_RDWR);
		if (temp_fd < 0) {
			continue;
		}

		/*
		 * Ignore this device if:
		 *    * the device identifier name can't be obtained
		 *    * the identifier name doesn't match the slave's ID name
		 */
		if ((ioctl(temp_fd, VIS_GETIDENTIFIER, &vis_ident) < 0) ||
		    (strcmp(vis_ident.name, ident_name) != 0)) {
			close(temp_fd);
			continue;
		}

		/*
		 * Give up if more than one potential master is found
		 */
		if (master_fd >= 0) {
			close(temp_fd);
			close(master_fd);
			master_fd = -1;
			break;
		}

		/*
		 * Assume this will be the master device, but look for others
		 */
		master_fd = temp_fd;
	}
	closedir(dir);

	/*
	 * Return the open file descriptor number, else -1
	 */
	return (master_fd);

}	/* fbc_open_master() */


/* End of fbc_open_master.c */
