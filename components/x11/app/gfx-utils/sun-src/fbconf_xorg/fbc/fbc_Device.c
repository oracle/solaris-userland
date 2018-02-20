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
 * fbc_Device - Edit Device sections
 */


#include <assert.h>		/* assert() */
#include <stdio.h>		/* NULL */
#include <stdlib.h>		/* free() */
#include <string.h>		/* strcmp(), strlen() */

#include "xf86Parser.h"		/* Public function, etc. declatations */
#include "configProcs.h"	/* Private function, etc. declarations */

#include "fbc_xorg.h"		/* Edit config file data representations */
#include "fbc_Device.h"		/* Edit Device sections */
#include "fbc_Option.h"		/* Edit Option lists */
#include "fbc_Screen.h"		/* Edit Screen sections */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_properties.h"	/* fbconf_xorg(1M) program properties */
#include "fbc_query_device.h"	/* Query a frame buffer device */
#include "fbc_write_config.h"	/* Write an updated config file */


/*
 * fbc_find_active_Device_section()
 *
 *    Find the first Device section that refers to the specified device.
 *
 *    This Device section must have a matching driver name and screen
 *    number.  It should have a matching device pathname, unless the
 *    pathname is not contained in any Device section.  In that case,
 *    the Device section must be the first qualifying one that has no
 *    device pathname ("Device" Option entry).
 *
 *        Driver      "<driver>"
 *        Screen      <number>
 *        Option      "Device" "<device_pathname>"
 *
 *    According to the XF86Config(5) (and xorg.conf(4)) man page, "A
 *    Device section is considered active if it is referenced by an
 *    active Screen section."  This reflects a top-down analysis of
 *    "activeness."  Because fbconf_xorg(1M) is given a device name as a
 *    starting point for the analysis, we start with the matching Device
 *    section and go bottom-up.
 *
 *    We can't know whether a given Device section will become active
 *    at execution time.  Even if we could guess which ServerLayout
 *    section and Screen section are likely to be active, the -screen
 *    command line option could still be used to override our best
 *    guess.
 *
 *    (Compare this function with xf86findDevice() in Device.c.)
 */

XF86ConfDevicePtr
fbc_find_active_Device_section(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	XF86ConfDevicePtr conf_device_lst, /* Head of Device section list */
	int		stream_num)	/* Device stream/screen number */
{
	XF86ConfDevicePtr blank_dev_sectn_ptr; /* Matching sect w/o "Device" */
	XF86ConfDevicePtr dev_sectn_ptr; /* Ptr to current Device section */
	XF86OptionPtr	option_ptr;	/* Ptr to current Option entry */

	/*
	 * Search each Device section for the specified device
	 *
	 *    Ideally we'll find a Device section containing the
	 *    matching device pathname in a "Device" Option.  Failing
	 *    that, we'll settle for the first Device section having a
	 *    matching driver name and stream/screen number and no
	 *    "Device" option.
	 */
	blank_dev_sectn_ptr = NULL;
	for (dev_sectn_ptr = conf_device_lst;
	    dev_sectn_ptr != NULL;
	    dev_sectn_ptr = dev_sectn_ptr->list.next) {
		/*
		 * Compare the device driver name and stream/screen numbers
		 *
		 *    If the Screen entry has been omitted, the value of
		 *    the dev_screen member defaults to zero.
		 */
		if ((strcmp(device->type, dev_sectn_ptr->dev_driver) != 0) ||
		    (stream_num != dev_sectn_ptr->dev_screen)) {
			continue;
		}

		/*
		 * Search this section's Option list for a "Device" entry
		 */
		for (option_ptr = dev_sectn_ptr->dev_option_lst;
		    ;
		    option_ptr = option_ptr->list.next) {
			/*
			 * Remember first Device section w/o a "Device" entry
			 */
			if (option_ptr == NULL) {
				if (blank_dev_sectn_ptr == NULL) {
					blank_dev_sectn_ptr = dev_sectn_ptr;
				}
				break;	/* Reached end of Option list */
			}

			/*
			 * See if this is a "Device" Option w/ a matching path
			 */
			if (xf86nameCompare(option_ptr->opt_name,
					    FBC_KEYWD_Device) == 0) {
				if (strcmp(option_ptr->opt_val, device->path)
						== 0) {
					/*
					 * This section has the device pathname
					 */
					return (dev_sectn_ptr);
				}
				break;	/* Can have only one "Device" entry */
			}
		}
	}

	/*
	 * A matching Device section with no "Device" Option should have one
	 *
	 *    No active sections have been recorded yet, so it's early
	 *    to be inserting a "Device" Option into the active Device
	 *    section.  We'll just cobble a temporary xf86_active_t
	 *    structure, check sanity, and charge the windmill.
	 *
	 *    By intent, this change to the in-memory configuration will
	 *    be discarded unless the user has provided a command line
	 *    option that causes the configuration file to be updated.
	 */
	if (blank_dev_sectn_ptr != NULL) {
		xf86_active_t	active;	/* Active config sections for device */

		assert(FBC_SECTN_Device == FBC_SECTION_Device);

		active.device_sectn = blank_dev_sectn_ptr;
		fbc_set_Option_value(&active,
					FBC_SECTN_Device,
					FBC_KEYWD_Device,
					device->path);
	}

	/*
	 * Return with a matching Device section, else NULL
	 */
	return (blank_dev_sectn_ptr);

}	/* fbc_find_active_Device_section() */


