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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
COMPILER  = gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         snappy
COMPONENT_VERSION=      1.2.1
COMPONENT_ARCHIVE_HASH= \
    sha256:736aeb64d86566d2236ddffa2865ee5d7a82d26c9016b36218fcc27ea4f09f86
COMPONENT_ARCHIVE_URL=  https://github.com/google/snappy/archive/refs/tags/$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=  http://google.github.io/snappy/
COMPONENT_BUGDB=	library/libsnappy
COMPONENT_ANITYA_ID=	4844

COMPONENT_BAID = 323909

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
         ( cd $(COMPONENT_SRC)/third_party; $(RM) -r $(COMPONENT_NAME_TESTS);  $(SYMLINK) ../../$(COMPONENT_SRC_TESTS) $(COMPONENT_NAME_TESTS) )

CLEAN_PATHS += $(COMPONENT_SRC_TESTS)

BUILD_STYLE=    cmake

include $(WS_MAKE_RULES)/common.mk

CMAKE_OPTIONS += -DBUILD_SHARED_LIBS=ON
CMAKE_OPTIONS += -DSNAPPY_BUILD_BENCHMARKS=OFF
CMAKE_OPTIONS += -DINSTALL_GTEST=OFF

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV += CLICOLOR=0
COMPONENT_TEST_TRANSFORMS += -e '"s/[[:space:]]\+[0-9]\+\(\.[0-9]\+\)\? sec/ X sec/g" '

REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
