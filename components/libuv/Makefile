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
# Copyright (c) 2022, 2025, Oracle and/or its affiliates.
#
# Build requirements, needed before inclusion of shared-macros.
BUILD_BITS=		64
COMPILER=		gcc
include ../../make-rules/shared-macros.mk

# Component information, used for download and packaging.
# -------------------------------------------------------
COMPONENT_NAME=		libuv
COMPONENT_VERSION=	1.50.0
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_SRC=		$(COMPONENT_NAME)-v$(COMPONENT_VERSION)
COMPONENT_BUGDB=	library/libuv
COMPONENT_BAID=		321128
COMPONENT_PROJECT_URL=	https://libuv.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL=	\
	https://dist.libuv.org/dist/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
# For check_anitya target, https://release-monitoring.org/project/10784
COMPONENT_ANITYA_ID=	10784
COMPONENT_ARCHIVE_HASH=	\
	sha256:6dc2b39aa7fa66c04e2e015bf47738b84e1c6b86b8987d57dd432d149d77ee25

include $(WS_MAKE_RULES)/common.mk

# Set LIBUVDEBUG=yes in environment to make this a debug build.
ifneq ($(LIBUVDEBUG), yes)
CPPFLAGS+=		-DNDEBUG
endif

# Preparation.
COMPONENT_PREP_ACTION = (cd $(@D) ; $(SHELL) autogen.sh)

# Post Build, create man page.  Requires sphinx-build.
# The awk script removes the DOWNLOADS and INSTALLATION sections.
COMPONENT_POST_BUILD_ACTION += \
	cd $(SOURCE_DIR)/docs; \
	$(MAKE) man BUILDDIR=$(BUILD_DIR); \
	$(CP) $(BUILD_DIR)/man/libuv.1 $(BUILD_DIR)/man/libuv.1.bak; \
	$(NAWK) '/^.SH DOWNLOADS$$/{sk=1}/^.SH AUTHOR$$/{sk=0}sk==0{print}' \
		$(BUILD_DIR)/man/libuv.1.bak > $(BUILD_DIR)/man/libuv.1; \

# Post Install, Copy man page into PROTO for packaging
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREMAN1DIR); \
	$(CP) $(BUILD_DIR)/man/libuv.1 $(PROTOUSRSHAREMAN1DIR);

# Test configuration
COMPONENT_TEST_TRANSFORMER =	$(NAWK)
COMPONENT_TEST_TRANSFORMS =	\
  -v dir=$(@D) -v perl=$(PERL) -v src=$(SOURCE_DIR) \
  -f $(COMPONENT_DIR)/Solaris/test-transform.awk

.PHONY: test-transform test-license show-man
# Test modified Solaris/test-transform.awk without rerunning tests.
test-transform:
	$(COMPONENT_TEST_PERFORM_TRANSFORM)
	$(COMPONENT_TEST_COMPARE)

# license verification, consistent license file build and check
e = /usr/gnu/bin/echo
copyright_files = LICENSE-extra LICENSE-docs
test-license:
	@$(MKDIR) -p $(BUILD_DIR)
	@( \
		d='--------------------------------------' ; \
		$e "$${d:0:31} Top-level license $${d:0:26}"; $e; \
		cat $(SOURCE_DIR)/LICENSE; $e; $e; \
		for f in $(copyright_files); do \
			(( n=$${#f}+2 ));(( r=$${#d}-(n/2) )); (( l=r-n%2 )); \
			$e "$${d:0:$$l} $$f $${d:0:$$r}"; $e; \
			cat $(SOURCE_DIR)/$$f; $e; $e; \
			done; \
	)  > $(BUILD_DIR)/libuv.license.new;
	@cmp $(COMPONENT_DIR)/libuv.license \
	    $(BUILD_DIR)/libuv.license.new >/dev/null || \
		( \
			$e 'WARNING: $(COMPONENT_DIR)/libuv.license'; \
			$e ' and $(BUILD_DIR)/libuv.license.new differ.'; \
		)

# Helper target to display manual page.
show-man: $(BUILD_DIR)/man/libuv.1
	/usr/bin/nroff -man $(BUILD_DIR)/man/libuv.1
