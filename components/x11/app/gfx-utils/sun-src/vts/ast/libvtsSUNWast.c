/*
 * Copyright (c) 2006, 2013, Oracle and/or its affiliates. All rights reserved.
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

#include "libvtsSUNWast.h"

ast_info_t ast_info;

ast_xw_t ast_xw;

static gfxtest_info *tests_info;

/* Declarations needed for get_tests() */

static uint_t ast_mask_list[] = {
	GRAPHICS_TEST_OPEN,
	GRAPHICS_TEST_DMA,
	GRAPHICS_TEST_MEM,
	GRAPHICS_TEST_CHIP
};

static uint_t ast_mesg_list[] = {
	GRAPHICS_TEST_OPEN_MESG,
	GRAPHICS_TEST_DMA_MESG,
	GRAPHICS_TEST_MEM_MESG,
	GRAPHICS_TEST_CHIP_MESG
};

static gfxtest_function ast_test_list[] = {
	ast_test_open,
	ast_test_dma,
	ast_test_memory,
	ast_test_chip
};


/* *** PUBLIC *** */

/* These library functions are public and are expected to exist */

int
get_tests(
    register gfxtest_info *const tests)
{
	/*
	 * Set the gfx_vts_debug_mask bits according to environment variables
	 */
	gfx_vts_set_debug_mask();

	/*
	 * Construct the list of tests to be performed
	 */
	tests->count = sizeof (ast_test_list) / sizeof (gfxtest_function);
	tests->this_test_mask = (int *)malloc(sizeof (ast_mask_list));
	tests->this_test_mesg = (int *)malloc(sizeof (ast_mesg_list));
	tests->this_test_function =
	    (gfxtest_function *)malloc(sizeof (ast_test_list));

	if ((tests->this_test_mask == NULL) ||
	    (tests->this_test_mesg == NULL) ||
	    (tests->this_test_function == NULL)) {
		gfx_vts_free_tests(tests);
		return (GRAPHICS_ERR_MALLOC_FAIL);
	}

	tests->connection_test_function = ast_test_open;

	memcpy(tests->this_test_mask, ast_mask_list, sizeof (ast_mask_list));
	memcpy(tests->this_test_mesg, ast_mesg_list, sizeof (ast_mesg_list));
	memcpy(tests->this_test_function, ast_test_list,
	    sizeof (ast_test_list));

	tests_info = tests;
	return (0);

}	/* get_tests() */


int
cleanup_tests(
    register gfxtest_info *const tests)
{

	TraceMessage(VTS_DEBUG, "cleanup_tests", "call cleanup_tests\n");
	gfx_vts_free_tests(tests);

	return (0);
}	/* cleanup_tests() */


void
ast_block_signals(
    void)
{
	sigset_t newprocmask;

	sigemptyset(&newprocmask);
	sigaddset(&newprocmask, SIGHUP);
	sigaddset(&newprocmask, SIGINT);
	sigaddset(&newprocmask, SIGTERM);
	sigaddset(&newprocmask, SIGALRM);

	sigprocmask(SIG_BLOCK, &newprocmask, &ast_xw.xw_procmask);
}


void
ast_restore_signals(
    void)
{
	sigprocmask(SIG_SETMASK, &ast_xw.xw_procmask, (sigset_t *)NULL);
}


int
ast_lock_display(
    void)
{
	if (gfx_vts_debug_mask & GRAPHICS_VTS_SLOCK_OFF) {
		TraceMessage(VTS_DEBUG, "ast_lock_display",
		    "ast_lock_display() DISABLED\n");
		return (0);
	}

	if (!ast_open_display()) {
		return (0);
	}

	ast_create_cursor();

	ast_create_window();

	XMapRaised(ast_xw.xw_display, ast_xw.xw_window);

	TraceMessage(VTS_DEBUG, "ast_lock_display",
	    "XMapRaised(display, 0x%lx)\n",
	    (ulong_t)ast_xw.xw_window);

	/* Disable server from handling any requests */
	ast_grab_server();

	/* Gain control of keyboard */
	ast_grab_keyboard();

	/* Gain control of pointer */
	ast_grab_pointer();

	ast_disable_screensaver();

	ast_disable_dpms();

	XSync(ast_xw.xw_display, False);

	return (1);

}       /* ast_lock_display() */


