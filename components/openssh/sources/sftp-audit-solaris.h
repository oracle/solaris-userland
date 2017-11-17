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
 */

/*
 * Copyright (c) 2011, 2017, Oracle and/or its affiliates. All rights reserved.
 */

#ifndef _SFTP_AUDIT_SOLARIS_H
#define	_SFTP_AUDIT_SOLARIS_H

#ifdef	SFTP_AUDIT
#include <bsm/adt.h>

/*
 * Defines and macros
 */
#define	SFTP_AUDIT_FD_GET 0x1
#define	SFTP_AUDIT_FD_PUT 0x2
#define	AU_LFOLLOW	1
#define	AU_LSTAY	2
#define	SSH2_FX_OK	0
#define	SSH2_FX_EOF	1

extern const char *audit_username(void);

/*
 * SFTP session audit events
 */
void audit_sftp_session_start(void);
void audit_sftp_session_stop(int);
void audit_sftp_session_fatal(void);
void audit_sftp_finish_event(adt_event_data_t *, int, int);

/*
 * SFTP commands audit events
 */
adt_event_data_t *audit_sftp_get(char *, int);
adt_event_data_t *audit_sftp_put(char *, int);
adt_event_data_t *audit_sftp_mkdir(char *, mode_t);
adt_event_data_t *audit_sftp_rmdir(char *);
adt_event_data_t *audit_sftp_rename(char *, char *);
adt_event_data_t *audit_sftp_remove(char *);
adt_event_data_t *audit_sftp_symlink(char *, char *);
adt_event_data_t *audit_sftp_chown(char *, int, uid_t, gid_t);
adt_event_data_t *audit_sftp_chmod(char *, int, mode_t);
adt_event_data_t *audit_sftp_utimes(char *, int);

#endif /* SFTP_AUDIT */

#endif /* _SFTP_AUDIT_SOLARIS_H */
