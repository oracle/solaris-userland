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
 * fbc_properties - Establish fbconf_xorg(1M) program properties
 */



#ifndef _FBC_PROPERTIES_H
#define	_FBC_PROPERTIES_H


#include <stdio.h>		/* FILE */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_xorg.h"		/* Edit config file data representations */
#include "fbc_mode_list.h"	/* List of Modes from Monitor section of cfg */
#include "fbc_query_device.h"	/* Query a frame buffer device */


/*
 * Set of common fbconf_xorg(1M) command line option flags
 */
typedef struct {
	unsigned int	help		: 1;	/* -help		*/
	unsigned int	prconf		: 1;	/* -prconf		*/
	unsigned int	predid_raw	: 1;	/* -predid raw		*/
	unsigned int	predid_parsed	: 1;	/* -predid parsed	*/
	unsigned int	propt		: 1;	/* -propt		*/
	unsigned int	res_list	: 1;	/* -res ?		*/
	unsigned int	res_mode_nocheck : 1;	/* -res <mode> nocheck	*/
	unsigned int	res_mode_noconfirm : 1;	/* -res <mode> noconfirm */
	unsigned int	res_mode_now	: 1;	/* -res <mode> now	*/
	unsigned int	res_mode_try	: 1;	/* -res <mode> try	*/
	/* Flags available for future use */
	unsigned int	spare_10	: 1;
	unsigned int	spare_11	: 1;
	unsigned int	spare_12	: 1;
	unsigned int	spare_13	: 1;
	unsigned int	spare_14	: 1;
	unsigned int	spare_15	: 1;
} opt_set_t;


/*
 * fbconf_xorg(1M) program properties, typically frame buffer device specific
 */
typedef struct fbc_varient_st {
	const char	*prog_name;	/* Program name used for messages */
	const char	*config_file_loc; /* Config file location (-file) */
	const char	*config_search_path; /* Config file search path */
	const char	*config_file_path; /* Config input file pathname */
	int (*getargs)(			/* Process the command line */
		const int argc,		/*   Program argument count */
		char	* const	argv[],	/*   Program argument vector */
		struct fbc_varient_st *fbvar); /*   Program varient data */
	void (*usage)(FILE *, struct fbc_varient_st *fbvar);
					/* Program usage() function */
	const char	*usage_text_header; /* Program usage text header */
	const char	*usage_text_body; /* Program usage text body */
	void (*help)(struct fbc_varient_st *fbvar);
					/* Program help() function */
	float		gamma_default;	/* Default gamma correction value */
	char		*gfile_in_path;	/* Gamma table input path, else NULL */
	const char	**gfile_out_path; /* Gamma table output pathname */
	int		lut_size;	/* Gamma look-up table size */
	char		*gamma_string_red; /* Red gamma packed data string */
	char		*gamma_string_green; /* Green gamma packed string */
	char		*gamma_string_blue; /* Blue gamma packed data string */
//???	fbopt_descr_t	*fbc_option;	/* Recognized command line options */
	void		*fbc_option;	/* Recognized command line options */
	xf86_ent_mod_t	xf86_entry_mods; /* xorg.conf entry values */
	opt_set_t	option_set;	/* Common command line option flags */
	sectn_mask_t	modify_config;	/* Config sections, etc. to modify */
	xf86_active_t	active;		/* Active config sections for device */
	void (*get_edid_res_info)
			(const fbc_dev_t *,
			fbc_mode_elem_t *,
			fbc_edid_res_t []); /* Get display device information */
	int (*revise_settings)(struct fbc_varient_st *fbvar);
					/* Config revision functn, else NULL */
	int (*init_device)
			(fbc_dev_t *device, struct fbc_varient_st *fbvar);
					/* Device init function, else NULL */
	void (*prconf)(const fbc_dev_t *device,
			struct fbc_varient_st *fbvar,
			XF86ConfigPtr	configIR);
					/* Display hardware config (-prconf) */
	void (*predid)(const fbc_dev_t *device,
			struct fbc_varient_st *fbvar);
					/* Display EDID data (-predid) */
//???	fbc_propt_fn_t	**propt_fn;	/* List of -propt display functions */
	void		*propt_fn;	/* List of -propt display functions */
	int (*res_mode_try)(fbc_dev_t *device, fbc_video_mode_t *video_mode);
					/* Video mode trial fn, else NULL */
	int (*res_mode_now)(fbc_dev_t *device, fbc_video_mode_t *video_mode);
					/* Video mode setting fn, else NULL */
} fbc_varient_t;


/*
 * Command line options that might commonly be invoked by "-defaults"
 */
extern char *const fbc_defargv_clone[];
extern char *const fbc_defargv_deflinear[];
extern char *const fbc_defargv_defoverlay[];
extern char *const fbc_defargv_deftransparent[];
extern char *const fbc_defargv_doublehigh[];
extern char *const fbc_defargv_doublewide[];
extern char *const fbc_defargv_fake8[];
extern char *const fbc_defargv_g[];
extern char *const fbc_defargv_multisample[];
extern char *const fbc_defargv_offset[];
extern char *const fbc_defargv_outputs[];
extern char *const fbc_defargv_rscreen[];
extern char *const fbc_defargv_samples[];
extern char *const fbc_defargv_slave[];
extern char *const fbc_defargv_stereo[];


void fbc_get_base_properties(
	fbc_varient_t	*fbvar);	/* Returned fbconf_xorg properties */


#endif	/* _FBC_PROPERTIES_H */


/* End of fbc_properties.h */
