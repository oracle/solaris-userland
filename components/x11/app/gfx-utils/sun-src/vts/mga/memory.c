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

#include "libvtsSUNWmga.h"	/* Common VTS library definitions */

typedef union MemType {
	uint64_t	val[8];
	uint32_t	word[16];
	uint16_t	halfwd[32];
	uint8_t		byte[64];
} MemType;

static const int access_mode[] = {
	1, 2, 4, 8, 0
};

static MemType data[32 * 8];
static MemType cdata[32 * 8];
static MemType rdval[4];

/*
 * mga_test_memory()
 *
 *    This test will open the device and read and write to all memory
 *    addresses.
 */

return_packet *
mga_test_memory(
    register int const fd)
{
	static return_packet rp;

	memset(&rp, 0, sizeof (return_packet));

	if (gfx_vts_debug_mask & GRAPHICS_VTS_MEM_OFF) {
		return (&rp);
	}

	TraceMessage(VTS_DEBUG, "mga_test_memory",
	    "mga_test_memory running\n");

	mga_block_signals();

	mga_lock_display();

	memory_test(&rp, fd);

	TraceMessage(VTS_DEBUG, "mga_test_memory",
	    "mga_test_memory completed\n");

	mga_unlock_display();

	mga_restore_signals();

	return (&rp);
}


int
memory_test(
    register return_packet *const rp,
    register int const fd)
{
	register size_t i;
	register int signo;
	struct sigaction oldhup;
	struct sigaction oldint;
	struct sigaction oldalrm;
	struct sigaction oldterm;
	struct sigaction newsigact;
	sigset_t oldprocmask;

	memset(&mga_info, 0, sizeof (mga_info));
	mga_info.mga_fd = fd;

	if (mga_map_mem(rp, GRAPHICS_ERR_MEMORY_MSG) != 0) {
		close(fd);
		return (-1);
	}

	if (mga_init_info(rp, GRAPHICS_ERR_MEMORY_MSG) != 0) {
		mga_unmap_mem(NULL, GRAPHICS_ERR_MEMORY_MSG);
		close(fd);
		return (-1);
	}

	mga_save_palet();
	mga_set_palet();

	/*
	 * Allow a SIGHUP, SIGINT, SIGALRM, or SIGTERM to interrupt our
	 * memory_test.  These signals should already be masked from a
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

		for (i = 0; access_mode[i] != 0; i++) {
			check_plane(mga_info.mga_depth, access_mode[i],
			    mga_info.mga_linesize / mga_info.mga_pixelsize,
			    mga_info.mga_height,
			    mga_info.mga_width, mga_info.mga_pixelsize,
			    mga_info.mga_fb_ptr);
		}

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

	mga_restore_palet();

	if (mga_unmap_mem(rp, GRAPHICS_ERR_MEMORY_MSG) != 0) {
		close(fd);
		return (-1);
	}


	if (close(fd) != 0) {
		gfx_vts_set_message(rp, 1, GRAPHICS_ERR_MEMORY_MSG,
		    "error closing device\n");
		return (-1);
	}

	return (0);
}


void
check_plane(
    register int const num_planes,
    register int const access_mode,
    register int const fb_pitch,
    register int const fb_height,
    register int const fb_width,
    register int const bytepp,
    register caddr_t const base)
{
	register int x;
	register int y;
	register int complement;

	/* Set up raster for this plane group */

	init_data(num_planes);

	/* Cover each 64x64 chunk of screen space */

	y = 0;
	while (y < fb_height) {
		x = 0;
		while (x < fb_width) {
			if (x + 63 > fb_width) x = fb_width - 64;
			if (y + 63 > fb_height) y = fb_height - 64;

			/* Do each chunk twice - once normal, once complement */

			for (complement = B_FALSE;
			    complement <= B_TRUE;
			    complement++) {
				write_read(x, y,
				    (boolean_t)complement,
				    access_mode,
				    B_TRUE,
				    fb_pitch,
				    bytepp,
				    base) ||
				    write_read(x, y,
				    (boolean_t)complement,
				    access_mode,
				    B_FALSE,
				    fb_pitch,
				    bytepp,
				    base);
			}

			/* Move over one 64x64 chunk */

			x += 64;
		}

		/* Move down one 64x64 chunk */

		y += 64;
	}
}


