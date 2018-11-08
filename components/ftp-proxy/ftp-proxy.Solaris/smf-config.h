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
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
 */

#ifndef	_SMF_CONFIG_H_
#define	_SMF_CONFIG_H_

#include <string.h>

#define	BASE_FMRI		"svc:/network/firewall/ftp-proxy"
#define	DEFAULT_INSTANCE	"default"

#define	SMF_CFG_ANON_SET	0x00000001
#define	SMF_CFG_FIXED_PROXY_SET	0x00000002
#define	SMF_CFG_LISTEN_ADDR_SET	0x00000004
#define	SMF_CFG_LISTEN_PORT_SET	0x00000008
#define	SMF_CFG_DEBUG_LEVEL_SET	0x00000010
#define	SMF_CFG_MAX_SESSION_SET	0x00000020
#define	SMF_CFG_RFC_MODE_SET	0x00000040
#define	SMF_CFG_FIXED_SERVER_PORT_SET	\
				0x00000080
#define	SMF_CFG_FIXED_SERVER_SET	\
				0x00000100
#define	SMF_CFG_TAG_SET		0x00000200
#define	SMF_CFG_TIMEOUT_SET	0x00000400
#define	SMF_CFG_LOG_SET		0x00000800

#define	SMF_CFG_LOG_OFF	0
#define	SMF_CFG_LOG_ON	1
#define	SMF_CFG_LOG_ALL	2

#define	SMF_COPY_STR(_x_)	(((_x_) == NULL) ? strdup("") : strdup((_x_)))

typedef struct smf_ftppx_cfg {
	unsigned int	cfg_set;	/* SMF_CFG_*_SET bit field */
	int		cfg_anonymous_only;
	char 		*cfg_fixed_proxy;
	char 		*cfg_listen_addr;
	int64_t		cfg_listen_port;
	int64_t		cfg_debug_level;
	int64_t		cfg_max_sessions;
	char		*cfg_fixed_server;
	int64_t		cfg_fixed_server_port;
	int		cfg_rfc_mode;
	char		*cfg_tag;
	int64_t		cfg_timeout;
	int		cfg_log;
} smf_ftppx_cfg_t;

extern smf_ftppx_cfg_t	smf_ftp_cfg;

extern int smf_print_ftpcfg(const char *);
extern int smf_write_ftpcfg(const char *, int);

#endif	/* !_SMF_CONFIG_H_ */
