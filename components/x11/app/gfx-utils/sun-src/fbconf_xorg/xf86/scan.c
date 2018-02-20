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

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdarg.h>

#if !defined(X_NOT_POSIX)
#if defined(_POSIX_SOURCE)
#include <limits.h>
#else
#define _POSIX_SOURCE
#include <limits.h>
#undef _POSIX_SOURCE
#endif /* _POSIX_SOURCE */
#endif /* !X_NOT_POSIX */
#if !defined(PATH_MAX)
#if defined(MAXPATHLEN)
#define PATH_MAX MAXPATHLEN
#else
#define PATH_MAX 1024
#endif /* MAXPATHLEN */
#endif /* !PATH_MAX */

#if !defined(MAXHOSTNAMELEN)
#define MAXHOSTNAMELEN 32
#endif /* !MAXHOSTNAMELEN */

#include "xf86Parser.h"		/* Public function, etc. declarations */
#include "Configint.h"
#include "configProcs.h"	/* Private function, etc. declarations */
#include "xf86tokens.h"

#if defined(SMI_FBCONFIG)
#include "fbc_error.h"		/* Error reporting */
#define	xf86printErrorF fbc_errormsg /* Write prog name & variable fmt error */
#include "fbc_line_er.h"	/* External Representation of config lines */
#endif

#if !defined(xf86printErrorF)	/* Could write prog name & variable fmt msg */
#define	xf86printErrorF ErrorF	/* Write a variable format error message */
#endif

#define CONFIG_BUF_LEN     1024

static int StringToToken (char *, xf86ConfigSymTabRec *);

static FILE *configFile = NULL;
static const char **builtinConfig = NULL;
static int builtinIndex = 0;
static int configPos = 0;		/* current readers position */
static int configLineNo = 0;	/* linenumber */
#if !defined(SMI_FBCONFIG)
static char *configBuf = NULL;		/* Config file line buffer */
static int configBufLen = 0;		/* Line buffer length */
#else
#define	configBuf	xf86configBuf
#define	configBufLen	xf86configBufLen
char *xf86configBuf = NULL;		/* Config file line buffer */
int xf86configBufLen = 0;		/* Line buffer length */
#endif
static char *configRBuf = NULL;		/* Token buffer */
static int configRBufLen = 0;		/* Token buffer length */
static char *configPath;		/* path to config file */
static char *configSection = NULL;	/* name of current section being parsed */
static int pushToken = LOCK_TOKEN;
static int eol_seen = 0;		/* private state to handle comments */
LexRec val;

#ifdef __UNIXOS2__
extern char *__XOS2RedirRoot(char *path);
#endif


/* 
 * xf86strToUL --
 *
 *  A portable, but restricted, version of strtoul().  It only understands
 *  hex, octal, and decimal.  But it's good enough for our needs.
 */
unsigned int
xf86strToUL (char *str)
{
	int base = 10;
	char *p = str;
	unsigned int tot = 0;

	if (*p == '0')
	{
		p++;
		if ((*p == 'x') || (*p == 'X'))
		{
			p++;
			base = 16;
		}
		else
			base = 8;
	}
	while (*p)
	{
		if ((*p >= '0') && (*p <= ((base == 8) ? '7' : '9')))
		{
			tot = tot * base + (*p - '0');
		}
		else if ((base == 16) && (*p >= 'a') && (*p <= 'f'))
		{
			tot = tot * base + 10 + (*p - 'a');
		}
		else if ((base == 16) && (*p >= 'A') && (*p <= 'F'))
		{
			tot = tot * base + 10 + (*p - 'A');
		}
		else
		{
			return (tot);
		}
		p++;
	}
	return (tot);
}

/*
 * xf86getNextLine()
 *
 *  Read from the configFile FILE stream until we encounter a newline;
 *  this is a wrapper for fgets(3) that can handle arbitrarily long
 *  input lines.
 *
 *  Callers, such as xf86getToken(), assume that we will read up to the
 *  next newline; we need to grow configBuf as necessary to support that.
 */

