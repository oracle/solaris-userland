/*
 * Copyright (c) 2006, 2015, Oracle and/or its affiliates. All rights reserved.
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

#include <sys/types.h>
#include <stdarg.h>		/* va_end(), va_start(), vfprintf() */
#include <stdio.h>		/* fprintf() */
#include <stdlib.h>		/* free(), getenv(), malloc() */
#include <string.h>		/* strdup() */
#include <signal.h>		/* kill() */
#include <unistd.h>		/* getpid() */
#include <X11/Xlib.h>
#include <X11/Xutil.h>

#include "graphicstest.h"
#include "gfx_vts.h"		/* VTS Graphics Tests common routines */


int	gfx_vts_debug_mask = VTS_DEBUG_OFF; /* Debugging categories bit mask */


/*
 * gfx_vts_set_debug_mask()
 *
 *    Set the gfx_vts_debug_mask bits according to environment variables.
 */

void
gfx_vts_set_debug_mask(void)
{

	gfx_vts_debug_mask = VTS_DEBUG_OFF;
	if (getenv("GRAPHICS_VTS_DEBUG")) {
	    gfx_vts_debug_mask |= VTS_DEBUG;
	}
	if (getenv("GRAPHICS_VTS_DEV")) {
	    gfx_vts_debug_mask |= GRAPHICS_VTS_DEV;
	}
	if (getenv("GRAPHICS_VTS_MEM_OFF")) {
	    gfx_vts_debug_mask |= GRAPHICS_VTS_MEM_OFF;
	}
	if (getenv("GRAPHICS_VTS_CHIP_OFF")) {
	    gfx_vts_debug_mask |= GRAPHICS_VTS_CHIP_OFF;
	}
	if (getenv("GRAPHICS_VTS_SLOCK_OFF")) {
	    gfx_vts_debug_mask |= GRAPHICS_VTS_SLOCK_OFF;
	}

}	/* gfx_vts_set_debug_mask() */


/*
 * TraceMessage()
 *
 *    Write a variable format debug message to stderr, prefixed by the
 *    calling function name.
 */

void
TraceMessage(
	int		flags,		/* Current debug categories bit mask */
	const char	*func,		/* Name of function to report */
	const char	*format,	/* printf()-style format string */
			...)		/* printf()-style variable arguments */
{
	va_list		ap;		/* Variable argument pointer */

	va_start(ap, format);
	if (flags & gfx_vts_debug_mask) {
	    fprintf(stderr, "%s: ", func);
	    vfprintf(stderr, format, ap);
	}
	va_end(ap);

}	/* TraceMessage() */


/*
 * gfx_vts_add_message()
 *
 *    Add a message to the existing VTS test return packet.
 *    Grow the arrays (this doesn't happen often enough to call for
 *    linked lists).
 *
 */

static
void
gfx_vts_add_message(
	return_packet	*rp,		/* VTS test return packet */
	int		count,
	int		mesg_num,
	char		*string)	/* Message string, else NULL */
{
	int		i;
	int		*tmp_codes;
	char		**tmp_strings;

	if (rp != NULL) {
	    rp->message_count += count;
	    if (mesg_num >= 6000) {
		rp->error_count += count;
	    }

	    rp->number_of_message_codes += 1;
	    tmp_codes   = rp->message_codes;
	    tmp_strings = rp->message_strings;
	    rp->message_codes =
		(int *)malloc(sizeof (int) * rp->number_of_message_codes);
	    rp->message_strings =
		(char **)malloc(sizeof (char *) * rp->number_of_message_codes);

	    for (i = 0; i < rp->number_of_message_codes - 1; i += 1) {
		rp->message_codes[i]   = tmp_codes[i];
		rp->message_strings[i] = tmp_strings[i];
	    }
	    free(tmp_codes);
	    free(tmp_strings);

	    rp->message_codes[i] = mesg_num;

	    rp->message_strings[i] = NULL;
	    if ((string != NULL) && (*string != '\0')) {
		rp->message_strings[i] = strdup(string);
	    }
	}

}	/* gfx_vts_add_message() */


/*
 * gfx_vts_set_message()
 *
 *    Initialize the message in the VTS test return packet.
 *    The "count" parameter allows for reporting the number of messages
 *    encountered, whereas the array size allows for multiple messages.
 */

void
gfx_vts_set_message(
	return_packet	*rp,		/* VTS test return packet */
	int		count,
	int		mesg_num,
	char		*string)	/* Message string, else NULL */
{

	if (rp != NULL) {
	    if (rp->number_of_message_codes > 0) {
		gfx_vts_add_message(rp, count, mesg_num, string);
	    } else {
		rp->message_count = count;
		if (mesg_num >= 6000) {
		    rp->error_count = 1;
		}
		rp->number_of_message_codes = 1;
		rp->message_codes    = (int *)malloc(sizeof (int));
		rp->message_codes[0] = mesg_num;
		rp->message_strings  = (char **)malloc(sizeof (char *));

		rp->message_strings[0] = NULL;
		if ((string != NULL) && (*string != '\0')) {
		    rp->message_strings[0] = strdup(string);
		}
	    }
	}

}	/* gfx_vts_set_message() */


/*
 * gfx_vts_check_fd()
 *
 *    See whether the specified file descriptor number looks valid.  If
 *    invalid, prepare a message in the return packet and return 1.
 *    Otherwise return zero.
 */

int
gfx_vts_check_fd(
	int		fd,		/* File descriptor number */
	return_packet	*rp)		/* VTS test return packet */
{

	if (fd < 0) {
	    gfx_vts_set_message(rp, 1, GRAPHICS_ERR_OPEN, NULL);
	    return (1);
	}
	return (0);

}	/* gfx_vts_check_fd() */


/*
 * gfx_vts_free_tests()
 *
 *    Free any and all dynamically allocated memory to which the test
 *    structure points.
 */

void
gfx_vts_free_tests(gfxtest_info *tests)
{

	if (tests != NULL) {
	    free(tests->this_test_mask);
	    tests->this_test_mask = NULL;

	    free(tests->this_test_mesg);
	    tests->this_test_mesg = NULL;

	    free(tests->this_test_function);
	    tests->this_test_function = NULL;
	}

}	/* gfx_vts_free_tests() */


/*
 * gfx_vts_console_interrupt()
 *
 *    See whether a console interrupt (Ctrl-C or ^C) has been typed.
 *    If so, send a SIGINT signal to our own PID.  Otherwise just
 *    return.
 */

void
gfx_vts_console_interrupt(
	Display		*dpy)		/* Connection to the X server */
{
#define	CTRL_C	'\003'			/* Ctrl-C (^C) */

	if (dpy != NULL) {
	    while (XPending(dpy)) {
		XEvent	event;		/* Key event structure */
		int	i;		/* Loop counter / keystr[] index */
		char	keystr[5] = "";	/* Buffer for returned string */
		int	len;		/* Length of returned string */

		XNextEvent(dpy, &event);
		if (event.type == KeyPress) {
		    len = XLookupString((XKeyEvent *)&event,
					keystr, sizeof (keystr),
					NULL, NULL);
		    for (i = 0; i < len; i += 1) {
			if (keystr[i] == CTRL_C) {
			    kill(getpid(), SIGINT);
			    graphicstest_finish(0);
			}
		    }
		}
	    }
	}

}	/* gfx_vts_console_interrupt() */


/* End of gfx_vts_common.c */
