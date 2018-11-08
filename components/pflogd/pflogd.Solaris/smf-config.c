/*
 * CDDL HEADER START
 *
 * The contents of this file are subject to the terms of the
 * Common Development and Distribution License (the "License").
 * You may not use this file except in compliance with the License.
 *
 * You can obtain a copy of the license at usr/src/OPENSOLARIS.LICENSE
 * or http://www.opensolaris.org/os/licensing.
 * See the License for the specific language governing permissions
 * and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL HEADER in each
 * file and include the License file at usr/src/OPENSOLARIS.LICENSE.
 * If applicable, add the following below this CDDL HEADER, with the
 * fields enclosed by brackets "[]" replaced with your own identifying
 * information: Portions Copyright [yyyy] [name of copyright owner]
 *
 * CDDL HEADER END
 *
 */

/*
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates. All rights reserved.
 */

#include <string.h>
#include <strings.h>
#include <stdlib.h>
#include <err.h>
#include <stdarg.h>
#include <stdio.h>
#include <libscf.h>
#include <stddef.h>
#include <libscf_priv.h>

#include "pflogd.h"
#include "smf-config.h"

#define	PFLOGD_PG	"pflog"
#define PFLOGD_PROP_VALUE_AUTH	"value_authorization"
#define PFLOGD_PROP_ACTION_AUTH	"action_authorization"
#define PFLOGD_VALUE_AUTH	"solaris.smf.value.network.firewall"
#define PFLOGD_MANAGE_AUTH	"solaris.smf.manage.network.firewall"

#define	SKIP_PROP(_pv_)		\
	((strcmp((_pv_)->pv_prop, "action_authorization") == 0) || \
	(strcmp((_pv_)->pv_prop, "value_authorization") == 0))

#define	STRIP_SVC(_x_)	((_x_) + (sizeof ("svc:/") - 1))

/*
 * smf_pflogd_cfg
 * FTP proxy configuration container.
 */
smf_pflogd_cfg_t	smf_pflogd_cfg;

#define	SMF_OPT_OPTIONAL	0
#define	SMF_OPT_MANDATORY	1
/*
 * X-macro table.
 * Columns are as follows:
 * 	value key/index 
 *	SMF property name name
 *	member in smf_pflogd_cfg_t structure
 *	function which converts ASCIIZ to member type in smf_pflogd_cfg_t
 *	function which converts member in smf_pflogd_cfg_t to ASCIIZ
 *	optional/mandatory status
 *      property type
 */
#define	X_CFG_PROPS	\
	X(SMF_LOGFILE, "logfile", cfg_logfile, nop_in, nop_out,		\
	    SMF_OPT_MANDATORY, SCF_TYPE_ASTRING)			\
	X(SMF_SNAPLEN, "snaplen", cfg_snaplen, int_in, int_out,		\
	    SMF_OPT_MANDATORY, SCF_TYPE_INTEGER)			\
	X(SMF_INTERFACE, "interface", cfg_interface, nop_in, nop_out,	\
	    SMF_OPT_MANDATORY, SCF_TYPE_ASTRING)			\
	X(SMF_DELAY, "delay",	cfg_delay, int_in, int_out,		\
	    SMF_OPT_OPTIONAL, SCF_TYPE_INTEGER)				\
	X(SMF_EXPRESSION, "filter", cfg_expression, nop_in, nop_out,	\
	    SMF_OPT_OPTIONAL, SCF_TYPE_ASTRING)

static void nop_in(void *, void *);
static void nop_out(void *, void *);
static void int_in(void *, void *);
static void int_out(void *, void *);