char *
xf86getNextLine(char **configBuf, int *configBufLen, FILE *configFile)
{
	char *tmpConfigBuf;
	int c, i, pos = 0, eolFound = 0;
	char *ret = NULL;

	/*
	 * Reallocate the buffer if it was grown last time (i.e., is no
	 * longer CONFIG_BUF_LEN); we malloc the new buffer first, so
	 * that if the malloc() fails, we can fall back to use the
	 * existing buffer.
	 *
	 * [Might want to wait and shrink the buffer after reading the line.]
	 */

	if (*configBufLen != CONFIG_BUF_LEN) {

		tmpConfigBuf = xf86confmalloc(CONFIG_BUF_LEN);
		if (tmpConfigBuf != NULL) {

			/*
			 * The malloc() succeeded; free the old buffer and use
			 * the new buffer.
			 */

			xf86conffree(configBuf);
			*configBuf    = tmpConfigBuf;
			*configBufLen = CONFIG_BUF_LEN;
		}
	}

	/* read in another block of chars */

	do {
		ret = fgets(*configBuf + pos, *configBufLen - pos - 1, configFile);
		if (ret == NULL) {
			(*configBuf)[pos] = '\0';
			break;
		}

		/* search for EOL in the new block of chars */

		for (i = pos; i < (*configBufLen - 1); i++) {
			c = (*configBuf)[i];

			if (c == '\0') break;

			if ((c == '\n') || (c == '\r')) {
				eolFound = 1;
				break;
			}
		}

		/*
		 * if we didn't find EOL, then grow the buffer and
		 * read in more
		 */

		if (!eolFound) {

			tmpConfigBuf = xf86confrealloc(*configBuf, *configBufLen + CONFIG_BUF_LEN);
			if (tmpConfigBuf == NULL) {
				/*
				 * The reallocation failed; we have to fall
				 * back to the previous configBufLen size and
				 * use the string we have, even though we don't
				 * have an EOL.
				 */
				break;

			} else {

				/* reallocation succeeded */

				*configBuf = tmpConfigBuf;
				pos = i;
				*configBufLen += CONFIG_BUF_LEN;
			}
		}

	} while (!eolFound);

	return (ret);
}

/* 
 * xf86getToken --
 *      Read next Token from the config file. Handle the global variable
 *      pushToken.  If a pointer to a symbol table has been provided
 *      (tab != NULL), the table may be searched for a match with the
 *      token.  If all attempts to recognize the token fail, an
 *      ERROR_TOKEN code is returned.
 */
