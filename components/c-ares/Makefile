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
# Copyright (c) 2020, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		c-ares
COMPONENT_VERSION=	1.34.6
COMPONENT_PROJECT_URL=	https://c-ares.org
COMPONENT_ARCHIVE_HASH= \
    sha256:912dd7cc3b3e8a79c52fd7fb9c0f4ecf0aaa73e45efda880266a2d6e26b84ef5
COMPONENT_ARCHIVE_URL=	https://github.com/c-ares/c-ares/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/c-ares
COMPONENT_ANITYA_ID=	5840

COMPONENT_BAID=		360417

# Internal testing requires Googletest.
COMPONENT_NAME_TESTS=		googletest
COMPONENT_VERSION_TESTS=	1.16.0
COMPONENT_PROJECT_URL_TESTS=	https://github.com/google/googletest
COMPONENT_SRC_TESTS=		$(COMPONENT_NAME_TESTS)-$(COMPONENT_VERSION_TESTS)
COMPONENT_ARCHIVE_TESTS=	$(COMPONENT_SRC_TESTS).tar.gz
COMPONENT_ARCHIVE_HASH_TESTS= \
     sha256:78c676fc63881529bf97bf9d45948d905a66833fbfa5318ea2cd7478cb98f399
COMPONENT_ARCHIVE_URL_TESTS=	$(COMPONENT_PROJECT_URL_TESTS)/archive/v$(COMPONENT_VERSION_TESTS).tar.gz

COMPONENT_POST_UNPACK_ACTION_TESTS = \
         ( cd $(COMPONENT_SRC)/test; $(RM) -r $(COMPONENT_NAME_TESTS);  $(SYMLINK) ../../$(COMPONENT_SRC_TESTS) $(COMPONENT_NAME_TESTS) )

CLEAN_PATHS += $(COMPONENT_SRC_TESTS)

BUILD_STYLE=    cmake

include $(WS_MAKE_RULES)/common.mk

CMAKE_OPTIONS += -DCARES_BUILD_TESTS=ON
CMAKE_OPTIONS += -DINSTALL_GTEST=OFF

# Override values from make-rules/cmake.mk to get correct pkgconfig files.
CMAKE_OPTIONS += -DCMAKE_INSTALL_BINDIR="bin"
CMAKE_OPTIONS.32 += -DCMAKE_INSTALL_LIBDIR="lib"
CMAKE_OPTIONS.64 += -DCMAKE_INSTALL_LIBDIR="lib/$(MACH64)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV += CLICOLOR=0
COMPONENT_TEST_TRANSFORMS += -e '"s/[[:space:]]\+[0-9]\+\(\.[0-9]\+\)\? sec/ X sec/g" '
