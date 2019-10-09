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
 * Copyright (c) 2011, 2020, Oracle and/or its affiliates. All rights reserved.
 */

#include "includes.h"

#include "sftp-audit-solaris.h"
#include "hostfile.h"
#include "auth.h"
#include "log.h"
#include "packet.h"
#include "xmalloc.h"

#include <errno.h>
#include <fcntl.h>
#include <pwd.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>

#include <bsm/adt.h>
#include <bsm/adt_event.h>

#include <bsm/audit.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <values.h>
#include <stdio.h>
#include <stdarg.h>
#include <ucred.h>

#include <sys/types.h>
#include <sys/stat.h>

#include "sftp.h"

static adt_session_data_t   *audit_session = NULL;
static struct stat64	    attributes;

static struct stat64 *get_attrs(char *, int, int);

/*
 * SFTP audit events definition
 */

void
audit_sftp_session_start(void)
{
	adt_event_data_t *event;

	if (adt_start_session(&audit_session, NULL, ADT_USE_PROC_DATA) != 0) {
		fatal("Auditing of sftp session start failed: %s "
		    "(could not start adt event)", strerror(errno));
	}

	if ((event = adt_alloc_event(audit_session, ADT_ft_start)) == NULL) {
		fatal("Auditing of sftp session start failed: %s "
		    "(could not allocate adt event)", strerror(errno));
	}

	if (adt_put_event(event, ADT_SUCCESS, ADT_SUCCESS) != 0) {
		adt_free_event(event);
		fatal("Auditing of sftp session start failed: %s "
		    "(could not put adt event)", strerror(errno));
	}
	adt_free_event(event);
}

void
audit_sftp_session_stop(int rv)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_stop);
	(void) adt_put_event(event, rv ? ADT_FAILURE : ADT_SUCCESS, rv);
	adt_free_event(event);
	(void) adt_end_session(audit_session);
	audit_session = NULL;
}

void
audit_sftp_session_fatal(void)
{
	/*
	 * The audit_sftp_session_stop routine will be called only for
	 * valid sftp sessions
	 */
	if (audit_session != NULL)
		audit_sftp_session_stop(ADT_FAIL_VALUE_PROGRAM);
}

void
audit_sftp_finish_event(adt_event_data_t *event, int status, int rv)
{
	if (status == SSH2_FX_OK || status == SSH2_FX_EOF) {
		status = rv = ADT_SUCCESS;
	} else {
		status = ADT_FAILURE;
		if (rv == 0) {
			rv = ADT_FAIL_VALUE_UNKNOWN;
		}
	}

	if (adt_put_event(event, status, rv) != 0) {
		fatal("Auditing failed: %s (%s)", strerror(errno),
		    "could not put adt event");
	}

	adt_free_event(event);
}