int
xf86getToken (xf86ConfigSymTabRec * tab)
{
	int c, i;
	char *tmpConfigRBuf;

	/* 
	 * First check whether pushToken has a different value than LOCK_TOKEN.
	 * In this case configRBuf[] contains a valid STRING/TOKEN/NUMBER.
	 * Otherwise the next token must be read from the input.
	 */
	if (pushToken == EOF_TOKEN)
		return (EOF_TOKEN);
	else if (pushToken == LOCK_TOKEN)
	{
		/*
		 * eol_seen is only set for the first token after a newline.
		 */
		eol_seen = 0;

		c = configBuf[configPos];

		/* 
		 * Get start of next Token. EOF is handled,
		 * whitespaces are skipped. 
		 */

again:
		if (!c)
		{
			char *ret;
			if (configFile != NULL) {
#if defined(SMI_FBCONFIG)
				off_t line_pos;	/* File position of line */

				line_pos = ftell(configFile);
#endif
				ret = xf86getNextLine(&configBuf, &configBufLen, configFile);
#if defined(SMI_FBCONFIG)
				if (ret != NULL) {
					fbc_save_line_location(configFile, line_pos);
				}
#endif
			} else {
				if (builtinConfig[builtinIndex] == NULL)
					ret = NULL;
				else {
					ret = strncpy(configBuf, builtinConfig[builtinIndex],
							CONFIG_BUF_LEN);
					builtinIndex++;
				}
			}
			if (ret == NULL)
			{
				return (pushToken = EOF_TOKEN);
			}
			configLineNo++;
			configPos = 0;
			eol_seen = 1;
		}

		/*
		 * Make the token buffer the same size as the input line
		 * buffer.  We malloc() the new token buffer first, so
		 * that if the malloc() fails, we can fall back to use the
		 * existing token buffer.
		 */

		if (configRBufLen != configBufLen) {

			tmpConfigRBuf = xf86confmalloc(configBufLen);
			if (tmpConfigRBuf != NULL) {

				/*
				 * The malloc() succeeded; free the old buffer
				 * and use the new buffer.
				 */

				xf86conffree(configRBuf);
				configBuf     = tmpConfigRBuf;
				configRBufLen = configBufLen;
			}
		}

		/*
		 * Start scanning the new token, which may include whitespace
		 */

		i = 0;
		for (;;) {
			c = configBuf[configPos++];
			configRBuf[i++] = c;
			switch (c) {
				case ' ':
				case '\t':
				case '\r':
					continue;
				case '\n':
					i = 0;
					continue;
			}
			break;
		}
		if (c == '\0')
			goto again;	/* [Should be a do-while loop] */

		if (c == '#')
		{
			do
			{
				configRBuf[i++] = (c = configBuf[configPos++]);
			}
			while ((c != '\n') && (c != '\r') && (c != '\0'));
			configRBuf[i] = '\0';
			/* XXX no private copy.
			 * Use xf86addComment when setting a comment.
			 */
			val.str = configRBuf;
			return (COMMENT);
		}

		/* GJA -- handle '-' and ','  * Be careful: "-hsync" is a keyword. */
		else if ((c == ',') && !isalpha (configBuf[configPos]))
		{
			return COMMA;
		}
		else if ((c == '-') && !isalpha (configBuf[configPos]))
		{
			return DASH;
		}

		/* 
		 * Numbers are returned immediately ...
		 */
		if (isdigit (c))
		{
			int base;

			if (c == '0')
				if ((configBuf[configPos] == 'x') ||
					(configBuf[configPos] == 'X'))
					base = 16;
				else
					base = 8;
			else
				base = 10;

			configRBuf[0] = c;
			i = 1;
			while (isdigit (c = configBuf[configPos++]) ||
				   (c == '.') || (c == 'x') || (c == 'X') ||
				   ((base == 16) && (((c >= 'a') && (c <= 'f')) ||
									 ((c >= 'A') && (c <= 'F')))))
				configRBuf[i++] = c;
			configPos--;		/* GJA -- one too far */
			configRBuf[i] = '\0';
			val.num = xf86strToUL (configRBuf);
			val.realnum = atof (configRBuf);
			return (NUMBER);
		}

		/* 
		 * All Strings START with a \" ...
		 */
		else if (c == '\"')
		{
			i = -1;
			do
			{
				configRBuf[++i] = (c = configBuf[configPos++]);
			}
			while ((c != '\"') && (c != '\n') && (c != '\r') && (c != '\0'));
			configRBuf[i] = '\0';
			val.str = xf86confmalloc (strlen (configRBuf) + 1);
			strcpy (val.str, configRBuf);	/* private copy ! */
			return (STRING);
		}

		/* 
		 * ... and now we MUST have a valid token.  The search is
		 * handled later along with the pushed tokens.
		 */
		else
		{
			configRBuf[0] = c;
			i = 0;
			do
			{
				configRBuf[++i] = (c = configBuf[configPos++]);;
			}
			while ((c != ' ') && (c != '\t') && (c != '\n') && (c != '\r') && (c != '\0') && (c != '#'));
			--configPos;
			configRBuf[i] = '\0';
			i = 0;
		}

	}
	else
	{

		/* 
		 * Here we deal with pushed tokens. Reinitialize pushToken again. If
		 * the pushed token was NUMBER || STRING return them again ...
		 */
		int temp = pushToken;
		pushToken = LOCK_TOKEN;

		if (temp == COMMA || temp == DASH)
			return (temp);
		if (temp == NUMBER || temp == STRING)
			return (temp);
	}

	/* 
	 * Joop, at last we have to lookup the token ...
	 */
	if (tab)
	{

		i = 0;
		while (tab[i].token != -1)
			if (xf86nameCompare (configRBuf, tab[i].name) == 0)
				return (tab[i].token);
			else
				i++;
	}

	return (ERROR_TOKEN);		/* Error catcher */
}

/* 
 * xf86getSubToken()
 *
 *    Read tokens from the configuration file until a non-COMMENT
 *    token is encountered.  No symbol table is provided for token
 *    lookup.  Unless no comment pointer is provided by the caller,
 *    append any COMMENT text to the dynamically grown string of
 *    comments.  Return the code for the non-COMMENT token.
 */
int
xf86getSubToken (char **comment)
{
	int token;

	for (;;) {
		token = xf86getToken(NULL);
		if (token == COMMENT) {
			if (comment)
				*comment = xf86addComment(*comment, val.str);
		}
		else
			return (token);
	}
	/*NOTREACHED*/
}

