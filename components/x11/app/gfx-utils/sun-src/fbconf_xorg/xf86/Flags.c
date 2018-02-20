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

#include <math.h>

#ifdef HAVE_XORG_CONFIG_H
#include <xorg-config.h>
#endif
#include "xf86Parser.h"
#include "xf86tokens.h"
#include "Configint.h"

#include "fields.h"		/* Config file output line fields */
#if defined(SMI_FBCONFIG)
#include "fbc_edit_config.h"	/* Write an updated configuration file */
#include "fbc_line_er.h"	/* External Representation of config lines */
#endif


extern LexRec val;

static xf86ConfigSymTabRec ServerFlagsTab[] =
{
	{ENDSECTION, "endsection"},
	{NOTRAPSIGNALS, "notrapsignals"},
	{DONTZAP, "dontzap"},
	{DONTZOOM, "dontzoom"},
	{DISABLEVIDMODE, "disablevidmodeextension"},
	{ALLOWNONLOCAL, "allownonlocalxvidtune"},
	{DISABLEMODINDEV, "disablemodindev"},
	{MODINDEVALLOWNONLOCAL, "allownonlocalmodindev"},
	{ALLOWMOUSEOPENFAIL, "allowmouseopenfail"},
	{OPTION, "option"},
	{BLANKTIME, "blanktime"},
	{STANDBYTIME, "standbytime"},
	{SUSPENDTIME, "suspendtime"},
	{OFFTIME, "offtime"},
	{DEFAULTLAYOUT, "defaultserverlayout"},
	{-1, ""},
};

#define CLEANUP xf86freeFlags

XF86ConfFlagsPtr
xf86parseFlagsSection (void)
{
	int token;
	parsePrologue (XF86ConfFlagsPtr, XF86ConfFlagsRec)

	while ((token = xf86getToken (ServerFlagsTab)) != ENDSECTION)
	{
		int hasvalue = FALSE;
		int strvalue = FALSE;
		int tokentype;
		switch (token)
		{
		case COMMENT:
			ptr->flg_comment = xf86addComment(ptr->flg_comment, val.str);
			break;
			/* 
			 * these old keywords are turned into standard generic options.
			 * we fall through here on purpose
			 */
		case DEFAULTLAYOUT:
			strvalue = TRUE;
		case BLANKTIME:
		case STANDBYTIME:
		case SUSPENDTIME:
		case OFFTIME:
			hasvalue = TRUE;
		case NOTRAPSIGNALS:
		case DONTZAP:
		case DONTZOOM:
		case DISABLEVIDMODE:
		case ALLOWNONLOCAL:
		case DISABLEMODINDEV:
		case MODINDEVALLOWNONLOCAL:
		case ALLOWMOUSEOPENFAIL:
			{
				int i = 0;
				while (ServerFlagsTab[i].token != -1)
				{
					char *tmp;

					if (ServerFlagsTab[i].token == token)
					{
						char *valstr = NULL;
						/* can't use strdup because it calls malloc */
						tmp = xf86configStrdup (ServerFlagsTab[i].name);
						if (hasvalue)
						{
							tokentype = xf86getSubToken(&(ptr->flg_comment));
							if (strvalue) {
								if (tokentype != STRING)
									Error (QUOTE_MSG, tmp);
								valstr = val.str;
							} else {
								if (tokentype != NUMBER)
									Error (NUMBER_MSG, tmp);
								valstr = xf86confmalloc(16);
								if (valstr)
									sprintf(valstr, "%d", val.num);
							}
						}
						ptr->flg_option_lst = xf86addNewOption
							(ptr->flg_option_lst, tmp, valstr);
					}
					i++;
				}
			}
			break;
		case OPTION:
			ptr->flg_option_lst = xf86parseOption(ptr->flg_option_lst);
			break;

		case EOF_TOKEN:
			Error (UNEXPECTED_EOF_MSG, NULL);
			break;
		default:
			Error (INVALID_KEYWORD_MSG, xf86tokenString ());
			break;
		}
	}

#ifdef DEBUG
	printf ("ServerFlags section parsed\n");
#endif

	return ptr;
}