/*
 * smf_keys
 * Keys (indexes) to `smf_propnames` dictionary.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) _const_,
enum smf_keys {
	X_CFG_PROPS
	SMF_CFG_PROP_COUNT
};
#undef	X

/*
 * smf_propnames
 * It's an array (dictionary), which translates property code (SMF_*) to
 * property value name found `ftp-proxy` property group.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) _propname_,
static const char *smf_propnames[] = {
	X_CFG_PROPS
	NULL
};
#undef	X

/*
 * smf_cfg_offsets
 * Table of smf_pflogd_cfg_t members.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) offsetof(smf_pflogd_cfg_t, _decl_),
static size_t smf_cfg_offsets[] = {
	X_CFG_PROPS
	sizeof (smf_pflogd_cfg_t)
};
#undef	X

typedef void(*conv_in_f)(void *, void *);
typedef void(*conv_out_f)(void *, void *);
/*
 * smf_convert_in
 * Table of conversion functions, which convert particular smf_pflogd_cfg_t
 * member into ASCIIZ.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) _conv_in_,
static conv_in_f smf_conv_in[] = {
	X_CFG_PROPS
	NULL
};
#undef	X

/*
 * smf_conv_out
 * Table of conversion functions, which convert ASCIIZ fetched from smf(5)
 * repository to member of smf_pflogd_cfg_t structure.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) _conv_out_,
static conv_out_f smf_conv_out[] = {
	X_CFG_PROPS
	NULL
};
#undef	X

/*
 * smf_mandatory
 * Table marks configuration parameters, which must be defined by admin,
 * before the service is enabled for the first time.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) _mandatory_,
static int smf_mandatory[] = {
	X_CFG_PROPS
	0
};
#undef	X

/*
 * smf_type
 * Table of types of SMF properties.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) _type_,
static int smf_type[] = {
	X_CFG_PROPS
	0
};
#undef	X

/*
 * pflogd property group properties
 * +1 for NULL termination.
 * +1 for value_authorization
 */
static scf_propvec_t	prop_vec[SMF_CFG_PROP_COUNT + 1 + 1];

/*
 * general property group properties
 * +1 for NULL termination.
 * +2 for value_authorization/action_authorization
 */
static scf_propvec_t	gen_prop_vec[1 + 2];

static int atexit_set = 0;
static int complete_pflogdcfg(const char *);

/*
 * nop_in()
 * Dummy conversion ASCIIZ to ASCIIZ, no allocation happens. Used when
 * configuration is from smf(5).
 */
static void
nop_in(void *asciiz, void *result)
{
	*((char **)result) = (char *)asciiz;
}

/*
 * nop_out()
 * Dummy conversion ASCIIZ to ASCIIZ, function allocates memory for result by
 * strdup(3C). Used when configuration is written to smf(5) repository.
 */
static void
nop_out(void *asciiz, void *val)
{
	*((char **)asciiz) = strdup(*(char **)val);
}

/*
 * int_in()
 * Dummy conversion of int64_t. No allocation happens. Used when reading
 * values from smf.
 */
static void
int_in(void *in, void *out) {
	*((int64_t *)out) = *((int64_t *)in);
}

/*
 * int_out()
 * Dummy conversion of int64_t, storing into a newly allocated memory.
 * Used when storing values to smf repository.
 */
static void
int_out(void *out, void *in) {
	int64_t **out_ = (int64_t **)out;

	*out_ = malloc(sizeof (int64_t));
	if (*out_ != NULL)
		**out_ = *((int64_t *)in);
}

static void
clear_prop_vec2(scf_propvec_t *prop_vec_ptr, int count)
{
	while (count--) {
		prop_vec_ptr->pv_prop = NULL;
		prop_vec_ptr->pv_desc = NULL;
		prop_vec_ptr->pv_type = 0;
		prop_vec_ptr->pv_aux = 0;
		prop_vec_ptr->pv_mval = 0;

		if (prop_vec_ptr->pv_ptr != NULL) {
			free(prop_vec_ptr->pv_ptr);
			prop_vec_ptr->pv_ptr = NULL;
		}

		prop_vec_ptr++;
	}
}

/*
 * clear_prop_vec()
 * Function clears global variables `prop_vec` and `gen_prop_vec`,
 * which are vectors of properties.
 */
static void
clear_prop_vec()
{
	clear_prop_vec2(prop_vec,
	    sizeof (prop_vec) / sizeof (scf_propvec_t));
	clear_prop_vec2(gen_prop_vec,
	    sizeof (gen_prop_vec) / sizeof (scf_propvec_t));
}

