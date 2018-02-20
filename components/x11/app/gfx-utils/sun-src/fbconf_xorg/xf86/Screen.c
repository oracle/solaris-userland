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

static xf86ConfigSymTabRec DisplayTab[] =
{
	{ENDSUBSECTION, "endsubsection"},
	{MODES, "modes"},
	{VIEWPORT, "viewport"},
	{VIRTUAL, "virtual"},
	{VISUAL, "visual"},
	{BLACK_TOK, "black"},
	{WHITE_TOK, "white"},
	{MONITOR, "monitor"},
	{DEPTH, "depth"},
	{BPP, "fbbpp"},
	{WEIGHT, "weight"},
	{OPTION, "option"},
	{-1, ""},
};


/*
 * xf86parseScrnMonitor()
 *
 *    Parse the Monitor entry line of a Screen section.  Return a
 *    pointer to the diagnostic message text in the event of an error.
 */
static
char *
xf86parseScrnMonitor(
	XF86ConfScreenPtr ptr)		/* Ptr to Screen section structure */
{
	XF86ConfScrnMonitorEntryRec mon_entry; /* Temp Monitor entry element */
	XF86ConfScrnMonitorEntryPtr mon_ptr; /* Ptr to Monitor list element */
	int		token;		/* Monitor entry token ID */

	/*
	 * Look for the optional monitor number token
	 */
	mon_entry.scrn_monitor_num_seen = FALSE;
	mon_entry.scrn_monitor_num      = 0;
	token = xf86getSubToken(&(ptr->scrn_comment));
	if (token == NUMBER) {
		mon_entry.scrn_monitor_num_seen = TRUE;
		mon_entry.scrn_monitor_num      = val.num;
		token = xf86getSubToken(&(ptr->scrn_comment));
	}

	/*
	 * Look for the monitor name string token
	 */
	if (token != STRING) {
		/* Monitor entry syntax error */
		return (MONITOR_SYNTAX_MSG);
	}
	mon_entry.scrn_monitor_name = val.str;

	/*
	 * Don't allow:
	 *     * Monitor numbers to be omitted when there are muliple
	 *       Monitor entries
	 *     * Duplicate Monitor numbers
	 *     * Duplicate Monitor names
	 */
	for (mon_ptr = ptr->scrn_monitor_lst;
		mon_ptr != NULL;
		mon_ptr = (XF86ConfScrnMonitorEntryPtr)mon_ptr->list.next) {

		if (!mon_entry.scrn_monitor_num_seen ||
					!mon_ptr->scrn_monitor_num_seen) {
			/* Missing monitor number */
			return (MONITOR_NUM_REQUIRED_MSG);
		}
		if (mon_entry.scrn_monitor_num ==
					mon_ptr->scrn_monitor_num) {
			/* Duplicate monitor number */
			return (MONITOR_DUP_NUM_MSG);
		}
		if (xf86nameCompare(mon_entry.scrn_monitor_name,
					mon_ptr->scrn_monitor_name) == 0) {
			/* Duplicate monitor name */
			return (MONITOR_DUP_NAME_MSG);
		}
	}

	/*
	 * Append the new Monitor entry element to the list
	 */
	mon_ptr = xf86confcalloc(1, sizeof (XF86ConfScrnMonitorEntryRec));
	if (mon_ptr == NULL) {
		/* Insufficient memory */
		return (NO_MEMORY_MSG);
	}
	mon_ptr->list.next             = NULL;
	mon_ptr->scrn_monitor_num_seen = mon_entry.scrn_monitor_num_seen;
	mon_ptr->scrn_monitor_num      = mon_entry.scrn_monitor_num;
	mon_ptr->scrn_monitor_name     = mon_entry.scrn_monitor_name;
	mon_ptr->scrn_monitor          = NULL;
	ptr->scrn_monitor_lst = (XF86ConfScrnMonitorEntryPtr)xf86addListItem(
						(glp)ptr->scrn_monitor_lst,
						(glp)mon_ptr);

	/*
	 * Return successfully
	 */
	return (NULL);

}


#define CLEANUP xf86freeDisplayList