int
ast_unlock_display(
    void)
{
	if (ast_xw.xw_display == NULL)
		return (0);

	XUnmapWindow(ast_xw.xw_display, ast_xw.xw_window);

	TraceMessage(VTS_DEBUG, "ast_unlock_display",
	    "XUnmapWindow(display, 0x%lx)\n",
	    (ulong_t)ast_xw.xw_window);

	ast_restore_dpms();

	ast_restore_screensaver();

	ast_ungrab_pointer();

	ast_ungrab_keyboard();

	ast_ungrab_server();

	XSync(ast_xw.xw_display, False);

	ast_check_for_interrupt();

	return (1);
}


int
ast_open_display(
    void)
{
	if (ast_xw.xw_dispname == NULL)
		ast_xw.xw_dispname = ":0.0";

	if (ast_xw.xw_display == NULL) {
		ast_xw.xw_display = XOpenDisplay(ast_xw.xw_dispname);

		if (ast_xw.xw_display == NULL) {
			TraceMessage(VTS_DEBUG, "ast_open_display",
			    "XOpenDisplay(\"%s\") = NULL\n"
			    "Assuming no window system.\n",
			    ast_xw.xw_dispname);

			return (0);
		}

		TraceMessage(VTS_DEBUG, "ast_open_display",
		    "XOpenDisplay(\"%s\") = 0x%p\n"
		    "Assuming a window system.\n",
		    ast_xw.xw_dispname, ast_xw.xw_display);
	}

	/* Tell server to report events as they occur */
	XSynchronize(ast_xw.xw_display, True);

	TraceMessage(VTS_DEBUG, "ast_open_display",
	    "XSynchronize(display, True).\n");

	return (1);
}


int
ast_create_cursor(
    void)
{
	register Window const root = RootWindow(ast_xw.xw_display,
	    ast_xw.xw_screen);
	register Pixmap emptypixmap;
	XColor dummy_color = {0, 0, 0, 0, 0, 0};

	if (ast_xw.xw_cursor != 0)
		return (0);

	emptypixmap = XCreateBitmapFromData(ast_xw.xw_display, root, "", 1, 1);

	ast_xw.xw_cursor = XCreatePixmapCursor(ast_xw.xw_display,
	    emptypixmap, emptypixmap, &dummy_color, &dummy_color, 0, 0);

	TraceMessage(VTS_DEBUG, "ast_create_cursor",
	    "XCreatePixmapCursor(display, 0x%lx, 0x%lx, &dummy_color, "
	    "&dummy_color, 0, 0) = 0x%lx\n",
	    (ulong_t)emptypixmap, (ulong_t)emptypixmap,
	    (ulong_t)ast_xw.xw_cursor);

	XFreePixmap(ast_xw.xw_display, emptypixmap);

	return (1);
}


int
ast_create_window(
    void)
{
	register Window const root = RootWindow(ast_xw.xw_display,
	    ast_xw.xw_screen);
	register int const width = DisplayWidth(ast_xw.xw_display,
	    ast_xw.xw_screen);
	register int const height = DisplayHeight(ast_xw.xw_display,
	    ast_xw.xw_screen);
	XSetWindowAttributes xswa;

	if (ast_xw.xw_window != NULL)
		return (0);

	memset(&xswa, 0, sizeof (xswa));
	xswa.cursor = ast_xw.xw_cursor;
	xswa.background_pixmap = None;
	xswa.override_redirect = True;
	xswa.backing_store = NotUseful;
	xswa.save_under = False;
	xswa.event_mask = KeyPressMask | KeyReleaseMask | ExposureMask;

	ast_xw.xw_window = XCreateWindow(ast_xw.xw_display,
	    root, 0, 0, width, height,
	    0, CopyFromParent, InputOutput, CopyFromParent,
	    CWBackPixmap | CWOverrideRedirect | CWBackingStore |
	    CWSaveUnder | CWEventMask | CWCursor, &xswa);

	TraceMessage(VTS_DEBUG, "ast_create_window",
	    "XCreateWindow(display, 0x%lx, %d, %d, %d, %d, "
	    "%d, %d, %d, %d, 0x%lx, &xswa) = 0x%lx\n",
	    (ulong_t)root, 0, 0, width, height,
	    0, CopyFromParent, InputOutput, CopyFromParent,
	    (ulong_t)(CWBackPixmap | CWOverrideRedirect |
	    CWBackingStore | CWSaveUnder | CWEventMask | CWCursor),
	    (ulong_t)ast_xw.xw_window);

	XStoreName(ast_xw.xw_display, ast_xw.xw_window, "libvtsSUNWast");

	return (1);
}