/*
 * cfg_to_prop_vec()
 * Function converts smf_pflogd_cfg global variable, which holds configuration
 * parsed from command line arguments, to prop_vec, which is a smf(5) friendly
 * representation of pflogd configuration. 
 *
 * Additionally, it populates gen_prop_vec to specify needed authorizations.
 *
 * Returns 0 on success, -1 on out of memory error.
 */
static int
cfg_to_prop_vec(void)
{
	int		cfg_bit = 1;
	int		i;
	scf_propvec_t	*prop_vec_ptr = prop_vec;
	conv_out_f	conv_func;

	clear_prop_vec();

	for (i = 0; i < SMF_CFG_PROP_COUNT; i++) {
		if ((smf_pflogd_cfg.cfg_set & cfg_bit) != 0) {
			prop_vec_ptr->pv_prop = smf_propnames[i];
			conv_func = smf_conv_out[i];

			conv_func(&prop_vec_ptr->pv_ptr,
			    ((char *)&smf_pflogd_cfg + smf_cfg_offsets[i]));
			if (prop_vec_ptr->pv_ptr == NULL)
				return (-1);
			prop_vec_ptr->pv_type = smf_type[i];
			prop_vec_ptr++;
		}
		cfg_bit = cfg_bit << 1;
	}
	prop_vec_ptr->pv_type = SCF_TYPE_ASTRING;
	prop_vec_ptr->pv_prop = PFLOGD_PROP_VALUE_AUTH;
	prop_vec_ptr->pv_ptr = strdup(PFLOGD_VALUE_AUTH);
	prop_vec_ptr++;

	gen_prop_vec[0].pv_type = SCF_TYPE_ASTRING;
	gen_prop_vec[0].pv_prop = PFLOGD_PROP_VALUE_AUTH;
	gen_prop_vec[0].pv_ptr = strdup(PFLOGD_MANAGE_AUTH);
	gen_prop_vec[1].pv_type = SCF_TYPE_ASTRING;
	gen_prop_vec[1].pv_prop = PFLOGD_PROP_ACTION_AUTH;
	gen_prop_vec[1].pv_ptr = strdup(PFLOGD_MANAGE_AUTH);

	return (0);
}

/*
 * prop_vec_to_cfg()
 * Converts global variable `prop_vec` to `smf_pflogd_cfg` global variable,
 * which is understood by main().
 */
static void
prop_vec_to_cfg(void)
{
	int		i;
	scf_propvec_t	*prop_vec_ptr = prop_vec;
	conv_in_f	conv_func;

	for (i = 0; i < SMF_CFG_PROP_COUNT; i++, prop_vec_ptr++) {
		if (SKIP_PROP(prop_vec_ptr)) {
			/*
			 * We have `hidden` properties: action/value smf
			 * authorization. Those two are not kept in
			 * smf_ftp_cfg.
			 *
			 * So we must to skip to next property in vector
			 * without letting for loop to advance its counter, so
			 * we compensate here by doing `i--`.
			 */
			i--;
			continue;
		};
		conv_func = smf_conv_in[i];
		conv_func(prop_vec_ptr->pv_ptr,
		    ((char *)&smf_pflogd_cfg + smf_cfg_offsets[i]));
	}
}

/*
 * smf_print_pflogcfg()
 * Function loads pflogdcfg from smf(5) repository and prints configuration to
 * standard output. We use `scf_simple_prop_get(3SCF)`.
 *
 * Returns 0 on success, -1 on error.
 */