#undef CLEANUP

void
xf86printServerFlagsSection (FILE * f, XF86ConfFlagsPtr flags)
{
	XF86OptionPtr p;

	if ((!flags) || (!flags->flg_option_lst))
		return;
	p = flags->flg_option_lst;
	fprintf (f, "Section \"ServerFlags\"\n");
	if (flags->flg_comment)
		fprintf (f, "%s", flags->flg_comment);
	xf86printOptionList(f, p, xf86whitespace_1);
	fprintf (f, "EndSection\n\n");
}


/*
 * xf86addNewOptionOrValue()
 *
 *    Append a new Option record to the specified Option list if the
 *    option name is not already present in the list.  If the option
 *    name is already present, replace the value, etc. of the existing
 *    option.  Return a pointer to the head of the list.
 */
#if !defined(SMI_FBCONFIG)
static
#endif
XF86OptionPtr
xf86addNewOptionOrValue(
	XF86OptionPtr	head,		/* Ptr to head of option list */
	char		*name,		/* Ptr to new option name string */
	char		*val,		/* Ptr to new option value string */
#if !defined(SMI_FBCONFIG)
	int		used)
#else
	int		used,		/* Not used w/ SMI_FBCONFIG */
	void		*end_line_er)	/* Ptr to End[Sub]Section, else NULL */
#endif
{
	XF86OptionPtr	new;		/* Ptr to new or existing option */
	XF86OptionPtr	old;		/* Ptr to existing option, if any */

	/*
	 * Disallow duplicate option names, discarding any but the last one
	 *
	 *    Note that xf86findOption() accepts NULL as the list head
	 *    and returns NULL in that case.
	 */
	old = xf86findOption(head, name);
	if (old == NULL) {
		new = xf86confcalloc (1, sizeof (XF86OptionRec));
 		new->list.next = NULL;
	} else {
//??? Memory leak in some or all cases (e.g. when old->used==1) ???
//???		xf86freeconfig(old->opt_name);
//???		xf86freeconfig(old->opt_val);
//??? Memory leak in some or all cases (e.g. when old->used==1) ???
		new = old;
	}

 	new->opt_name = name;
 	new->opt_val  = val;
 	new->opt_used = used;
	
  	if (old == NULL) {
#if defined(SMI_FBCONFIG)
		/*
		 * Insert and link the External Representation of this option
		 *
		 *    The External Representation of this new Option
		 *    line will be inserted just before the EndSection
		 *    or EndSubSection line (assuming our caller has
		 *    provided a pointer to the ER for the end line).
		 */
		if (end_line_er != NULL) {
			fbc_insert_line_ER(end_line_er, (void *)new,
					(xf86_print_fn_t *)&xf86printOption,
					FBC_INDENT_ENTRY);
		}

#endif
		/*
		 * Add the new option and return the (new) list head
		 */
		return ((XF86OptionPtr) xf86addListItem((glp)head, (glp)new));
	}

#if defined(SMI_FBCONFIG)
	/*
	 * Mark the External Representation of this option as modified
	 *
	 *    If our caller hasn't provided a pointer (end_line_er) to
	 *    the External Representation of an EndSection or
	 *    EndSubSection line then it's likely that our caller isn't
	 *    on an SMI_FBCONFIG code path.  
	 */
	if (end_line_er != NULL) {
		fbc_modify_line_ER(new->opt_line_er);
	}

#endif
	/*
	 * Return the unchanged list head, having modified an existing option
	 */
	return (head);
}


/*
 * xf86addNewOption()
 *
 *    Append a new Option record to the specified Option list if the
 *    option name is not already present in the list.  If the option
 *    name is already present, replace the value, etc. of the existing
 *    option.  Return a pointer to the head of the list.
 */
