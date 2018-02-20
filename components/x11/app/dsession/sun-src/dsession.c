/*
 * Copyright (c) 2014, 2015, Oracle and/or its affiliates. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files(the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice(including the next
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

#include <sys/stat.h>
#include <sys/shm.h>
#include <sys/ipc.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <errno.h>
#include <dirent.h>
#include <synch.h>
#include <signal.h>
#include <libgen.h>
#include <X11/Xos.h>
#include "pciaccess.h"
#include "xorg/xf86Pci.h"


#define MAX_DISP_DEV	8
#define IS_VGA(c) \
	(((c) & 0x00ffff00) \
	== ((PCI_CLASS_DISPLAY << 16) | (PCI_SUBCLASS_DISPLAY_VGA << 8)))
#define RETRY_COUNT	30
#define ALL		255
#define MAX_EARGC	8
#define FTOK_FILE	"/usr/lib/ConsoleKit/dsession"
#define FTOK_ID		'H'
#define SESSION_SIZE	64
#define TYPE_SIZE	16

typedef struct {
	char	session_id[SESSION_SIZE];
	Bool	open;
	char	busid[64];
	char	dev_path[PATH_MAX];
	int	display;
	char	status[TYPE_SIZE];
	char	usr_session[SESSION_SIZE];
	pid_t	server_pid;
} dsession_mgr_t;

typedef struct {
	char	session_id[SESSION_SIZE];
	Bool	open;
	int	display;
	char	session_type[TYPE_SIZE];
	char	display_type[TYPE_SIZE];
} ck_session_t;

typedef struct {
	dsession_mgr_t	dsession_table[MAX_DISP_DEV];
	mutex_t		lock;
} shared_mem_t;

static struct pci_device_iterator * iter;
static struct pci_device * dev;
static struct sol_device_private {
	    struct pci_device	base;
	    const char		*device_string;
	};
#define DEV_PATH(dev)	(((struct sol_device_private *) dev)->device_string)

static char 		*program_name;
static dsession_mgr_t	dsession_mgr_table[MAX_DISP_DEV];
static int		disp_num = 0;
static ck_session_t	ck_sessions[MAX_DISP_DEV * 2];
static int   		num_sessions = 0;
static char		device[PATH_MAX];
static void		*shm_addr = NULL;
static key_t		shm_key;
static int		shmid;
static Bool		debug = FALSE;

#define lock		(((shared_mem_t *) shm_addr)->lock)
#define shm_table	(((shared_mem_t *) shm_addr)->dsession_table)


static Bool
cmd_exec(char *cmd, char *output, size_t size)
{
    pid_t pid;
    int   p_fd[2];
    char  *token;
    char  string[MAX_EARGC + 1][64];
    char  *eargv[MAX_EARGC + 1];
    int   i;

    if (debug)
	printf("run cmd: %s\n", cmd);

    /* parse cmd */
    memset(eargv, 0, sizeof (eargv));
    i = -1;

    token = strtok(cmd, " ");

    /* walk through other tokens */
    while (token != NULL) {
	if (++i == MAX_EARGC) {
	    fprintf(stderr, "cmd_exec: arguments exceed limit\n");

	    return FALSE;
	}

	strlcpy(string[i], token, sizeof (string[i]));
	eargv[i] = string[i];

	token = strtok(NULL, " ");
    }

    if (i == -1) {
	fprintf(stderr, "cmd_exec: cmd parsing error\n");

	return FALSE;
    }

    if (pipe(p_fd) != 0) {
	fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
	perror("unable to pipe");

	return FALSE;
    }

    if ((pid = fork()) == -1) {
	fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
	perror("can not fork");

	close(p_fd[0]);
	close(p_fd[1]);

	return FALSE;

    } else if (pid == 0) {
	/* child process */
	close(p_fd[0]);

	if (p_fd[1] != 1) {
	    if (dup2(p_fd[1], 1) < 0) {
		fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
		perror("child failed to reopen stdout");

		return FALSE;
	    }

	    close(p_fd[1]);
	}

	execv(eargv[0], eargv);

	fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
	perror("fail to exec"); 	/* shouldn't be reached */

	_exit(1);

    } else {
	/* parent process */
	FILE  *fd;
	Bool  done = FALSE;
	char  *buf;
	int   status;
	int   len;

	close(p_fd[1]);
	fd = fdopen(p_fd[0], "r");

	if (output && (size > 0)) {
	    buf = malloc(size);

	    while (fgets(buf, size, fd) != NULL) {
		/* only need one line from read */
		if (!done) {
		    strlcpy(output, buf, size);
		    done = TRUE;
		}
	    }

	    if ((len = strlen(output)) > 0) {
		if (output[len - 1] == '\n')
		    output[len - 1] = 0;

		else
		    output[len] = 0;
	    }

	} else {
	    buf = malloc(256);

	    while (fgets(buf, 256, fd) != NULL);
	}

	free(buf);

	fclose(fd);

	if (waitpid(pid, &status, 0) != pid) {
	    fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
	    perror("error waiting for child process");

	    return FALSE;

	} else if (WIFSIGNALED(status)) {
	    fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
	    fprintf(stderr, "child exited with signal %d\n",
		    WTERMSIG(status));

	    return FALSE;

	} else if (WIFEXITED(status) && (WEXITSTATUS(status) == 0)) {
	    return TRUE;

	} else {
	    fprintf(stderr, "cmd_exec command %s: ", eargv[0]);
	    fprintf(stderr, "child exited abnormally\n");

	    return FALSE;
	}
    }
}

static void
get_dsession_mgr_table(void)
{
    int i;

    memcpy(dsession_mgr_table, shm_table, sizeof (dsession_mgr_table));

    for (i = 0; i < MAX_DISP_DEV; i++) {
	if (!dsession_mgr_table[i].dev_path[0])
	    break;
    }

    if (i == 0)
	printf("warning: no entry in dsession table\n");

    disp_num = i;
}