XF86ConfDisplayPtr
xf86parseDisplaySubSection (void)
{
	int token;
#if defined(SMI_FBCONFIG)
	void *line_er;		/* Ptr to Extnl Rep of config file line */
#endif
	parsePrologue (XF86ConfDisplayPtr, XF86ConfDisplayRec)

	ptr->disp_monitor_seen = FALSE;

	ptr->disp_black.red = ptr->disp_black.green = ptr->disp_black.blue = -1;
	ptr->disp_white.red = ptr->disp_white.green = ptr->disp_white.blue = -1;
	ptr->disp_frameX0 = ptr->disp_frameY0 = -1;
	for (;;)
	{
		token = xf86getToken(DisplayTab);

#if defined(SMI_FBCONFIG)
		/*
		 * Get a ptr to the External Representation of this config line
		 */
		line_er = fbc_get_current_line_ER();

#endif
		if (token == ENDSUBSECTION)
		{
			break;
		}
		switch (token)
		{
		case COMMENT:
			ptr->disp_comment = xf86addComment(ptr->disp_comment, val.str);
			break;
		case VIEWPORT:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (VIEWPORT_MSG, NULL);
			ptr->disp_frameX0 = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (VIEWPORT_MSG, NULL);
			ptr->disp_frameY0 = val.num;
			break;
		case VIRTUAL:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (VIRTUAL_MSG, NULL);
			ptr->disp_virtualX = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (VIRTUAL_MSG, NULL);
			ptr->disp_virtualY = val.num;
			break;
		case MONITOR:
			if (ptr->disp_monitor_seen ||
				(xf86getSubToken(&(ptr->disp_comment)) != NUMBER)) {
					Error (NUMBER_MSG, "Display");
			}
			ptr->disp_monitor_seen = TRUE;
			ptr->disp_monitor_num  = val.num;
			break;
		case DEPTH:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (NUMBER_MSG, "Display");
			ptr->disp_depth = val.num;
			break;
		case BPP:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (NUMBER_MSG, "Display");
			ptr->disp_bpp = val.num;
			break;
		case VISUAL:
			if (xf86getSubToken (&(ptr->disp_comment)) != STRING)
				Error (QUOTE_MSG, "Display");
			ptr->disp_visual = val.str;
			break;
		case WEIGHT:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (WEIGHT_MSG, NULL);
			ptr->disp_weight.red = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (WEIGHT_MSG, NULL);
			ptr->disp_weight.green = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (WEIGHT_MSG, NULL);
			ptr->disp_weight.blue = val.num;
			break;
		case BLACK_TOK:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (BLACK_MSG, NULL);
			ptr->disp_black.red = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (BLACK_MSG, NULL);
			ptr->disp_black.green = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (BLACK_MSG, NULL);
			ptr->disp_black.blue = val.num;
			break;
		case WHITE_TOK:
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (WHITE_MSG, NULL);
			ptr->disp_white.red = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (WHITE_MSG, NULL);
			ptr->disp_white.green = val.num;
			if (xf86getSubToken (&(ptr->disp_comment)) != NUMBER)
				Error (WHITE_MSG, NULL);
			ptr->disp_white.blue = val.num;
			break;
		case MODES:
			{
				XF86ModePtr mptr;

				while ((token = xf86getSubTokenWithTab (&(ptr->disp_comment), DisplayTab)) == STRING)
				{
					mptr = xf86confcalloc (1, sizeof (XF86ModeRec));
					mptr->mode_name = val.str;
					mptr->list.next = NULL;
					ptr->disp_mode_lst = (XF86ModePtr)
						xf86addListItem ((glp) ptr->disp_mode_lst, (glp) mptr);
				}
				xf86unGetToken (token);
			}
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->disp_modes_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printDisplaySubsectionModes,
					FBC_INDENT_2);
#endif
			break;
		case OPTION:
			ptr->disp_option_lst = xf86parseOption(ptr->disp_option_lst);
			break;
			
		case EOF_TOKEN:
			Error (UNEXPECTED_EOF_MSG, NULL);
			break;
		default:
			Error (INVALID_KEYWORD_MSG, xf86tokenString ());
			break;
		}
	}

#if defined(SMI_FBCONFIG)
	/*
	 * Link Internal & External Representations of the EndSubSection line
	 */
	ptr->disp_end_line_er = line_er;
	fbc_link_line_ER(line_er,
			(void *)ptr,
			(xf86_print_fn_t *)&xf86printDisplaySubsectionEndSubsection,
			FBC_INDENT_1);