XF86OptionPtr
xf86addNewOption (XF86OptionPtr head, char *name, char *val)
{
#if !defined(SMI_FBCONFIG)
	return (xf86addNewOptionOrValue(head, name, val, 0));
#else
	return (xf86addNewOptionOrValue(head, name, val, 0, NULL));
#endif
}


void
xf86freeFlags (XF86ConfFlagsPtr flags)
{
	if (flags == NULL)
		return;
	xf86optionListFree (flags->flg_option_lst);
	TestFree(flags->flg_comment);
	xf86conffree (flags);
}

XF86OptionPtr
xf86optionListDup (XF86OptionPtr opt)
{
	XF86OptionPtr newopt = NULL;

	while (opt)
	{
		newopt = xf86addNewOption(newopt, xf86configStrdup(opt->opt_name), 
					  xf86configStrdup(opt->opt_val));
		newopt->opt_used = opt->opt_used;
		if (opt->opt_comment)
			newopt->opt_comment = xf86configStrdup(opt->opt_comment);
		opt = opt->list.next;
	}
	return newopt;
}

void
xf86optionListFree (XF86OptionPtr opt)
{
	XF86OptionPtr prev;

	while (opt)
	{
		TestFree (opt->opt_name);
		TestFree (opt->opt_val);
		TestFree (opt->opt_comment);
		prev = opt;
		opt = opt->list.next;
		xf86conffree (prev);
	}
}

char *
xf86optionName(XF86OptionPtr opt)
{
	if (opt)
		return opt->opt_name;
	return 0;
}

char *
xf86optionValue(XF86OptionPtr opt)
{
	if (opt)
		return opt->opt_val;
	return 0;
}

XF86OptionPtr
xf86newOption(char *name, char *value)
{
	XF86OptionPtr opt;

	opt = xf86confcalloc(1, sizeof (XF86OptionRec));
	if (!opt)
		return NULL;

	opt->opt_used = 0;
	opt->list.next = 0;
	opt->opt_name = name;
	opt->opt_val = value;

	return opt;
}

XF86OptionPtr
xf86nextOption(XF86OptionPtr list)
{
	if (!list)
		return NULL;
	return list->list.next;
}

/*
 * This function searches the given option list for the named option and
 * returns a pointer to the option rec if found. If not found, it returns
 * NULL.
 */

XF86OptionPtr
xf86findOption (XF86OptionPtr list, const char *name)
{
	/*
	 * Known Boolean option names, which accept a "No" prefix
	 *
	 *    This table is arranged in xorg.conf(4) man page order,
	 *    merely for ease of its creation and potential maintenance.
	 *
	 *    What should the opposites of the following Boolean option
	 *    names be?
	 *        "NoTrapSignals"  -  "NoNoTrapSignals" or "TrapSignals"
	 *        "NoPM"           -  "NoNoPM"          or "PM"
	 *        "NoInt10"        -  "NoNoInt10"       or "Int10"
	 */
	static const char * const bool_option_names[] =
	{
		/*
		 * ServerFlags Section
		 */
		"NoTrapSignals",	/* ??? Not a negated option name */
		"DontVTSwitch",
		"DontZap",
		"DontZoom",
		"DisableVidModeExtension",
		"AllowNonLocalXvidtune",
		"DisableModInDev",
		"AllowNonLocalModInDev",
		"AllowMouseOpenFail",
		"VTSysReq",
		"XkbDisable",
		"PC98",
		"NoPM",			/* ??? Not a negated option name */
		"Xinerama",
		"AllowDeactivateGrabs",
		"AllowClosedownGrabs",
		/*
		 * InputDevice section
		 */
		"AIGLX",
		"IgnoreABI",
		/*
		 * Module section
		 */
		"AlwaysCore",
		"SendCoreEvents",
		"SendDragEvents",
		/*
		 * Monitor section
		 */
		"DPMS",
		"SyncOnGreen",
		"Enable",
		"Ignore",
		/*
		 * Screen section
		 */
		"InitPrimary",
		"NoInt10",		/* ??? Not a negated option name */
		"SingleCard",
#if defined(SMI_FBCONFIG)
		FBC_KEYWD_DefLinear,	/* Display subsection */
		FBC_KEYWD_DefOverlay,	/* Display subsection */
		FBC_KEYWD_DefTransparent, /* Display subsection */
		FBC_KEYWD_DoubleHigh,	/* ??? Is this really a Boolean ??? */
		FBC_KEYWD_DoubleWide,	/* ??? Is this really a Boolean ??? */
#endif
		NULL			/* End-of-table marker */
	};

	for ( ; list != NULL; list = list->list.next)
	{
		if (xf86optionNameCompare (
				bool_option_names, list->opt_name, name) == 0)
		{
			return (list);
		}
	}
	return (NULL);
}

