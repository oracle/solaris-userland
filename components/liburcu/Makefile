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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

# Refer to ../../doc/makefile-variables.txt
#
# Build requirements, needed before inclusion of shared-macros.
BUILD_BITS=		64
COMPILER=		gcc
CTF_MODE =		relaxed

include ../../make-rules/shared-macros.mk

# Component information, used for download and packaging.
# -------------------------------------------------------
# https://lttng.org/files/urcu/userspace-rcu-0.15.3.tar.bz2.asc
COMPONENT_NAME=		userspace-rcu
COMPONENT_VERSION=	0.15.3
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_BUGDB=	LIBRARY/LIBURCU
COMPONENT_BAID=		336112
COMPONENT_PROJECT_URL=	https://liburcu.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
	sha256:26687ec84e3e114759454c884a08abeaf79dec09b041895ddf4c45ec150acb6d
COMPONENT_ARCHIVE_URL=	\
	https://lttng.org/files/urcu/$(COMPONENT_ARCHIVE)
# For check_anitya target, https://release-monitoring.org/project/7134
COMPONENT_ANITYA_ID=	7134

include $(WS_MAKE_RULES)/common.mk

# Configure wants gnu make, so make sure its in the path first.
PATH=$(GNUBIN):$(USRBINDIR)
# solaris-build.md suggests setting these preprocessor CFLAGS
CFLAGS += -D_XOPEN_SOURCE=1 -D_XOPEN_SOURCE_EXTENDED=1 -D__EXTENSIONS__=1
# Don't deliver static libraries
CONFIGURE_OPTIONS +=	--disable-static

COMPONENT_TEST_MASTER = \
	$(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS)-$(MACH).master

# When updating workspace from one version to another
# it seems the publisher package repository needs clearing out;
# which this achieves, simply use `gmake republish` instead of `gmake publish`.
republish:
	$(GMAKE) publish PKGREPO_REMOVE_BEFORE_PUBLISH=yes

# Test configuration
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|^\(.* \- get_possible_cpus_array_len (\)\([0-9]*\)\(.*\)|\1ELIDED\3|" '

# license verification, consistent license file build and check
e = /usr/gnu/bin/echo
copyright_files = `echo $(SOURCE_DIR)/LICENSES/*`
test-license:
	@$(MKDIR) -p $(BUILD_DIR)
	@( \
		d='--------------------------------------' ; \
		$e "$${d:0:31} Top-level license $${d:0:26}"; $e; \
		cat $(SOURCE_DIR)/LICENSE.md; $e; $e; \
		for ff in $(copyright_files); do \
			f=$${ff#$(SOURCE_DIR)/}; \
			(( n=$${#f}+2 ));(( r=$${#d}-(n/2) )); (( l=r-n%2 )); \
			$e "$${d:0:$$l} $$f $${d:0:$$r}"; $e; \
			cat $$ff; $e; $e; \
			done; \
	)  > $(BUILD_DIR)/liburcu.license.new;
	@cmp $(COMPONENT_DIR)/liburcu.license \
	    $(BUILD_DIR)/liburcu.license.new >/dev/null || \
		( \
			$e 'WARNING: $(COMPONENT_DIR)/liburcu.license'; \
			$e ' and $(BUILD_DIR)/liburcu.license.new differ.'; \
		)

# Packaging.
# ---------
# see ./generate directory and use `gmake manifest-update` as necessary.
#

# Additional testing
# ------------------
#
# Our 'make test' target runs and compares liburcu's check target; a
# bunch of short tests meant to be run when rebuilding or porting
# Userspace RCU.  In addition to that there is 'regtest' target which
# is a longer test meant to be run when modifying Userspace RCU or
# porting it to a new architecture or operating system.  For ease of
# use:
regtest check:
	(cd $(BUILD_DIR_64) ; $(MAKE) $@)

.PHONY: republish test-license regtest check

# Package dependencies. None.
# EOF
