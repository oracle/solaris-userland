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

#include "smf-config.h"

/* #include <net/pfvar.h> */

#define	FTP_PROXY_PG	"ftp-proxy"
#define FTP_PROXY_PROP_VALUE_AUTH	"value_authorization"
#define FTP_PROXY_PROP_ACTION_AUTH	"action_authorization"
#define FTP_PROXY_VALUE_AUTH	"solaris.smf.value.network.firewall"
#define FTP_PROXY_MANAGE_AUTH	"solaris.smf.manage.network.firewall"

/*
 * CHKASCIIZ()
 * Macro checks if _s_ is ASCIIZ (not NULL, not empty), if _s_ is not empty
 * string, then _p_ is returned.
 *
 * Arguments:
 *	_s_	- ASCIIZ string to be tested
 *	_p_	- string to be returned when _s_ is not NULL or empty
 *
 * Returns:
 *	_p_ if _s_ is not NULL/empty, otherwise the empty string is returned.
 */
#define	CHKASCIIZ(_s_, _p_)	\
	((((_s_) == NULL) || (_s_[0] == '\0')) ? "" : (_p_))

#define	SKIP_PROP(_pv_)		\
	((strcmp((_pv_)->pv_prop, "action_authorization") == 0) || \
	(strcmp((_pv_)->pv_prop, "value_authorization") == 0))

#define	STRIP_SVC(_x_)	((_x_) + (sizeof ("svc:/") - 1))

/*
 * smf_ftp_cfg
 * FTP proxy configuration container.
 */
smf_ftppx_cfg_t	smf_ftp_cfg;

#define	SMF_OPT_OPTIONAL	0
#define	SMF_OPT_MANDATORY	1
/*
 * X-macro table.
 * Columns are as follows:
 * 	value key/index 
 *	smf(7) property name name
 *	member in smf_ftppx_cfg_t structure
 *	function which converts ASCIIZ to member type in smf_ftppx_cfg_t
 *	function which converts member in smf_ftppx_cfg_t to ASCIIZ
 *	optional/mandatory status
 *	property type
 */
#define	X_CFG_PROPS	\
	X(SMF_ANON, "anonymous-only", cfg_anonymous_only, on_to_one,	\
	    one_to_on, SMF_OPT_OPTIONAL, SCF_TYPE_ASTRING)		\
	X(SMF_FIXED_PROXY, "proxy-NAT-address",	cfg_fixed_proxy,	\
	    nop_in, nop_out, SMF_OPT_MANDATORY, SCF_TYPE_ASTRING)	\
	X(SMF_LISTEN_ADDR, "proxy-listen-address", cfg_listen_addr,	\
	    nop_in, nop_out, SMF_OPT_MANDATORY, SCF_TYPE_ASTRING)	\
	X(SMF_LISTEN_PORT, "listen-port",	cfg_listen_port,	\
	    int_in, int_out, SMF_OPT_OPTIONAL, SCF_TYPE_INTEGER)	\
	X(SMF_DEBUG_LEVEL, "debug-level", cfg_debug_level, int_in,	\
	    int_out, SMF_OPT_OPTIONAL, SCF_TYPE_INTEGER)		\
	X(SMF_MAX_SESSIONS, "maxsessions", cfg_max_sessions,		\
	    int_in, int_out, SMF_OPT_OPTIONAL,				\
	    SCF_TYPE_INTEGER)						\
	X(SMF_RFC_MODE, "always-use-ftp-data-port", cfg_rfc_mode,	\
	    on_to_one, one_to_on, SMF_OPT_OPTIONAL, SCF_TYPE_ASTRING)	\
	X(SMF_FIXED_SERVER_PORT, "reverse-mode-port", 			\
	    cfg_fixed_server_port, int_in, int_out, SMF_OPT_OPTIONAL,	\
	    SCF_TYPE_INTEGER)						\
	X(SMF_FIXED_SERVER, "reverse-mode-address", cfg_fixed_server,	\
	    nop_in, nop_out, SMF_OPT_OPTIONAL, SCF_TYPE_ASTRING)	\
	X(SMF_TAG, "tag", cfg_tag, nop_in, nop_out, SMF_OPT_OPTIONAL,	\
	    SCF_TYPE_ASTRING)						\
	X(SMF_TIMEOUT, "timeout", cfg_timeout, int_in, int_out,		\
	    SMF_OPT_OPTIONAL, SCF_TYPE_INTEGER)				\
	X(SMF_LOG, "log", cfg_log, log_to_int, int_to_log,		\
	    SMF_OPT_OPTIONAL, SCF_TYPE_ASTRING)