static void
print_mgr_table_entry(int index)
{
    printf("%s:\n", dsession_mgr_table[index].session_id);

    if (dsession_mgr_table[index].open)
	printf("\topen = %s\n", "TRUE");

    else
	printf("\topen = %s\n", "FALSE");

    if (dsession_mgr_table[index].busid[0])
	printf("\tbusid = %s\n", dsession_mgr_table[index].busid);

    else
	printf("\tbusid = %s\n", "NULL");

    if (dsession_mgr_table[index].dev_path[0])
	printf("\tdev_path = %s\n", dsession_mgr_table[index].dev_path);

    else
	printf("\tdev_path = %s\n", "NULL");

    if (dsession_mgr_table[index].display == -1)
	printf("\tdisplay = :\n");

    else
	printf("\tdisplay = :%d\n", dsession_mgr_table[index].display);

    if (dsession_mgr_table[index].status[0])
	printf("\tstatus = %s\n", dsession_mgr_table[index].status);

    else
	printf("\tstatus = %s\n", "UNKNOWN");

    if (dsession_mgr_table[index].usr_session[0])
	printf("\tuser_session_id = %s\n",
		dsession_mgr_table[index].usr_session);

    fflush(stdout);
}

static Bool
print_mgr_table(Bool all)
{
    int  i;

    if (all) {
	for (i = 0; i < disp_num; i++)
	    print_mgr_table_entry(i);

    } else {
	for (i = 0; i < disp_num; i++) {
	    if (strcmp(dsession_mgr_table[i].dev_path, device) == 0)
		break;
	}

	if (i != disp_num)
	    print_mgr_table_entry(i);

	else {
	    fprintf(stderr, "device not in the table\n");

	    return FALSE;
	}
    }

    return TRUE;
}

static int
get_sessions(char *session)
{
    pid_t  pid;
    int    p_fd[2];

    if (pipe(p_fd) != 0) {
	perror("get_sessions: unable to pipe");

	return -1;
    }

    if ((pid = fork()) == -1) {
	perror("get_sessions: can not fork");

	close(p_fd[0]);
	close(p_fd[1]);

	return -1;

    } else if (pid == 0) {
	/* child process */
	close(p_fd[0]);

	if (p_fd[1] != 1) {
	    if (dup2(p_fd[1], 1) < 0) {
		perror("get_sessions: child failed to reopen stdout");

		return -1;
	    }

	    close(p_fd[1]);
	}

	if (strcmp(session, "all") == 0)
	    execl("/usr/bin/ck-list-sessions", "ck-list-sessions", "-a",
		    NULL);

	else
	    execl("/usr/bin/ck-list-sessions", "ck-list-sessions", "-s",
		    session, NULL);

	perror("get_sessions: fail to exec"); 	/* shouldn't be reached */

	_exit(1);

    } else {
	/* parent process */
	FILE  *fd;
	char  buf[BUFSIZ];
	int   session_num;
	int   status;
	Bool  discard = FALSE;
	Bool  ret = TRUE;

	close(p_fd[1]);
	fd = fdopen(p_fd[0], "r");
	session_num = -1;

	memset(ck_sessions, 0, sizeof (ck_sessions));

	while (fgets(buf, BUFSIZ, fd) != NULL) {
	    size_t  bufsize = strlen(buf);

	    if (discard)
		continue;

	    if (buf[0] != '\t') {
		/* session id */
		if (++session_num > (MAX_DISP_DEV * 2 - 1)) {
		    fprintf(stderr, "max session number exceeded.\n");

		    discard = TRUE;
		    ret = FALSE;

		    continue;
		}

		if (bufsize && (buf[bufsize - 1] == '\n')) {
		    buf[bufsize - 1] = 0;
		    bufsize--;
		}

		if (bufsize && (buf[bufsize - 1] == ':'))
		    buf[bufsize - 1] = 0;

		strlcpy(ck_sessions[session_num].session_id, buf,
			SESSION_SIZE);

	    } else {
		/* session body */
		if (bufsize && (buf[bufsize - 1] == '\n'))
		    buf[bufsize - 1] = 0;

		if (strncmp(buf, "\topen = ", sizeof ("\topen = ") - 1) == 0) {
		    if (strncmp(&buf[sizeof ("\topen = ") - 1], "'TRUE'",
			    sizeof ("'TRUE'") - 1) == 0)
			ck_sessions[session_num].open = TRUE;

		    else if (strncmp(&buf[sizeof ("\topen = ") - 1], "'FALSE'",
			    sizeof ("'FALSE'") - 1) == 0)
			ck_sessions[session_num].open = FALSE;

		} else if (strncmp(buf, "\tx11-display = ",
			sizeof ("\tx11-display = ") - 1) == 0) {
		    int disp;

		    if (strncmp(&buf[sizeof ("\tx11-display = ") - 1], "''",
			    sizeof ("''") - 1) == 0)
			ck_sessions[session_num].display = -1;

		    else {
		        if (sscanf(buf, "\tx11-display = ':%d'",
				&disp) == 1)
			    ck_sessions[session_num].display = disp;
		    }

		} else if (strncmp(buf, "\tsession-type = ",
			sizeof ("\tsession-type = ") - 1) == 0) {
		    char type[TYPE_SIZE];

		    if (strncmp(&buf[sizeof ("\tsession-type = ") - 1], "''",
			    sizeof ("''") - 1) == 0)
			ck_sessions[session_num].session_type[0] = 0;

		    else {
			if (sscanf(buf, "\tsession-type = '%16[^']",
				type) == 1)
			    strlcpy(ck_sessions[session_num].session_type,
				    type, TYPE_SIZE);
		    }

		} else if (strncmp(buf, "\tdisplay-type = ",
			sizeof ("\tdisplay-type = ") - 1) == 0) {
		    char type[TYPE_SIZE];

		    if (strncmp(&buf[sizeof ("\tdisplay-type = ") - 1], "''",
			    sizeof ("''") - 1) == 0)
			ck_sessions[session_num].display_type[0] = 0;

		    else {
			if (sscanf(buf, "\tdisplay-type = '%16[^']",
				type) == 1)
			    strlcpy(ck_sessions[session_num].display_type,
				    type, TYPE_SIZE);
		    }

		} else
		    /* ignore */
		    continue;
	    }
	}

	fclose(fd);

	if (waitpid(pid, &status, 0) != pid) {
	    perror("get_sessions: error waiting for child process");

	    return -1;

	} else if (WIFSIGNALED(status)) {
	    fprintf(stderr, "get_sessions: child exited with signal %d\n",
		    WTERMSIG(status));

            return -1;

	} else if (WIFEXITED(status) && (WEXITSTATUS(status) == 0)) {
	    if (ret) {
		if (debug) {
		    if (strcmp(session, "all") == 0)
			printf("get_sessions(all): %d sessions found\n",
				session_num + 1);
		    else
			printf("get_sessions(single): %d sessions found\n",
				session_num + 1);
		}

	 	return session_num + 1;

	    } else
		return -1;

	} else {
	    fprintf(stderr, "get_sessions: child exited abnormally\n");

	    return -1;

	}
    }
}