int
ast_grab_server(
    void)
{
	if (ast_xw.xw_grab_server == True)
		return (0);

	ast_xw.xw_grab_server = XGrabServer(ast_xw.xw_display);

	TraceMessage(VTS_DEBUG, "ast_grab_server",
	    "XGrabServer(display)\n");

	return (1);
}


int
ast_ungrab_server(
    void)
{
	if (ast_xw.xw_grab_server != True)
		return (0);

	ast_xw.xw_grab_server = !XUngrabServer(ast_xw.xw_display);

	TraceMessage(VTS_DEBUG, "ast_ungrab_server",
	    "XUngrabServer(display)\n");

	return (1);
}


int
ast_grab_keyboard(
    void)
{
	register int status;

	if (ast_xw.xw_grab_keyboard == True)
		return (0);

	status = XGrabKeyboard(ast_xw.xw_display, ast_xw.xw_window,
	    False, GrabModeAsync, GrabModeAsync, CurrentTime);
	ast_xw.xw_grab_keyboard = status == GrabSuccess;

	TraceMessage(VTS_DEBUG, "ast_grab_keyboard",
	    "XGrabKeyboard(display, 0x%lx, %d, %d, %d, %ld) = %d\n",
	    (ulong_t)ast_xw.xw_window,
	    False, GrabModeAsync, GrabModeAsync, CurrentTime,
	    status);

	if (status != GrabSuccess) {
		TraceMessage(VTS_DEBUG, "ast_grab_keyboard",
		    "Cannot gain control of keyboard\n");
		return (-1);

	} else {
		return (1);
	}
}


int
ast_ungrab_keyboard(
    void)
{
	register int status;

	if (ast_xw.xw_grab_keyboard != True)
		return (0);

	status = XUngrabKeyboard(ast_xw.xw_display, CurrentTime);

	ast_xw.xw_grab_keyboard = False;
	TraceMessage(VTS_DEBUG, "ast_ungrab_keyboard",
	    "XGrabKeyboard(display, %ld) = %d\n",
	    CurrentTime, status);

	return (1);
}


int
ast_grab_pointer(
    void)
{
	register int status;

	if (ast_xw.xw_grab_pointer == True)
		return (0);

	status = XGrabPointer(ast_xw.xw_display, ast_xw.xw_window,
	    False, ResizeRedirectMask, GrabModeAsync, GrabModeAsync,
	    None, ast_xw.xw_cursor, CurrentTime);

	ast_xw.xw_grab_pointer = status == GrabSuccess;

	TraceMessage(VTS_DEBUG, "ast_grab_pointer",
	    "XGrabPointer(display, 0x%lx, %d, 0x%lx, %d, %d, "
	    "%d, %d, %ld) = %d\n",
	    (ulong_t)ast_xw.xw_window,
	    False, ResizeRedirectMask,
	    GrabModeAsync, GrabModeAsync,
	    None, None, CurrentTime,
	    status);

	if (status != GrabSuccess) {
		TraceMessage(VTS_DEBUG, "ast_grab_pointer",
		    "Cannot gain control of pointer\n");
		return (-1);

	} else {
		return (1);
	}
}


int
ast_ungrab_pointer(
    void)
{
	register int status;

	if (ast_xw.xw_grab_pointer != True)
		return (0);

	status = XUngrabPointer(ast_xw.xw_display, CurrentTime);

	ast_xw.xw_grab_pointer = False;

	TraceMessage(VTS_DEBUG, "ast_ungrab_pointer",
	    "XGrabPointer(display, %ld) = %d\n",
	    CurrentTime, status);

	return (1);
}


int
ast_disable_screensaver(
    void)
{
	XGetScreenSaver(ast_xw.xw_display,
	    &ast_xw.xw_ss_timeout,
	    &ast_xw.xw_ss_interval,
	    &ast_xw.xw_ss_prefer_blanking,
	    &ast_xw.xw_ss_allow_exposures);

	ast_xw.xw_ss_saved = True;

	TraceMessage(VTS_DEBUG, "ast_disable_screensaver",
	    "XGetScreenSaver(display) = %d, %d, %d, %d\n",
	    ast_xw.xw_ss_timeout,
	    ast_xw.xw_ss_interval,
	    ast_xw.xw_ss_prefer_blanking,
	    ast_xw.xw_ss_allow_exposures);

	/* Reset the screen saver to reset its time. */

	XResetScreenSaver(ast_xw.xw_display);

	ast_xw.xw_ss_disabled = True;

	XSetScreenSaver(ast_xw.xw_display,
	    DisableScreenSaver,
	    ast_xw.xw_ss_interval,
	    ast_xw.xw_ss_prefer_blanking,
	    ast_xw.xw_ss_allow_exposures);

	TraceMessage(VTS_DEBUG, "ast_disable_screensaver",
	    "XSetScreenSaver(display, %d, %d, %d, %d)\n",
	    DisableScreenSaver,
	    ast_xw.xw_ss_interval,
	    ast_xw.xw_ss_prefer_blanking,
	    ast_xw.xw_ss_allow_exposures);

	return (1);
}