int
smf_print_pflogcfg(const char *smf_instance)
{
	scf_simple_prop_t	*prop;
	char			*propval;
	int			i;
	scf_propvec_t		*prop_vec_ptr = prop_vec;
	int			cfg_undefined = 0;
	char			*fmri;

	if (atexit_set == 0) {
		atexit(clear_prop_vec);
		bzero(&smf_pflogd_cfg, sizeof (smf_pflogd_cfg_t));
		atexit_set = 1;
	}

	(void) asprintf(&fmri, "%s:%s", BASE_FMRI, smf_instance);
	if (fmri == NULL) {
		fprintf(stderr, "Out of memory.\n");
		return (-1);
	}

	clear_prop_vec();

	for (i = 0; i < SMF_CFG_PROP_COUNT; i++) {
		prop = scf_simple_prop_get(NULL, fmri, PFLOGD_PG,
		    smf_propnames[i]);
		prop_vec_ptr->pv_prop = smf_propnames[i];

		if (prop == NULL) {
			/*
			 * Property not defined, so we create a kind of
			 * 'placeholder' with empty value.
			 *
			 * calloc() works well for both astring and integer.
			 */
			prop_vec_ptr->pv_type = smf_type[i];
			prop_vec_ptr->pv_ptr = calloc(1, sizeof (int64_t));
			cfg_undefined |= smf_mandatory[i];
		} else {
			prop_vec_ptr->pv_type = scf_simple_prop_type(prop);
			if (prop_vec_ptr->pv_type == -1) {
				free(fmri);
				fprintf(stderr,
				    "Failed to get property type.\n");
				return (-1);
			}
			if (prop_vec_ptr->pv_type != smf_type[i]) {
				free(fmri);
				fprintf(stderr,
				    "Property %s has unexpected type.\n",
				    smf_propnames[i]);
				return (-1);
			}

			if (smf_type[i] == SCF_TYPE_ASTRING) {
				char	*propval;
				propval = scf_simple_prop_next_astring(prop);
				if (propval == NULL) {
					propval = "";
				}
				prop_vec_ptr->pv_ptr = strdup(propval);

				if (propval[0] == 0) {
					cfg_undefined |= smf_mandatory[i];
				}
			} else {
				/* smf_type[i] == SCF_TYPE_INTEGER */
				int64_t	*propval;
				int64_t propval_;

				propval = scf_simple_prop_next_integer(prop);
				propval_ = (propval == NULL) ? (0) : (*propval);

				prop_vec_ptr->pv_ptr = malloc(sizeof (int64_t));
				if (prop_vec_ptr->pv_ptr != NULL) {
					*((int64_t *)prop_vec_ptr->pv_ptr) =
					    propval_;
				}
				if (propval_ == 0) {
					cfg_undefined |= smf_mandatory[i];
				}
			}
			scf_simple_prop_free(prop);
		}
		if (prop_vec_ptr->pv_ptr == NULL) {
			free(fmri);
			fprintf(stderr, "Out of memory.\n");
			return (-1);
		}

		prop_vec_ptr++;
	}

	printf("PF pflogd configuration:\n");

	prop_vec_ptr = prop_vec;
	for (i = 0; i < SMF_CFG_PROP_COUNT; i++) {
		if (smf_type[i] == SCF_TYPE_ASTRING) {
			const char *val = (const char *)prop_vec_ptr->pv_ptr;
			printf("\t- %s:\n\t\t%s\n", prop_vec_ptr->pv_prop,
			    ((val[0] == '\0') ?  "?? undefined ??" : val));
		} else {
			/* smf_type[i] == SCF_TYPE_INTEGER */
			int64_t val = *((int64_t *)prop_vec_ptr->pv_ptr);
			if (val == 0) {
				printf("\t- %s:\n\t\t%s\n", prop_vec_ptr->pv_prop,
			    	    "?? undefined ??");
			} else {
				printf("\t- %s:\n\t\t%d\n", prop_vec_ptr->pv_prop,
			    	    (int)val);
			}
		}
		prop_vec_ptr++;
	}
	if (cfg_undefined) {
		printf("\n\nConfiguration for %s is incomplete."
		    " Service will not run.\n\n", fmri);
	} else {
		prop_vec_to_cfg();
		printf(
		    "\n\n%s service is being launched using cmd line below\n",
		    fmri);
		printf("pflogd -d %d -i %s -s %d -f %s %s\n\n",
		    (int)smf_pflogd_cfg.cfg_delay, smf_pflogd_cfg.cfg_interface,
		    (int)smf_pflogd_cfg.cfg_snaplen, smf_pflogd_cfg.cfg_logfile,
		    smf_pflogd_cfg.cfg_expression);
	}

	free(fmri);

	return (0);
}