static int
find_session_in_list(char *session_id)
{
    int i;

    if (!session_id)
	return -1;

    for (i = 0; i < num_sessions; i++) {
	if (strcmp(ck_sessions[i].session_id, session_id) == 0)
	    return i;
    }

    return -1;
}


static Bool
probe_and_print_dev(void)
{
    if (pci_system_init() != 0) {
	fprintf(stderr, "can't do pci system init\n");

	return FALSE;
    }

    iter = pci_slot_match_iterator_create(NULL);

    while ((dev = pci_device_next(iter)) != NULL) {
	pci_device_probe(dev);

	if (IS_VGA(dev->device_class)) {
	    if (DEV_PATH(dev))
		printf("/devices%s\n", DEV_PATH(dev));

	}
    }

    pci_iterator_destroy(iter);
    pci_system_cleanup();

    return TRUE;
}

static Bool
set_server_pid(int i)
{
    char  output[16];
    long  pid;
    char  display[8];

    if (dsession_mgr_table[i].display != -1)
	snprintf(display, sizeof (display), ":%d",
		dsession_mgr_table[i].display);

    else
	return FALSE;

    setenv("DISPLAY", display, 1);

    memset(output, 0, sizeof (output));

    if (cmd_exec("/usr/lib/ck-get-x11-server-pid", output,
	    sizeof (output)) && output[0]) {
	if (sscanf(output, "%ld", &pid) == 1) {
	    dsession_mgr_table[i].server_pid = (pid_t) pid;

	    if (debug)
		printf("server pid %ld set for display :%d\n",
			(long) dsession_mgr_table[i].server_pid,
			dsession_mgr_table[i].display);

	    return TRUE;

	} else
	    return FALSE;
    }

    return FALSE;
}

