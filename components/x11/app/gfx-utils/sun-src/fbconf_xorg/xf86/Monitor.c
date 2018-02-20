/* 
 * 
 * Copyright (c) 1997  Metro Link Incorporated
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE X CONSORTIUM BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
 * OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Except as contained in this notice, the name of the Metro Link shall not be
 * used in advertising or otherwise to promote the sale, use or other dealings
 * in this Software without prior written authorization from Metro Link.
 * 
 */
/*
 * Copyright (c) 1997-2003 by The XFree86 Project, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE COPYRIGHT HOLDER(S) OR AUTHOR(S) BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Except as contained in this notice, the name of the copyright holder(s)
 * and author(s) shall not be used in advertising or otherwise to promote
 * the sale, use or other dealings in this Software without prior written
 * authorization from the copyright holder(s) and author(s).
 */


/* View/edit this file with tab stops set to 4 */

#ifdef HAVE_XORG_CONFIG_H
#include <xorg-config.h>
#endif

#include "xf86Parser.h"
#include "xf86tokens.h"
#include "Configint.h"
#include "fields.h"		/* Config file output line fields */
#if defined(SMI_FBCONFIG)
#include "fbc_line_er.h"	/* External Representation of config lines */
#endif

extern LexRec val;

static xf86ConfigSymTabRec MonitorTab[] =
{
	{ENDSECTION, "endsection"},
	{IDENTIFIER, "identifier"},
	{VENDOR, "vendorname"},
	{MODEL, "modelname"},
	{USEMODES, "usemodes"},
	{MODELINE, "modeline"},
	{DISPLAYSIZE, "displaysize"},
	{HORIZSYNC, "horizsync"},
	{VERTREFRESH, "vertrefresh"},
	{MODE, "mode"},
	{GAMMA, "gamma"},
	{OPTION, "option"},
	{-1, ""},
};

static xf86ConfigSymTabRec ModesTab[] =
{
	{ENDSECTION, "endsection"},
	{IDENTIFIER, "identifier"},
	{MODELINE, "modeline"},
	{MODE, "mode"},
	{-1, ""},
};

static xf86ConfigSymTabRec TimingTab[] =
{
	{TT_INTERLACE, "interlace"},
	{TT_PHSYNC, "+hsync"},
	{TT_NHSYNC, "-hsync"},
	{TT_PVSYNC, "+vsync"},
	{TT_NVSYNC, "-vsync"},
	{TT_CSYNC, "composite"},
	{TT_PCSYNC, "+csync"},
	{TT_NCSYNC, "-csync"},
	{TT_DBLSCAN, "doublescan"},
	{TT_HSKEW, "hskew"},
	{TT_BCAST, "bcast"},
	{TT_VSCAN, "vscan"},
	{TT_CUSTOM, "CUSTOM"},
	{-1, ""},
};

static xf86ConfigSymTabRec ModeTab[] =
{
	{DOTCLOCK, "dotclock"},
	{HTIMINGS, "htimings"},
	{VTIMINGS, "vtimings"},
	{FLAGS, "flags"},
	{HSKEW, "hskew"},
	{BCAST, "bcast"},
	{VSCAN, "vscan"},
	{ENDMODE, "endmode"},
	{-1, ""},
};

#define CLEANUP xf86freeModeLineList