/* 
 * xf86getSubTokenWithTab()
 *
 *    Read tokens from the configuration file until a non-COMMENT
 *    token is encountered.  A symbol table is provided for token
 *    lookup.  Unless no comment pointer is provided by the caller,
 *    append any COMMENT text to the dynamically grown string of
 *    comments.  Return the code for the non-COMMENT token.
 */
int
xf86getSubTokenWithTab (char **comment, xf86ConfigSymTabRec *tab)
{
	int token;

	for (;;) {
		token = xf86getToken(tab);
		if (token == COMMENT) {
			if (comment)
				*comment = xf86addComment(*comment, val.str);
		}
		else
			return (token);
	}
	/*NOTREACHED*/
}

void
xf86unGetToken (int token)
{
	pushToken = token;
}

char *
xf86tokenString (void)
{
	return configRBuf;
}

int
xf86pathIsAbsolute(const char *path)
{
	if (path && path[0] == '/')
		return 1;
#ifdef __UNIXOS2__
	if (path && (path[0] == '\\' || (path[1] == ':')))
		return 1;
#endif
	return 0;
}

/* A path is "safe" if it is relative and if it contains no ".." elements. */
int
xf86pathIsSafe(const char *path)
{
	if (xf86pathIsAbsolute(path))
		return 0;

	/* Compare with ".." */
	if (!strcmp(path, ".."))
		return 0;

	/* Look for leading "../" */
	if (!strncmp(path, "../", 3))
		return 0;

	/* Look for trailing "/.." */
	if ((strlen(path) > 3) && !strcmp(path + strlen(path) - 3, "/.."))
		return 0;

	/* Look for "/../" */
	if (strstr(path, "/../"))
		return 0;

	return 1;
}

/*
 * This function substitutes the following escape sequences:
 *
 *    %A    cmdline argument as an absolute path (must be absolute to match)
 *    %R    cmdline argument as a relative path
 *    %S    cmdline argument as a "safe" path (relative, and no ".." elements)
 *    %X    default config file name ("xorg.conf")
 *    %H    hostname
 *    %E    config file environment ($XORGCONFIG) as an absolute path
 *    %F    config file environment ($XORGCONFIG) as a relative path
 *    %G    config file environment ($XORGCONFIG) as a safe path
 *    %D    $HOME
 *    %P    projroot
 *    %M    major version number
 *    %%    %
 *    %&    UNIXOS2 only: prepend X11ROOT env var
 */

#ifndef XCONFIGFILE
#define XCONFIGFILE	"xorg.conf"
#endif
#ifndef PROJECTROOT
#define PROJECTROOT	"/usr/X11R6"
#endif
#ifndef XCONFENV
#define XCONFENV	"XORGCONFIG"
#endif
#define XFREE86CFGFILE "XF86Config"
#ifndef XF86_VERSION_MAJOR
#ifdef XVERSION
#if XVERSION > 40000000
#define XF86_VERSION_MAJOR	(XVERSION / 10000000)
#else
#define XF86_VERSION_MAJOR	(XVERSION / 1000)
#endif
#else
#define XF86_VERSION_MAJOR	4
#endif
#endif

#define BAIL_OUT		do {									\
							xf86conffree(result);				\
							return NULL;						\
						} while (0)

#define CHECK_LENGTH	do {									\
							if (l > PATH_MAX) {					\
								BAIL_OUT;						\
							}									\
						} while (0)

#define APPEND_STR(s)	do {									\
							if (strlen(s) + l > PATH_MAX) {		\
								BAIL_OUT;						\
							} else {							\
								strcpy(result + l, s);			\
								l += strlen(s);					\
							}									\
						} while (0)