static Bool
verify_and_set(char *type, int index)
{

    Bool verified = FALSE;
    int  count = 0;
    Bool allsessions;
    int  i, j;
    char *session_id;

    if (index == ALL)
	/* called from init() or fini() */
	allsessions = TRUE;

    else {
	allsessions = FALSE;
	session_id = dsession_mgr_table[index].session_id;
    }

    if (strcmp(type, "delete") == 0) {
	while (!verified && (count++ < RETRY_COUNT)) {
	    Bool   no_server_pid = FALSE;

	    usleep(2000000);
	    if (allsessions) {
		/* delete all sessions, only when called from fini() */
		if ((num_sessions = get_sessions("all")) == -1)
		    return FALSE;

		verified = TRUE;

		for (i = 0; i < disp_num; i++) {
		    pid_t server_pid = dsession_mgr_table[i].server_pid;

		    if (strcmp(dsession_mgr_table[i].session_id, "Deleted")
			    != 0) {
			if ((find_session_in_list(
				dsession_mgr_table[i].session_id)) == -1) {
			    /*
			     * session closed, also need to verify server
			     * termination before exiting
			     */
			    if (server_pid != -1) {
				if (kill(server_pid, 0)) {
				    if (debug)
					printf("server %ld terminated\n",
						(long) server_pid);

				} else
				    verified = FALSE;

			    } else
				no_server_pid = TRUE;

			    if (verified) {
			        dsession_mgr_table[i].open = FALSE;

			        strlcpy(dsession_mgr_table[i].session_id,
					"Deleted", SESSION_SIZE);
			        strlcpy(dsession_mgr_table[i].status,
					"REMOVED", TYPE_SIZE);
			    }

			} else {
			    verified = FALSE;

			    if (count == (RETRY_COUNT - 5) &&
				    (server_pid != -1)) {

				errno = 0;
				if ((kill(server_pid, SIGTERM) == -1) &&
					(errno != ESRCH))
				    perror("kill server failed");

				else if (debug)
				    printf("server %ld killed\n",
					    (long) server_pid);
			    }
			}
		    }
		}

		if (verified && no_server_pid)
		    /*
		     * add a delay if server's termination cannot be
		     * verified
		     */
		    usleep(4000000);

	    } else {
		/* delete single session */
		pid_t server_pid = dsession_mgr_table[index].server_pid;

		if (get_sessions(session_id) == 0) {
		    /*
		     * session closed, also need to verify server
		     * termination before exiting
		     */
		    if (server_pid != -1) {
			if (kill(server_pid, 0)) {
			    if (debug)
				printf("server %ld terminated\n",
					(long) server_pid);

			    verified = TRUE;
			}

		    } else  {
		        /*
			 * add a delay if server's termination cannot be
			 * verified
			 */
			usleep(4000000);
			verified = TRUE;
		    }

		    if (verified) {
			dsession_mgr_table[index].open = FALSE;

			strlcpy(dsession_mgr_table[index].session_id,
				"Deleted", SESSION_SIZE);
			strlcpy(dsession_mgr_table[index].status,
				"REMOVED", TYPE_SIZE);

			memcpy(&shm_table[index],
				&dsession_mgr_table[index],
				sizeof (dsession_mgr_t));
		    }

		} else {
		    if (count == (RETRY_COUNT - 5) &&
			    (server_pid != -1)) {

			errno = 0;
			if ((kill(server_pid, SIGTERM) == -1) &&
				(errno != ESRCH))
			    perror("kill server failed");

			else if (debug)
			    printf("server %ld killed\n",
				    (long) server_pid);
		    }
		}
	    }
	}

    } else if (strcmp(type, "add") == 0) {
	do {
	    usleep(2000000);

	    if (allsessions) {
		/* add all sessions, only when called from init() */
		if ((num_sessions = get_sessions("all")) == -1)
		    return FALSE;

		verified = TRUE;

		for (i = 0; i < disp_num; i++) {
		    if ((j = find_session_in_list(
			    dsession_mgr_table[i].session_id)) != -1) {
			if ((!ck_sessions[j].open) ||
				(ck_sessions[j].display == -1))
			    verified = FALSE;

		    } else
			verified = FALSE;
		}

	    } else {
		/* add single session */
		i = get_sessions(session_id);

		if ((i == 1) && ck_sessions[0].open &&
			(ck_sessions[0].display != -1))
		    verified = TRUE;
	    }
	} while (!verified && (count++ < RETRY_COUNT));

	if (allsessions) {
	    /* add all sessions */
	    for (i = 0; i < disp_num; i++) {
		if ((j = find_session_in_list(
			dsession_mgr_table[i].session_id)) != -1) {
		    /* consolekit session was created */
		    dsession_mgr_table[i].open = ck_sessions[j].open;

		    if (dsession_mgr_table[i].open) {
			dsession_mgr_table[i].display = ck_sessions[j].display;
			strlcpy(dsession_mgr_table[i].status,
				"UP", TYPE_SIZE);

			if (!set_server_pid(i)) {
			    dsession_mgr_table[i].server_pid = -1;
			    fprintf(stderr, "set server pid failed for :%d\n",
				    dsession_mgr_table[i].display);
			}

		    } else {
			strlcpy(dsession_mgr_table[i].status,
				"FAILURE", TYPE_SIZE);
			fprintf(stderr, "added %s not verified\n",
				dsession_mgr_table[i].session_id);
		    }

		} else
		    fprintf(stderr, "dsession %s not added\n",
			    dsession_mgr_table[i].session_id);
	    }

	} else {
	    /* Add single session */
	    if ((i == 1) && (strcmp(ck_sessions[0].session_id, session_id)
		    == 0)) {
		/* consolekit session was created */
		dsession_mgr_table[index].open = ck_sessions[0].open;

		if (dsession_mgr_table[index].open) {
		    dsession_mgr_table[index].display = ck_sessions[0].display;
		    strlcpy(dsession_mgr_table[index].status,
			    "UP", TYPE_SIZE);

		    if (!set_server_pid(index)) {
			dsession_mgr_table[index].server_pid = -1;

			fprintf(stderr, "set server pid failed for :%d\n",
		  		dsession_mgr_table[index].display);
		    }

		} else
		    strlcpy(dsession_mgr_table[index].status,
			    "FAILURE", TYPE_SIZE);

		memcpy(&shm_table[index], &dsession_mgr_table[index],
			sizeof (dsession_mgr_t));
	    }
	}
    }

    return verified;

}

static int
delete_session(void)
{
    int  i;
    char cmd[128];

    for (i = 0; i < disp_num; i++) {
	if (strcmp(dsession_mgr_table[i].dev_path, device) == 0) {
	    break;
	}
    }

    if (i == disp_num) {
	fprintf(stderr, "invalid device path: %s\n", device);
	return -1;
    }

    if ((!dsession_mgr_table[i].session_id[0]) ||
	    (get_sessions(dsession_mgr_table[i].session_id) == 0)) {
	/*
	 * no valid session id in mgr table, this is abnormal.
	 * try to work around.
	 */
	if (dsession_mgr_table[i].display != -1) {
	    int j;

	    if ((num_sessions = get_sessions("all")) == -1)
		return -1;

	    for (j = 0; j < num_sessions; j++) {
		if (ck_sessions[j].display == dsession_mgr_table[i].display) {
		    strlcpy(dsession_mgr_table[i].session_id,
			    ck_sessions[j].session_id, SESSION_SIZE);

		    break;
		}
	    }
	}

	if (strcmp(dsession_mgr_table[i].session_id, "Deleted") == 0) {
	    /* session already deleted */
	    printf("dsession for device %s already deleted\n",
		    basename(device));

	    return i;
	}
    }

    if (!dsession_mgr_table[i].open &&
	    (strcmp(dsession_mgr_table[i].status, "TRANSFERRED") == 0) &&
	    dsession_mgr_table[i].usr_session[0]) {
	/* has a user session for it, delete it first */
	printf("warning: you are deleting a user session\n");

	snprintf(cmd, sizeof (cmd),
		"/usr/sbin/ck-seat-tool --delete --session-id=%s",
		dsession_mgr_table[i].usr_session);

	if (cmd_exec(cmd, NULL, 0)) {
	    dsession_mgr_table[i].usr_session[0] = 0;

	    printf("user session %s deleted\n",
		    dsession_mgr_table[i].usr_session);
	}
    }

    snprintf(cmd, sizeof (cmd),
	    "/usr/sbin/ck-seat-tool --delete --session-id=%s",
	    dsession_mgr_table[i].session_id);

    if (cmd_exec(cmd, NULL, 0)) {
	printf("%s for device %s deleted\n", dsession_mgr_table[i].session_id,
		basename(device));

	return i;

    } else {
	fprintf(stderr, "%s for device %s not deleted\n",
		dsession_mgr_table[i].session_id, basename(device));

	return -1;
    }
}