/*
 * fbc_insert_new_Device_section()
 *
 *    Insert a new, mostly empty Device section in the configuration at
 *    the specified location.
 *
 *        Section "Device"
 *            Identifier  "<device_identifier>"
 *            Driver      "<driver>"
 *            VendorName  "Sun Microsystems, Inc."
 *            BoardName   "Sun <board> Graphics Accelerator"
 *            Option      "Device" "<device_pathname>"
 *        EndSection
 *        <blank line>
 *
 *    Note that the Device section identifier string, dev_identifier,
 *    has been dynamically allocated by our caller.
 */

static
int
fbc_insert_new_Device_section(
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	char		*dev_identifier, /* Device section identifier */
	const char	*dev_driver,	/* Device Driver value */
	const char	*dev_vendor,	/* Device VendorName, else NULL */
	const char	*dev_board,	/* Device BoardName, else NULL */
	const char	*device_path,	/* Device pathname value */
	XF86ConfDevicePtr *device_ptr)	/* Ptr to new Device section IR */
{

	/*
	 * Allocate and initialize the Internal Rep for a new Device section
	 *
	 *    The dev_identifier string has been allocated already.
	 */
	*device_ptr = xf86confcalloc(1, sizeof (XF86ConfDeviceRec));
	if (*device_ptr == NULL) {
		return (FBC_ERR_NOMEM);
	}

	(*device_ptr)->dev_identifier = dev_identifier;
	(*device_ptr)->dev_driver = xf86configStrdup(dev_driver);
	if (dev_vendor != NULL) {
		(*device_ptr)->dev_vendor = xf86configStrdup(dev_vendor);
	}
	if (dev_board != NULL) {
		(*device_ptr)->dev_board = xf86configStrdup(dev_board);
	}
	if ((*device_ptr)->dev_driver == NULL) {
		xf86conffree(device_ptr);
		return (FBC_ERR_NOMEM);
	}

	/*
	 * Insert the External Representation data for the Device section
	 */
	/*  Section "Device"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*device_ptr,
			(xf86_print_fn_t *)&xf86printDeviceSectionSection,
			FBC_INDENT_0);

	/*  Identifier "<device_identifier>"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*device_ptr,
			(xf86_print_fn_t *)&xf86printDeviceSectionIdentifier,
			FBC_INDENT_1);

	/*  Driver "<driver>"  */
	(void) fbc_insert_line_ER(
			next_line_er,
			*device_ptr,
			(xf86_print_fn_t *)&xf86printDeviceSectionDriver,
			FBC_INDENT_1);

	/*  VendorName "Sun Microsystems, Inc."  */
	if ((*device_ptr)->dev_vendor != NULL) {
		(void) fbc_insert_line_ER(
			next_line_er,
			*device_ptr,
			(xf86_print_fn_t *)&xf86printDeviceSectionVendorName,
			FBC_INDENT_1);
	}

	/*  BoardName "Sun <board> Graphics Accelerator"  */
	if ((*device_ptr)->dev_board != NULL) {
		(void) fbc_insert_line_ER(
			next_line_er,
			*device_ptr,
			(xf86_print_fn_t *)&xf86printDeviceSectionBoardName,
			FBC_INDENT_1);
	}

	/*  EndSection  */
	(*device_ptr)->dev_end_line_er =
		fbc_insert_line_ER(
			next_line_er,
			*device_ptr,
			(xf86_print_fn_t *)&xf86printDeviceSectionEndSection,
			FBC_INDENT_0);

	/*  <blank line>  */
	(void) fbc_insert_line_ER(
			next_line_er,
			"\n",
			(xf86_print_fn_t *)&fbc_print_config_text,
			FBC_INDENT_0);

	/*
	 * Add the new Device section to the in-memory configuration
	 */
	configIR->conf_device_lst =
		(XF86ConfDevicePtr) xf86addListItem(
			(glp)configIR->conf_device_lst, (glp)configIR);

	/*
	 * Insert the Device Option entry  (see fbc_set_Option_value())
	 */
	(*device_ptr)->dev_option_lst = xf86addNewOptionOrValue(
					(*device_ptr)->dev_option_lst,
//??? xf86configStrdup() ???
					"Device",
//??? xf86configStrdup() ???
					(char *)device_path,
					0,	/* The "used" arg is unused */
					(*device_ptr)->dev_end_line_er);

	return (FBC_SUCCESS);

}	/* fbc_insert_new_Device_section() */