XF86ConfModeLinePtr
xf86parseModeLine (void)
{
	int token;
#if defined(SMI_FBCONFIG)
	void *line_er;			/* Ptr to Extnl Rep of config line */
#endif
	parsePrologue (XF86ConfModeLinePtr, XF86ConfModeLineRec)

	ptr->ml_verbose = FALSE;

#if defined(SMI_FBCONFIG)
	/*
	 * Link Internal & External Representations of the line
	 */
	line_er = fbc_get_current_line_ER();
	ptr->ml_dotclock_line_er = line_er;
	ptr->ml_htimings_line_er = line_er;
	ptr->ml_vtimings_line_er = line_er;
	ptr->ml_flags_line_er    = line_er;
	ptr->ml_hskew_line_er    = line_er;
	ptr->ml_vscan_line_er    = line_er;
	fbc_link_line_ER(line_er, (void *)ptr,
			(xf86_print_fn_t *)&xf86printMxxxSectionModeLine,
			FBC_INDENT_1);

#endif
	/* Identifier */
	if (xf86getSubToken (&(ptr->ml_comment)) != STRING)
		Error ("ModeLine identifier expected", NULL);
	ptr->ml_identifier = val.str;

	/* DotClock */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine dotclock expected", NULL);
	ptr->ml_clock = (int) (val.realnum * 1000.0 + 0.5);

	/* HDisplay */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine Hdisplay expected", NULL);
	ptr->ml_hdisplay = val.num;

	/* HSyncStart */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine HSyncStart expected", NULL);
	ptr->ml_hsyncstart = val.num;

	/* HSyncEnd */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine HSyncEnd expected", NULL);
	ptr->ml_hsyncend = val.num;

	/* HTotal */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine HTotal expected", NULL);
	ptr->ml_htotal = val.num;

	/* VDisplay */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine Vdisplay expected", NULL);
	ptr->ml_vdisplay = val.num;

	/* VSyncStart */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine VSyncStart expected", NULL);
	ptr->ml_vsyncstart = val.num;

	/* VSyncEnd */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine VSyncEnd expected", NULL);
	ptr->ml_vsyncend = val.num;

	/* VTotal */
	if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
		Error ("ModeLine VTotal expected", NULL);
	ptr->ml_vtotal = val.num;

	token = xf86getSubTokenWithTab (&(ptr->ml_comment), TimingTab);
	while ((token == TT_INTERLACE) || (token == TT_PHSYNC) ||
		   (token == TT_NHSYNC) || (token == TT_PVSYNC) ||
		   (token == TT_NVSYNC) || (token == TT_CSYNC) ||
		   (token == TT_PCSYNC) || (token == TT_NCSYNC) ||
		   (token == TT_DBLSCAN) || (token == TT_HSKEW) ||
		   (token == TT_VSCAN) || (token == TT_BCAST))
	{
		switch (token)
		{

		case TT_INTERLACE:
			ptr->ml_flags |= XF86CONF_INTERLACE;
			break;
		case TT_PHSYNC:
			ptr->ml_flags |= XF86CONF_PHSYNC;
			break;
		case TT_NHSYNC:
			ptr->ml_flags |= XF86CONF_NHSYNC;
			break;
		case TT_PVSYNC:
			ptr->ml_flags |= XF86CONF_PVSYNC;
			break;
		case TT_NVSYNC:
			ptr->ml_flags |= XF86CONF_NVSYNC;
			break;
		case TT_CSYNC:
			ptr->ml_flags |= XF86CONF_CSYNC;
			break;
		case TT_PCSYNC:
			ptr->ml_flags |= XF86CONF_PCSYNC;
			break;
		case TT_NCSYNC:
			ptr->ml_flags |= XF86CONF_NCSYNC;
			break;
		case TT_DBLSCAN:
			ptr->ml_flags |= XF86CONF_DBLSCAN;
			break;
		case TT_HSKEW:
			if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
				Error (NUMBER_MSG, "Hskew");
			ptr->ml_hskew = val.num;
			ptr->ml_flags |= XF86CONF_HSKEW;
			break;
		case TT_BCAST:
			ptr->ml_flags |= XF86CONF_BCAST;
			break;
		case TT_VSCAN:
			if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
				Error (NUMBER_MSG, "Vscan");
			ptr->ml_vscan = val.num;
			ptr->ml_flags |= XF86CONF_VSCAN;
			break;
		case TT_CUSTOM:
			ptr->ml_flags |= XF86CONF_CUSTOM;
			break;
		case EOF_TOKEN:
			Error (UNEXPECTED_EOF_MSG, NULL);
			break;
		default:
			Error (INVALID_KEYWORD_MSG, xf86tokenString ());
			break;
		}
		token = xf86getSubTokenWithTab (&(ptr->ml_comment), TimingTab);
	}
	xf86unGetToken (token);

#ifdef DEBUG
	printf ("ModeLine parsed\n");
#endif
	return (ptr);
}


/*
 * xf86parseVerboseMode(void)
 *
 *    Parse a "verbose" Mode-EndMode entry of a Monitor or Modes
 *    section.
 */
XF86ConfModeLinePtr
xf86parseVerboseMode (void)
{
	int token, token2;
	int had_dotclock = 0, had_htimings = 0, had_vtimings = 0;
#if defined(SMI_FBCONFIG)
	void *line_er;			/* Ptr to Extnl Rep of config line */
#endif
	parsePrologue (XF86ConfModeLinePtr, XF86ConfModeLineRec)

	ptr->ml_verbose = TRUE;

	if (xf86getSubToken (&(ptr->ml_comment)) != STRING)
		Error ("Mode name expected", NULL);
	ptr->ml_identifier = val.str;
	for (;;)
	{
		token = xf86getToken(ModeTab);
#if defined(SMI_FBCONFIG)
		/*
		 * Get a ptr to the External Representation of this config line
		 */
		line_er = fbc_get_current_line_ER();

#endif
		if (token == ENDMODE)
		{
			break;
		}
		switch (token)
		{
		case COMMENT:
			ptr->ml_comment = xf86addComment(ptr->ml_comment, val.str);
			break;
		case DOTCLOCK:
			if ((token = xf86getSubToken (&(ptr->ml_comment))) != NUMBER)
				Error (NUMBER_MSG, "DotClock");
			ptr->ml_clock = (int) (val.realnum * 1000.0 + 0.5);
			had_dotclock = 1;
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->ml_dotclock_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMxxxSectionModeDotClock,
					FBC_INDENT_2);
#endif
			break;
		case HTIMINGS:
			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_hdisplay = val.num;
			else
				Error ("Horizontal display expected", NULL);

			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_hsyncstart = val.num;
			else
				Error ("Horizontal sync start expected", NULL);

			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_hsyncend = val.num;
			else
				Error ("Horizontal sync end expected", NULL);

			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_htotal = val.num;
			else
				Error ("Horizontal total expected", NULL);
			had_htimings = 1;
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->ml_htimings_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMxxxSectionModeHTimings,
					FBC_INDENT_2);
#endif
			break;
		case VTIMINGS:
			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_vdisplay = val.num;
			else
				Error ("Vertical display expected", NULL);

			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_vsyncstart = val.num;
			else
				Error ("Vertical sync start expected", NULL);

			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_vsyncend = val.num;
			else
				Error ("Vertical sync end expected", NULL);

			if (xf86getSubToken (&(ptr->ml_comment)) == NUMBER)
				ptr->ml_vtotal = val.num;
			else
				Error ("Vertical total expected", NULL);
			had_vtimings = 1;
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->ml_vtimings_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMxxxSectionModeVTimings,
					FBC_INDENT_2);