static void nop_in(void *, void *);
static void nop_out(void *, void *);
static void int_in(void *, void *);
static void int_out(void *, void *);
static void on_to_one(void *, void *);
static void one_to_on(void *, void *);
static void str_to_int(void *, void *);
static void int_to_str(void *, void *);
static void str_to_uint(void *, void *);
static void uint_to_str(void *, void *);
static void log_to_int(void *, void *);
static void int_to_log(void *, void *);

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
 * Table of smf_ftppx_cfg_t members.
 */
#define	X(_const_, _propname_, _decl_, _conv_in_, _conv_out_, _mandatory_, \
    _type_) offsetof(smf_ftppx_cfg_t, _decl_),
static size_t smf_cfg_offsets[] = {
	X_CFG_PROPS
	sizeof (smf_ftppx_cfg_t)
};
#undef	X

typedef void(*conv_in_f)(void *, void *);
typedef void(*conv_out_f)(void *, void *);
/*
 * smf_convert_in
 * Table of conversion functions, which convert particular smf_ftppx_cfg_t
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
 * Table of conversion functions, which convert ASCIIZ fetched from smf(7)
 * repository to member of smf_ftppx_cfg_t structure.
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
 * ftp-proxy property group properties
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

/*
 * Conversion routines from smf_ftp_cfg structure to prop_vec member and vice
 * versa.
 */

/*
 * nop_in()
 * Dummy conversion ASCIIZ to ASCIIZ, no allocation happens. Used when
 * configuration is from smf(7).
 */
static void
nop_in(void *asciiz, void *result)
{
	*((char **)result) = asciiz;
}

/*
 * nop_out()
 * Dummy conversion ASCIIZ to ASCIIZ, function allocates memory for result by
 * strdup(3C). Used when configuration is written to smf(7) repository.
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

/*
 * on_to_one()
 * Function converts ASCIIZ value "on" to 1. Anything else yields a 0. Used to
 * read configuration from smf(7).
 */
static void
on_to_one(void *asciiz, void *result)
{
	*((int *)result) = ((strcasecmp((char *)asciiz, "on") == 0) ? 1 : 0);
}

/*
 * one_to_on()
 * Function converts 0 to ASCIIZ string "off", anything else than 0 yields to
 * "on". Used when configuration ie being written to smf(7). Function also
 * allocates memory for resulting string using strdup(3C).
 */
static void
one_to_on(void *asciiz, void *val)
{
	if (*((int *)val) == 0) {
		*((char **)asciiz) = strdup("off");
	} else {
		*((char **)asciiz) = strdup("on");
	}
}

/*
 * str_to_int()
 * Function converts integer represented as ASCIIZ to int using atoi(3C).  Used
 * when configuration is read from smf(7).
 */
static void
str_to_int(void *asciiz, void *result)
{
	*((int *)result) = atoi((char *)asciiz);
}

/*
 * int_to_str()
 * Function converts integer number to ASCIIZ using asprintf(3C). Used when
 * configuration is being stored to smf(7). Memory for results get allocated by
 * asprintf(3C).
 */
static void
int_to_str(void *asciiz, void *val)
{
	(void) asprintf((char **)asciiz, "%d", *((int *)val));
}

/*
 * str_to_uint()
 * Function converts unsigned integer represented as ASCIIZ to int using
 * atoi(3C). Used when configuration is being read from smf(7) repository.
 */
static void
str_to_uint(void *asciiz, void *result)
{
	*((unsigned int *)result) = (unsigned int) atoi((char *)asciiz);
}

/*
 * uint_to_str()
 * Function converts unsigned integer to ASCIIZ using asprintf(3C).  Used when
 * configuration is written to smf(7). Memory for result is allocated by
 * asprintf(3C).
 */