#endif
#ifdef DEBUG
	printf ("Display subsection parsed\n");
#endif

	return ptr;
}

#undef CLEANUP

static xf86ConfigSymTabRec ScreenTab[] =
{
	{ENDSECTION, "endsection"},
	{IDENTIFIER, "identifier"},
	{OBSDRIVER, "driver"},
	{MDEVICE, "device"},
	{MONITOR, "monitor"},
	{VIDEOADAPTOR, "videoadaptor"},
	{SCREENNO, "screenno"},
	{SUBSECTION, "subsection"},
	{DEFAULTDEPTH, "defaultcolordepth"},
	{DEFAULTDEPTH, "defaultdepth"},
	{DEFAULTBPP, "defaultbpp"},
	{DEFAULTFBBPP, "defaultfbbpp"},
	{OPTION, "option"},
	{-1, ""},
};

#define CLEANUP xf86freeScreenList
XF86ConfScreenPtr
xf86parseScreenSection (void)
{
	int has_ident = FALSE;
	int has_driver= FALSE;
	int token;
#if defined(SMI_FBCONFIG)
	void *line_er;		/* Ptr to Extnl Rep of config file line */
#endif
	parsePrologue (XF86ConfScreenPtr, XF86ConfScreenRec)

	for (;;)
	{
		token = xf86getToken(ScreenTab);
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
			ptr->scrn_comment = xf86addComment(ptr->scrn_comment, val.str);
			break;
		case IDENTIFIER:
			if (xf86getSubToken (&(ptr->scrn_comment)) != STRING)
				Error (QUOTE_MSG, "Identifier");
			ptr->scrn_identifier = val.str;
			if (has_ident || has_driver)
				Error (ONLY_ONE_MSG,"Identifier or Driver");
			has_ident = TRUE;
			break;
		case OBSDRIVER:
			if (xf86getSubToken (&(ptr->scrn_comment)) != STRING)
				Error (QUOTE_MSG, "Driver");
			ptr->scrn_obso_driver = val.str;
			if (has_ident || has_driver)
				Error (ONLY_ONE_MSG,"Identifier or Driver");
			has_driver = TRUE;
			break;
		case DEFAULTDEPTH:
			if (xf86getSubToken (&(ptr->scrn_comment)) != NUMBER)
				Error (NUMBER_MSG, "DefaultDepth");
			ptr->scrn_defaultdepth = val.num;
#if defined(SMI_FBCONFIG)
			/*
			 * Link Internal & External Representations of the line
			 */
			ptr->scrn_defaultdepth_line_er = line_er;
			fbc_link_line_ER(line_er,
					(void *)ptr,
					(xf86_print_fn_t *)&xf86printScreenSectionDefaultDepth,
					FBC_INDENT_1);
#endif
			break;
		case DEFAULTBPP:
			if (xf86getSubToken (&(ptr->scrn_comment)) != NUMBER)
				Error (NUMBER_MSG, "DefaultBPP");
			ptr->scrn_defaultbpp = val.num;
			break;
		case DEFAULTFBBPP:
			if (xf86getSubToken (&(ptr->scrn_comment)) != NUMBER)
				Error (NUMBER_MSG, "DefaultFbBPP");
			ptr->scrn_defaultfbbpp = val.num;
			break;
		case MDEVICE:
			if (xf86getSubToken (&(ptr->scrn_comment)) != STRING)
				Error (QUOTE_MSG, "Device");
			if (ptr->scrn_device_str != NULL) {
				Error (MULTIPLE_MSG, "Device");
			}
			ptr->scrn_device_str = val.str;
			break;
		case MONITOR:
			{
				char *error_msg;
				error_msg = xf86parseScrnMonitor(ptr);
				if (error_msg != NULL) {
					Error (error_msg, NULL);
				}
			}
			break;
		case VIDEOADAPTOR:
			{
				XF86ConfAdaptorLinkPtr aptr;

				if (xf86getSubToken (&(ptr->scrn_comment)) != STRING)
					Error (QUOTE_MSG, "VideoAdaptor");

				/* Don't allow duplicates */
				for (aptr = ptr->scrn_adaptor_lst; aptr; 
					aptr = (XF86ConfAdaptorLinkPtr) aptr->list.next)
					if (xf86nameCompare (val.str, aptr->al_adaptor_str) == 0)
						break;

				if (aptr == NULL)
				{
					aptr = xf86confcalloc (1, sizeof (XF86ConfAdaptorLinkRec));
					aptr->list.next = NULL;
					aptr->al_adaptor_str = val.str;
					ptr->scrn_adaptor_lst = (XF86ConfAdaptorLinkPtr)
						xf86addListItem ((glp) ptr->scrn_adaptor_lst, (glp) aptr);
				}
			}
			break;
		case OPTION:
			ptr->scrn_option_lst = xf86parseOption(ptr->scrn_option_lst);
			break;
		case SUBSECTION:
			if (xf86getSubToken (&(ptr->scrn_comment)) != STRING)
				Error (QUOTE_MSG, "SubSection");
			{
				xf86conffree(val.str);
				HANDLE_LIST (scrn_display_lst, xf86parseDisplaySubSection,
							 XF86ConfDisplayPtr);
			}
			break;
		case EOF_TOKEN:
			Error (UNEXPECTED_EOF_MSG, NULL);
			break;
		default:
			Error (INVALID_KEYWORD_MSG, xf86tokenString ());
			break;
		}
	}