#endif
			break;
		case FLAGS:
			token = xf86getSubToken (&(ptr->ml_comment));
			if (token != STRING)
				Error (QUOTE_MSG, "Flags");
			while (token == STRING)
			{
				token2 = xf86getStringToken (TimingTab);
				switch (token2)
				{
				case TT_INTERLACE:
					ptr->ml_flags |= XF86CONF_INTERLACE;
					break;
				case TT_PHSYNC:
					ptr->ml_flags |= XF86CONF_PHSYNC;
					break;
				case TT_NHSYNC:
					ptr->ml_flags |= XF86CONF_NHSYNC;
					break;
				case TT_PVSYNC:
					ptr->ml_flags |= XF86CONF_PVSYNC;
					break;
				case TT_NVSYNC:
					ptr->ml_flags |= XF86CONF_NVSYNC;
					break;
				case TT_CSYNC:
					ptr->ml_flags |= XF86CONF_CSYNC;
					break;
				case TT_PCSYNC:
					ptr->ml_flags |= XF86CONF_PCSYNC;
					break;
				case TT_NCSYNC:
					ptr->ml_flags |= XF86CONF_NCSYNC;
					break;
				case TT_DBLSCAN:
					ptr->ml_flags |= XF86CONF_DBLSCAN;
					break;
				case TT_CUSTOM:
					ptr->ml_flags |= XF86CONF_CUSTOM;
					break;
				case EOF_TOKEN:
					Error (UNEXPECTED_EOF_MSG, NULL);
					break;
				default:
					Error ("Unknown flag string, %s",
							val.str);
					break;
				}
				token = xf86getSubToken (&(ptr->ml_comment));
			}
			xf86unGetToken (token);
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->ml_flags_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMxxxSectionModeFlags,
					FBC_INDENT_2);
#endif
			break;
		case HSKEW:
			if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
				Error ("Horizontal skew expected", NULL);
			ptr->ml_flags |= XF86CONF_HSKEW;
			ptr->ml_hskew = val.num;
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->ml_hskew_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMxxxSectionModeHSkew,
					FBC_INDENT_2);
#endif
			break;
		case VSCAN:
			if (xf86getSubToken (&(ptr->ml_comment)) != NUMBER)
				Error ("Vertical scan count expected", NULL);
			ptr->ml_flags |= XF86CONF_VSCAN;
			ptr->ml_vscan = val.num;
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->ml_vscan_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMxxxSectionModeVScan,
					FBC_INDENT_2);
#endif
			break;
		case EOF_TOKEN:
			Error (UNEXPECTED_EOF_MSG, NULL);
			break;
		default:
			Error ("Unexepcted token in verbose \"Mode\" entry\n", NULL);
			break;
		}
	}

#if defined(SMI_FBCONFIG)
	/*
	 * Link Internal & External Representations of the EndMode line
	 */
	ptr->ml_end_line_er = line_er;
	fbc_link_line_ER(line_er,
			(void *)ptr,
			NULL /* (xf86_print_fn_t *)&xf86printMxxxSectionEndMode */ ,
			FBC_INDENT_1);

#endif
	if (!had_dotclock)
		Error ("The DotClock is missing", NULL);
	if (!had_htimings)
		Error ("The horizontal timings are missing", NULL);
	if (!had_vtimings)
		Error ("The vertical timings are missing", NULL);

#ifdef DEBUG
	printf ("Verbose Mode parsed\n");
#endif
	return (ptr);
}

#undef CLEANUP

#define CLEANUP xf86freeMonitorList

