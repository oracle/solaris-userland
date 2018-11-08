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

#define	BASE_FMRI		"svc:/network/firewall/pflog"
#define	DEFAULT_INSTANCE	"pflog0"

#define	SMF_CFG_LOGFILE_SET	0x00000001
#define	SMF_CFG_SNAPLEN_SET	0x00000002
#define	SMF_CFG_INTERFACE_SET	0x00000004
#define	SMF_CFG_DELAY_SET	0x00000008
#define	SMF_CFG_EXPRESSION_SET	0x00000010

typedef struct smf_pflogd_cfg {
	unsigned int	cfg_set;	/* SMF_CFG_*_SET bit field */
	char		*cfg_logfile;
	int64_t		cfg_snaplen;
	char 		*cfg_interface;
	int64_t		cfg_delay;
	char		*cfg_expression;
} smf_pflogd_cfg_t;

extern smf_pflogd_cfg_t	smf_pflogd_cfg;

extern int smf_print_pflogcfg(const char *);
extern int smf_write_pflogcfg(const char *, int);

#endif	/* !_SMF_CONFIG_H_ */
