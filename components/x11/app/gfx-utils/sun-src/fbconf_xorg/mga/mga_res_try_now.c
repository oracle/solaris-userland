/*
 * Copyright (c) 2012, Oracle and/or its affiliates. All rights reserved.
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

/*
 * mga_res_try_now - Video mode setting (-res try now)
 */

#include <sys/types.h>		/* u_char, uint32_t */
#include <ctype.h>		/* toupper() */
#include <stdio.h>		/* printf(), sscanf() */
#include <signal.h>		/* signal() */
#include <termios.h>		/* tcgetattr(), tcsetattr() */
#include <unistd.h>		/* alarm(), read() */

#include "gfx_common.h"

#if TRY_RES_NOW
#include "mgaio.h"		/* mga I/O, including ioctl() stuff */
#include "regdef.h"		/* CRTC*_PITCH, ... */

/* n-bit register read/write (offset, value) */
#define	regr(o)		(*(volatile uint32_t *)(registers + (o)))
#define	regr16(o)	(*(volatile uint16_t *)(registers + (o)))
#define	regr8(o)	(*(volatile uint8_t *)(registers + (o)))
#define	regw(o,v)	(regr(o) = (v))
#define	regw16(o,v)	(regr16(o) = (v))
#define	regw8(o,v)	(regr8(o) = (v))
#endif /* TRY_RES_NOW */

#include "fbc.h"		/* Common fbconf_xorg(1M) definitions */
#include "fbc_ask.h"		/* User interaction */
#include "fbc_dev.h"		/* Identify the graphics device (-dev opt) */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_res.h"		/* Video modes/resolutions (-res option) */

#include "mga_res_try_now.h"	/* Video mode setting (-res try now) */


#define	MGA_MAX_STREAMS	2

#define	_LIVE_		0	/* Live run */


static const int	mga_stream_bit[MGA_MAX_STREAMS] = {
	GFX_EDID_HEAD_ONE,		/* Video stream 1 bit */
	GFX_EDID_HEAD_TWO		/* Video stream 2 bit */
};


/*
 * mga_res_mode_try_stop()
 *
 *    Signal handler for the duration of the video mode trial.
 */

static
void
mga_res_mode_try_stop(
	int		signum)		/* Signal number */
{

	/* Void */

}	/* mga_res_mode_try_stop() */


/*
 * mga_res_mode_try()
 *
 *    Conduct a 10-second trial of the new video mode for the user's
 *    approval (-res <video_mode> try).  Return TRUE iff the trial is
 *    successful.
 */