XF86ConfMonitorPtr
xf86parseMonitorSection (void)
{
	int has_ident = FALSE;
	int token;
#if defined(SMI_FBCONFIG)
	void *line_er;			/* Ptr to Extnl Rep of config line */
#endif
	parsePrologue (XF86ConfMonitorPtr, XF86ConfMonitorRec)

	for (;;)
	{
		token = xf86getToken(MonitorTab);
#if defined(SMI_FBCONFIG)
		/*
		 * Get a ptr to the External Representation of this config line
		 */
		line_er = fbc_get_current_line_ER();

#endif
		if (token == ENDSECTION)
		{
			break;
		}
		switch (token)
		{
		case COMMENT:
			ptr->mon_comment = xf86addComment(ptr->mon_comment, val.str);
			break;
		case IDENTIFIER:
			if (xf86getSubToken (&(ptr->mon_comment)) != STRING)
				Error (QUOTE_MSG, "Identifier");
			if (has_ident == TRUE)
				Error (MULTIPLE_MSG, "Identifier");
			ptr->mon_identifier = val.str;
			has_ident = TRUE;
			break;
		case VENDOR:
			if (xf86getSubToken (&(ptr->mon_comment)) != STRING)
				Error (QUOTE_MSG, "Vendor");
			ptr->mon_vendor = val.str;
			break;
		case MODEL:
			if (xf86getSubToken (&(ptr->mon_comment)) != STRING)
				Error (QUOTE_MSG, "ModelName");
			ptr->mon_modelname = val.str;
			break;
		case MODE:
			HANDLE_LIST (mon_modeline_lst, xf86parseVerboseMode,
						 XF86ConfModeLinePtr);
			break;
		case MODELINE:
			HANDLE_LIST (mon_modeline_lst, xf86parseModeLine,
						 XF86ConfModeLinePtr);
			break;
		case DISPLAYSIZE:
			if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
				Error (DISPLAYSIZE_MSG, NULL);
			ptr->mon_width = val.realnum;
			if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
				Error (DISPLAYSIZE_MSG, NULL);
			ptr->mon_height = val.realnum;
			break;

		case HORIZSYNC:
			if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
				Error (HORIZSYNC_MSG, NULL);
			do {
				if (ptr->mon_n_hsync >= CONF_MAX_HSYNC)
					Error ("Sorry. Too many horizontal sync intervals.", NULL);
				ptr->mon_hsync[ptr->mon_n_hsync].lo = val.realnum;
				switch (token = xf86getSubToken (&(ptr->mon_comment)))
				{
					case COMMA:
						ptr->mon_hsync[ptr->mon_n_hsync].hi =
						ptr->mon_hsync[ptr->mon_n_hsync].lo;
						break;
					case DASH:
						if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER ||
						    (float)val.realnum < ptr->mon_hsync[ptr->mon_n_hsync].lo)
							Error (HORIZSYNC_MSG, NULL);
						ptr->mon_hsync[ptr->mon_n_hsync].hi = val.realnum;
						if ((token = xf86getSubToken (&(ptr->mon_comment))) == COMMA)
							break;
						ptr->mon_n_hsync++;
						goto HorizDone;
					default:
						/* We cannot currently know if a '\n' was found,
						 * or this is a real error
						 */
						ptr->mon_hsync[ptr->mon_n_hsync].hi =
						ptr->mon_hsync[ptr->mon_n_hsync].lo;
						ptr->mon_n_hsync++;
						goto HorizDone;
				}
				ptr->mon_n_hsync++;
			} while ((token = xf86getSubToken (&(ptr->mon_comment))) == NUMBER);
HorizDone:
			xf86unGetToken (token);
			break;

		case VERTREFRESH:
			if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
				Error (VERTREFRESH_MSG, NULL);
			do {
				ptr->mon_vrefresh[ptr->mon_n_vrefresh].lo = val.realnum;
				switch (token = xf86getSubToken (&(ptr->mon_comment)))
				{
					case COMMA:
						ptr->mon_vrefresh[ptr->mon_n_vrefresh].hi =
						ptr->mon_vrefresh[ptr->mon_n_vrefresh].lo;
						break;
					case DASH:
						if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER ||
						    (float)val.realnum < ptr->mon_vrefresh[ptr->mon_n_vrefresh].lo)
							Error (VERTREFRESH_MSG, NULL);
						ptr->mon_vrefresh[ptr->mon_n_vrefresh].hi = val.realnum;
						if ((token = xf86getSubToken (&(ptr->mon_comment))) == COMMA)
							break;
						ptr->mon_n_vrefresh++;
						goto VertDone;
					default:
						/* We cannot currently know if a '\n' was found,
						 * or this is a real error
						 */
						ptr->mon_vrefresh[ptr->mon_n_vrefresh].hi =
						ptr->mon_vrefresh[ptr->mon_n_vrefresh].lo;
						ptr->mon_n_vrefresh++;
						goto VertDone;
				}
				if (ptr->mon_n_vrefresh >= CONF_MAX_VREFRESH)
					Error ("Sorry. Too many vertical refresh intervals.", NULL);
				ptr->mon_n_vrefresh++;
			} while ((token = xf86getSubToken (&(ptr->mon_comment))) == NUMBER);
VertDone:
			xf86unGetToken (token);
			break;

		case GAMMA:
			if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
			{
				Error (INVALID_GAMMA_MSG, NULL);
				break;
			}
			ptr->mon_gamma_red = val.realnum;
			if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
			{
				ptr->mon_gamma_green = ptr->mon_gamma_red;
				ptr->mon_gamma_blue  = ptr->mon_gamma_red;
				xf86unGetToken (token);
			}
			else
			{
				ptr->mon_gamma_green = val.realnum;
				if (xf86getSubToken (&(ptr->mon_comment)) != NUMBER)
				{
					Error (INVALID_GAMMA_MSG, NULL);
					break;
				}
				ptr->mon_gamma_blue = val.realnum;
			}
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->mon_gamma_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printMonitorSectionGamma,
					FBC_INDENT_1);