/*
 * smf_create_pflogd_instance()
 * Function creates a new instance in smf(5) repository.
 */
static int
smf_create_pflogd_instance(const char *smf_instance)
{
	scf_handle_t	*h_scf = NULL;
	scf_scope_t	*scp_scf = NULL;
	scf_service_t	*svc_scf = NULL;
	scf_instance_t	*sin_scf = NULL;
	int	rv = -1;

 	h_scf = scf_handle_create(SCF_VERSION);
	if ((h_scf == NULL) || (scf_handle_bind(h_scf) == -1)) {
		(void) fprintf(stderr, "scf_handle_bind() failed - %s\n",
		    scf_strerror(scf_error()));
		if (h_scf != NULL) {
			scf_handle_destroy(h_scf);
		}
		return (-1);
	}

	if ((scp_scf = scf_scope_create(h_scf)) == NULL) {
		(void) fprintf(stderr, "could not create scope - %s\n",
		    scf_strerror(scf_error()));
		goto unbind;
	}

	if (scf_handle_get_local_scope(h_scf, scp_scf) != 0) {
		(void) fprintf(stderr, "could not get scope - %s\n",
		    scf_strerror(scf_error()));
		goto scope_destroy;
	}

	if ((svc_scf = scf_service_create(h_scf)) == NULL) {
		(void) fprintf(stderr, "could not create service - %s\n",
		    scf_strerror(scf_error()));
		goto scope_destroy;
	}

	if ((sin_scf = scf_instance_create(h_scf)) == NULL) {
		(void) fprintf(stderr, "could not get instance handle - %s\n",
		    scf_strerror(scf_error()));
		goto service_destroy;
	}

	if (scf_scope_get_service(scp_scf, STRIP_SVC(BASE_FMRI), svc_scf) !=
	    SCF_SUCCESS) {
		(void) fprintf(stderr, "could not select service (%s)\n",
		    scf_strerror(scf_error()));
		goto instance_destroy;
	}

	if (scf_service_add_instance(svc_scf, smf_instance, sin_scf) != 0) {
		(void) fprintf(stderr, "could not add %s instance - %s\n",
		    smf_instance, scf_strerror(scf_error()));
		goto instance_destroy;
	}

	if (scf_instance_add_pg(sin_scf, "general", "framework", 0,
	    NULL) != SCF_SUCCESS) {
		(void) fprintf(stderr,
		    "could not create property group - %s\n",
		    scf_strerror(scf_error()));
		goto instance_delete;
	}

	if (scf_instance_add_pg(sin_scf, PFLOGD_PG, "application", 0,
	    NULL) != SCF_SUCCESS) {
		(void) fprintf(stderr,
		    "could not create property group - %s\n",
		    scf_strerror(scf_error()));
		goto instance_delete;
	}

	rv = 0;
	goto instance_destroy;

instance_delete:
	if (scf_instance_delete(sin_scf) != 0) {
		fprintf(stderr, "Can't delete the newly created instance:");
		fprintf(stderr, "\t%s\n", scf_strerror(scf_error()));
	}
instance_destroy:
	scf_instance_destroy(sin_scf);
service_destroy:
	scf_service_destroy(svc_scf);
scope_destroy:
	scf_scope_destroy(scp_scf);
unbind:
	scf_handle_unbind(h_scf);
	scf_handle_destroy(h_scf);

	return (rv);
}

/*
 * smf_write_pflogcfg()
 * Function writes pflogd configuration to smf(5) repository.
 */