static int
add_session(Bool init, int entry)
{
    int    index;
    char   cmd[256];
    char   output[64];
    int    display;

    if (init) {
	/* called from init() */
	index = entry;

	/* avoid using display :0 */
	display = index + 1;

    } else {
	Bool found = FALSE;

	for (index = 0; index < disp_num; index++) {
	    if (strcmp(dsession_mgr_table[index].dev_path, device) == 0)
		break;
	}

	if (index < disp_num) {
	    /* add session on existing device */
	    if (dsession_mgr_table[index].session_id[0] &&
		    (strcmp(dsession_mgr_table[index].session_id, "Deleted")
		    != 0)) {
		printf("session for device already running - not added\n");

		return -1;
	    }

	   /*
	    * check to see if a ck session already running on
	    * the same display. this could happen when previous
	    * verify_and_set() got interrupted .
	    */
	    if (dsession_mgr_table[index].display != -1) {
		int i;

		if ((num_sessions = get_sessions("all")) == -1)
			return -1;

		for (i = 0; i < num_sessions; i++) {
		    if (ck_sessions[i].display ==
			    dsession_mgr_table[index].display) {
              		strlcpy(dsession_mgr_table[index].session_id,
				ck_sessions[i].session_id, SESSION_SIZE);

			printf("%s for device %s restored in table\n",
				dsession_mgr_table[index].session_id,
				basename(dsession_mgr_table[index].dev_path));

            		break;
		    }
                }

		if (i < num_sessions)
		    return index;
            }

	} else if (disp_num == MAX_DISP_DEV) {
	    /* index == disp_num, and adding a new session */
	    fprintf(stderr, "add session: too many devices\n");

	    return -1;
	}

	/*
         * unless called from init(), always need a re-probe, as the numbering
	 * of root complex may have changed. So table's busid needs update if
         * the device already exits in the table.
         */
	if (pci_system_init() != 0) {
	    fprintf(stderr, "can't do pci system init\n");

	    return -1;
	}

	iter = pci_slot_match_iterator_create(NULL);

	while ((dev = pci_device_next(iter)) != NULL) {
	    char dev_path[PATH_MAX];

	    if (IS_VGA(dev->device_class)) {
		pci_device_probe(dev);

		if (DEV_PATH(dev))
		    snprintf(dev_path, PATH_MAX,
			    "/devices%s", DEV_PATH(dev));
		else
		    continue;

		if (strcmp(device, dev_path) == 0) {
		    snprintf(dsession_mgr_table[index].busid,
			    sizeof (dsession_mgr_table[index].busid),
			    "PCI:%d:%d:%d", dev->domain << 8 | dev->bus,
			    dev->dev, dev->func);

		    if (index < disp_num) {
			if ((display = dsession_mgr_table[index].display)
				== -1)
			    display = index + 1;

		    } else {
			/* add a session for new device */
			strlcpy(dsession_mgr_table[index].dev_path, dev_path,
				PATH_MAX);

			dsession_mgr_table[index].display = -1;
			dsession_mgr_table[index].server_pid = -1;

			disp_num++;
			display = index + 1;
		    }

		    found = TRUE;

		    break;
		}

	    }
	}

	pci_iterator_destroy(iter);
	pci_system_cleanup();

	if (!found) {
	    fprintf(stderr, "cannot find device %s in probe\n", device);

	    return -1;
	}
    }

    /* prepare command */
    snprintf(cmd, sizeof (cmd),
	    "/usr/sbin/ck-seat-tool -a --session-type=LoginWindow"
	    " --display-type=HotPlug --seat-id=StaticSeat1"
	    " display=:%d busid=%s",
	    display, dsession_mgr_table[index].busid);

    memset(output, 0, sizeof (output));

    /* run command */
    if (cmd_exec(cmd, output, sizeof (output)) && output[0]) {
	printf("%s for device %s added\n", output,
		basename(dsession_mgr_table[index].dev_path));

	strlcpy(dsession_mgr_table[index].session_id, output,
		SESSION_SIZE);

	return index;

    } else {
	fprintf(stderr, "dsession for device %s not added\n",
		basename(dsession_mgr_table[index].dev_path));

	return -1;
    }
}

static Bool
restart_session(void)
{
    int i;

    if ((i = delete_session()) == -1) {
	fprintf(stderr, "failed to delete dsession for %s\n",
		basename(device));

	return FALSE;

    } else {
	if (!verify_and_set("delete", i)) {
	    fprintf(stderr, "deleted dsession can't be verified,"
		    "restart failed\n");

	    return FALSE;

	} else {
	    printf("deleted dsession verified\n");

	    if ((i = add_session(FALSE, 0)) == -1) {
		fprintf(stderr, "failed to add dsession for %s\n",
			basename(device));

		return FALSE;

	    } else {
		if (!verify_and_set("add", i)) {
		    fprintf(stderr, "added dsession can't be verified\n");

		    return FALSE;

		} else {
		    printf("added dsession %s verified\n",
			    dsession_mgr_table[i].session_id);
		}
	    }
	}
    }

    return TRUE;
}