#endif
			break;
		case OPTION:
			ptr->mon_option_lst = xf86parseOption(ptr->mon_option_lst);
			break;
		case USEMODES:
		        {
				XF86ConfModesLinkPtr mptr;

				if ((token = xf86getSubToken (&(ptr->mon_comment))) != STRING)
					Error (QUOTE_MSG, "UseModes");

				/* add to the end of the list of modes sections 
				   referenced here */
				mptr = xf86confcalloc (1, sizeof (XF86ConfModesLinkRec));
				mptr->list.next = NULL;
				mptr->ml_modes_str = val.str;
				mptr->ml_modes = NULL;
				ptr->mon_modes_sect_lst = (XF86ConfModesLinkPtr)
					xf86addListItem((GenericListPtr)ptr->mon_modes_sect_lst,
						    (GenericListPtr)mptr);
#if defined(SMI_FBCONFIG)
				/*
			 	 * Link Internal & External Representations of the line
			 	 */
				mptr->line_er = line_er;
				ptr->mon_usemodes_line_er = line_er;
#endif
			}
			break;
		case EOF_TOKEN:
			Error (UNEXPECTED_EOF_MSG, NULL);
			break;
		default:
			xf86parseError (INVALID_KEYWORD_MSG, xf86tokenString ());
			CLEANUP (ptr);
			return NULL;
		}
	}

#if defined(SMI_FBCONFIG)
	/*
	 * Link Internal & External Representations of the EndSection line
	 */
	ptr->mon_end_line_er = line_er;
	fbc_link_line_ER(line_er,
			(void *)ptr,
			(xf86_print_fn_t *)&xf86printMonitorSectionEndSection,
			FBC_INDENT_0);

#endif
	if (!has_ident)
		Error (NO_IDENT_MSG, NULL);

#ifdef DEBUG
	printf ("Monitor section parsed\n");
#endif
	return ptr;
}

#undef CLEANUP
#define CLEANUP xf86freeModesList

XF86ConfModesPtr
xf86parseModesSection (void)
{
	int has_ident = FALSE;
	int token;
	parsePrologue (XF86ConfModesPtr, XF86ConfModesRec)

#if defined(SMI_FBCONFIG)
	fbc_line_elem_t *line_er;			/* Ptr to Extnl Rep of config line */
	int isSunModesSection = FALSE;

	/*
	 * Link Internal & External Representations of the line
	 */
	line_er = fbc_get_current_line_ER();
	ptr->begin_line_er = line_er;

#endif /* SMI_FBCONFIG */


	while ((token = xf86getToken (ModesTab)) != ENDSECTION)
	{
		switch (token)
		{
		case COMMENT:
			ptr->modes_comment = xf86addComment(ptr->modes_comment, val.str);
			break;
		case IDENTIFIER:
			if (xf86getSubToken (&(ptr->modes_comment)) != STRING)
				Error (QUOTE_MSG, "Identifier");
			if (has_ident == TRUE)
				Error (MULTIPLE_MSG, "Identifier");
			ptr->modes_identifier = val.str;
			has_ident = TRUE;

#if defined(SMI_FBCONFIG)
			if (strcmp(val.str, "SunModes") == 0) {
				isSunModesSection = TRUE;
			}
#endif /* SMI_FBCONFIG */

			break;
		case MODE:
			HANDLE_LIST (mon_modeline_lst, xf86parseVerboseMode,
						 XF86ConfModeLinePtr);
			break;
		case MODELINE:
			HANDLE_LIST (mon_modeline_lst, xf86parseModeLine,
						 XF86ConfModeLinePtr);
			break;
		default:
			xf86parseError (INVALID_KEYWORD_MSG, xf86tokenString ());
			CLEANUP (ptr);
			return NULL;
			break;
		}
	}

#if defined(SMI_FBCONFIG)
	ptr->end_line_er = fbc_get_current_line_ER();

	if (isSunModesSection == TRUE) {
		while (line_er != NULL) {
			fbc_delete_line_ER(line_er);
			line_er = line_er->next_ptr;
		}
	}
#endif /* SMI_FBCONFIG */

	if (!has_ident)
		Error (NO_IDENT_MSG, NULL);

#ifdef DEBUG
	printf ("Modes section parsed\n");
#endif
	return ptr;
}

#undef CLEANUP


/*
 * xf86printMonitorSectionSection()
 *
 *    Write the Monitor section Section line to the configuration file.
 */
void
xf86printMonitorSectionSection(
	FILE *cf, XF86ConfMonitorPtr ptr, const char *const whitespace[])
{
	fprintf (cf, "Section \"Monitor\"\n");
	if (ptr->mon_comment != NULL) {
		fprintf(cf, "%s", ptr->mon_comment);
	}
}


/*
 * xf86printMonitorSectionIdentifier()
 *
 *    Write the Monitor section Identifier line to the configuration
 *    file.
 */
void
xf86printMonitorSectionIdentifier(
	FILE *cf, XF86ConfMonitorPtr ptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "Identifier", NULL);
	fprintf(cf, "\"%s\"\n", ptr->mon_identifier);
}