/*
 * fbc_insert_Device_section()
 *
 *    Insert a new, empty Device section in the configuration at the
 *    specified location.
 */

int
fbc_insert_Device_section(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_varient_t	*fbvar,		/* fbconf_xorg(1M) varient data */
	XF86ConfigPtr	configIR,	/* Config Internal Representation */
	fbc_line_elem_t *next_line_er,	/* Line ER following insertion point */
	XF86ConfDevicePtr *device_ptr)	/* Ptr to new Device section IR */
{
	char		boardname_buf[1024]; /* BoardName entry value buffer */
	char		*dev_boardname;	/* BoardName entry value string */
	char		*dev_identifier; /* Device section identifier */
	const char	*dev_vendor;	/* Device VendorName, else NULL */
	int		error_code;	/* Error code */
	const char	*format;	/* Format for sprintf() */
	char		*full_model_name; /* Model name w/ "SUNW," prefix */
	unsigned int	i;		/* Loop counter / uniqueness factor */

	/*
	 * Allocate memory for the new Device identifier string
	 *
	 *    Allocate space for the intended name and any extra
	 *    underscore and decimal digits needed to make it unique.
	 *    The number of digits will never be greater than the byte
	 *    size of the loop counter, i, multiplied by three decimal
	 *    digits per byte.
	 */
	dev_identifier = xf86confmalloc(strlen(device->name)
					+ 1			/* "_" */
					+ 3 * sizeof (i)	/* Digits */
					+ 1);			/* Nul */
	if (dev_identifier == NULL) {
		return (FBC_ERR_NOMEM);
	}

	/*
	 * Insure that the new Device section identifier will be unique
	 */
	format = "%s";
	for (i = 0; ; ) {
		XF86ConfDevicePtr dev_ptr; /* Ptr to existing Device section */

		/*
		 * Try the name alone and then the name with a numeric suffix
		 */
		sprintf(dev_identifier, format, device->name, i);
		format = "%s_%u";

		/*
		 * Search for this name among the existing Device sections
		 */
		for (dev_ptr = configIR->conf_device_lst;
		     dev_ptr != NULL;
		     dev_ptr = dev_ptr->list.next) {
			if (xf86nameCompare(dev_identifier,
					    dev_ptr->dev_identifier) == 0) {
				break;	/* Not unique */
			}
		}

		/*
		 * Stop when the name is unique (or if the loop counter wraps)
		 */
		i += 1;
		if ((dev_ptr == NULL) || (i == 0)) {
			break;		/* The name is unique enough */
		}
	}

	/*
	 * Generate the Device VendorName (and BoardName fmt), else NULL
	 *
	 *    If the full model name begins with a "SUNW," prefix (e.g.,
	 *    "SUNW,XVR-2500") such that the simple board name occurs
	 *    later in the string, we'll conclude that Sun Microsystems
	 *    is indeed the vendor.
	 */
	full_model_name = fbc_get_fb_model_name(device->fd, &dev_boardname);

	dev_vendor = NULL;
	format     = "%s Graphics Accelerator";

	if (dev_boardname > full_model_name) {
		dev_vendor = "Sun Microsystems, Inc.";
		format     = "Sun %s Graphics Accelerator";
	}

	/*
	 * Generate the BoardName entry value string (else a NULL pointer)
	 */
	if (dev_boardname != NULL) {
		snprintf(boardname_buf, sizeof (boardname_buf),
			format, dev_boardname);
		dev_boardname = &boardname_buf[0];
	}

	/*
	 * Insert a new Device section into the in-memory configuration
	 */
	error_code = fbc_insert_new_Device_section(configIR,
						    next_line_er,
						    dev_identifier,
						    device->type, /* Driver */
						    dev_vendor,
						    dev_boardname,
						    device->path,
						    device_ptr);
	if (error_code != FBC_SUCCESS) {
		xf86conffree(dev_identifier);
	}
	free (full_model_name);

	return (error_code);

}	/* fbc_insert_Device_section() */


/* End of fbc_Device.c */
