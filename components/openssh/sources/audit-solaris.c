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
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates. All rights reserved.
 */

#include "includes.h"
#if defined(USE_SOLARIS_AUDIT)

#include "audit.h"
#include "sshkey.h"
#include "hostfile.h"
#include "auth.h"
#include "log.h"
#include "packet.h"

#include <errno.h>
#include <pwd.h>
#include <string.h>

#include <bsm/adt.h>
#include <bsm/adt_event.h>
#include <sys/types.h>
#include <unistd.h>

#include <security/pam_appl.h>

extern Authctxt *the_authctxt;

extern const char *audit_username(void);
extern const char *audit_event_lookup(ssh_audit_event_t);

static adt_session_data_t *ah = NULL;		/* audit session handle */
static adt_termid_t	*tid = NULL;		/* peer terminal id */

static void audit_login(void);
static void audit_logout(void);
static void audit_fail(int);

/* Below is the sshd audit API Solaris adt interpretation */

/*
 * Called after a connection has been accepted but before any authentication
 * has been attempted.
 */
/* ARGSUSED */
void
audit_connection_from(const char *host, int port)
{
	/* NOT IMPLEMENTED */
}

/*
 * Called when various events occur (see audit.h for a list of possible
 * events and what they mean).
 *
 *	Entry	the_authcntxt
 */
void
audit_event(struct ssh *ssh, ssh_audit_event_t event)
{
	static boolean_t logged_in = B_FALSE;	/* if user did login */
	int fail = PAM_IGNORE;		/* default unset */
	static boolean_t did_maxtries = B_FALSE; /* if interactive and abort */

	debug("adt audit_event(%s)", audit_event_lookup(event));
	
	switch (event) {
	case SSH_AUTH_SUCCESS:		/* authentication success */
		logged_in = B_TRUE;
		audit_login(); 		/* ADT_ssh; */
		return;

	case SSH_CONNECTION_CLOSE:	/* connection closed, all done */
		if (logged_in) {
			audit_logout();		/* ADT_logout; */
			logged_in = B_FALSE;
		} else {
			error("adt audit_event logout without login");
		}
		return;

	/* Translate fail events to Solaris PAM errors */

	/* auth2.c: userauth_finish as audit_event(SSH_LOGIN_EXCEED_MAXTRIES) */
	/* auth1.c:do_authloop audit_event(SSH_LOGIN_EXCEED_MAXTRIES) */
	case SSH_LOGIN_EXCEED_MAXTRIES:
		fail = PAM_MAXTRIES;
		did_maxtries = B_TRUE;
		break;

	/* auth2.c: userauth_finish as audit_event(SSH_LOGIN_ROOT_DENIED) */
	/* auth1.c:do_authloop audit_event(SSH_LOGIN_ROOT_DENIED) */
	case SSH_LOGIN_ROOT_DENIED:
		fail = PAM_PERM_DENIED;
		break;

	/* auth2.c: input_userauth_request as audit_event(SSH_INVALID_USER) */
	/* auth.c: getpwnamallow as audit_event(SSH_INVALID_USER) */
	case SSH_INVALID_USER:
		fail = PAM_USER_UNKNOWN;
		break;

	/* seems unused, but translate to the Solaris PAM error */
	case SSH_NOLOGIN:
		fail = PAM_LOGINS_DISABLED;
		break;

	/*
	 * auth.c in auth_log as it's walking through methods calls
	 * audit_classify_method(method) which maps
	 *
	 * none		-> SSH_AUTH_FAIL_NONE
	 * password	-> SSH_AUTH_FAIL_PASSWD
	 *
	 * publickey	-> SSH_AUTH_FAIL_PUBKEY
	 * rsa		-> SSH_AUTH_FAIL_PUBKEY
	 *
	 * keyboard-interactive	-> SSH_AUTH_FAIL_KBDINT
	 * challenge-response	-> SSH_AUTH_FAIL_KBDINT
	 *
	 * hostbased	-> SSH_AUTH_FAIL_HOSTBASED
	 * rhosts-rsa	-> SSH_AUTH_FAIL_HOSTBASED
	 *
	 * gssapi-with-mic	-> SSH_AUTH_FAIL_GSSAPI
	 *
	 * unknown method	-> SSH_AUDIT_UNKNOWN
	 */
	/*
	 * see mon_table mon_dispatch_proto20[], mon_dispatch_postauth20[],
	 * mon_dispatch_proto15[], mon_dispatch_postauth15[]:
	 * MONITOR_REQ_AUDIT_EVENT
	 * called from monitor.c:mm_answer_audit_event()
	 * SSH_AUTH_FAIL_PUBKEY, SSH_AUTH_FAIL_HOSTBASED,
	 * SSH_AUTH_FAIL_GSSAPI, SSH_LOGIN_EXCEED_MAXTRIES,
	 * SSH_LOGIN_ROOT_DENIED, SSH_CONNECTION_CLOSE SSH_INVALID_USER
	 * monitor_wrap.c: mm_audit_event()
	 */
	case SSH_AUTH_FAIL_NONE:	/* auth type none */
	case SSH_AUTH_FAIL_PUBKEY:	/* authtype publickey */
		break;

	case SSH_AUTH_FAIL_PASSWD:	/* auth type password */
	case SSH_AUTH_FAIL_KBDINT:	/* authtype keyboard-interactive */
	case SSH_AUTH_FAIL_HOSTBASED:	/* auth type hostbased */
	case SSH_AUTH_FAIL_GSSAPI:	/* auth type gssapi-with-mic */
	case SSH_AUDIT_UNKNOWN:		/* auth type unknown */
		fail = PAM_AUTH_ERR;
		break;

	/* sshd.c: cleanup_exit: server specific fatal cleanup */
	case SSH_CONNECTION_ABANDON:	/* bailing with fatal error */
		/*
		 * This seems to occur with OpenSSH client when
		 * the user login shell exits.
		 */
		if (logged_in) {
			audit_logout();		/* ADT_logout; */
			logged_in = B_FALSE;
			return;
		} else if (!did_maxtries) {
			fail = PAM_AUTHINFO_UNAVAIL;
		} else {
			/* reset saw max tries */
			did_maxtries = FALSE;
		}
		break;

	default:
		error("adt audit_event: unknown event %d", event);
		break;
	}
	audit_fail(fail);
}