/*
 * xf86printMonitorSectionUseModes()
 *
 *    Write a Monitor section UseModes entry line to the configuration
 *    file.
 */
void
xf86printMonitorSectionUseModes(
	FILE *cf, XF86ConfModesLinkPtr mptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "UseModes", NULL);
	fprintf (cf, "\"%s\"\n", mptr->ml_modes_str);
}


/*
 * xf86printMonitorSectionGamma()
 *
 *    Write the Gamma entry of a Monitor section to the configuration
 *    file.
 */
void
xf86printMonitorSectionGamma(
	FILE *cf, XF86ConfMonitorPtr ptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "Gamma", NULL);
	if (ptr->mon_gamma_red == ptr->mon_gamma_green
			&& ptr->mon_gamma_red == ptr->mon_gamma_blue) {
		fprintf(cf, "%.4g\n", ptr->mon_gamma_red);
	} else {
		fprintf(cf, "%.4g %.4g %.4g\n",
				ptr->mon_gamma_red,
				ptr->mon_gamma_green,
				ptr->mon_gamma_blue);
	}
}


/*
 * xf86printMonitorSectionEndSection()
 *
 *    Write the Monitor section EndSection line to the configuration
 *    file.
 */
void
xf86printMonitorSectionEndSection(
	FILE *cf, XF86ConfMonitorPtr ptr, const char *const whitespace[])
{
	fprintf (cf, "EndSection\n");
}


/*
 * ModeLine/Mode-EndMode entry flags (in man page order)
 */
const static struct {
	int		mask;		/* Mode flag mask bit */
	char		*name;		/* Mode flag name string */
} modeFlagTab[] = {
	{ XF86CONF_INTERLACE, "Interlace"  },
	{ XF86CONF_DBLSCAN  , "DoubleScan" },
	{ XF86CONF_PHSYNC   , "+HSync"     },
	{ XF86CONF_NHSYNC   , "-HSync"     },
	{ XF86CONF_PVSYNC   , "+VSync"     },
	{ XF86CONF_NVSYNC   , "-VSync"     },
	{ XF86CONF_CSYNC    , "Composite"  },
	{ XF86CONF_PCSYNC   , "+CSync"     },
	{ XF86CONF_NCSYNC   , "-CSync"     },
	{ XF86CONF_CUSTOM   , "Custom"     },	/* ??? not in man page ??? */
	{ XF86CONF_BCAST    , "BCast"      },	/* ??? not in man page ??? */
	{ 0                 , NULL         }	/* End-of-table marker */
};


/*
 * xf86printMxxxSectionModeDotClock()
 *
 *    Write the DotClock line of a Mode-EndMode entry of a Monitor or
 *    Modes section to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeDotClock(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "DotClock", NULL);
	fprintf(cf, "%2.4f\n", mlptr->ml_clock/1000.0);
}


/*
 * xf86printMxxxSectionModeHTimings()
 *
 *    Write the HTimings line of a Mode-EndMode entry of a Monitor or
 *    Modes section to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeHTimings(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "HTimings", NULL);
	fprintf(cf, "%d %d %d %d\n",
			mlptr->ml_hdisplay,
			mlptr->ml_hsyncstart,
			mlptr->ml_hsyncend,
			mlptr->ml_htotal);
}


/*
 * xf86printMxxxSectionModeVTimings()
 *
 *    Write the VTimings line of a Mode-EndMode entry of a Monitor or
 *    Modes section to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeVTimings(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "VTimings", NULL);
	fprintf(cf, "%d %d %d %d\n",
			mlptr->ml_vdisplay,
			mlptr->ml_vsyncstart,
			mlptr->ml_vsyncend,
			mlptr->ml_vtotal);
}


/*
 * xf86printMxxxSectionModeFlags()
 *
 *    Write the Flags line of a Mode-EndMode entry of a Monitor or Modes
 *    section to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeFlags(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	int		have_flags;	/* TRUE => Flags printed */
	int		i;		/* Loop counter / array index */

	have_flags = FALSE;
	for (i = 0; modeFlagTab[i].name != NULL; i += 1) {
		if (mlptr->ml_flags & modeFlagTab[i].mask) {
			if (!have_flags) {
				xf86printFields(cf, whitespace, "Flags", NULL);
				have_flags = TRUE;
			} else {
				fputc(' ', cf);
			}
			fprintf(cf, "\"%s\"", modeFlagTab[i].name);
		}
	}
	if (have_flags) {
		fputc('\n', cf);
	}
}


