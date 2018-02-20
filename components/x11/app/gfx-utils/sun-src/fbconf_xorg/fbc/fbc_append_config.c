/*
 * Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_append_config - Append configuration file supplement
 */


#include <stdio.h>		/* NULL */
#include <stdlib.h>		/* exit() */

#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"		/* Private definitions, etc. */
#include "configProcs.h"	/* Private function, etc. declarations */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_append_config.h"	/* Append configuration file supplement */
#include "fbc_error.h"		/* Error reporting */


/*
 * fbc_append_config()
 *
 *    Open a configuration supplement file and append it to the Internal
 *    and External representation of the current configuration.
 *
 *    A supplement name and corresponding supplement pathname might be:
 *        "SunModes"    /usr/lib/fbconfig/SunModes_xorg.conf
 */

int
fbc_append_config(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	const char	*supplement_name) /* Config supplement name prefix */
{
	const char	*supplement_path; /* Config supplement pathname */

	/*
	 * Open the config supplement file, /usr/lib/fbconfig/<name>_xorg.conf
	 */
	supplement_path = xf86openConfigFileIn("%P/%R_xorg.conf",
						supplement_name,
						FBC_LIB_DIR);
	if (supplement_path == NULL) {
		return (FBC_ERR_OPEN);
	}

#if (0)	/* This may or may not be necessary */
	/*
	 * Set effective UID to real UID while reading config file
	 */
	if (euid != uid) {
		if (seteuid(uid) != 0) {
			fbc_errormsg(
				"Unable to set effective user ID\n");
			exit(FBC_EXIT_FAILURE);
		}
	}

#endif	/* This may or may not be necessary */
	/*
	 * Read the configuration supplement file
	 */
	if (xf86readNextConfigFile(configIR) == NULL) {
		fbc_errormsg("Error in configuration file, %s\n",
				supplement_path);
		exit(FBC_EXIT_FAILURE);	/* Just lost all config IR data */
	}
#if (0)	/* This may or may not be necessary */
	if (euid != uid) {
		(void) seteuid(euid);
	}
#endif	/* This may or may not be necessary */

	return (FBC_SUCCESS);

}	/* fbc_append_config() */


/* End of fbc_append_config.c */