/*
 * Called when a user session is started.  Argument is the tty allocated to
 * the session, or NULL if no tty was allocated.
 *
 * Note that this may be called multiple times if multiple sessions are used
 * within a single connection.
 */
/* ARGSUSED */
void
audit_session_open(struct logininfo *li)
{
	/* NOT IMPLEMENTED */
}

/*
 * Called when a user session is closed.  Argument is the tty allocated to
 * the session, or NULL if no tty was allocated.
 *
 * Note that this may be called multiple times if multiple sessions are used
 * within a single connection.
 */
/* ARGSUSED */
void
audit_session_close(struct logininfo *li)
{
	/* NOT IMPLEMENTED */
}

/*
 * This will be called when a user runs a non-interactive command.  Note that
 * it may be called multiple times for a single connection since SSH2 allows
 * multiple sessions within a single connection.
 */
/* ARGSUSED */
void
audit_run_command(const char *command)
{
	/* NOT IMPLEMENTED */
}

/*
 * audit_login - audit successful login
 *
 *	Entry	the_authctxt should be valid ;-)
 *		and pam_setcred called.
 *		adt_info &  ADT_INFO_PW_SUCCESS if successful
 *		password change.
 *
 *	Exit	ah = audit session established for audit_logout();
 */
static void
audit_login(void)
{
	adt_event_data_t *event;
	uid_t uid = ADT_NO_ATTRIB;
	gid_t gid = (gid_t)ADT_NO_ATTRIB;
	au_id_t	auid;

	if ((the_authctxt != NULL) && (the_authctxt->valid != 0)) {
		uid = the_authctxt->pw->pw_uid;
		gid = the_authctxt->pw->pw_gid;
	}

	if (adt_start_session(&ah, NULL, ADT_USE_PROC_DATA) != 0) {
		error("adt_start_session: %s", strerror(errno));
		return;
	}

	adt_get_auid(ah, &auid);

	if (adt_set_user(ah, uid, gid, uid, gid, NULL,
	    auid == AU_NOAUDITID ? ADT_NEW : ADT_USER)) {
		error("adt_set_user auid=%d, uid=%d", auid, uid);
		(void) adt_end_session(ah);
		ah = NULL;
		free(tid);
		tid = NULL;
		return;
	}
	if ((event = adt_alloc_event(ah, ADT_ssh)) == NULL) {
		error("adt_alloc_event(ADT_ssh): %s", strerror(errno));
		return;
	}
	if (adt_put_event(event, ADT_SUCCESS, ADT_SUCCESS) != 0) {
		error("adt_put_event(ADT_ssh, ADT_SUCCESS): %s",
		    strerror(errno));
	}
	/* should audit successful password change here */
	adt_free_event(event);
}