static char *
DoSubstitution(const char *template, const char *cmdline, const char *projroot,
			int *cmdlineUsed, int *envUsed, const char *XConfigFile)
{
	char *result;
	int i, l;
	static const char *env = NULL, *home = NULL;
	static char *hostname = NULL;
	static char majorvers[3] = "";
#ifdef __UNIXOS2__
	static char *x11root = NULL;
#endif

	if (!template)
		return NULL;

	if (cmdlineUsed)
		*cmdlineUsed = 0;
	if (envUsed)
		*envUsed = 0;

	result = xf86confmalloc(PATH_MAX + 1);
	l = 0;
	for (i = 0; template[i]; i++) {
		if (template[i] != '%') {
			result[l++] = template[i];
			CHECK_LENGTH;
		} else {
			switch (template[++i]) {
			case 'A':
				if (cmdline && xf86pathIsAbsolute(cmdline)) {
					APPEND_STR(cmdline);
					if (cmdlineUsed)
						*cmdlineUsed = 1;
				} else
					BAIL_OUT;
				break;
			case 'R':
				if (cmdline && !xf86pathIsAbsolute(cmdline)) {
					APPEND_STR(cmdline);
					if (cmdlineUsed)
						*cmdlineUsed = 1;
				} else 
					BAIL_OUT;
				break;
			case 'S':
				if (cmdline && xf86pathIsSafe(cmdline)) {
					APPEND_STR(cmdline);
					if (cmdlineUsed)
						*cmdlineUsed = 1;
				} else 
					BAIL_OUT;
				break;
			case 'X':
				APPEND_STR(XConfigFile);
				break;
			case 'H':
				if (!hostname) {
					if ((hostname = xf86confmalloc(MAXHOSTNAMELEN + 1))) {
						if (gethostname(hostname, MAXHOSTNAMELEN) == 0) {
							hostname[MAXHOSTNAMELEN] = '\0';
						} else {
							xf86conffree(hostname);
							hostname = NULL;
						}
					}
				}
				if (hostname)
					APPEND_STR(hostname);
				break;
			case 'E':
				if (!env)
					env = getenv(XCONFENV);
				if (env && xf86pathIsAbsolute(env)) {
					APPEND_STR(env);
					if (envUsed)
						*envUsed = 1;
				} else
					BAIL_OUT;
				break;
			case 'F':
				if (!env)
					env = getenv(XCONFENV);
				if (env && !xf86pathIsAbsolute(env)) {
					APPEND_STR(env);
					if (envUsed)
						*envUsed = 1;
				} else
					BAIL_OUT;
				break;
			case 'G':
				if (!env)
					env = getenv(XCONFENV);
				if (env && xf86pathIsSafe(env)) {
					APPEND_STR(env);
					if (envUsed)
						*envUsed = 1;
				} else
					BAIL_OUT;
				break;
			case 'D':
				if (!home)
					home = getenv("HOME");
				if (home && xf86pathIsAbsolute(home))
					APPEND_STR(home);
				else
					BAIL_OUT;
				break;
			case 'P':
				if (projroot && xf86pathIsAbsolute(projroot))
					APPEND_STR(projroot);
				else
					BAIL_OUT;
				break;
			case 'M':
				if (!majorvers[0]) {
					if (XF86_VERSION_MAJOR < 0 || XF86_VERSION_MAJOR > 99) {
						fprintf(stderr, "XF86_VERSION_MAJOR is out of range\n");
						BAIL_OUT;
					} else
						sprintf(majorvers, "%d", XF86_VERSION_MAJOR);
				}
				APPEND_STR(majorvers);
				break;
			case '%':
				result[l++] = '%';
				CHECK_LENGTH;
				break;
#ifdef __UNIXOS2__
			case '&':
				if (!x11root)
					x11root = getenv("X11ROOT");
				if (x11root)
					APPEND_STR(x11root);
				else
					BAIL_OUT;
				break;
#endif
			default:
				fprintf(stderr, "invalid escape %%%c found in path template\n",
						template[i]);
				BAIL_OUT;
				break;
			}
		}
	}
#ifdef DEBUG
	fprintf(stderr, "Converted `%s' to `%s'\n", template, result);
#endif
	result[l] = '\0';
	return result;
}


/* 
 * xf86openConfigFileIn()
 *
 * This function takes a config file search path (optional), a command-line
 * specified file name (optional) and the ProjectRoot path (optional) and
 * locates and opens a config file based on that information.  This
 * function will fail if a command-line file name is specified and there
 * is no %A, %R, or %S escape sequence in the effective search path.
 *
 * The return value is a pointer to the actual name of the file that was
 * opened.  When no file is found, the return value is NULL.
 *
 * The escape sequences allowed in the search path are defined above.  The
 * default search path is defined below.
 */

#ifndef DEFAULT_CONF_PATH
#define DEFAULT_CONF_PATH	"/etc/X11/%S," \
							"%P/etc/X11/%S," \
							"/etc/X11/%G," \
							"%P/etc/X11/%G," \
							"/etc/X11/%X-%M," \
							"/etc/X11/%X," \
							"/etc/%X," \
							"%P/etc/X11/%X.%H," \
							"%P/etc/X11/%X-%M," \
							"%P/etc/X11/%X," \
							"%P/lib/X11/%X.%H," \
							"%P/lib/X11/%X-%M," \
							"%P/lib/X11/%X"