/*
 * This function searches the given option list for the named option. If
 * found and the option has a parameter, a pointer to the parameter is
 * returned.  If the option does not have a parameter, an empty string
 * is returned.  If the option is not found, a NULL is returned.
 */

char *
xf86findOptionValue (XF86OptionPtr list, const char *name)
{
	XF86OptionPtr p = xf86findOption (list, name);

	if (p)
	{
		if (p->opt_val)
			return (p->opt_val);
		else
			return "";
	}
	return (NULL);
}

/*
 * xf86optionListCreate()
 *
 *    Create and return a list of options from an array of option &
 *    value string pairs.  The size of the array is specified by a
 *    non-negative "count" value or else by a NULL as the last element
 *    of the array.  The purpose of "used," which appears to be Boolean,
 *    has been documented only by its name.
 */
XF86OptionPtr
xf86optionListCreate( const char **options, int count, int used )
{
	XF86OptionPtr p = NULL;
	char *t1, *t2;
	int i;

	if (count == -1)
	{
		for (count = 0; options[count]; count++)
			;
	}
	if( (count % 2) != 0 )
	{
		fprintf( stderr, "xf86optionListCreate: count must be an even number.\n" );
		return (NULL);
	}
	for (i = 0; i < count; i += 2)
	{
		/* can't use strdup because it calls malloc */
		t1 = xf86confmalloc (sizeof (char) *
				(strlen (options[i]) + 1));
		strcpy (t1, options[i]);
		t2 = xf86confmalloc (sizeof (char) *
				(strlen (options[i + 1]) + 1));
		strcpy (t2, options[i + 1]);
#if !defined(SMI_FBCONFIG)
		p = xf86addNewOptionOrValue(p, t1, t2, used);
#else
		p = xf86addNewOptionOrValue(p, t1, t2, used, NULL);
#endif
	}

	return (p);
}

/* the 2 given lists are merged. If an option with the same name is present in
 * both, the option from the user list - specified in the second argument -
 * is used. The end result is a single valid list of options. Duplicates
 * are freed, and the original lists are no longer guaranteed to be complete.
 */
XF86OptionPtr
xf86optionListMerge (XF86OptionPtr head, XF86OptionPtr tail)
{
	XF86OptionPtr a, b, ap = NULL, bp = NULL;

	a = tail;
	b = head;
	while (tail && b) {
		if (xf86nameCompare (a->opt_name, b->opt_name) == 0) {
			if (b == head)
				head = a;
			else
				bp->list.next = a;
			if (a == tail)
				tail = a->list.next;
			else
				ap->list.next = a->list.next;
			a->list.next = b->list.next;
			b->list.next = NULL;
			xf86optionListFree (b);
			b = a->list.next;
			bp = a;
			a = tail;
			ap = NULL;
		} else {
			ap = a;
			if (!(a = a->list.next)) {
				a = tail;
				bp = b;
				b = b->list.next;
				ap = NULL;
			}
		}
	}

	if (head) {
		for (a = head; a->list.next; a = a->list.next)
			;
		a->list.next = tail;
	} else 
		head = tail;

	return (head);
}

char *
xf86uLongToString(unsigned long i)
{
	char *s;
	int l;

	l = (int)(ceil(log10((double)i) + 2.5));
	s = xf86confmalloc(l);
	if (!s)
		return NULL;
	sprintf(s, "%lu", i);
	return s;
}

