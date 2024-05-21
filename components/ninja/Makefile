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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

COMPILER= gcc
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ninja
COMPONENT_VERSION=	1.12.1
COMPONENT_PROJECT_URL=	https://ninja-build.org/
# modifying the upstream tarball name since it has the same one as tigervnc
COMPONENT_ARCHIVE=	ninja-v$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:821bdff48a3f683bc4bb3b6f0b5fe7b2d647cf65d52aeb63328c91a6c6df285a
COMPONENT_ARCHIVE_URL=	https://github.com/ninja-build/ninja/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=        utility/ninja
COMPONENT_ANITYA_ID=	2089
COMPONENT_BAID=		166645

BUILD_STYLE = justmake

# Upstream started using GoogleTest instead of their own test
# framework which came into effect since version 1.12.0.
# See patches/01-gtest-source-dir.patch file for details.
COMPONENT_NAME_TESTS=		googletest
COMPONENT_VERSION_TESTS=	1.14.0
COMPONENT_PROJECT_URL_TESTS=	https://github.com/google/googletest
COMPONENT_SRC_TESTS=		$(COMPONENT_NAME_TESTS)-$(COMPONENT_VERSION_TESTS)
COMPONENT_ARCHIVE_TESTS=	v$(COMPONENT_VERSION_TESTS).tar.gz
COMPONENT_ARCHIVE_HASH_TESTS= \
    sha256:8ad598c73ad796e0d8280b082cebd82a630d73e73cd3c70057938a6501bba5d7
COMPONENT_ARCHIVE_URL_TESTS=	$(COMPONENT_PROJECT_URL_TESTS)/archive/v$(COMPONENT_VERSION_TESTS).tar.gz
	
PKG_PROTO_DIRS += $(BUILD_DIR_64)
PKG_PROTO_DIRS += $(BUILD_DIR_64)/doc
PKG_PROTO_DIRS += $(BUILD_DIR_64)/misc

include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_BUILD_ACTION = \
	$(CLONEY) $(SOURCE_DIR) $(@D); \
	cd $(@D); $(ENV) $(COMPONENT_BUILD_ENV) \
	./configure.py --bootstrap --gtest-source-dir=$(COMPONENT_DIR)/$(COMPONENT_SRC_TESTS)

COMPONENT_INSTALL_ACTION =  \
	touch $(BUILD_DIR_64)/.installed

COMPONENT_PRE_TEST_ACTION = \
	cd $(BUILD_DIR_64); \
	./ninja all; 

COMPONENT_TEST_CMD = cd $(BUILD_DIR_64); ./ninja_test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS = \
	'-e "s/ ([0-9][0-9]* ms)//g" ' \
	'-e "s/ ([0-9][0-9]* ms total)//g" '

REQUIRED_PACKAGES += developer/parser/re2c
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
