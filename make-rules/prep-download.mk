#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at usr/src/OPENSOLARIS.LICENSE
# or http://www.opensolaris.org/os/licensing.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at usr/src/OPENSOLARIS.LICENSE.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2010, 2020, Oracle and/or its affiliates.
#

FETCH =		$(WS_TOOLS)/userland-fetch

#
# Anything that we download must have a COMPONENT_ARCHIVE_URL{_[0-9]+} macro
# that tells us where the canonical source for the archive can be found.  The
# macro for the first archive is typically un-suffixed.  By convention,
# subsequent archives will include a _[0-9]+ in the macro name.  This allows
# an arbitrary number of archives to be downloaded for a particular component
# Makefile.  It is also important to note that there is a corresponding
# COMPONENT_ARCHIVE macro defining a local file name for the archive, and
# optional COMPONENT_ARCHIVE_HASH and COMPONENT_SIG_URL containing a hash of
# the file and signature for verification of its contents.
#

URL_SUFFIXES = $(subst COMPONENT_ARCHIVE_URL_,, \
		$(filter COMPONENT_ARCHIVE_URL_%, $(.VARIABLES)))

# Templates for download variables and rules.  We separate the variable
# assignments from the rules so that all the variable assignments are given a
# chance to complete before those variables are used in targets or
# prerequisites, where they'll be expanded immediately.  Use ifneq/origin
# instead of ifdef due to GNU Make bug 49093.
define download-variables
ifneq "$(origin COMPONENT_ARCHIVE_URL$(1))" "undefined"
ARCHIVES += $$(COMPONENT_ARCHIVE$(1))
CLOBBER_PATHS += $$(COMPONENT_ARCHIVE$(1)) $$(notdir $$(COMPONENT_SIG_URL$(1)))
endif
endef

define download-rules
ifneq "$(origin COMPONENT_ARCHIVE_URL$(1))" "undefined"
download::	$$(USERLAND_ARCHIVES)$$(COMPONENT_ARCHIVE$(1))

$$(USERLAND_ARCHIVES)$$(COMPONENT_ARCHIVE$(1)):	$(MAKEFILE_PREREQ)
	$$(FETCH) --file $$@ \
		$$(COMPONENT_ARCHIVE_URL$(1):%=--url '%') \
		$$(COMPONENT_ARCHIVE_HASH$(1):%=--hash '%') \
		$$(COMPONENT_SIG_URL$(1):%=--sigurl '%') \
		$$(COMPONENT_PUBLIC_KEY_URL$(1):%=--pubkey '%')
	$$(TOUCH) $$@

REQUIRED_PACKAGES += runtime/python-37

endif
endef

# Evaluate the variable assignments immediately.
# Use $(if) instead of ifeq() because the latter is evaluated immediately.
$(eval $(call download-variables,))
$(foreach suffix, $(URL_SUFFIXES), $(eval $(call download-variables,_$(suffix))))

# Put the rule evaluations in a variable for deferred evaluation.
define eval-download-rules
$(eval $(call download-rules,))
$(foreach suffix, $(URL_SUFFIXES), $(eval $(call download-rules,_$(suffix))))
endef

# Needed for signature validation of downloads
REQUIRED_PACKAGES += crypto/gnupg
