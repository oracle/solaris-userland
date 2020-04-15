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
# Copyright (c) 2018, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=		32_and_64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nspr
COMPONENT_VERSION=	4.25
COMPONENT_PROJECT_URL=	https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSPR
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:0bc309be21f91da4474c56df90415101c7f0c7c7cab2943cd943cd7896985256
COMPONENT_ARCHIVE_URL=	http://ftp.mozilla.org/pub/$(COMPONENT_NAME)/releases/v$(COMPONENT_VERSION)/src/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/nspr
COMPONENT_ANITYA_ID=	7953

TPNO=			57828

LDFLAGS += $(CC_BITS)

CONFIGURE_SCRIPT = $(SOURCE_DIR)/nspr/configure
CONFIGURE_LIBDIR.32 =	$(CONFIGURE_PREFIX)/lib/mps
CONFIGURE_LIBDIR.64 =	$(CONFIGURE_PREFIX)/lib/mps/$(MACH64)
CONFIGURE_OPTIONS += --disable-debug --enable-optimize
CONFIGURE_OPTIONS += --includedir=$(CONFIGURE_PREFIX)/include/mps
CONFIGURE_OPTIONS.64 += --enable-64bit

COMPONENT_PRE_TEST_ACTION = \
	cd $(@D)/pr/tests; \
	$(GMAKE) $(COMPONENT_BUILD_ARGS) OS_CFLAGS="$(CFLAGS)";
COMPONENT_TEST_DIR =	$(@D)/pr/tests
COMPONENT_TEST_CMD =	$(SOURCE_DIR)/nspr/pr/tests/runtests.sh $(@D)/dist
COMPONENT_TEST_TARGETS =
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "/^BEGIN/d" '
COMPONENT_TEST_TRANSFORMS += '-e "/^END/d" '
COMPONENT_TEST_TRANSFORMS += '-e "s/ ([012][0-9]:[0-5][0-9]:[0-5][0-9])//g" '

include $(WS_MAKE_RULES)/common.mk