#endif

#if !defined(SMI_FBCONFIG)
static
#endif
const char *
xf86openConfigFileIn(
	const char	*path,		/* Search path, else NULL */
	const char	*cmdline,	/* File path (%A,%R,%S), else NULL */
	const char	*projroot)	/* Project root path (%P), else NULL */
{
	const char *const Xfile[] = {
		XCONFIGFILE,
		XFREE86CFGFILE,
		NULL
	};				/* Substitutions for %X */
	char *pathcopy;
	const char *template;
	int cmdlineUsed = 0;
	const char *const *XConfigFile;	/* Ptr to current %X filename */

	/* Initialize global variables for the scanner */
	configPath   = NULL;		/* Config file pathname, else NULL */
	configFile   = NULL;		/* Config file descriptor, else NULL */
	configLineNo = 0;		/* Config file current line number */
	configPos    = 0;		/* Index of current char in line buf */
	if (configBuf != NULL) {
		configBuf[0] = '\0';	/* Start with an empty line buffer */
	}
	pushToken    = LOCK_TOKEN;

	/* Be sure there's a non-empty search path and a scratch buffer */
	if (path == NULL || path[0] == '\0') {
		path = DEFAULT_CONF_PATH;
	}
	pathcopy = xf86confmalloc(strlen(path) + 1);
	if (pathcopy == NULL) {
		return (NULL);
	}

	/* Be sure there's a non-empty project root to substitute for %P */
	if (projroot == NULL || projroot[0] == '\0') {
		projroot = PROJECTROOT;
	}

	/* Repeat for each config filename that can be substituted for %X */
	for (XConfigFile = &Xfile[0]; *XConfigFile != NULL; XConfigFile += 1) {

		/* Repeat for each comma-separated pathname template */
		strcpy(pathcopy, path);
		for (template = strtok(pathcopy, ",");
			template != NULL;
			template = strtok(NULL, ",")) {

			/* Construct a config pathname from the template */
			configPath = DoSubstitution(template, cmdline, projroot,
							&cmdlineUsed, NULL,
							*XConfigFile);
			if (configPath == NULL) {
				continue;	/* No memory */
			}

			/* Open the path unless a provided name wasn't used */
			if (cmdline == NULL || cmdlineUsed) {
				configFile = fopen(configPath, "r");
				if (configFile != NULL) {
					break;	/* Success */
				}
			}

			/* Discard the failed config pathname */
			xf86conffree(configPath);
			configPath = NULL;
		}

		if (configFile != NULL) {
			break;			/* Success */
		}
	}
	
	xf86conffree(pathcopy);

	return (configPath);
}


/* 
 * xf86openConfigFile()
 *
 * This function takes a config file search path (optional), a command-line
 * specified file name (optional) and the ProjectRoot path (optional) and
 * locates and opens a config file based on that information.  This
 * function will fail if a command-line file name is specified and there
 * is no %A, %R, or %S escape sequence in the effective search path.
 *
 * The return value is a pointer to the actual name of the file that was
 * opened.  When no file is found, the return value is NULL.
 *
 * The escape sequences allowed in the search path are defined above.
 */

const char *
xf86openConfigFile(const char *path, const char *cmdline, const char *projroot)
{
	const char	*configPath;	/* Config file pathname, else NULL */

	configPath    = xf86openConfigFileIn(path, cmdline, projroot);

	configBuf     = xf86confmalloc(CONFIG_BUF_LEN);
	configRBuf    = xf86confmalloc(CONFIG_BUF_LEN);
	if (configBuf == NULL || configRBuf == NULL) {
		return (NULL);
	}
	configBufLen  = CONFIG_BUF_LEN;
	configRBufLen = CONFIG_BUF_LEN;
	configBuf[0]  = '\0';		/* Start with an empty line buffer */

	return (configPath);
}

/*
 * xf86confScanFree()
 *
 *    Release all dynamically allocated memory used to scan the
 *    configuration file.
 */
void
xf86confScanFree(void)
{
	xf86conffree (configPath);
	configPath = NULL;
	xf86conffree (configRBuf);
	configRBuf = NULL;
	xf86conffree (configBuf);
	configBuf = NULL;
}

