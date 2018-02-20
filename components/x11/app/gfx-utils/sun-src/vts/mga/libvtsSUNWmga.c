/*
 * Copyright (c) 2006, 2012, Oracle and/or its affiliates. All rights reserved.
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

#include "libvtsSUNWmga.h"	/* VTS library definitions for mga device */

mga_info_t mga_info;

mga_xw_t mga_xw;

static gfxtest_info	*tests_info;

/* Declarations needed for get_tests() */

static unsigned int mga_mask_list[] = {
	GRAPHICS_TEST_OPEN,
	GRAPHICS_TEST_DMA,
	GRAPHICS_TEST_MEM,
	GRAPHICS_TEST_CHIP,
};

static unsigned int mga_mesg_list[] = {
	GRAPHICS_TEST_OPEN_MESG,
	GRAPHICS_TEST_DMA_MESG,
	GRAPHICS_TEST_MEM_MESG,
	GRAPHICS_TEST_CHIP_MESG,
};

static gfxtest_function mga_test_list[] = {
	mga_test_open,
	mga_test_dma,
	mga_test_memory,
	mga_test_chip
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
	tests->count = sizeof (mga_test_list) / sizeof (gfxtest_function);
	tests->this_test_mask = (int *)malloc(sizeof (mga_mask_list));
	tests->this_test_mesg = (int *)malloc(sizeof (mga_mesg_list));
	tests->this_test_function =
	    (gfxtest_function *)malloc(sizeof (mga_test_list));

	if ((tests->this_test_mask == NULL) ||
	    (tests->this_test_mesg == NULL) ||
	    (tests->this_test_function == NULL)) {
		gfx_vts_free_tests(tests);
		return (GRAPHICS_ERR_MALLOC_FAIL);
	}

	tests->connection_test_function = mga_test_open;

	memcpy(tests->this_test_mask, mga_mask_list, sizeof (mga_mask_list));
	memcpy(tests->this_test_mesg, mga_mesg_list, sizeof (mga_mesg_list));
	memcpy(tests->this_test_function, mga_test_list,
	    sizeof (mga_test_list));

	tests_info = tests;
	return (0);

}	/* get_tests() */


int
cleanup_tests(
    register gfxtest_info *const tests)
{

	TraceMessage(VTS_DEBUG, "cleanup_tests",
	    "call cleanup_tests\n");
	gfx_vts_free_tests(tests);

	return (0);
}	/* cleanup_tests() */


void
mga_block_signals(
    void)
{
	sigset_t newprocmask;

	sigemptyset(&newprocmask);
	sigaddset(&newprocmask, SIGHUP);
	sigaddset(&newprocmask, SIGINT);
	sigaddset(&newprocmask, SIGTERM);
	sigaddset(&newprocmask, SIGALRM);

	sigprocmask(SIG_BLOCK, &newprocmask, &mga_xw.xw_procmask);
}


void
mga_restore_signals(
    void)
{
	sigprocmask(SIG_SETMASK, &mga_xw.xw_procmask, (sigset_t *) NULL);
}


int
mga_lock_display(
    void)
{
	if (gfx_vts_debug_mask & GRAPHICS_VTS_SLOCK_OFF) {
		TraceMessage(VTS_DEBUG, "mga_lock_display",
		    "mga_lock_display() DISABLED\n");
		return (0);
	}

	if (!mga_open_display()) {
		return (0);
	}

	mga_create_cursor();

	mga_create_window();

	/* Disable server from handling any requests */
	mga_grab_server();

	/* Gain control of keyboard */
	mga_grab_keyboard();

	/* Gain control of pointer */
	mga_grab_pointer();

	mga_disable_screensaver();

	mga_disable_dpms();

	XMapRaised(mga_xw.xw_display, mga_xw.xw_window);

	TraceMessage(VTS_DEBUG, "mga_lock_display",
	    "XMapRaised(display, 0x%lx)\n",
	    (unsigned long) mga_xw.xw_window);

	return (1);

}       /* mga_lock_display() */

int
mga_unlock_display(
    void)
{
	if (mga_xw.xw_display == NULL)
		return (0);

	XUnmapWindow(mga_xw.xw_display, mga_xw.xw_window);

	TraceMessage(VTS_DEBUG, "mga_unlock_display",
	    "XUnmapWindow(display, 0x%lx)\n",
	    (unsigned long) mga_xw.xw_window);

	mga_restore_dpms();

	mga_restore_screensaver();

	mga_ungrab_pointer();

	mga_ungrab_keyboard();

	mga_ungrab_server();

	return (1);
}