int
ast_restore_screensaver(
    void)
{
	if (ast_xw.xw_ss_saved != True ||
	    ast_xw.xw_ss_disabled != True) {
		ast_xw.xw_ss_disabled = False;
		ast_xw.xw_ss_saved = False;
		return (0);

	} else {
		XSetScreenSaver(ast_xw.xw_display,
		    ast_xw.xw_ss_timeout,
		    ast_xw.xw_ss_interval,
		    ast_xw.xw_ss_prefer_blanking,
		    ast_xw.xw_ss_allow_exposures);

		ast_xw.xw_ss_disabled = False;

		TraceMessage(VTS_DEBUG, "ast_restore_screensaver",
		    "XSetScreenSaver(display, %d, %d, %d, %d)\n",
		    ast_xw.xw_ss_timeout,
		    ast_xw.xw_ss_interval,
		    ast_xw.xw_ss_prefer_blanking,
		    ast_xw.xw_ss_allow_exposures);

		ast_xw.xw_ss_saved = False;

		return (1);
	}
}


int
ast_disable_dpms(
    void)
{
	/* Disable the X Display Power Management Signaling. */

	int status;
	int dpms_error = 0;
	int dpms_event = 0;

	status = DPMSQueryExtension(ast_xw.xw_display,
	    &dpms_event, &dpms_error);

	TraceMessage(VTS_DEBUG, "ast_disable_dpms",
	    "DPMSQueryExtension(display) = %d, %d, %d\n",
	    status,
	    dpms_event,
	    dpms_error);

	if (status != True)
		return (-1);

	ast_xw.xw_dpms_saved = DPMSInfo(ast_xw.xw_display,
	    &ast_xw.xw_dpms_power, &ast_xw.xw_dpms_state);

	TraceMessage(VTS_DEBUG, "ast_disable_dpms",
	    "DPMSInfo(display) = %d, %d, %d\n",
	    ast_xw.xw_dpms_saved,
	    ast_xw.xw_dpms_power,
	    ast_xw.xw_dpms_state);

	if (ast_xw.xw_dpms_saved != True ||
	    ast_xw.xw_dpms_state != True)
		return (0);

	else {
		ast_xw.xw_dpms_disabled = True;

		DPMSDisable(ast_xw.xw_display);

		TraceMessage(VTS_DEBUG, "ast_disable_dpms",
		    "DPMSDisable(display)\n");

		return (1);
	}
}


int
ast_restore_dpms(
    void)
{
	/* Restore the X Display Power Management Signaling. */

	if (ast_xw.xw_dpms_saved != True ||
	    ast_xw.xw_dpms_disabled != True) {
		ast_xw.xw_dpms_disabled = False;
		ast_xw.xw_dpms_saved = False;
		return (0);

	} else {
		DPMSEnable(ast_xw.xw_display);

		ast_xw.xw_dpms_disabled = False;

		TraceMessage(VTS_DEBUG, "ast_restore_dpms",
		    "DPMSEnable(display)\n");

		ast_xw.xw_dpms_saved = False;
		return (1);
	}
}