/*
 * xf86printMxxxSectionModeHSkew()
 *
 *    Write the HSkew line of a Mode-EndMode entry of a Monitor or Modes
 *    section to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeHSkew(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "HSkew", NULL);
	fprintf(cf, " %d\n", mlptr->ml_hskew);
}


/*
 * xf86printMxxxSectionModeVScan()
 *
 *    Write the VScan line of a Mode-EndMode entry of a Monitor or Modes
 *    section to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeVScan(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "VScan", NULL);
	fprintf(cf, " %d\n", mlptr->ml_vscan);
}


/*
 * xf86printMxxxSectionMode()
 *
 *    Write the Mode-EndMode entry lines of a Monitor or Modes section
 *    to the configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionMode(
	FILE *cf, XF86ConfModeLinePtr mlptr,
	const char *const whitespace_a[], const char *const whitespace_b[])
{
	xf86printFields(cf, whitespace_a, "Mode", NULL);
	fprintf(cf, "\"%s\"\n", mlptr->ml_identifier);
	xf86printMxxxSectionModeDotClock(cf, mlptr, whitespace_b);
	xf86printMxxxSectionModeHTimings(cf, mlptr, whitespace_b);
	xf86printMxxxSectionModeVTimings(cf, mlptr, whitespace_b);
	xf86printMxxxSectionModeFlags(cf, mlptr, whitespace_b);
	if (mlptr->ml_flags & XF86CONF_HSKEW) {
		xf86printMxxxSectionModeHSkew(cf, mlptr, whitespace_b);
	}
	if (mlptr->ml_flags & XF86CONF_VSCAN) {
		xf86printMxxxSectionModeVScan(cf, mlptr, whitespace_b);
	}
	xf86printFields(cf, whitespace_a, "EndMode\n", NULL);
}


/*
 * xf86printMxxxSectionModeLine()
 *
 *    Write a ModeLine entry of a Monitor or Modes section to the
 *    configuration file.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
void
xf86printMxxxSectionModeLine(
	FILE *cf, XF86ConfModeLinePtr mlptr, const char *const whitespace[])
{
	int		i;		/* Loop counter / array index */

	/* ModeLine entry name w/ whitespace fields */
	xf86printFields(cf, whitespace, "ModeLine", NULL);

	/* Identifier, DotClock */
	fprintf(cf, "\"%s\" %2.1f",
			mlptr->ml_identifier, mlptr->ml_clock / 1000.0);

	/* HTimings */
	fprintf(cf, " %d %d %d %d",
			mlptr->ml_hdisplay, mlptr->ml_hsyncstart,
			mlptr->ml_hsyncend, mlptr->ml_htotal);

	/* VTimings */
	fprintf(cf, " %d %d %d %d",
			mlptr->ml_vdisplay, mlptr->ml_vsyncstart,
			mlptr->ml_vsyncend, mlptr->ml_vtotal);

	/* Flags */
	for (i = 0; modeFlagTab[i].name != NULL; i += 1) {
		if (mlptr->ml_flags & modeFlagTab[i].mask) {
			fprintf(cf, " %s", modeFlagTab[i].name);
		}
	}

	/* HSkew */
	if (mlptr->ml_hskew != 0) {
		fprintf(cf, " HSkew %d", mlptr->ml_hskew);
	}

	/* VScan */
	if (mlptr->ml_vscan != 0) {
		fprintf(cf, " VScan %d", mlptr->ml_vscan);
	}

	/* Comment (if any) and line terminator */
	if (mlptr->ml_comment) {
		fprintf(cf, "%s", mlptr->ml_comment);
	} else {
		fprintf(cf, "\n");
	}
}


/*
 * xf86printMonitorSection()
 *
 *    Write a Monitor section to the configuration file.
 */
void
xf86printMonitorSection (FILE * cf, XF86ConfMonitorPtr ptr)
{
	int i;
	XF86ConfModeLinePtr mlptr;	/* Ptr to ModeLine / Mode entry */
	XF86ConfModesLinkPtr mptr;	/* Ptr to UseModes entry */

	while (ptr)
	{
		mptr = ptr->mon_modes_sect_lst;

		xf86printMonitorSectionSection(cf, ptr, xf86whitespace_0);
		if (ptr->mon_identifier) {
			xf86printMonitorSectionIdentifier(
						cf, ptr, xf86whitespace_1);
		}
		if (ptr->mon_vendor)
			fprintf (cf, "\tVendorName   \"%s\"\n", ptr->mon_vendor);
		if (ptr->mon_modelname)
			fprintf (cf, "\tModelName    \"%s\"\n", ptr->mon_modelname);
		while (mptr) {
			xf86printMonitorSectionUseModes(cf, mptr, xf86whitespace_1);
			mptr = mptr->list.next;
		}
		if (ptr->mon_width)
			fprintf (cf, "\tDisplaySize  %d\t%d\n",
					 ptr->mon_width,
					 ptr->mon_height);
		if ( ptr->mon_n_hsync || ptr->mon_n_vrefresh )
		    fprintf(cf," ### Comment all HorizSync and VertRefresh values to use DDC:\n");
		for (i = 0; i < ptr->mon_n_hsync; i++)
		{
			fprintf (cf, "\tHorizSync    %2.1f - %2.1f\n",
					 ptr->mon_hsync[i].lo,
					 ptr->mon_hsync[i].hi);
		}
		for (i = 0; i < ptr->mon_n_vrefresh; i++)
		{
			fprintf (cf, "\tVertRefresh  %2.1f - %2.1f\n",
					 ptr->mon_vrefresh[i].lo,
					 ptr->mon_vrefresh[i].hi);
		}
		if (ptr->mon_gamma_red) {
			xf86printMonitorSectionGamma(cf, ptr, xf86whitespace_1);
		}
		for (mlptr = ptr->mon_modeline_lst; mlptr; mlptr = mlptr->list.next)
		{
			if (mlptr->ml_verbose) {
				xf86printMxxxSectionMode(
					cf, mlptr, xf86whitespace_1, xf86whitespace_2);
			} else {
				xf86printMxxxSectionModeLine(
					cf, mlptr, xf86whitespace_1);
			}
		}
		xf86printOptionList(cf, ptr->mon_option_lst, xf86whitespace_1);
		xf86printMonitorSectionEndSection(cf, ptr, xf86whitespace_0);
		fprintf (cf, "\n");
		ptr = ptr->list.next;
	}
}