/*
 * xf86closeConfigFile()
 *
 *    Release all dynamically allocated memory used to scan the
 *    configuration file.  Close the input configuration file, else
 *    discard the in-memory configuration text.
 */
void
xf86closeConfigFile (void)
{
	xf86confScanFree();

	if (configFile != NULL) {
		fclose(configFile);
		configFile = NULL;
	} else {
		builtinConfig = NULL;
		builtinIndex = 0;
	}
}

void
xf86setBuiltinConfig(const char *config[])
{
	builtinConfig = config;
	configPath = xf86configStrdup("<builtin configuration>");
	configBuf     = xf86confmalloc (CONFIG_BUF_LEN);
	configBufLen  = CONFIG_BUF_LEN;
	configRBuf    = xf86confmalloc (CONFIG_BUF_LEN);
	configRBufLen = CONFIG_BUF_LEN;
	configBuf[0]  = '\0';		/* sanity ... */

}

void
xf86parseError (char *format,...)
{
	va_list ap;

	xf86printErrorF("Parse error on line %d of section %s in file %s\n\t",
		 configLineNo, configSection, configPath);
	va_start (ap, format);
	VErrorF (format, ap);
	va_end (ap);

	ErrorF ("\n");
}

void
xf86parseWarning (char *format,...)
{
	va_list ap;

	xf86printErrorF("Parse warning on line %d of section %s in file %s\n\t",
		 configLineNo, configSection, configPath);
	va_start (ap, format);
	VErrorF (format, ap);
	va_end (ap);

	ErrorF ("\n");
}

void
xf86validationError (char *format, ...)
{
	va_list ap;

	xf86printErrorF("Error in config file, %s\n\t", configPath);
	va_start (ap, format);
	VErrorF (format, ap);
	va_end (ap);

	ErrorF ("\n");
}

void
xf86setSection (char *section)
{
	if (configSection)
		xf86conffree(configSection);
	configSection = xf86confmalloc(strlen (section) + 1);
	strcpy (configSection, section);
}

/* 
 * xf86getToken --
 *  Lookup a string if it is actually a token in disguise.
 */
int
xf86getStringToken (xf86ConfigSymTabRec * tab)
{
	return StringToToken (val.str, tab);
}

static int
StringToToken (char *str, xf86ConfigSymTabRec * tab)
{
	int i;

	for (i = 0; tab[i].token != -1; i++)
	{
		if (!xf86nameCompare (tab[i].name, str))
			return tab[i].token;
	}
	return (ERROR_TOKEN);
}


/*
 * xf86nameCompareResumable()
 *
 *    Compare two name-like strings pointed to by s1 and s2.  Ignore
 *    alphabetic case and the characters, '_', ' ', and '\t'.  If s2
 *    matches the initial characters of s1 then return a pointer to the
 *    next character of s1 via s1resume (where further comparison could
 *    be resumed).  Otherwise return NULL via s1resume.  Return the
 *    conventional negative, zero, or positive value to indicate the
 *    result of the basic comparison.
 */
static int
xf86nameCompareResumable(
	const char *s1, const char *s2, const char **s1resume)
{
	int		c1;		/* Normalized character from s1 */
	int		c2;		/* Normalized character from s2 */

	*s1resume = NULL;	/* Comparison has no resumption point yet */

	if ((s1 == NULL) && (s2 == NULL)) {
		return (0);
	}
	if (s1 == NULL) {
		return (-1);	/* Behave as if NULL < non-NULL */
	}
	if (s2 == NULL) {
		return (1);	/* Behave as if non-NULL > NULL */
	}

	do {
		while ((*s1 == '_') || (*s1 == ' ') || (*s1 == '\t')) {
			s1 += 1;
		}
		while ((*s2 == '_') || (*s2 == ' ') || (*s2 == '\t')) {
			s2 += 1;
		}
		if (*s2 == '\0') {
			/* s1 matches s2 or contains s2 as a prefix */
			*s1resume = s1;
			return (0);
		}
		c1 = tolower(*s1);
		c2 = tolower(*s2);
		s1++;
		s2++;

	}
	while (c1 == c2);

	/*
	 * The strings don't match
	 */
	return (c1 - c2);
}


/*
 * xf86nameCompare()
 *
 *    Compare two name-like strings pointed to by s1 and s2.  Ignore
 *    alphabetic case and the characters, '_', ' ', and '\t'.  Return
 *    the conventional negative, zero, or positive value to indicate the
 *    result of the comparison.
 */