int
ast_sleep(
    uint_t const seconds)
{
	register int signo;
	struct sigaction oldhup;
	struct sigaction oldint;
	struct sigaction oldalrm;
	struct sigaction oldterm;
	struct sigaction newsigact;
	sigset_t oldprocmask;

	/*
	 * Allow a SIGHUP, SIGINT, SIGALRM, or SIGTERM to interrupt our
	 * sleep.  These signals should already be masked from a
	 * call to ast_block_signals.
	 */

	/* Save the current signals. */

	sigaction(SIGHUP, NULL, &oldhup);
	sigaction(SIGINT, NULL, &oldint);
	sigaction(SIGALRM, NULL, &oldalrm);
	sigaction(SIGTERM, NULL, &oldterm);

	/* Setup up new signal action. */

	newsigact.sa_handler = ast_signal_routine;
	sigemptyset(&newsigact.sa_mask);
	newsigact.sa_flags = 0;

	signo = sigsetjmp(ast_xw.xw_sigjmpbuf, 1);
	if (!signo) {
		/* First time goes here. */

		/* Set signal routines. */

		if (oldhup.sa_handler != SIG_IGN)
			sigaction(SIGHUP, &newsigact, NULL);
		if (oldint.sa_handler != SIG_IGN)
			sigaction(SIGINT, &newsigact, NULL);
		if (oldalrm.sa_handler != SIG_IGN)
			sigaction(SIGALRM, &newsigact, NULL);
		if (oldterm.sa_handler != SIG_IGN)
			sigaction(SIGTERM, &newsigact, NULL);

		/* Unmask SIGHUP, SIGINT, SIGALRM, SIGTERM. */

		sigprocmask(SIG_SETMASK, &ast_xw.xw_procmask, &oldprocmask);

		sleep(seconds);

		/* Mask SIGHUP, SIGINT, SIGALRM, SIGTERM. */

		sigprocmask(SIG_SETMASK, &oldprocmask, NULL);

		/* Restore the signals. */

		if (oldhup.sa_handler != SIG_IGN)
			sigaction(SIGHUP, &oldhup, NULL);
		if (oldint.sa_handler != SIG_IGN)
			sigaction(SIGINT, &oldint, NULL);
		if (oldalrm.sa_handler != SIG_IGN)
			sigaction(SIGALRM, &oldalrm, NULL);
		if (oldterm.sa_handler != SIG_IGN)
			sigaction(SIGTERM, &oldterm, NULL);
		}

	else {
		/* We come here from the siglongjmp in ast_signal_routine. */

		/* Mask SIGHUP, SIGINT, SIGALRM, SIGTERM. */

		sigprocmask(SIG_SETMASK, &oldprocmask, NULL);

		/* Restore the signals. */

		if (oldhup.sa_handler != SIG_IGN)
			sigaction(SIGHUP, &oldhup, NULL);
		if (oldint.sa_handler != SIG_IGN)
			sigaction(SIGINT, &oldint, NULL);
		if (oldalrm.sa_handler != SIG_IGN)
			sigaction(SIGALRM, &oldalrm, NULL);
		if (oldterm.sa_handler != SIG_IGN)
			sigaction(SIGTERM, &oldterm, NULL);

		/* Cause us to get the signal, when we unmask the signals. */
		kill(getpid(), signo);
		return (signo);
	}

	signo = ast_check_for_interrupt();
	return (signo);
}


void
ast_signal_routine(
    register int const signo)
{
	siglongjmp(ast_xw.xw_sigjmpbuf, signo);
}


void
graphicstest_finish(
    register int const flag)
{

	TraceMessage(VTS_DEBUG, "graphicstest_finish",
	    "call graphicstest_finish\n");

	TraceMessage(VTS_DEBUG, "graphicstest_finish",
	    "call reset_memory_state\n");

	cleanup_tests(tests_info);

	exit(0);

}	/* graphicstest_finish() */

#define	CTRL(x)	((x) & 0x1f)


int
ast_check_for_interrupt(
    void)
{
	register size_t inputlength;
	register size_t inputon;
	register int ch;
	struct sigaction oldint;
	struct sigaction oldquit;
	XEvent event;
	char inputstring[16];

	if (ast_xw.xw_display == NULL)
		return (0);

	while (XPending(ast_xw.xw_display)) {
		XNextEvent(ast_xw.xw_display, &event);
		if (event.type == KeyPress) {
			inputlength = XLookupString(&event.xkey, inputstring,
			    sizeof (inputstring), NULL, NULL);
			for (inputon = 0; inputon < inputlength; inputon++) {
				ch = inputstring[inputon];

				if (ch == CTRL('c')) {
					sigaction(SIGINT, NULL, &oldint);
					if (oldint.sa_handler != SIG_IGN) {
						kill(getpid(), SIGINT);
						return (SIGINT);
					}

				} else if (ch == CTRL('\\')) {
					sigaction(SIGQUIT, NULL, &oldquit);
					if (oldquit.sa_handler != SIG_IGN) {
						kill(getpid(), SIGQUIT);
						return (SIGQUIT);
					}
				}
			}
		}
	}
	return (0);
}

/* End of libvtsSUNWast.c */