static Bool
sync_sessions(void)
{
    int   i, j, k;
    Bool  ret = TRUE;
    Bool  ck_session_changed = FALSE;

    if ((num_sessions = get_sessions("all")) == -1)
	return FALSE;

    for (j = 0; j < num_sessions; j++) {
	if ((strncmp(ck_sessions[j].session_type, "LoginWindow",
		sizeof ("LoginWindow") - 1) == 0) &&
		(strncmp(ck_sessions[j].display_type, "HotPlug",
		sizeof ("HotPlug") - 1) == 0) &&
		ck_sessions[j].open == FALSE) {
	    /* handle closed sessions */
	    int   display = -1;

	    for (i = 0; i < disp_num; i++) {
		if (strcmp(dsession_mgr_table[i].session_id,
			ck_sessions[j].session_id) == 0) {
		    display = dsession_mgr_table[i].display;

		    break;
		}
	    }

	    if (display != -1) {
		/* found a session in mgr table with valid display */
		for (k = 0; k < num_sessions; k++) {
		    if ((strncmp(ck_sessions[k].session_type, "LoginWindow",
			    sizeof ("LoginWindow") - 1) != 0) &&
			    (display == ck_sessions[k].display)) {
			/*
			 * found user session (type is not "LoginWindow")
			 * with same display. update mgr table
			 */
			if (strncmp(dsession_mgr_table[i].status, "TRANSFERRED",
				sizeof ("TRANSFERRED") - 1) != 0) {
			    strlcpy(dsession_mgr_table[i].status,
				    "TRANSFERRED", TYPE_SIZE);
			    dsession_mgr_table[i].open = FALSE;

			    strlcpy(dsession_mgr_table[i].usr_session,
				    ck_sessions[k].session_id,
				    SESSION_SIZE);

			    memcpy(&shm_table[i], &dsession_mgr_table[i],
				    sizeof (dsession_mgr_t));

			    if (debug)
				printf("session %s updated in sync\n",
					dsession_mgr_table[i].session_id);
			}

			break;
		    }
		}

	    } else {
		/* not a transferred session, delete it as it's closed */
		char cmd[128];

		snprintf(cmd, sizeof (cmd),
			"/usr/sbin/ck-seat-tool --delete --session-id=%s",
			ck_sessions[j].session_id);

		if (cmd_exec(cmd, NULL, 0)) {
		    if (debug)
			printf("session %s deleted in sync\n",
				ck_sessions[j].session_id);

		    ck_session_changed = TRUE;

		} else
		    ret = FALSE;

		if (i < disp_num) {
		    /* session in mgr table, need to update entry */
		    strlcpy(dsession_mgr_table[i].session_id,
			    "Deleted", SESSION_SIZE);
		    strlcpy(dsession_mgr_table[i].status,
			    "REMOVED", TYPE_SIZE);

		    memcpy(&shm_table[i], &dsession_mgr_table[i],
			    sizeof (dsession_mgr_t));
		}
	    }
	}
    }

    if ((ck_session_changed) && ((num_sessions = get_sessions("all")) == -1))
	ret = FALSE;

    for (i = 0; i < disp_num; i++) {
	if (strcmp(dsession_mgr_table[i].status, "TRANSFERRED") == 0) {
	    for (j = 0; j < num_sessions; j++) {
		if ((strcmp(dsession_mgr_table[i].session_id,
			ck_sessions[j].session_id) == 0) &&
			ck_sessions[j].open &&
			find_session_in_list(dsession_mgr_table[i].usr_session)
			== -1) {
		    /*
		     * corresponding session in ck table becomes open and
		     * the user session does not exist any more
		     */
		    strlcpy(dsession_mgr_table[i].status, "UP",
			    TYPE_SIZE);

		    dsession_mgr_table[i].open = TRUE;
		    dsession_mgr_table[i].usr_session[0] = 0;

	    	    memcpy(&shm_table[i], &dsession_mgr_table[i],
		    	    sizeof (dsession_mgr_t));

		    if (debug)
			printf("session %s updated in sync\n",
				dsession_mgr_table[i].session_id);

		    break;
		}
	    }
	}
    }

    if (ret && debug)
	printf("sync sessions done\n");

    return ret;
}

static Bool
fini(void)
{
    int i;

    if ((shmid = shmget(shm_key, sizeof (shared_mem_t),
	    IPC_ALLOC)) == -1) {
	perror("shared memory get error");

	return FALSE;
    }

    if ((shm_addr = (char *) shmat(shmid,
	    (void *) NULL, 0)) == (void *) -1) {
	perror("shared memory attach error");

	return FALSE;
    }

    mutex_lock(&lock);

    get_dsession_mgr_table();

    if (!sync_sessions())
	fprintf(stderr, "warning: sync sessions partially failed\n");

    for (i = 0; i < disp_num; i++) {
	if (dsession_mgr_table[i].dev_path[0]) {
	    strlcpy(device, dsession_mgr_table[i].dev_path, PATH_MAX);

	    if (delete_session() == -1)
	    	fprintf(stderr, "failed to delete dsession for %s\n",
			basename(device));
	}
    }

    /* verify sessions just deleted */
    if (debug)
	printf("verifying the deleted dsessions ...\n");

    if (verify_and_set("delete", ALL))
	printf("deleted dsessions all verified\n");

    else
	fprintf(stderr, "deleted dsessions not verified\n");

    memcpy(shm_table, dsession_mgr_table, sizeof (dsession_mgr_table));

    mutex_unlock(&lock);

    if (shmdt(shm_addr) == -1) {
	perror("shared memory detach error");

	return FALSE;
    }

    return TRUE;
}

static Bool
clean(void)
{
    if (!fini())
	fprintf(stderr, "failed to fini\n");

    if ((shmid = shmget(shm_key, sizeof (shared_mem_t),
	    IPC_ALLOC)) == -1) {
	perror("shared memory get error");

	return FALSE;
    }

    if ((shm_addr = (char *) shmat(shmid,
	    (void *) NULL, 0)) == (void *) -1) {
	perror("shared memory attach error");

	return FALSE;
    }

    mutex_destroy(&lock);

    if (shmdt(shm_addr) == -1) {
	perror("shared memory detach error");

	return FALSE;
    }

    /* destroy the shared memory area */
    if (shmctl(shmid, IPC_RMID, NULL) == -1) {
	perror("shared memory remove error");

	return FALSE;
    }

    printf("shared memory removed\n");

    return TRUE;
}