static void
uint_to_str(void *asciiz, void *val)
{
	(void) asprintf((char **)asciiz, "%u", *((int *)val));
}

/*
 * log_to_int()
 * Function encodes ASCIIZ value for log property to numeric code.  String
 * "all" gets converted to 2, string "on" to 1, anything else yields to 0.
 * It's used when configuration is being read from smf(7) repository.
 */
static void
log_to_int(void *asciiz, void *result)
{
	if (strcasecmp((char *)asciiz, "all") == 0) {
		*((int *)result) = 2;
	} else if (strcasecmp((char *)asciiz, "on") == 0) {
		*((int *)result) = 1;
	} else {
		*((int *)result) = 0;
	}
}

/*
 * int_to_log()
 * Function encodes value of log property to its numeric representation.  2
 * gets encoded to "all", 1 results to "on", anything else results to off.
 * The memory for result is allocated by strdup(3C).
 */
static void
int_to_log(void *asciiz, void *val)
{
	switch (*((int *)val)) {
	case	2:
		*((char **)asciiz) = strdup("all");
		break;
	case	1:
		*((char **)asciiz) = strdup("on");
		break;
	default:
		*((char **)asciiz) = strdup("off");
	}
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
 * Function converts smf_ftp_cfg global variable, which holds configuration
 * parsed from command line arguments, to prop_vec, which is a smf(7) friendly
 * representation of proxy configuration.
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
		if ((smf_ftp_cfg.cfg_set & cfg_bit) != 0) {
			prop_vec_ptr->pv_prop = smf_propnames[i];
			conv_func = smf_conv_out[i];

			conv_func(&prop_vec_ptr->pv_ptr,
			    ((char *)&smf_ftp_cfg + smf_cfg_offsets[i]));
			if (prop_vec_ptr->pv_ptr == NULL)
				return (-1);
			prop_vec_ptr->pv_type = smf_type[i];
			prop_vec_ptr++;
		}
		cfg_bit = cfg_bit << 1;
	}
	prop_vec_ptr->pv_type = SCF_TYPE_ASTRING;
	prop_vec_ptr->pv_prop = FTP_PROXY_PROP_VALUE_AUTH;
	prop_vec_ptr->pv_ptr = strdup(FTP_PROXY_VALUE_AUTH);
	prop_vec_ptr++;

	gen_prop_vec[0].pv_type = SCF_TYPE_ASTRING;
	gen_prop_vec[0].pv_prop = FTP_PROXY_PROP_VALUE_AUTH;
	gen_prop_vec[0].pv_ptr = strdup(FTP_PROXY_MANAGE_AUTH);
	gen_prop_vec[1].pv_type = SCF_TYPE_ASTRING;
	gen_prop_vec[1].pv_prop = FTP_PROXY_PROP_ACTION_AUTH;
	gen_prop_vec[1].pv_ptr = strdup(FTP_PROXY_MANAGE_AUTH);

	return (0);
}

/*
 * prop_vec_to_cfg()
 * Converts global variable `prop_vec` to `smf_ftp_cfg` global variable,
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
		    ((char *)&smf_ftp_cfg + smf_cfg_offsets[i]));
	}
}

/*
 * smf_print_ftpcfg()
 * Function loads ftpcfg from smf(7) repository and prints configuration to
 * standard output. We use `scf_simple_prop_get(3SCF)`.
 *
 * Returns 0 on success, -1 on error..
 */