void
xf86printModesSection (FILE * cf, XF86ConfModesPtr ptr)
{
	XF86ConfModeLinePtr mlptr;

	while (ptr)
	{
		fprintf (cf, "Section \"Modes\"\n");
		if (ptr->modes_comment)
			fprintf (cf, "%s", ptr->modes_comment);
		if (ptr->modes_identifier)
			fprintf (cf, "\tIdentifier     \"%s\"\n", ptr->modes_identifier);
		for (mlptr = ptr->mon_modeline_lst; mlptr; mlptr = mlptr->list.next)
		{
			if (mlptr->ml_verbose) {
				xf86printMxxxSectionMode(
					cf, mlptr, xf86whitespace_1, xf86whitespace_2);
			} else {
				xf86printMxxxSectionModeLine(
					cf, mlptr, xf86whitespace_1);
			}
		}
		fprintf (cf, "EndSection\n\n");
		ptr = ptr->list.next;
	}
}

void
xf86freeMonitorList (XF86ConfMonitorPtr ptr)
{
	XF86ConfMonitorPtr prev;

	while (ptr)
	{
		TestFree (ptr->mon_identifier);
		TestFree (ptr->mon_vendor);
		TestFree (ptr->mon_modelname);
		TestFree (ptr->mon_comment);
		xf86optionListFree (ptr->mon_option_lst);
		xf86freeModeLineList (ptr->mon_modeline_lst);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

void
xf86freeModesList (XF86ConfModesPtr ptr)
{
	XF86ConfModesPtr prev;

	while (ptr)
	{
		TestFree (ptr->modes_identifier);
		TestFree (ptr->modes_comment);
		xf86freeModeLineList (ptr->mon_modeline_lst);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

void
xf86freeModeLineList (XF86ConfModeLinePtr ptr)
{
	XF86ConfModeLinePtr prev;
	while (ptr)
	{
		TestFree (ptr->ml_identifier);
		TestFree (ptr->ml_comment);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

XF86ConfMonitorPtr
xf86findMonitor (const char *ident, XF86ConfMonitorPtr p)
{
	while (p)
	{
		if (xf86nameCompare (ident, p->mon_identifier) == 0)
			return (p);

		p = p->list.next;
	}
	return (NULL);
}

/*
 * xf86findModes()
 *
 *    Given the name of a Modes section, search the list of Modes
 *    sections and return a pointer to the matching section.  Return
 *    NULL if no Modes section has that name.
 */
XF86ConfModesPtr
xf86findModes (const char *ident, XF86ConfModesPtr p)
{
	while (p)
	{
		if (xf86nameCompare (ident, p->modes_identifier) == 0)
			return (p);

		p = p->list.next;
	}
	return (NULL);
}

/*
 * xf86findModeLine()
 *
 *    Given the name of a ModeLine / Mode-EndMode entry and a list of
 *    entries from a Monitor or Modes section, search the list of
 *    entries and return a pointer to the matching entry.  Return NULL
 *    if no ModeLine / Mode-EndMode entry in the section has that name.
 */
XF86ConfModeLinePtr
xf86findModeLine (const char *ident, XF86ConfModeLinePtr p)
{
	while (p)
	{
		if (xf86nameCompare (ident, p->ml_identifier) == 0)
			return (p);

		p = p->list.next;
	}
	return (NULL);
}

/*
 * xf86validateMonitor()
 *
 *    Validate a Monitor section that is referenced by the specified
 *    Screen section.  Validation of a Monitor section consists of
 *    making sure that every UseModes entry in the section specifies the
 *    name of an existing Modes section.  A link is also created from
 *    each UseModes entry to the matching Modes section.  Return TRUE
 *    iff successful.
 */
int
xf86validateMonitor(
	XF86ConfigPtr	p,		/* Ptr to configuration stuff */
	const char *const screen_identifier, /* Name of Screen section */
	XF86ConfMonitorPtr monitor)	/* Monitor section to validate */
{
	XF86ConfModesLinkPtr modeslnk;
	XF86ConfModesPtr modes;

	for (modeslnk = monitor->mon_modes_sect_lst;
		modeslnk != NULL;
		modeslnk = modeslnk->list.next) {

		modes = xf86findModes (modeslnk->ml_modes_str, p->conf_modes_lst);
		if (!modes)
		{
			xf86validationError (UNDEFINED_MODES_MSG, 
						modeslnk->ml_modes_str, 
						screen_identifier);
			return (FALSE);
		}
		modeslnk->ml_modes = modes;
	}
	return (TRUE);
}