#if defined(SMI_FBCONFIG)
	/*
	 * Link Internal & External Representations of the EndSection line
	 */
	ptr->scrn_end_line_er = line_er;
	fbc_link_line_ER(line_er,
			(void *)ptr,
			(xf86_print_fn_t *)&xf86printScreenSectionEndSection,
			FBC_INDENT_0);

#endif
	if (!has_ident && !has_driver)
		Error (NO_IDENT_MSG, NULL);

#ifdef DEBUG
	printf ("Screen section parsed\n");
#endif

	return ptr;
}


/*
 * xf86printDisplaySubsectionSubsection()
 *
 *    Write the Display subsection Subsection line to the configuration
 *    file.
 */
void
xf86printDisplaySubsectionSubsection(
	FILE		*cf,		/* Config file output stream */
	XF86ConfDisplayPtr dptr,	/* Ptr to Display subsection */
	const char *const whitespace[])
{
	fprintf(cf, "\tSubsection \"Display\"\n");
	if (dptr->disp_comment != NULL) {
		fprintf(cf, "%s", dptr->disp_comment);
	}
}


/*
 * xf86printDisplaySubectionMonitor()
 *
 *    Write a Display subsection Monitor entry line to the configuration
 *    file.
 */
void
xf86printDisplaySubsectionMonitor(
	FILE		*cf,		/* Config file output stream */
	XF86ConfDisplayPtr dptr,	/* Ptr to Display subsection */
	const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "Monitor", NULL);
	fprintf(cf, "%d\n", dptr->disp_monitor_num);
}


/*
 * xf86printDisplaySubsectionModes()
 *
 *    Write the Modes line of a Display subsection of a Screen section
 *    to the configuration file.
 */
void
xf86printDisplaySubsectionModes(
	FILE		*cf,		/* Config file output stream */
	XF86ConfDisplayPtr dptr,	/* Ptr to Display subsection */
	const char *const whitespace[])
{
	XF86ModePtr	mptr;		/* Ptr to Modes name list element */
	const char	*space;		/* Ptr to "" or " " separator */

	xf86printFields(cf, whitespace, "Modes", NULL);
	space = "";
	for (mptr = dptr->disp_mode_lst; mptr != NULL; mptr = mptr->list.next)
	{
		fprintf(cf, "%s\"%s\"", space, mptr->mode_name);
		space = " ";
	}
	fprintf(cf, "\n");
}


/*
 * xf86printDisplaySubsectionEndSubsection()
 *
 *    Write the Display subsection EndSubsection line to the
 *    configuration file.
 */
void
xf86printDisplaySubsectionEndSubsection(
	FILE		*cf,		/* Config file output stream */
	XF86ConfDisplayPtr dptr,	/* Ptr to Display subsection */
	const char *const whitespace[])
{
//???	xf86printFields(cf, whitespace, "EndSubsection\n", NULL);
	fprintf (cf, "\tEndSubsection\n");
}


/*
 * xf86printScreenSectionSection()
 *
 *    Write the Screen section Section line to the configuration file.
 */