int
smf_print_ftpcfg(const char *smf_instance)
{
	scf_simple_prop_t	*prop;
	int			i;
	scf_propvec_t		*prop_vec_ptr = prop_vec;
	int			cfg_incomplete = 0;
	char			*fmri;

	if (atexit_set == 0) {
		atexit(clear_prop_vec);
		bzero(&smf_ftp_cfg, sizeof (smf_ftppx_cfg_t));
		atexit_set = 1;
	}

	(void) asprintf(&fmri, "%s:%s", BASE_FMRI, smf_instance);
	if (fmri == NULL) {
		fprintf(stderr, "Out of memory.\n");
		return (-1);
	}

	clear_prop_vec();

	for (i = 0; i < SMF_CFG_PROP_COUNT; i++) {
		prop = scf_simple_prop_get(NULL, fmri, FTP_PROXY_PG,
		    smf_propnames[i]);
		prop_vec_ptr->pv_prop = smf_propnames[i];
		prop_vec_ptr->pv_type = scf_simple_prop_type(prop);
		if (prop_vec_ptr->pv_type == -1) {
			free(fmri);
			fprintf(stderr, "Failed to get property type.\n");
			return (-1);
		}
		if (prop_vec_ptr->pv_type != smf_type[i]) {
			free(fmri);
			fprintf(stderr, "Property %s has unexpected type.\n",
			    smf_propnames[i]);
			return (-1);
		}
		if (prop == NULL) {
			/*
			 * Property not defined, so we create a kind of
			 * 'placeholder' with empty value.
			 *
			 * calloc() works well for both astring and integer.
			 */
			prop_vec_ptr->pv_ptr = calloc(1, sizeof (int64_t));
			cfg_incomplete |= smf_mandatory[i];
		} else {
			if (smf_type[i] == SCF_TYPE_ASTRING) {
				char	*propval;
				propval = scf_simple_prop_next_astring(prop);
				if (propval == NULL) {
					propval = "";
				}
				prop_vec_ptr->pv_ptr = strdup(propval);

				if (propval[0] == 0) {
					cfg_incomplete |= smf_mandatory[i];
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
					cfg_incomplete |= smf_mandatory[i];
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

	printf("PF FTP proxy configuration:\n");

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
	if (cfg_incomplete) {
		printf("\n\nConfiguration for %s is incomplete."
		    " Service will not run.\n\n", fmri);
	} else {
		prop_vec_to_cfg();
		printf(
		    "\n\n%s service is being launched using cmd line below\n\n",
		    fmri);
		printf("ftp-proxy "
		    "%s -a %s -b %s -p "
		    "%d -D %d -m %d -t %d %s %s %s %.d %s %s %s %s\n",
		    ((smf_ftp_cfg.cfg_anonymous_only == 1) ? "-A on" : ""),
		    smf_ftp_cfg.cfg_fixed_proxy,
		    smf_ftp_cfg.cfg_listen_addr,
		    (int)smf_ftp_cfg.cfg_listen_port,
		    (int)smf_ftp_cfg.cfg_debug_level,
		    (int)smf_ftp_cfg.cfg_max_sessions,
		    (int)smf_ftp_cfg.cfg_timeout,
		    CHKASCIIZ(smf_ftp_cfg.cfg_fixed_server, "-R"),
		    CHKASCIIZ(smf_ftp_cfg.cfg_fixed_server,
			smf_ftp_cfg.cfg_fixed_server),
		    (smf_ftp_cfg.cfg_fixed_server_port == 0) ? ("") : ("-P"),
		    (int)smf_ftp_cfg.cfg_fixed_server_port,
		    ((smf_ftp_cfg.cfg_rfc_mode != 0) ? "-r on" : ""),
		    CHKASCIIZ(smf_ftp_cfg.cfg_tag, "-T"),
		    CHKASCIIZ(smf_ftp_cfg.cfg_tag, smf_ftp_cfg.cfg_tag),
		    ((smf_ftp_cfg.cfg_log == 2) ? "-vv" :
			((smf_ftp_cfg.cfg_log == 1) ? "-v" : "")));
	}

	free(fmri);

	return (0);
}

/*
 * smf_create_ftp_instance()
 * Function creates a new instance in smf(7) repository.
 */
static int
smf_create_ftp_instance(const char *smf_instance)
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

	if (scf_instance_add_pg(sin_scf, FTP_PROXY_PG, "application", 0,
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
 * smf_write_ftpcfg()
 * Function writes proxy configuration to smf(7) repostiory.
 */
int
smf_write_ftpcfg(const char *smf_instance, int create)
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
		if (smf_create_ftp_instance(smf_instance) != 0) {
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
	if (scf_write_propvec(fmri, FTP_PROXY_PG, prop_vec, &bad_prop_vec)
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