/*
 * audit_logout - audit the logout
 *
 *	Entry	ah = audit session.
 */
static void
audit_logout(void)
{
	adt_event_data_t *event;

	if ((event = adt_alloc_event(ah, ADT_logout)) == NULL) {
		error("adt_alloc_event(ADT_logout): %s", strerror(errno));
		return;
	}
	if (adt_put_event(event, ADT_SUCCESS, ADT_SUCCESS) != 0) {
		error("adt_put_event(ADT_logout, ADT_SUCCESS): %s",
		    strerror(errno));
	}
	adt_free_event(event);
	(void) adt_end_session(ah);
	ah = NULL;
	free(tid);
	tid = NULL;
}

/*
 * audit_fail - audit login failure.
 *
 *	Entry	the_authctxt assumed to have some info.
 *			user = user who asked to be authenticated.
 *		tid = connection audit TID set by audit_connect_from();
 *
 *	N.B.	pam_strerror() prototype takes a pam handle and error number.
 *		At least on Solaris, pam_strerror never uses the pam handle.
 *		Since there doesn't seem to be a pam handle available, this
 *		code just uses NULL.
 */
static void
audit_fail(int pamerr)
{
	adt_session_data_t *ah = NULL;
	adt_event_data_t *event;
	uid_t	uid = ADT_NO_ATTRIB;
	gid_t	gid = (gid_t)ADT_NO_ATTRIB;

	if (pamerr == PAM_IGNORE) {
		return;
	}
	if ((the_authctxt != NULL) && (the_authctxt->valid != 0)) {
		uid = the_authctxt->pw->pw_uid;
		gid = the_authctxt->pw->pw_gid;
	} else if ((the_authctxt != NULL) && (the_authctxt->user != NULL)) {
		struct passwd *pw;

		if ((pw = getpwnam(the_authctxt->user)) != NULL) {
			uid = pw->pw_uid;
			gid = pw->pw_gid;
		}
	}
	if (adt_start_session(&ah, NULL, 0) != 0) {
		error("adt_start_session(ADT_ssh, 0, fail=%s):"
		    " %s", pam_strerror(NULL, pamerr), strerror(errno));
		return;
	}
	if (adt_set_user(ah, uid, gid, uid, gid, tid, ADT_NEW) != 0) {
		error("adt_set_user(ADT_ssh, PROC_DATA, fail=%s): %s",
		    pam_strerror(NULL, pamerr), strerror(errno));
		goto done;
	}
	if ((event = adt_alloc_event(ah, ADT_ssh)) == NULL) {
		error("adt_alloc_event(ADT_ssh, fail=%s): %s",
		    pam_strerror(NULL, pamerr), strerror(errno));
	
	} else if (adt_put_event(event, ADT_FAILURE,
	    ADT_FAIL_PAM + pamerr) != 0) {
		error("adt_put_event(ADT_ssh, fail=%s): %s",
		    pam_strerror(NULL, pamerr), strerror(errno));
	}
	/* should audit authentication with failed password change here. */
	adt_free_event(event);
done:
	(void) adt_end_session(ah);
}
#endif	/* USE_SOLARIS_AUDIT */