int
mga_open_display(
    void)
{
	if (mga_xw.xw_dispname == NULL)
		mga_xw.xw_dispname = ":0.0";

	if (mga_xw.xw_display == NULL) {
		mga_xw.xw_display = XOpenDisplay(mga_xw.xw_dispname);

		if (mga_xw.xw_display == NULL) {
			TraceMessage(VTS_DEBUG, "mga_open_display",
			    "XOpenDisplay(\"%s\") = NULL\n"
			    "Assuming no window system.\n",
			    mga_xw.xw_dispname);

			return (0);
		}

		TraceMessage(VTS_DEBUG, "mga_open_display",
		    "XOpenDisplay(\"%s\") = 0x%p\n"
		    "Assuming a window system.\n",
		    mga_xw.xw_dispname, mga_xw.xw_display);
	}

	/* Tell server to report events as they occur */
	XSynchronize(mga_xw.xw_display, True);

	TraceMessage(VTS_DEBUG, "mga_open_display",
	    "XSynchronize(display, True).\n");

	return (1);
}


int
mga_create_cursor(
    void)
{
	register Window const root = RootWindow(mga_xw.xw_display,
	    mga_xw.xw_screen);
	register Pixmap emptypixmap;
	XColor dummy_color = {0, 0, 0, 0, 0, 0};

	if (mga_xw.xw_cursor != 0)
		return (0);

	emptypixmap = XCreateBitmapFromData(mga_xw.xw_display, root, "", 1, 1);

	mga_xw.xw_cursor = XCreatePixmapCursor(mga_xw.xw_display,
	    emptypixmap, emptypixmap, &dummy_color, &dummy_color, 0, 0);

	TraceMessage(VTS_DEBUG, "mga_create_cursor",
	    "XCreatePixmapCursor(display, 0x%lx, 0x%lx, &dummy_color, "
	    "&dummy_color, 0, 0) = 0x%lx\n",
	    (unsigned long) emptypixmap, (unsigned long) emptypixmap,
	    (unsigned long) mga_xw.xw_cursor);

	XFreePixmap(mga_xw.xw_display, emptypixmap);

	return (1);
}


int
mga_create_window(
    void)
{
	register Window const root = RootWindow(mga_xw.xw_display,
	    mga_xw.xw_screen);
	register int const width = DisplayWidth(mga_xw.xw_display,
	    mga_xw.xw_screen);
	register int const height = DisplayHeight(mga_xw.xw_display,
	    mga_xw.xw_screen);
	XSetWindowAttributes xswa;

	if (mga_xw.xw_window != NULL)
		return (0);

	memset(&xswa, 0, sizeof (xswa));
	xswa.cursor = mga_xw.xw_cursor;
	xswa.background_pixmap = None;
	xswa.override_redirect = True;
	xswa.backing_store = NotUseful;
	xswa.save_under = False;
	xswa.event_mask = KeyPressMask | KeyReleaseMask | ExposureMask;

	mga_xw.xw_window = XCreateWindow(mga_xw.xw_display,
	    root, 0, 0, width, height,
	    0, CopyFromParent, InputOutput, CopyFromParent,
	    CWBackPixmap | CWOverrideRedirect | CWBackingStore |
	    CWSaveUnder | CWEventMask | CWCursor, &xswa);

	TraceMessage(VTS_DEBUG, "mga_create_window",
	    "XCreateWindow(display, 0x%lx, %d, %d, %d, %d, "
	    "%d, %d, %d, %d, 0x%lx, &xswa) = 0x%lx\n",
	    (unsigned long) root, 0, 0, width, height,
	    0, CopyFromParent, InputOutput, CopyFromParent,
	    (unsigned long) (CWBackPixmap | CWOverrideRedirect |
	    CWBackingStore | CWSaveUnder | CWEventMask | CWCursor),
	    (unsigned long) mga_xw.xw_window);

	return (1);
}


int
mga_grab_server(
    void)
{
	if (mga_xw.xw_grab_server == True)
		return (0);

	mga_xw.xw_grab_server = XGrabServer(mga_xw.xw_display);

	TraceMessage(VTS_DEBUG, "mga_grab_server",
	    "XGrabServer(display)\n");

	return (1);
}


