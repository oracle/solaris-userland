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
 * fbc_get_properties - Get fbconf_xorg(1M) program properties
 */


#include <sys/param.h>		/* MAXPATHLEN */
#include <dlfcn.h>		/* Dynamic linking: dlopen(), etc. */
#include <errno.h>		/* errno */
#include <link.h>
#include <stdio.h>		/* snprintf() */
#include <stdlib.h>		/* exit() */
#include <string.h>		/* strerror() */
#include <sys/stat.h>		/* stat() */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_get_properties.h"	/* Get fbconf_xorg(1M) program properties */


#define	FBC_FUNC_NAME_FMT "%s_get_properties"


/*
 * fbc_get_properties()
 *
 *    Return the fbconf_xorg(1M) properties for the specified frame
 *    buffer device type.
 */

int
fbc_get_properties(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar)		/* Returned fbconf_xorg properties */
{
	char		*error_msg;	/* Error message */
	fbc_api_ver_t	*fb_api_version; /* API version of shared library */
	int		(*fb_get_properties)(
				fbc_dev_t	*device,
				fbc_varient_t	*fbvar);
					/* Device-specific properties functn */
	void		*lib_handle;	/* Handle for shared library */
	int		len;		/* Value returned by snprintf() */
	char		name_buf[MAXPATHLEN]; /* Pathname & symbol name buf */
	struct stat	stat_buf;	/* stat() buffer for device */

	/*
	 * Construct the pathname of the device-specific shared library
	 */
	len = snprintf(name_buf, sizeof (name_buf),
				FBC_LIB_PATH_FMT, device->vis_ident.name);
	if ((len < 0) || (len >= sizeof (name_buf))) {
		fbc_errormsg("Unable to construct device library pathname, "
					FBC_LIB_NAME_FMT "\n",
				device->vis_ident.name);
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Open the shared library for this frame buffer device type
	 */
	lib_handle = dlopen(name_buf, RTLD_LAZY);
	if (lib_handle == NULL) {
		/*
		 * Decide whether to inflict a great ugly informative message
		 */
		if (stat(name_buf, &stat_buf) == 0) {
			fbc_errormsg("%s\n", dlerror());  /* Ugly message */
		} else {
			fbc_errormsg("%s, %s\n", strerror(errno), name_buf);
		}
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Make sure fbconf_xorg(1M) and this libSUNW*_conf.so use the same API
	 */
	len = snprintf(name_buf, sizeof (name_buf),
				FBC_API_VERSION_FMT, device->vis_ident.name);
	if ((len < 0) || (len >= sizeof (name_buf))) {
		fbc_errormsg("Unable to construct API version symbol name, "
				     FBC_API_VERSION_FMT "\n",
				device->vis_ident.name);
		exit(FBC_EXIT_FAILURE);
	}

	fb_api_version = (fbc_api_ver_t *)dlsym(lib_handle, name_buf);
	error_msg = dlerror();
	if (error_msg != NULL) {
		fbc_errormsg("%s\n", error_msg);
		exit(FBC_EXIT_FAILURE);
	}
	if (*fb_api_version != FBC_API_VERSION) {
		fbc_errormsg("API version mismatch (expected %d, found %d), "
					FBC_LIB_NAME_FMT " \n",
				FBC_API_VERSION,    /* fbconf_xorg(1M) */
				*fb_api_version,    /* libSUNW*_conf.so */
				device->vis_ident.name);
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Construct the name of the device-specific properties function
	 */
	len = snprintf(name_buf, sizeof (name_buf),
				FBC_FUNC_NAME_FMT, device->vis_ident.name);
	if ((len < 0) || (len >= sizeof (name_buf))) {
		fbc_errormsg("Unable to construct function name, "
				     FBC_FUNC_NAME_FMT "\n",
				device->vis_ident.name);
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Get the address of the device-specific properties function
	 */
	fb_get_properties = (int (*)(fbc_dev_t *, fbc_varient_t *))
					dlsym(lib_handle, name_buf);
	error_msg = dlerror();
	if (error_msg != NULL) {
		fbc_errormsg("%s\n", error_msg);
		exit(FBC_EXIT_FAILURE);
	}

	/*
	 * Gather up and return with the device-specific properties
	 */
	return ((*fb_get_properties)(device, fbvar));

}	/* fbc_get_properties() */


/* End of fbc_properties.c */
