/*
 * Copyright (c) 2008, Oracle and/or its affiliates. All rights reserved.
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
 * fbc_mode_list - List of Modes from the config file
 */


#include <stdio.h>		/* NULL */
#include <stdlib.h>		/* free(), malloc() */

#include "xf86Parser.h"		/* Public function, etc. declarations */

#include "fbc_Modes.h"		/* Edit Modes sections */
#include "fbc_error.h"		/* Error reporting */
#include "fbc_mode_list.h"	/* List of Modes from the config file */


/*
 * fbc_insert_mode_in_list()
 *
 *    Insert a ModeLine / Mode-EndMode element into an unintrusive
 *    singly-linked list of sorted Mode elements.  The list is sorted in
 *    "-res ?" display order.  Duplicate Modes are discarded.
 */

static
fbc_mode_elem_t *
fbc_insert_mode_in_list(
	fbc_mode_elem_t	*mode_list,	/* Modes from Monitor section of cfg */
	XF86ConfModeLinePtr new_mode_ptr) /* ModeLine / Mode-EndMode entry */
{
	int		frequency;	/* Vert frequency of Mode in list */
	fbc_mode_elem_t	*mode_elem;	/* Mode list element (unintrusive) */
	fbc_mode_elem_t	**mode_elem_p;	/* Ptr to ptr to Mode list element */
	XF86ConfModeLinePtr mode_ptr;	/* ModeLine / Mode-EndMode entry */
	int		name_comp;	/* Result of Mode name comparison */
	int		new_frequency;	/* Vertical frequency of new Mode */
	long		total;		/* Total pixels */

	/*
	 * Find the insertion point in the sorted list for the new Mode element
	 *
	 *    The insertion point will be left in the *mode_elem_p
	 *    location.  The list is sorted according to these keys:
	 *        Primary:    Horizontal addressable pixels  (Descending)
	 *        Secondary:  Vertical addressable lines     (Descending)
	 *        Tertiary:   Vertical frequency             (Descending)
	 *        Quaternary: Mode name string               (Ascending)
	 *
	 *    Quinary, etc. keys aren't needed for -res ? display
	 *    purposes.  They are used so that exact duplicate Modes can
	 *    be detected easily and discarded.  Their sort order is
	 *    arbitrary.
	 *
	 *    Raw DotClock values shouldn't be used in place of vertical
	 *    frequency values, since they don't reflect the blanking
	 *    times or borders (if any).
	 */
	total = (long)new_mode_ptr->ml_htotal * new_mode_ptr->ml_vtotal;
	if (total <= 0) {
		return (mode_list);	/* Needs to be more pixilated */
	}
	new_frequency = (long)new_mode_ptr->ml_clock * 1000 / total;

	for (mode_elem_p = &mode_list;
	    *mode_elem_p != NULL;
	     mode_elem_p = (fbc_mode_elem_t **)&mode_elem->list.next) {
		mode_elem = *mode_elem_p;
		mode_ptr  = mode_elem->mode_ptr;

		/*
		 * See if an insertion point has been found for -res ? purposes
		 */
		if (new_mode_ptr->ml_hdisplay > mode_ptr->ml_hdisplay) {
			break;
		}
		if (new_mode_ptr->ml_hdisplay < mode_ptr->ml_hdisplay) {
			continue;
		}

		if (new_mode_ptr->ml_vdisplay > mode_ptr->ml_vdisplay) {
			break;
		}
		if (new_mode_ptr->ml_vdisplay < mode_ptr->ml_vdisplay) {
			continue;
		}

		total     = (long)mode_ptr->ml_htotal * mode_ptr->ml_vtotal;
		frequency = (long)mode_ptr->ml_clock * 1000 / total;
		if (new_frequency > frequency) {
			break;
		}
		if (new_frequency < frequency) {
			continue;
		}

		name_comp = xf86nameCompare(new_mode_ptr->ml_identifier,
					    mode_ptr->ml_identifier);
		if (name_comp < 0) {
			break;
		}
		if (name_comp > 0) {
			continue;
		}

		/*
		 * Discard this seemingly duplicate Mode if it's an exact dup
		 */
		if (new_mode_ptr->ml_htotal     > mode_ptr->ml_htotal) {
			break;
		}
		if (new_mode_ptr->ml_htotal     < mode_ptr->ml_htotal) {
			continue;
		}

		if (new_mode_ptr->ml_vtotal     > mode_ptr->ml_vtotal) {
			break;
		}
		if (new_mode_ptr->ml_vtotal     < mode_ptr->ml_vtotal) {
			continue;
		}

		if (new_mode_ptr->ml_clock      > mode_ptr->ml_clock) {
			break;
		}
		if (new_mode_ptr->ml_clock      < mode_ptr->ml_clock) {
			continue;
		}

		if (new_mode_ptr->ml_hsyncstart > mode_ptr->ml_hsyncstart) {
			break;
		}
		if (new_mode_ptr->ml_hsyncstart < mode_ptr->ml_hsyncstart) {
			continue;
		}

		if (new_mode_ptr->ml_hsyncend   > mode_ptr->ml_hsyncend) {
			break;
		}
		if (new_mode_ptr->ml_hsyncend   < mode_ptr->ml_hsyncend) {
			continue;
		}

		if (new_mode_ptr->ml_vsyncstart > mode_ptr->ml_vsyncstart) {
			break;
		}
		if (new_mode_ptr->ml_vsyncstart < mode_ptr->ml_vsyncstart) {
			continue;
		}

		if (new_mode_ptr->ml_vsyncend   > mode_ptr->ml_vsyncend) {
			break;
		}
		if (new_mode_ptr->ml_vsyncend   < mode_ptr->ml_vsyncend) {
			continue;
		}

		if (new_mode_ptr->ml_vscan      > mode_ptr->ml_vscan) {
			break;
		}
		if (new_mode_ptr->ml_vscan      < mode_ptr->ml_vscan) {
			continue;
		}

		if (new_mode_ptr->ml_hskew      > mode_ptr->ml_hskew) {
			break;
		}
		if (new_mode_ptr->ml_hskew      < mode_ptr->ml_hskew) {
			continue;
		}

		if (new_mode_ptr->ml_flags      > mode_ptr->ml_flags) {
			break;
		}
		if (new_mode_ptr->ml_flags      < mode_ptr->ml_flags) {
			continue;
		}

		return (mode_list);	/* Duplicate Mode, list is unchanged */
	}

	/*
	 * Allocate, initialize, and insert the new Mode list element
	 */
	mode_elem = malloc(sizeof (fbc_mode_elem_t));
	if (mode_elem == NULL) {
		fbc_errormsg("Insufficient memory, mode_list\n");
		exit(FBC_EXIT_FAILURE);	/* Avoid repeating error messages */
	}

	mode_elem->list.next = *mode_elem_p;
	mode_elem->mode_ptr  = new_mode_ptr;
	*mode_elem_p         = mode_elem;

	/*
	 * Return the (potentially new) list head
	 */
	return (mode_list);

}	/*  fbc_insert_mode_in_list() */


