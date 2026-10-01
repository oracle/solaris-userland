/*
 * CDDL HEADER START
 *
 * The contents of this file are subject to the terms of the
 * Common Development and Distribution License (the "License").
 * You may not use this file except in compliance with the License.
 *
 * You can obtain a copy of the license at LICENSE.txt
 * or https://oss.oracle.com/licenses/.
 * See the License for the specific language governing permissions
 * and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL HEADER in each
 * file and include the License file at LICENSE.txt.
 * If applicable, add the following below this CDDL HEADER, with the
 * fields enclosed by brackets "[]" replaced with your own identifying
 * information: Portions Copyright [yyyy] [name of copyright owner]
 *
 * CDDL HEADER END
 */

/*
 * Copyright (c) 2009, 2026, Oracle and/or its affiliates.
 */

#include <stdio.h>
#include <stdlib.h>
#include <auth_attr.h>
#include <secdb.h>
#include <pwd.h>
#include <unistd.h>
#include <sysexits.h>
#include <errno.h>
#include <auth_list.h>

#define	_PATH_SENDMAIL_BIN	"/usr/lib/sendmail"

int
main(int argc, char *argv[], char *envp[])
{
	struct passwd *pw = getpwuid(getuid());
	char **newargv;
	int j;

	if (pw && chkauthattr(MAILQ_AUTH, pw->pw_name)) {
		/* The extra 2 is 1 for the "-bp" + 1 for the terminator. */
		newargv = (char **)malloc((argc + 2) * sizeof (char *));
		if (newargv == NULL)
			exit(EX_UNAVAILABLE);
		newargv[0] = _PATH_SENDMAIL_BIN;
		newargv[1] = "-bp";
		for (j = 1; j <= argc; j++)
			newargv[j + 1] = argv[j];
		(void) execve(_PATH_SENDMAIL_BIN, newargv, envp);
		perror("Cannot exec " _PATH_SENDMAIL_BIN);
		exit(EX_OSERR);
	}
	(void) fputs("No authorization to run mailq; "
	    "see mailq(1) for details.\n", stderr);
	return (EX_NOPERM);
}