void
xf86printScreenSectionSection(
	FILE * cf, XF86ConfScreenPtr ptr, const char *const whitespace[])
{
	fprintf (cf, "Section \"Screen\"\n");
	if (ptr->scrn_comment != NULL) {
		fprintf(cf, "%s", ptr->scrn_comment);
	}
}


/*
 * xf86printScreenSectionIdentifier()
 *
 *    Write the Screen section Identifier line to the configuration
 *    file.
 */
void
xf86printScreenSectionIdentifier(
	FILE * cf, XF86ConfScreenPtr ptr, const char *const whitespace[])
{
/*???*/	xf86printFields(cf, whitespace, "Identifier", NULL);
	fprintf(cf, "\"%s\"\n", ptr->scrn_identifier);
}


/*
 * xf86printScreenSectionDevice()
 *
 *    Write the Screen section Device entry line to the configuration
 *    file.
 */
void
xf86printScreenSectionDevice(
	FILE * cf, XF86ConfScreenPtr ptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "Device", NULL);
	fprintf(cf, "\"%s\"\n", ptr->scrn_device_str);
}


/*
 * xf86printScreenSectionMonitor()
 *
 *    Write a Screen section Monitor entry line to the configuration
 *    file.
 */
void
xf86printScreenSectionMonitor(
	FILE		* cf,		/* Config file output stream */
	XF86ConfScrnMonitorEntryPtr mon_ptr, /* Ptr to Monitor entry */
	const char *const whitespace[])
{
	char		monitor_field[64]; /* "Monitor[ <num>]" */

	sprintf(monitor_field,
		(mon_ptr->scrn_monitor_num_seen) ? "Monitor %d" : "Monitor",
		mon_ptr->scrn_monitor_num);
	xf86printFields(cf, whitespace, monitor_field, NULL);
	fprintf(cf, "\"%s\"\n", mon_ptr->scrn_monitor_name);
}


/*
 * xf86printScreenSectionDefaultDepth()
 *
 *    Write a Screen section DefaultDepth entry to the configuration
 *    file.
 */
void
xf86printScreenSectionDefaultDepth(
	FILE * cf, XF86ConfScreenPtr ptr, const char *const whitespace[])
{
	xf86printFields(cf, whitespace, "DefaultDepth", NULL);
	fprintf(cf, "%d\n", ptr->scrn_defaultdepth);
}


/*
 * xf86printScreenSectionEndSection()
 *
 *    Write the Screen section EndSection line to the configuration
 *    file.
 */
void
xf86printScreenSectionEndSection(
	FILE * cf, XF86ConfScreenPtr ptr, const char *const whitespace[])
{
	fprintf (cf, "EndSection\n");
}


/*
 * xf86printScreenSection()
 *
 *    Write a Screen section to the configuration file.
 */