/*
 * fbc_append_mode_list_to_list()
 *
 *    Insert the ModeLine / Mode-EndMode entries from a config list into
 *    an unintrusive singly-linked list of sorted Mode elements.
 */

static
fbc_mode_elem_t *
fbc_append_mode_list_to_list(
	fbc_mode_elem_t	*mode_list,	/* Modes from Monitor section of cfg */
	XF86ConfModeLinePtr mode_ptr)	/* ModeLine / Mode-EndMode entry */
{

	/*
	 * Insert each ModeLine / Mode-EndMode entry into the unintrusive list
	 */
	for ( ; mode_ptr != NULL; mode_ptr = mode_ptr->list.next) {
		mode_list = fbc_insert_mode_in_list(mode_list, mode_ptr);
	}
	return (mode_list);

}	/* fbc_append_mode_list_to_list() */


/*
 * fbc_get_mode_list()
 *
 *    Create the Monitor section if it does not exist, along with any
 *    Modes sections that might be appropriate.
 *
 *    Return a dynamically allocated list of ModeLine / Mode-EndMode
 *    entries that are accessable from the specified Monitor section of
 *    the configuration file.
 */

fbc_mode_elem_t *
fbc_get_mode_list(
	XF86ConfigPtr	configIR,	/* Ptr to configuration Internal Rep */
	XF86ConfMonitorPtr monitor_sectn_ptr, /* Ptr to Monitor section IR */
	const char	*device_type)	/* Device type name (e.g. "nfb") */
{
	fbc_mode_elem_t	*mode_list;	/* Modes from Monitor section of cfg */
	XF86ConfModesLinkPtr modeslink;	/* Ptr to UseModes list entry */

	/*
	 * Make sure there's a Monitor section that declares some video modes
	 *
	 *    This function is called as part of processing some form of
	 *    the -res option.  By now the active/target sections should
	 *    have been identified, being created if necessary.  If the
	 *    Monitor section isn't present then a mischief has
	 *    occurred.  If the active Monitor section contains no video
	 *    mode declaration entries (ModeLine, Mode-EndMode, or
	 *    UseModes) then it may be that the section was newly
	 *    created and not yet accoutred.
	 */
	if (monitor_sectn_ptr == NULL) {
		return (NULL);		/* Unwelcome but not fatal (to us) */
	}

	/*
	 * Always get the predefined SunModes sections
	 */
	(void) fbc_append_Modes_sections(
				configIR, monitor_sectn_ptr, device_type);

	/*
	 * Start with any ModeLine / Mode-EndMode entries the Monitor section
	 */
	mode_list = fbc_append_mode_list_to_list(
				NULL, monitor_sectn_ptr->mon_modeline_lst);

	/*
	 * Traverse the list of Modes sectns specified by any UseModes entries
	 */
	for (modeslink = monitor_sectn_ptr->mon_modes_sect_lst;
	    modeslink != NULL;
	    modeslink = modeslink->list.next) {
		/*
		 * Add any ModeLine / Mode-EndMode entries in this Modes sectn
		 */
		mode_list = fbc_append_mode_list_to_list(
				mode_list,
				modeslink->ml_modes->mon_modeline_lst);
	}

	/*
	 * Return a pointer to the unintrusive Modes list
	 */
	return (mode_list);

}	/* fbc_get_mode_list() */


/*
 * fbc_free_mode_list()
 *
 *    Free a dynamically allocated list of unintrusive singly-linked
 *    Mode elements.
 */

void
fbc_free_mode_list(
	fbc_mode_elem_t	*mode_list)	/* Modes from Monitor section of cfg */
{
	fbc_mode_elem_t	*mode_elem;	/* Mode list element (unintrusive) */
	fbc_mode_elem_t	*next_mode_elem; /* Next Mode list element */

	for (mode_elem = mode_list;
	    mode_elem != NULL;
	    mode_elem = next_mode_elem) {
		next_mode_elem = mode_elem->list.next;
		free(mode_elem);
	}

}	/* fbc_free_mode_list() */


/* End of fbc_mode_list.c */