int
mga_res_mode_try(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_video_mode_t *video_mode)	/* Video mode (-res <video_mode>) */
{
	int rval = TRUE;

#if TRY_RES_NOW
	const int	crtc_pitch_off[MGA_MAX_STREAMS] = {
		CRTC_PITCH,		/* Stream 1 pitch register offset */
		CRTC2_PITCH		/* Stream 2 pitch register offset */
	};
	const int	crtc_offset_off[MGA_MAX_STREAMS] = {
		CRTC_OFFSET,		/* Stream 1 offset register offset */
		CRTC2_OFFSET		/* Stream 2 offset register offset */
	};
	AstInfo		*fb_info; 	/* Frame buffer information */
	void		(*orig_disp[NSIG])(int); /* Original signal disp's */
	struct termios	tparm_old;	/* Original terminal parameters */
	struct termios	tparm_new;	/* Video trial terminal parameters */
	int		input_size;	/* Stdin keystroke count (0 or 1) */
	char		input_buf[4];	/* Stdin keystroke buffer */
	int		rval = TRUE;	/* TRUE => Successful trial so far */
	CRTCInfoBlock	video[MGA_MAX_STREAMS];
	int		depth[MGA_MAX_STREAMS];
	uint32_t	crtc_pitch_val[MGA_MAX_STREAMS];
	uint32_t	crtc_offset_val[MGA_MAX_STREAMS];
	volatile u_char	*registers;	/* Ptr to registers (regr(), regw()) */

	uint32_t	offset[MGA_MAX_STREAMS];
	int		stream_index;	/* Video stream index (zero-based) */

	/*
	 * Get the frame buffer information
	 */
#if (_LIVE_)	// ???
	fb_info = mga_openfd(device->fd);
	if (fb_info == NULL) {
		return (FALSE);
	}

	/*
	 * Point to the (volatle) registers
	 */
	registers = fb_info->registers;

	/*
	 * Get the current hardware video mode for each applicable stream
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		Radeon_GetMode(fb_info,
				mga_stream_bit[stream_index],
				&video[stream_index],
				&depth[stream_index]);
		crtc_pitch_val[stream_index]  =
				regr(crtc_pitch_off[stream_index]);
		crtc_offset_val[stream_index] =
				regr(crtc_offset_off[stream_index]);
	}

#endif	// ???
	/*
	 * Ask whether the user is ready to try the new video mode
	 */
	printf("About to change video resolution to \"%s\" for %d seconds\n",
		video_mode->name, FBC_TRIAL_TIME);
	if (!fbc_ask_yes_no("Continue (yes/no) ? ")) {
		return (FALSE);
	}

	/*
	 * Set a new signal handler, saving the original signal dispositions
	 *
	 *    SIGHUP     Hangup
	 *    SIGINT     Interrupt
	 *    SIGQUIT    Quit
	 *    SIGBUS     Bus Error
	 *    SIGSEGV    Segmentation Fault
	 *    SIGPIPE    Broken Pipe
	 *    SIGALRM    Alarm Clock
	 *    SIGTERM    Terminated
	 *    SIGVTALRM  Virtual Timer Expired
	 */
	orig_disp[SIGHUP]    = signal(SIGHUP,    mga_res_mode_try_stop);
	orig_disp[SIGINT]    = signal(SIGINT,    mga_res_mode_try_stop);
	orig_disp[SIGQUIT]   = signal(SIGQUIT,   mga_res_mode_try_stop);
	orig_disp[SIGBUS]    = signal(SIGBUS,    mga_res_mode_try_stop);
	orig_disp[SIGSEGV]   = signal(SIGSEGV,   mga_res_mode_try_stop);
	orig_disp[SIGPIPE]   = signal(SIGPIPE,   mga_res_mode_try_stop);
	orig_disp[SIGALRM]   = signal(SIGALRM,   mga_res_mode_try_stop);
	orig_disp[SIGTERM]   = signal(SIGTERM,   mga_res_mode_try_stop);
	orig_disp[SIGVTALRM] = signal(SIGVTALRM, mga_res_mode_try_stop);

	/*
	 * Set the new video mode for all applicable display devices
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
#if (_LIVE_)	// ???
		fb_info->stream = mga_stream_bit[stream_index];
		offset[stream_index] = Radeon_GetMemory(device->fd,
							video_mode->width,
							video_mode->height,
							depth[stream_index],
							0);
		if (offset[stream_index] == (uint32_t)-1) {
			offset[stream_index] = 0;
		}
		if (mga_set_named_mode(fb_info,
					video_mode->name,
					depth[stream_index],
					offset[stream_index]) != 0) {
			char monitor_id[FBC_MAX_MONITOR_ID_LEN];

			fbc_get_monitor_id(
					device, stream_index, &monitor_id[0]);
			fbc_errormsg("Cannot set video mode for monitor%s!\n",
					monitor_id);
			rval = FALSE;
		}
#endif	// ???
	}

	if (rval) {
		/*
		 * Clear each screen after changing the video mode
		 */
		for (stream_index = device->stream_lo;
		    stream_index <= device->stream_hi;
		    stream_index += 1) {
			int pitch;
#if (_LIVE_)	// ???
			pitch = regr(crtc_pitch_off[stream_index]) * 8;
			if (offset[stream_index] == 0) {
				offset[stream_index] =
						crtc_offset_val[stream_index];
			}
			memset((void *)(fb_info->fb_mem + offset[0]/*???*/),
				0,
				pitch * video_mode->height);
#endif	// ???
		}

		/*
		 * Put the terminal's standard input into raw mode
		 */
		tcgetattr(0, &tparm_old);
		tparm_new = tparm_old;
		tparm_new.c_lflag &= ~(ISIG | ICANON | ECHO | ECHOE |
					ECHOK | ECHONL | ECHOCTL | ECHOPRT |
					ECHOKE);
		tparm_new.c_cc[VMIN]  = 0;
		tparm_new.c_cc[VTIME] = (FBC_TRIAL_TIME * 10);
		tcsetattr(0, TCSANOW, &tparm_new);

		/*
		 * Wait for a user keystroke or for the timer to expire
		 */
		alarm(FBC_TRIAL_TIME + 1);  /* In case VTIME doesn't work */
		input_size = read(0, input_buf, 1);
		alarm(0);

		/*
		 * Restore the terminal's original standard input parameters
		 */
		tcsetattr(0, TCSANOW, &tparm_old);
	}

	/*
	 * Restore the original signal dispositions
	 */
	signal(SIGHUP,    orig_disp[SIGHUP]);
	signal(SIGINT,    orig_disp[SIGINT]);
	signal(SIGQUIT,   orig_disp[SIGQUIT]);
	signal(SIGBUS,    orig_disp[SIGBUS]);
	signal(SIGSEGV,   orig_disp[SIGSEGV]);
	signal(SIGPIPE,   orig_disp[SIGPIPE]);
	signal(SIGALRM,   orig_disp[SIGALRM]);
	signal(SIGTERM,   orig_disp[SIGTERM]);
	signal(SIGVTALRM, orig_disp[SIGVTALRM]);

	/*
	 * Restore the original video mode for the applicable display devices
	 */