void
init_data(
    register int const num_planes)
{
	register int i;
	register int j;

	/* Get memory to store data */

	/* Write data to memory */

	for (i = 0; i < num_planes * 8; i++) {
		for (j = 0; j < 8; j++) {

			/* Figure out the value to write */

			data[i].val[j] = ((unsigned long long)
			    test_data() << 32) | test_data();
			cdata[i].val[j] = ~data[i].val[j];
		}
	}
}


u_int
test_data(
    void)
{
	register u_int ret;

	ret = (u_int)mrand48();
	return (ret);
}


boolean_t
write_read(
    register int const xoff,
    register int const yoff,
    register boolean_t const complement,
    register int const access_mode,
    register boolean_t const pass,
    register int const fb_pitch,
    register int const bytepp,
    register caddr_t const base)
{
	register MemType *const dp = complement ? cdata : data;
	register int const pitch = fb_pitch;
	register int x;
	register int y;
	register int i;
	register caddr_t mem_addr;
	register int subscr = 0;

	/* Write Data to Screen */

	for (y = yoff; y < yoff + 64; y++) {
		for (x = xoff * bytepp, i = 0;
		    x < ((xoff + 64) *bytepp);
		    x += access_mode, i++) {
			mem_addr = (y*pitch*bytepp) + x + base;

			/* Check which access mode to use for write */

			switch (access_mode) {
			    case 8: /* long long (8-byte) access mode */
				*(uint64_t volatile *)mem_addr =
				    dp[subscr].val[i];
				break;

			    case 4: /* word (4-byte) access mode */
				*(uint32_t volatile *)mem_addr =
				    dp[subscr].word[i];
				break;

			    case 2: /* short (2-byte) access mode */
				*(uint16_t volatile *)mem_addr =
				    dp[subscr].halfwd[i];
				break;

			    default: /* default to byte access */
				*(uint8_t volatile *)mem_addr =
				    dp[subscr].byte[i];
				break;
			}
		}
		subscr++;
	}

	/* Read the Data From the Screen */

	for (y = yoff; y < yoff + 64; y++) {
	    for (x = xoff * bytepp, i = 0;
		x < ((xoff + 64) * bytepp);
		x += access_mode, i++) {
		mem_addr = (y*pitch*bytepp) + x + base;

		switch (access_mode) {
		case 8:	/* long long (8-byte) access mode */
			rdval[0].val[i] =
			    *(uint64_t volatile const *)mem_addr;
			break;

		case 4:	/* word (4-byte) access mode */
			rdval[0].word[i] =
			    *(uint32_t volatile const *)mem_addr;
			break;

		case 2:	/* short (2-byte) access mode */
			rdval[0].halfwd[i] =
			    *(uint16_t volatile const *)mem_addr;
			break;

		default: /* default to byte access */
			rdval[0].byte[i] =
			    *(uint8_t volatile const *)mem_addr;
			break;
		}
	    }

	    /* TODO: verification */

	    if (memcmp(rdval, dp[subscr].byte, 64 * bytepp) != 0) {
		switch (access_mode) {
		case 8:	/* long long (8-byte) access mode */
			for (i = 0; i < (8 * bytepp); i++) {
			    if (rdval[0].val[i] != dp[subscr].val[i]) {
				return (B_FALSE);
			    }
			}
			break;

		case 4:	/* word (4-byte) access mode */
			for (i = 0; i < (16  * bytepp); i++) {
			    if (rdval[0].word[i] != dp[subscr].word[i]) {
				return (B_FALSE);
			    }
			}
			break;

		case 2:	/* short (2-byte) access mode */
			for (i = 0; i < (32 * bytepp); i++) {
			    if (rdval[0].halfwd[i] != dp[subscr].halfwd[i]) {
				    return (B_FALSE);
			    }
			}
			break;

		default: /* default to byte access */
			for (i = 0; i < (64 * bytepp); i++) {
			    if (rdval[0].byte[i] != dp[subscr].byte[i]) {
				return (B_FALSE);
			    }
			}
			break;
		}
	    }
	    subscr++;
	}

	return (B_TRUE);
}