void
xf86printScreenSection (FILE * cf, XF86ConfScreenPtr ptr)
{
	XF86ConfAdaptorLinkPtr aptr;
	XF86ConfDisplayPtr dptr;
	XF86ConfScrnMonitorEntryPtr mon_ptr; /* Ptr to a Monitor element */

	while (ptr)
	{
		xf86printScreenSectionSection(cf, ptr, xf86whitespace_0);
		if (ptr->scrn_identifier) {
			xf86printScreenSectionIdentifier(
						cf, ptr, xf86whitespace_1);
		}
		if (ptr->scrn_obso_driver)
			fprintf (cf, "\tDriver     \"%s\"\n", ptr->scrn_obso_driver);
		if (ptr->scrn_device_str) {
			xf86printScreenSectionDevice(
						cf, ptr, xf86whitespace_1);
		}
		for (mon_ptr = ptr->scrn_monitor_lst;
			mon_ptr != NULL;
			mon_ptr = (XF86ConfScrnMonitorEntryPtr)mon_ptr->list.next) {
			xf86printScreenSectionMonitor(cf, mon_ptr, xf86whitespace_1);
		}
		if (ptr->scrn_defaultdepth)
			xf86printScreenSectionDefaultDepth(cf, ptr, xf86whitespace_1);
		if (ptr->scrn_defaultbpp)
			fprintf (cf, "\tDefaultBPP     %d\n",
					 ptr->scrn_defaultbpp);
		if (ptr->scrn_defaultfbbpp)
			fprintf (cf, "\tDefaultFbBPP     %d\n",
					 ptr->scrn_defaultfbbpp);
		xf86printOptionList(cf, ptr->scrn_option_lst, xf86whitespace_1);
		for (aptr = ptr->scrn_adaptor_lst; aptr; aptr = aptr->list.next)
		{
			fprintf (cf, "\tVideoAdaptor \"%s\"\n", aptr->al_adaptor_str);
		}

		/*
		 * Write each Display subsection to the configuration file
		 */
		for (dptr = ptr->scrn_display_lst; dptr; dptr = dptr->list.next)
		{
			xf86printDisplaySubsectionSubsection(cf, dptr, xf86whitespace_1);
			if (dptr->disp_monitor_seen) {
				xf86printDisplaySubsectionMonitor(cf, dptr, xf86whitespace_1);
			}

			if (dptr->disp_frameX0 >= 0 || dptr->disp_frameY0 >= 0)
			{
				fprintf (cf, "\t\tViewport   %d %d\n",
						 dptr->disp_frameX0, dptr->disp_frameY0);
			}
			if (dptr->disp_virtualX != 0 || dptr->disp_virtualY != 0)
			{
				fprintf (cf, "\t\tVirtual   %d %d\n",
						 dptr->disp_virtualX, dptr->disp_virtualY);
			}
			if (dptr->disp_depth)
			{
				fprintf (cf, "\t\tDepth     %d\n", dptr->disp_depth);
			}
			if (dptr->disp_bpp)
			{
				fprintf (cf, "\t\tFbBPP     %d\n", dptr->disp_bpp);
			}
			if (dptr->disp_visual)
			{
				fprintf (cf, "\t\tVisual    \"%s\"\n", dptr->disp_visual);
			}
			if (dptr->disp_weight.red != 0)
			{
				fprintf (cf, "\t\tWeight    %d %d %d\n",
					 dptr->disp_weight.red, dptr->disp_weight.green, dptr->disp_weight.blue);
			}
			if (dptr->disp_black.red != -1)
			{
				fprintf (cf, "\t\tBlack     0x%04x 0x%04x 0x%04x\n",
					  dptr->disp_black.red, dptr->disp_black.green, dptr->disp_black.blue);
			}
			if (dptr->disp_white.red != -1)
			{
				fprintf (cf, "\t\tWhite     0x%04x 0x%04x 0x%04x\n",
					  dptr->disp_white.red, dptr->disp_white.green, dptr->disp_white.blue);
			}
			if (dptr->disp_mode_lst != NULL)
			{
				xf86printDisplaySubsectionModes(cf, dptr, xf86whitespace_2);
			}
			xf86printOptionList(cf, dptr->disp_option_lst, xf86whitespace_2);
			xf86printDisplaySubsectionEndSubsection(
						cf, dptr, xf86whitespace_1);
		}
		xf86printScreenSectionEndSection(cf, ptr, xf86whitespace_0);
		fprintf(cf, "\n");
		ptr = ptr->list.next;
	}

}


/*
 * xf86freeScrnMonitorList()
 *
 *    Free the list of Monitor entries of a Screen section, and the
 *    contents of each entry (i.e. Monitor section name string).
 *
 *    Note that xf86conffree() (aka free()) accepts NULL pointers.
 */
static
void
xf86freeScrnMonitorList(XF86ConfScrnMonitorEntryPtr mon_ptr)
{
	XF86ConfScrnMonitorEntryPtr next_mon_ptr;

	for ( ; mon_ptr != NULL; mon_ptr = next_mon_ptr) {
		next_mon_ptr = mon_ptr->list.next;
		xf86conffree(mon_ptr->scrn_monitor_name);
		xf86conffree(mon_ptr);
	}
}


/*
 * xf86freeScreenList()
 *
 *    Free the list of Screen sections, and the contents of each
 *    section.
 */