int
xf86nameCompare(const char *s1, const char *s2)
{
	int		result;		/* Name comparison result */
	const char	*s1resume;	/* Comparison resumption point */

	/*
	 * Compare the name strings, s1 and s2
	 */
	result = xf86nameCompareResumable(s1, s2, &s1resume);
	if (result == 0) {
		/*
		 * Determine whether s2 matches all of or just part of s1
		 *
		 *    Note that s1resume will not be NULL if result is
		 *    zero.
		 */
		result = *s1resume - '\0';
	}

	/*
	 * Return the final result of the comparison
	 */
	return (result);
}


/*
 * xf86lookupBoolOption()
 *
 *    Look up an option name in an array of known Boolean option names.
 *    Note that a Boolean option name can have a "No" prefix.  If found,
 *    return the array subscript of the Boolean option name.  Otherwise
 *    return -1.
 */
static int
xf86lookupBoolOption(
	const char *const bool_option_names[], const char *opt_name)
{
	int		i;		/* Index into option name array */
	const char	*s1resume;	/* Comparison resumption point */

	/*
	 * Look up the option name, which can be negated using a "No" prefix
	 */
	for (i = 0; bool_option_names[i] != NULL; i += 1) {
		/*
		 * See whether this is a plain instance of the option name
		 */
		if (xf86nameCompare(bool_option_names[i], opt_name) == 0) {
			return (i);	/* Have a match */
		}
		
		/*
		 * See whether this is a negated instance of the option name
		 */
		(void) xf86nameCompareResumable(opt_name, "No", &s1resume);
		if (s1resume == NULL) {
			s1resume = opt_name; /* Doesn't have a "No" prefix */
		}
		if (xf86nameCompare(bool_option_names[i], s1resume) == 0) {
			return (i);	/* Have a match */
		}
	}

	/*
	 * Not the name of a known Boolean option
	 */
	return (-1);
}


/*
 * xf86optionNameCompare()
 *
 *    Compare two option names pointed to by s1 and s2.  Ignore
 *    alphabetic case and the characters, '_', ' ', and '\t'.  For names
 *    of known Boolean options (provided via bool_option_names[]), any
 *    "No" prefix is ignored.  Return the usual negative, zero, or
 *    positive values to indicate the results of the comparison.
 *
 *    To see why we want a list of known Boolean option names, consider
 *    these ponderables:
 *        * Can we tell from this hypothetical example whether "Tables"
 *          is the name of a Boolean option, which could be negated?
 *                  Option  "Tables" 1
 *        * Can we tell whether "Notables" is the opposite of "Tables"?
 *        * Is the opposite of the documented Boolean option,
 *          "NoTrapSignals", intended to be "NoNoTrapSignals" or
 *          "TrapSignals"?  Ditto for "NoPM" and "NoInt10".
 */
int
xf86optionNameCompare(
	const char *const bool_option_names[], const char *s1, const char *s2)
{
	int		i;		/* Index of option name, else -1 */

	i = xf86lookupBoolOption(bool_option_names, s1);
	if ((i != -1) && (i == xf86lookupBoolOption(bool_option_names, s2))) {
		return (0);		/* Known Boolean option names match */
	}
	return (xf86nameCompare(s1, s2));
}


char *
xf86addComment(char *cur, char *add)
{
	char *str;
	int len, curlen, iscomment, hasnewline = 0, endnewline;

	if (add == NULL || add[0] == '\0')
		return (cur);

	if (cur) {
		curlen = strlen(cur);
		if (curlen)
		    hasnewline = cur[curlen - 1] == '\n';
		eol_seen = 0;
	}
	else
		curlen = 0;

	str = add;
	iscomment = 0;
	while (*str) {
	    if (*str != ' ' && *str != '\t')
		break;
	    ++str;
	}
	iscomment = (*str == '#');

	len = strlen(add);
	endnewline = add[len - 1] == '\n';
	len +=  1 + iscomment + (!hasnewline) + (!endnewline) + eol_seen;

	if ((str = xf86confrealloc(cur, len + curlen)) == NULL)
		return (cur);

	cur = str;

	if (eol_seen || (curlen && !hasnewline))
		cur[curlen++] = '\n';
	if (!iscomment)
		cur[curlen++] = '#';
	strcpy(cur + curlen, add);
	if (!endnewline)
		strcat(cur, "\n");

	return (cur);
}