adt_event_data_t *
audit_sftp_rename(char *f_from, char *f_to)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_rename);
	if (event == NULL) {
		fatal("Auditing of sftp rename failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_rename.dst_path = f_to;
	event->adt_ft_rename.src_path = f_from;
	/* fill the attribute token */
	event->adt_ft_rename.src_attr = get_attrs(f_from, -1, AU_LSTAY);

	return (event);
}

adt_event_data_t *
audit_sftp_remove(char *f_path)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_remove);
	if (event == NULL) {
		fatal("Auditing of sftp remove failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_remove.f_path = f_path;
	/* fill the attribute token */
	event->adt_ft_remove.f_attr = get_attrs(f_path, -1, AU_LSTAY);

	return (event);
}

adt_event_data_t *
audit_sftp_mkdir(char *d_path, mode_t mode)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_mkdir);
	if (event == NULL) {
		fatal("Auditing of sftp mkdir failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the argument token */
	event->adt_ft_mkdir.arg = (uint32_t)mode;
	event->adt_ft_mkdir.arg_id = 2;
	event->adt_ft_mkdir.arg_desc = "mode";
	/* fill the path token */
	event->adt_ft_mkdir.d_path = d_path;
	/* fill the attribute token */
	event->adt_ft_mkdir.d_attr = get_attrs(d_path, -1, AU_LSTAY);

	return (event);
}

adt_event_data_t *
audit_sftp_rmdir(char *d_path)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_rmdir);
	if (event == NULL) {
		fatal("Auditing of sftp rmdir failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_rmdir.f_path = d_path;
	/* fill the attribute token */
	event->adt_ft_rmdir.f_attr = get_attrs(d_path, -1, AU_LSTAY);

	return (event);
}

adt_event_data_t *
audit_sftp_symlink(char *f_from, char *f_to)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_symlink);
	if (event == NULL) {
		fatal("Auditing of sftp symlink failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill path tokens */
	event->adt_ft_symlink.src_path = f_from;
	event->adt_ft_symlink.dst_path = f_to;
	/* fill the attribute token */
	event->adt_ft_symlink.dst_attr = get_attrs(f_to, -1, AU_LSTAY);

	return (event);
}

adt_event_data_t *
audit_sftp_get(char *f_path, int fd)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_get);
	if (event == NULL) {
		fatal("Auditing of sftp get failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}

	/* fill the path token */
	event->adt_ft_get.f_path = f_path;
	/* fill the attribute token */
	event->adt_ft_get.f_attr = get_attrs(f_path, fd, AU_LFOLLOW);

	return (event);
}

adt_event_data_t *
audit_sftp_put(char *f_path, int fd)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_put);
	if (event == NULL) {
		fatal("Auditing of sftp put failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_put.f_path = f_path;
	/* fill the attribute token */
	event->adt_ft_put.f_attr = get_attrs(f_path, fd, AU_LFOLLOW);

	return (event);
}

adt_event_data_t *
audit_sftp_chown(char *f_path, int fd, uid_t uid, gid_t gid)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_chown);
	if (event == NULL) {
		fatal("Auditing of sftp chown failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_chown.f_path = f_path;
	/* fill the attribute token */
	event->adt_ft_chown.f_attr = get_attrs(f_path, fd, AU_LFOLLOW);
	/* fill argument tokens */
	event->adt_ft_chown.uid = (uint32_t)uid;
	event->adt_ft_chown.uid_id = 2;
	event->adt_ft_chown.uid_desc = "new file uid";
	event->adt_ft_chown.gid = (uint32_t)gid;
	event->adt_ft_chown.gid_id = 3;
	event->adt_ft_chown.gid_desc = "new file gid";

	return (event);
}

adt_event_data_t *
audit_sftp_chmod(char *f_path, int fd, mode_t mode)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_chmod);
	if (event == NULL) {
		fatal("Auditing of sftp chmod failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_chmod.f_path = f_path;
	/* fill the attribute token */
	event->adt_ft_chmod.f_attr = get_attrs(f_path, fd, AU_LFOLLOW);
	/* fill the argument token */
	event->adt_ft_chmod.mode = (uint32_t)mode;
	event->adt_ft_chmod.mode_id = 2;
	event->adt_ft_chmod.mode_desc = "new file mode";

	return (event);
}

adt_event_data_t *
audit_sftp_utimes(char *f_path, int fd)
{
	adt_event_data_t *event;

	event = adt_alloc_event(audit_session, ADT_ft_utimes);
	if (event == NULL) {
		fatal("Auditing of sftp utimes failed: %s (%s)",
		    strerror(errno), "could not allocate adt event");
	}
	/* fill the path token */
	event->adt_ft_chmod.f_path = f_path;
	/* fill the attribute token */
	event->adt_ft_chmod.f_attr = get_attrs(f_path, fd, AU_LFOLLOW);

	return (event);
}

static struct stat64 *
get_attrs(char *name, int fd, int follow_link)
{
	if (fd >= 0) {
		if (fstat64(fd, &attributes) != 0) {
			return (NULL);
		}
		return (&attributes);
	}
	if (name != NULL) {
		int ret;

		if (follow_link == AU_LFOLLOW) {
			ret = stat64(name, &attributes);
		} else {
			ret = lstat64(name, &attributes);
		}
		return ((ret == -1) ? NULL : &attributes);
	}
	return (NULL);
}