#if (_LIVE_)	// ???
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		/* For Radeon_SetModeNB*() declarations, see libast.h */
		typedef int Radeon_SetModeNBi_t(
					AstInfo		*fb_info,
					int		xres,
					int		yres,
					int		depth,
					const CRTCInfoBlock *paramtable,
					uint32_t	offset);
		Radeon_SetModeNBi_t *Radeon_SetModeNBi[] = {
			&Radeon_SetModeNB1,
			&Radeon_SetModeNB2
		};

		(void) Radeon_SetModeNBi[stream_index](
					    fb_info,
					    video[stream_index].width,
					    video[stream_index].height,
					    depth[stream_index],
					    &video[stream_index],
					    crtc_offset_val[stream_index]);
		regw(crtc_pitch_off[0], crtc_pitch_val[0]);
	}

	mga_closefd(fb_info);
#endif	// ???

	if (rval) {
		/*
		 * Interpret the user input character or absence thereof
		 *
		 *    Treat the absence of user input as noncommittal.
		 *    Treat Newline or Carriage Return (but not Space,
		 *    etc. by historical precedent) as noncommittal.
		 *    Treat 'Y' or 'y' as affirmative.
		 *    Treat 'N' or 'n' or anything else (by historical
		 *    precedent) as negative.
		 */
		if ((input_size == 0) ||
		    (input_buf[0] == '\n') || (input_buf[0] == '\r')) {
			/*
			 * Still need a Yes/No response from the user
			 */
			rval = fbc_ask_yes_no(
			"Do you want %s to become the new setting (yes/no) ? ",
						video_mode->name);
		} else
		if (toupper(input_buf[0]) != 'Y') {
			rval = FALSE;		/* Treat as 'N' or 'n' */
		}
	}

	/*
	 * Return, indicating whether the trial was successful
	 */
#endif /* TRY_RES_NOW */

	return (rval);

}	/* mga_res_mode_try() */


/*
 * mga_res_mode_now()
 *
 *    Set the new video mode now (-res <video_mode> now).
 */

int
mga_res_mode_now(
	fbc_dev_t	*device,	/* Frame buffer device info (-dev) */
	fbc_video_mode_t *video_mode)	/* Video mode (-res <video_mode>) */
{
/*???*/	const unsigned int depth = 24;	/* From nfb & pfb for Solaris 8 & 9 */

#if TRY_RES_NOW
	AstInfo		*fb_info;	/* Frame buffer information */
	int		error_code;	/* Error code (FBC_ERR_xxxxx) */
	int		stream_index;	/* Video stream index (zero-based) */

	error_code = FBC_SUCCESS;

	fb_info = mga_openfd(device->fd);
	if (fb_info == NULL) {
		return (FBC_ERR_OPEN);
	}

	printf("Setting \"%s\"\n", video_mode->name);

	/*
	 * Let the driver know (??? that we've begun setting this mode ???)
	 */
	(void) ioctl(device->fd, MGA_BEGIN_SETVIDEOMODE, 0);

	/*
	 * Set the video mode for each applicable display device
	 */
	for (stream_index = device->stream_lo;
	    stream_index <= device->stream_hi;
	    stream_index += 1) {
		fb_info->stream = mga_stream_bit[stream_index];
		if (mga_set_named_mode(fb_info, video_mode->name, depth, 0)
					!= 0) {
			error_code = FBC_ERR_IOCTL;
		}
	}

	/*
	 * Let the driver know (??? that we're finished setting this mode ???)
	 */
	(void) ioctl(device->fd, MGA_SETVIDEOMODE, 0);

	mga_closefd(fb_info);

	return (error_code);
#endif /* TRY_RES_NOW */

	return (FBC_SUCCESS);

}	/* mga_res_mode_now() */


/* End of mga_res_try_now.c */