static Bool
init(void)
{
    int  i;
    Bool shm_created = FALSE;

    if ((shmid = shmget(shm_key, sizeof (shared_mem_t),
	    IPC_ALLOC)) != -1) {
	/* shared memory already exists */
	if ((shm_addr = (char *) shmat(shmid,
		(void *) NULL, 0)) == (void *) -1) {
            perror("shared memory attach error");

	    return FALSE;
        }

	mutex_lock(&lock);

	get_dsession_mgr_table();

	for (i = 0; i < disp_num; i++) {
	    if (dsession_mgr_table[i].session_id[0] &&
		    (strcmp(dsession_mgr_table[i].session_id,
		    "Deleted") != 0)) {
		fprintf(stderr, "need to delete all sessions "
			"before running \"dsession -i/--init\"\n");

	        mutex_unlock(&lock);

		if (shmdt(shm_addr) == -1)
		    perror("shared memory detach error");

		return FALSE;
	    }
	}

	shm_created = TRUE;
    }

    /* initialize mgr table */
    if (pci_system_init() != 0) {
	fprintf(stderr, "can't do pci system init\n");

	if (shm_created) {
	    mutex_unlock(&lock);

	    if (shmdt(shm_addr) == -1)
		perror("shared memory detach error");
	}

	return FALSE;
    }

    memset(dsession_mgr_table, 0, sizeof (dsession_mgr_table));

    disp_num = 0;

    iter = pci_slot_match_iterator_create(NULL);

    while ((dev = pci_device_next(iter)) != NULL) {
	if (IS_VGA(dev->device_class)) {
	    if (disp_num == MAX_DISP_DEV) {
        	fprintf(stderr, "init: too many display devices\n");

		if (shm_created) {
		    mutex_unlock(&lock);

		    if (shmdt(shm_addr) == -1)
			perror("shared memory detach error");
		}

		pci_iterator_destroy(iter);
		pci_system_cleanup();

		return FALSE;
	    }

	    pci_device_probe(dev);

	    snprintf(dsession_mgr_table[disp_num].busid,
		    sizeof (dsession_mgr_table[disp_num].busid),
		    "PCI:%d:%d:%d", dev->domain << 8 | dev->bus,
		    dev->dev, dev->func);

	    if (DEV_PATH(dev)) {
		snprintf(dsession_mgr_table[disp_num].dev_path,
			PATH_MAX,
			"/devices%s", DEV_PATH(dev));

		dsession_mgr_table[disp_num].display = -1;
		dsession_mgr_table[disp_num].server_pid = -1;

		disp_num++;
	    }
	}
    }

    pci_iterator_destroy(iter);
    pci_system_cleanup();

    if (!shm_created) {
	/* shared memory has never been created */
	if ((shmid = shmget(shm_key, sizeof (shared_mem_t),
		IPC_CREAT|IPC_EXCL|0600)) == -1) {
	    perror("shared memory get error during create");

	    return FALSE;
	}

	printf("shared memory create successful\n");

	if ((shm_addr = (char *) shmat(shmid,
		(void *) NULL, 0)) == (void *) -1) {
	    perror("shared memory attach error");

	    return FALSE;
	}

	mutex_init(&lock, USYNC_PROCESS, NULL);

	mutex_lock(&lock);
    }

    /* dynamically add sessions, one for each device */
    for (i = 0; i < disp_num; i++) {
	if (dsession_mgr_table[i].dev_path[0] &&
		add_session(TRUE, i) == -1)
	    fprintf(stderr, "failed to add dsession for %s\n",
		    basename(device));
    }

    /* verify sessions just added */
    if (debug)
	printf("verifying the added dsessions ...\n");

    if (verify_and_set("add", ALL))
	printf("%d added dsessions all verified\n", disp_num);

    else
	fprintf(stderr, "added dsessions not verified\n");

    memcpy(shm_table, dsession_mgr_table, sizeof (dsession_mgr_table));

    mutex_unlock(&lock);

    if (shmdt(shm_addr) == -1) {
	perror("shared memory detach error");

	return FALSE;
    }

    return TRUE;
}

/*ARGSUSED*/
static void
sig_handler(int sig)
{
    int status;

    if (debug)
	printf("signal %d caught\n", sig);

    if (!(status = mutex_trylock(&lock)))
	mutex_unlock(&lock);

    else  if (status == EBUSY)
	mutex_unlock(&lock);

    if ((shm_addr) && (shmdt(shm_addr) == -1))
	perror("shared memory detach error");

    (void) sigset(sig, SIG_DFL);

    (void) kill(getpid(), sig);

    exit(1);
}

static void
usage(void)
{
    fprintf(stderr,
	    "\nUsage:\n");

    fprintf(stderr,
	    "%s -h|--help\n%s", program_name,
	    "    Print help messages\n\n");

    fprintf(stderr,
	    "%s [debug-option] sub-command\n%s", program_name,
            "    Run sub-command, where\n\n"
	    "    debug-option:\n"
            "    -v or --verb\t\tPrint debug messages\n\n"
	    "    sub-command:\t\t(<dev> is path of display device)\n"
            "    -a or --add <dev>\t\tAdd a dsession to run on <dev>\n"
            "    -d or --delete <dev>\tDelete a dsession running on <dev>\n"
            "    -r or --restart <dev>\tRestart a dsession running on <dev>\n"
            "    -l or --list all\t\tList all dsessions\n"
            "    -l or --list dev\t\tProbe and list devs\n"
            "    -l or --list <dev>\t\tList dsession running on <dev>\n"
            "    -i or --init\t\tInitialize: create shared memory\n"
	    "		\t\tand mutex, add all dsessions\n"
            "    -f or --fini\t\tFinish: delete all dsessions\n"
            "    -c or --clean\t\tDelete all dsessions,\n"
	    "		\t\tdestroy mutex and shared memory\n");
}