int
mga_ungrab_server(
    void)
{
	if (mga_xw.xw_grab_server != True)
		return (0);

	mga_xw.xw_grab_server = !XUngrabServer(mga_xw.xw_display);

	TraceMessage(VTS_DEBUG, "mga_ungrab_server",
	    "XUngrabServer(display)\n");

	return (1);
}


int
mga_grab_keyboard(
    void)
{
	register int status;

	if (mga_xw.xw_grab_keyboard == True)
		return (0);

	status = XGrabKeyboard(mga_xw.xw_display, mga_xw.xw_window,
	    False, GrabModeAsync, GrabModeAsync, CurrentTime);
	mga_xw.xw_grab_keyboard = status == GrabSuccess;

	TraceMessage(VTS_DEBUG, "mga_grab_keyboard",
	    "XGrabKeyboard(display, 0x%lx, %d, %d, %d, %ld) = %d\n",
	    (unsigned long) mga_xw.xw_window,
	    False, GrabModeAsync, GrabModeAsync, CurrentTime,
	    status);

	if (status != GrabSuccess) {
		TraceMessage(VTS_DEBUG, "mga_grab_keyboard",
		    "Cannot gain control of keyboard\n");
		return (-1);

	} else {
		return (1);
	}
}


int
mga_ungrab_keyboard(
    void)
{
	register int status;

	if (mga_xw.xw_grab_keyboard != True)
		return (0);

	status = XUngrabKeyboard(mga_xw.xw_display, CurrentTime);

	mga_xw.xw_grab_keyboard = False;

	TraceMessage(VTS_DEBUG, "mga_ungrab_keyboard",
	    "XGrabKeyboard(display, %ld) = %d\n",
	    CurrentTime, status);

	return (1);
}


int
mga_grab_pointer(
    void)
{
	register int status;

	if (mga_xw.xw_grab_pointer == True)
		return (0);

	status = XGrabPointer(mga_xw.xw_display, mga_xw.xw_window,
	    False, ResizeRedirectMask, GrabModeAsync, GrabModeAsync,
	    None, mga_xw.xw_cursor, CurrentTime);

	mga_xw.xw_grab_pointer = status == GrabSuccess;

	TraceMessage(VTS_DEBUG, "mga_grab_pointer",
	    "XGrabPointer(display, 0x%lx, %d, 0x%lx, %d, %d, "
	    "%d, %d, %ld) = %d\n",
	    (unsigned long) mga_xw.xw_window,
	    False, ResizeRedirectMask,
	    GrabModeAsync, GrabModeAsync,
	    None, None, CurrentTime,
	    status);

	if (status != GrabSuccess) {
		TraceMessage(VTS_DEBUG, "mga_grab_pointer",
		    "Cannot gain control of pointer\n");
		return (-1);

	} else {
		return (1);
	}
}


int
mga_ungrab_pointer(
    void)
{
	register int status;

	if (mga_xw.xw_grab_pointer != True)
		return (0);

	status = XUngrabPointer(mga_xw.xw_display, CurrentTime);

	mga_xw.xw_grab_pointer = False;

	TraceMessage(VTS_DEBUG, "mga_ungrab_pointer",
	    "XGrabPointer(display, %ld) = %d\n",
	    CurrentTime, status);

	return (1);
}


int
mga_disable_screensaver(
    void)
{
	XGetScreenSaver(mga_xw.xw_display,
	    &mga_xw.xw_ss_timeout,
	    &mga_xw.xw_ss_interval,
	    &mga_xw.xw_ss_prefer_blanking,
	    &mga_xw.xw_ss_allow_exposures);

	mga_xw.xw_ss_saved = True;

	TraceMessage(VTS_DEBUG, "mga_disable_screensaver",
	    "XGetScreenSaver(display) = %d, %d, %d, %d\n",
	    mga_xw.xw_ss_timeout,
	    mga_xw.xw_ss_interval,
	    mga_xw.xw_ss_prefer_blanking,
	    mga_xw.xw_ss_allow_exposures);

	/* Reset the screen saver to reset its time. */

	XResetScreenSaver(mga_xw.xw_display);

	mga_xw.xw_ss_disabled = True;

	XSetScreenSaver(mga_xw.xw_display,
	    DisableScreenSaver,
	    mga_xw.xw_ss_interval,
	    mga_xw.xw_ss_prefer_blanking,
	    mga_xw.xw_ss_allow_exposures);

	TraceMessage(VTS_DEBUG, "mga_disable_screensaver",
	    "XSetScreenSaver(display, %d, %d, %d, %d)\n",
	    DisableScreenSaver,
	    mga_xw.xw_ss_interval,
	    mga_xw.xw_ss_prefer_blanking,
	    mga_xw.xw_ss_allow_exposures);

	return (1);
}