int
smf_write_pflogcfg(const char *smf_instance, int create)
{
	int	i;
	scf_propvec_t
		*bad_prop_vec = NULL;
	char	*fmri;

	if (atexit_set == 0) {
		atexit(clear_prop_vec);
		bzero(prop_vec, sizeof (prop_vec));
		atexit_set = 1;
	}

	if (create && (complete_pflogdcfg(smf_instance) != 0)) {
		fprintf(stderr, "Out of memory.\n");
		return (-1);
	}

	if (cfg_to_prop_vec() != 0) {
		fprintf(stderr, "Out of memory.\n");
		return (-1);
	}

	(void) asprintf(&fmri, "%s:%s", BASE_FMRI, smf_instance);
	if (fmri == NULL) {
		fprintf(stderr, "Out of memory.\n");
		return (-1);
	}

	if (create) {
		if (smf_create_pflogd_instance(smf_instance) != 0) {
			free(fmri);
			return (-1);
		}
	}

	if (create && (scf_write_propvec(fmri, "general", gen_prop_vec,
	    &bad_prop_vec) != SCF_SUCCESS)) {
		fprintf(stderr, "Can't update %s configuration:", fmri);
		fprintf(stderr, "\t%s\n", scf_strerror(scf_error()));
		if (bad_prop_vec != NULL) {
			fprintf(stderr, "Could not set %s\n",
			    bad_prop_vec->pv_prop);
		}
		free(fmri);
		exit(1);
	}

	bad_prop_vec = NULL;
	if (scf_write_propvec(fmri, PFLOGD_PG, prop_vec, &bad_prop_vec)
	    != SCF_SUCCESS) {
		fprintf(stderr, "Can't update %s configuration:", fmri);
		fprintf(stderr, "\t%s\n", scf_strerror(scf_error()));
		if (bad_prop_vec != NULL) {
			fprintf(stderr, "Could not set %s\n",
			    bad_prop_vec->pv_prop);
		}
		free(fmri);
		exit(1);
	}

	if (smf_refresh_instance_synchronous(fmri) != 0) {
		fprintf(stderr, "Failed to do 'svcadm refresh %s':\n\t%s\n"
		    "The service instance continues to run with old"
		    "settings.\n",
		    fmri,
		    scf_strerror(scf_error()));
		free(fmri);
		exit(1);
	}

	free(fmri);
	return (0);
}

/*
 * complete_pflogdcfg()
 * Function sets default values to properties, which are unset/undefined when
 * new smf(5) instance is being created.
 *
 * Returns 0 on success, -1 on out of memory error.
 */
static int
complete_pflogdcfg(const char *smf_instance)
{
	int	i;
	int	f = 1;

	for (i = 0; i < SMF_CFG_PROP_COUNT; i++) {
		if ((smf_pflogd_cfg.cfg_set & f) == 0) {
			switch (i) {
			case SMF_LOGFILE:
				(void) asprintf(&smf_pflogd_cfg.cfg_logfile,
				    "%s/%s", PFLOGD_LOG_DIR, smf_instance);
				if (smf_pflogd_cfg.cfg_logfile == NULL) {
					return (-1);
				}
				smf_pflogd_cfg.cfg_set |= SMF_CFG_LOGFILE_SET;	
				break;
			case SMF_INTERFACE:
				smf_pflogd_cfg.cfg_interface = strdup(smf_instance);
				if (smf_pflogd_cfg.cfg_interface == NULL) {
					return (-1);
				}
				smf_pflogd_cfg.cfg_set |= SMF_CFG_INTERFACE_SET;
				break;
			case SMF_SNAPLEN:
				smf_pflogd_cfg.cfg_snaplen = DEF_SNAPLEN;
				smf_pflogd_cfg.cfg_set |= SMF_CFG_SNAPLEN_SET;
				break;
			case SMF_DELAY:
				smf_pflogd_cfg.cfg_delay = FLUSH_DELAY;
				smf_pflogd_cfg.cfg_set |= SMF_CFG_DELAY_SET;
				break;
			case SMF_EXPRESSION:
				smf_pflogd_cfg.cfg_expression = strdup("");
				smf_pflogd_cfg.cfg_set |= SMF_CFG_EXPRESSION_SET;
				break;
			default: ;
			}
		}
		f = f << 1;
	}

	return (0);
}