void
xf86freeScreenList (XF86ConfScreenPtr ptr)
{
	XF86ConfScreenPtr prev;

	while (ptr)
	{
		TestFree (ptr->scrn_identifier);
		TestFree (ptr->scrn_device_str);
		TestFree (ptr->scrn_comment);
		xf86optionListFree (ptr->scrn_option_lst);
		xf86freeScrnMonitorList(ptr->scrn_monitor_lst);
		xf86freeAdaptorLinkList (ptr->scrn_adaptor_lst);
		xf86freeDisplayList (ptr->scrn_display_lst);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

void
xf86freeAdaptorLinkList (XF86ConfAdaptorLinkPtr ptr)
{
	XF86ConfAdaptorLinkPtr prev;

	while (ptr)
	{
		TestFree (ptr->al_adaptor_str);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

void
xf86freeDisplayList (XF86ConfDisplayPtr ptr)
{
	XF86ConfDisplayPtr prev;

	while (ptr)
	{
		xf86freeModeList (ptr->disp_mode_lst);
		xf86optionListFree (ptr->disp_option_lst);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

void
xf86freeModeList (XF86ModePtr ptr)
{
	XF86ModePtr prev;

	while (ptr)
	{
		TestFree (ptr->mode_name);
		prev = ptr;
		ptr = ptr->list.next;
		xf86conffree (prev);
	}
}

/*
 * xf86validateScreen()
 *
 *    Validate each Screen section and its subordinate sections.
 */
int
xf86validateScreen (XF86ConfigPtr p)
{
	XF86ConfScreenPtr screen = p->conf_screen_lst;
	XF86ConfScrnMonitorEntryPtr mon_ptr; /* Ptr to a Monitor entry */
	XF86ConfMonitorPtr monitor;	/* Ptr to a Monitor section */
	XF86ConfDevicePtr device;
	XF86ConfAdaptorLinkPtr adaptor;

#if !defined(SMI_FBCONFIG)	/* Missing section will be constructed */
	if (!screen)
	{
		xf86validationError ("At least one Screen section is required.");
		return (FALSE);
	}

#endif
	while (screen)
	{
		if (screen->scrn_obso_driver && !screen->scrn_identifier)
			screen->scrn_identifier = screen->scrn_obso_driver;

		/*
		 * Process each Monitor entry in this Screen section
		 */
		for (mon_ptr = screen->scrn_monitor_lst;
			mon_ptr != NULL;
			mon_ptr = (XF86ConfScrnMonitorEntryPtr)mon_ptr->list.next) {

			monitor = xf86findMonitor(mon_ptr->scrn_monitor_name,
							p->conf_monitor_lst);
			if (monitor == NULL) {
				xf86validationError(
						UNDEFINED_MONITOR_MSG,
						mon_ptr->scrn_monitor_name,
						screen->scrn_identifier);
				return (FALSE);
			}
			mon_ptr->scrn_monitor = monitor;
			if (!xf86validateMonitor(
					p, screen->scrn_identifier, monitor)) {
				return (FALSE);
			}
		}

		/*
		 * Make sure the specified Device section can be found
		 */
		if (screen->scrn_device_str == NULL) {
			xf86validationError(UNDEFINED_DEVICE_MSG,
						 "", screen->scrn_identifier);
			return (FALSE);
		}
		device = xf86findDevice (screen->scrn_device_str, p->conf_device_lst);
		if (!device)
		{
			xf86validationError (UNDEFINED_DEVICE_MSG,
						  screen->scrn_device_str, screen->scrn_identifier);
			return (FALSE);
		}
		screen->scrn_device = device;

		adaptor = screen->scrn_adaptor_lst;
		while (adaptor)
		{
			adaptor->al_adaptor = xf86findVideoAdaptor (adaptor->al_adaptor_str, p->conf_videoadaptor_lst);
			if (!adaptor->al_adaptor)
			{
				xf86validationError (UNDEFINED_ADAPTOR_MSG, adaptor->al_adaptor_str, screen->scrn_identifier);
				return (FALSE);
			}
			else if (adaptor->al_adaptor->va_fwdref)
			{
				xf86validationError (ADAPTOR_REF_TWICE_MSG, adaptor->al_adaptor_str,
						     adaptor->al_adaptor->va_fwdref);
				return (FALSE);
			}

			adaptor->al_adaptor->va_fwdref = xf86configStrdup(screen->scrn_identifier);
			adaptor = adaptor->list.next;
		}

		screen = screen->list.next;
	}

	return (TRUE);
}

XF86ConfScreenPtr
xf86findScreen (const char *ident, XF86ConfScreenPtr p)
{
	while (p)
	{
		if (xf86nameCompare (ident, p->scrn_identifier) == 0)
			return (p);

		p = p->list.next;
	}
	return (NULL);
}