int
mga_restore_screensaver(
    void)
{
	if (mga_xw.xw_ss_saved != True ||
	    mga_xw.xw_ss_disabled != True) {
		mga_xw.xw_ss_disabled = False;
		mga_xw.xw_ss_saved = False;
		return (0);

	} else {
		XSetScreenSaver(mga_xw.xw_display,
		    mga_xw.xw_ss_timeout,
		    mga_xw.xw_ss_interval,
		    mga_xw.xw_ss_prefer_blanking,
		    mga_xw.xw_ss_allow_exposures);

		mga_xw.xw_ss_disabled = False;

		TraceMessage(VTS_DEBUG, "mga_restore_screensaver",
		    "XSetScreenSaver(display, %d, %d, %d, %d)\n",
		    mga_xw.xw_ss_timeout,
		    mga_xw.xw_ss_interval,
		    mga_xw.xw_ss_prefer_blanking,
		    mga_xw.xw_ss_allow_exposures);

		mga_xw.xw_ss_saved = False;

		return (1);
	}
}


int
mga_disable_dpms(
    void)
{
	/* Disable the X Display Power Management Signaling. */

	int status;
	int dpms_error = 0;
	int dpms_event = 0;

	status = DPMSQueryExtension(mga_xw.xw_display,
	    &dpms_event, &dpms_error);

	TraceMessage(VTS_DEBUG, "mga_disable_dpms",
	    "DPMSQueryExtension(display) = %d, %d, %d\n",
	    status,
	    dpms_event,
	    dpms_error);

	if (status != True)
		return (-1);

	mga_xw.xw_dpms_saved = DPMSInfo(mga_xw.xw_display,
	    &mga_xw.xw_dpms_power, &mga_xw.xw_dpms_state);

	TraceMessage(VTS_DEBUG, "mga_disable_dpms",
	    "DPMSInfo(display) = %d, %d, %d\n",
	    mga_xw.xw_dpms_saved,
	    mga_xw.xw_dpms_power,
	    mga_xw.xw_dpms_state);

	if (mga_xw.xw_dpms_saved != True ||
	    mga_xw.xw_dpms_state != True)
		return (0);

	else {
		mga_xw.xw_dpms_disabled = True;

		DPMSDisable(mga_xw.xw_display);

		TraceMessage(VTS_DEBUG, "mga_disable_dpms",
		    "DPMSDisable(display)\n");

		return (1);
	}
}


int
mga_restore_dpms(
    void)
{
	/* Restore the X Display Power Management Signaling. */

	if (mga_xw.xw_dpms_saved != True ||
	    mga_xw.xw_dpms_disabled != True) {
		mga_xw.xw_dpms_disabled = False;
		mga_xw.xw_dpms_saved = False;
		return (0);

	} else {
		DPMSEnable(mga_xw.xw_display);

		mga_xw.xw_dpms_disabled = False;

		TraceMessage(VTS_DEBUG, "mga_restore_dpms",
		    "DPMSEnable(display)\n");

		mga_xw.xw_dpms_saved = False;

		return (1);
	}
}


int
mga_sleep(
    unsigned int const seconds)
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
	 * call to mga_block_signals.
	 */

	/* Save the current signals. */

	sigaction(SIGHUP, NULL, &oldhup);
	sigaction(SIGINT, NULL, &oldint);
	sigaction(SIGALRM, NULL, &oldalrm);
	sigaction(SIGTERM, NULL, &oldterm);

	/* Setup up new signal action. */

	newsigact.sa_handler = mga_signal_routine;
	sigemptyset(&newsigact.sa_mask);
	newsigact.sa_flags = 0;

	signo = sigsetjmp(mga_xw.xw_sigjmpbuf, 1);
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

		sigprocmask(SIG_SETMASK, &mga_xw.xw_procmask, &oldprocmask);

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
		/* We come here from the siglongjmp in mga_signal_routine. */

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
	}
	return (signo);
}


void
mga_signal_routine(
    register int const signo)
{
	siglongjmp(mga_xw.xw_sigjmpbuf, signo);
}


void
graphicstest_finish(
    register int const flag)
{

	TraceMessage(VTS_DEBUG, "graphicstest_finish",
	    "call graphicstest_finish\n");

	cleanup_tests(tests_info);

	exit(0);

}