static Bool
get_shm_key(void) {
    struct stat statbuf;

    if (stat(FTOK_FILE, &statbuf) != 0) {
	fprintf(stderr, "need to install dsession at %s before run\n",
		FTOK_FILE);

	return FALSE;
    }

    if ((shm_key = ftok(FTOK_FILE, FTOK_ID)) == -1) {
	perror("IPC error: ftok");

	return FALSE;
    }

    return TRUE;
}

int
main(int argc, char **argv)
{

    program_name = argv[0];
    Bool  add = FALSE;
    Bool  delete = FALSE;
    Bool  list_all = FALSE;
    Bool  list_dev = FALSE;
    Bool  list_probe_dev = FALSE;
    Bool  restart = FALSE;
    int   ret = 0;
    int   signals[] = {SIGHUP, SIGTERM, SIGINT, SIGQUIT, SIGSEGV, SIGBUS,
			SIGPIPE};
    int  i;

    if ((argc == 2) && ((strcmp("-h", argv[1]) == 0) ||
            (strcmp("--help", argv[1]) == 0))) {
        usage();

	exit(0);
    }

    if ((argc > 1) && ((strcmp("-v", argv[1]) == 0) ||
            (strcmp("--verb", argv[1]) == 0))) {
	debug = TRUE;

	argc--;
	argv++;
    }

    if ((argc < 2) || (argc > 3)) {
	usage();

	exit(1);
    }

    for (i = 0; i < sizeof (signals)/sizeof (signals[0]); i++) {
	if (sigset(signals[i], SIG_IGN) == SIG_DFL)
		(void) sigset(signals[i], sig_handler);
    }

    if ((strcmp("-a", argv[1]) == 0) ||
	    (strcmp("--add", argv[1]) == 0))
	add = TRUE;

    else if ((strcmp("-d", argv[1]) == 0) ||
	    (strcmp("--delete", argv[1]) == 0))
	delete = TRUE;

    else if ((strcmp("-r", argv[1]) == 0) ||
	    (strcmp("--restart", argv[1]) == 0))
	restart = TRUE;

    else if (((strcmp("-l", argv[1]) == 0) ||
	    (strcmp("--list", argv[1]) == 0)) &&
	    (argc == 3)) {
	if (strcmp("all", argv[2]) == 0)
	    list_all = TRUE;

	else if (strcmp("dev", argv[2]) == 0)
	    list_probe_dev = TRUE;

	else
	    list_dev = TRUE;
    }

    if ((argc == 3) && (add || delete || restart || list_all || list_dev)) {
	if (add || delete || restart || list_dev) {
	    char  *path;

	    if (path = realpath(argv[2], NULL)) {
		strlcpy(device, path, PATH_MAX);
		free(path);

	    } else {
		fprintf(stderr, "invalid device path: %s\n", argv[2]);

		exit(1);
	    }
	}

	if (!get_shm_key()) {
	    fprintf(stderr, "get_shm_key failed\n");

	    exit(1);
	}

	if ((shmid = shmget(shm_key, sizeof (shared_mem_t),
		IPC_ALLOC)) == -1) {
	    perror("shared memory get error");

	    exit(1);
	}

	if ((shm_addr = (char *) shmat(shmid,
		(void *) NULL, 0)) == (void *) -1) {
	    perror("shared memory attach error");

	    exit(1);
	}

	mutex_lock(&lock);

	get_dsession_mgr_table();

	if (!sync_sessions())
	    fprintf(stderr, "warning: sync sessions partially failed\n");

	if (add) {
	    if ((i = add_session(FALSE, 0)) == -1) {
		fprintf(stderr, "failed to add dsession for %s\n",
			basename(device));
		ret = 1;

	    } else {
		if (verify_and_set("add", i))
		    printf("added dsession %s verified\n",
			    dsession_mgr_table[i].session_id);

		else {
		    fprintf(stderr, "added dsession can't be verified\n");
		    ret = 1;
		}
	    }

	} else if (delete) {
	    if ((i = delete_session()) == -1) {
		fprintf(stderr, "failed to delete dsession for %s\n",
			basename(device));
		ret = 1;

	    } else {
		if (verify_and_set("delete", i))
		    printf("deleted dsession verified\n");

		else {
		    fprintf(stderr, "deleted dsession can't be verified\n");
		    ret = 1;
		}
	    }

	} else if (restart) {
	    if (restart_session())
		printf("restart dsession on dev %s succeeded\n",
			basename(device));

	    else {
		fprintf(stderr, "failed to restart dsession for %s\n",
			basename(device));
		ret = 1;
	    }

	} else if (list_all) {
	    if (!print_mgr_table(TRUE))
		fprintf(stderr, "failed to print table\n");

	} else if (list_dev) {
	    if (!print_mgr_table(FALSE)) {
		fprintf(stderr, "failed to print table for %s\n", device);
		ret = 1;
	    }
	}

	mutex_unlock(&lock);

	if (shmdt(shm_addr) == -1) {
	    perror("shared memory detach error");

            exit(1);
	}

    } else if (argc == 2) {
	if (!get_shm_key()) {
	    fprintf(stderr, "get_shm_key failed\n");

	    exit(1);
	}

	if ((strcmp("-i", argv[1]) == 0) ||
		(strcmp("--init", argv[1]) == 0)) {
	    if (!init()) {
		fprintf(stderr, "failed to init\n");

		exit(1);
	    }

	} else if ((strcmp("-f", argv[1]) == 0) ||
		(strcmp("--fini", argv[1]) == 0)) {
	    if (!fini()) {
		fprintf(stderr, "failed to fini\n");

		exit(1);
	    }

	} else if ((strcmp("-c", argv[1]) == 0) ||
		(strcmp("--clean", argv[1]) == 0)) {
	    if (!clean()) {
		fprintf(stderr, "failed to clean\n");

		exit(1);
	    }

	} else {
	    usage();

	    exit(1);
	}

    } else if (list_probe_dev) {
	if (!probe_and_print_dev())
	    ret = 1;

    } else {
	usage();

	exit(1);
    }

    exit(ret);
    /*NOTREACHED*/

}