void
xf86debugListOptions(XF86OptionPtr Options)
{
	while (Options) {
		ErrorF("Option: %s Value: %s\n",Options->opt_name,Options->opt_val);
		Options = Options->list.next;
	}
}


/*
 * xf86parseOption()
 *
 *    Parse the current Option line.  Complain about bad Option lines.
 *    Discard duplicate option names.  Otherwise, append the new option
 *    to the Option list specified by "head."
 */
XF86OptionPtr
xf86parseOption(XF86OptionPtr head)
{
	XF86OptionPtr option, old;
	char *name, *comment = NULL;
	int token;
#if defined(SMI_FBCONFIG)
	void *line_er;		/* Ptr to External Rep of Option line */

	/*
	 * Get a pointer to the External Representation of this Option line
	 */
	line_er = fbc_get_current_line_ER();
#endif

	/*
	 * Get the option name token
	 */
	if ((token = xf86getSubToken(&comment)) != STRING) {
		xf86parseError(BAD_OPTION_MSG, NULL);
		if (comment)
			xf86conffree(comment);
		return (head);
	}
	name = val.str;

	/*
	 * Get the option value token, if any, and comment string, if any
	 */
	if ((token = xf86getSubToken(&comment)) == STRING) {
		option = xf86newOption(name, val.str);
		option->opt_comment = comment;
		if ((token = xf86getToken(NULL)) == COMMENT)
			option->opt_comment = xf86addComment(option->opt_comment, val.str);
		else
			xf86unGetToken(token);
	}
	else {
		option = xf86newOption(name, NULL);
		option->opt_comment = comment;
		if (token == COMMENT)
			option->opt_comment = xf86addComment(option->opt_comment, val.str);
		else
			xf86unGetToken(token);
	}

	/*
	 * Disallow duplicate option names, discarding any but the first one
	 *
	 *    Note that xf86findOption() accepts NULL as the list head
	 *    and returns NULL in that case.
	 */
	old = xf86findOption(head, name);
	if (old != NULL) {
		xf86conffree(option->opt_name);
		TestFree(option->opt_val);
		TestFree(option->opt_comment);
		xf86conffree(option);
#if defined(SMI_FBCONFIG)
		fbc_delete_line_ER(line_er);  /* Delete config line from ER */
#endif
		return (head);
	}

#if defined(SMI_FBCONFIG)
	/*
	 * Link the Internal and External Representations of this Option line
	 */
	option->opt_line_er = line_er;
	fbc_link_line_ER(line_er,
			(void *)option,
			(xf86_print_fn_t*)&xf86printOption,
			FBC_INDENT_ENTRY);

#endif
	return ((XF86OptionPtr)xf86addListItem((glp)head, (glp)option));
}


/*
 * xf86printOption()
 *
 *    Write an Option line to the output configuration file.
 */
void
xf86printOption(
	FILE *fp, XF86OptionPtr option, const char * const whitespace[])
{
	char		*comment;	/* Comment or end-of-line text */

	/*
	 * Comment or end-of-line text
	 */
	comment = "\n";
	if (option->opt_comment != NULL) {
		comment = option->opt_comment;
	}

	/*
	 * Write the Option line, which may include an Option value
	 */
	xf86printFields(fp, whitespace, "Option", NULL);
	if (option->opt_val != NULL) {
		fprintf(fp, "\"%s\" \"%s\"%s",
			option->opt_name, option->opt_val, comment);
	} else {
		fprintf(fp, "\"%s\"%s", option->opt_name, comment);
	}
}


/*
 * xf86printOptionList()
 *
 *    Write all of the Option lines of a (sub)section to the output
 *    configuration file.
 */
void
xf86printOptionList(
	FILE *fp, XF86OptionPtr list, const char * const whitespace[])
{

	for ( ; list != NULL; list = list->list.next) {
		xf86printOption(fp, list, whitespace);
	}
}

