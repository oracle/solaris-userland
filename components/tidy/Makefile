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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		tidy
COMPONENT_VERSION=	5.8.0
COMPONENT_PROJECT_URL=	http://www.html-tidy.org/
COMPONENT_SRC_NAME=	tidy-html5
COMPONENT_ARCHIVE_HASH=	\
    sha256:59c86d5b2e452f63c5cdb29c866a12a4c55b1741d7025cf2f3ce0cde99b0660e
COMPONENT_ARCHIVE_URL=	https://github.com/htacg/tidy-html5/archive/$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	library/tidy
COMPONENT_ANITYA_ID=	13267

COMPONENT_BAID=		324063

BUILD_STYLE= cmake

# There are not unit tests.
TEST_TARGET= $(NO_TESTS)
SYSTEM_TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

CMAKE_OPTIONS += -DBUILD_TAB2SPACE=ON

# Override values from make-rules/cmake.mk to get correct pkgconfig files.
CMAKE_OPTIONS.32 += -DLIB_INSTALL_DIR="lib"
CMAKE_OPTIONS.64 += -DLIB_INSTALL_DIR="lib/$(MACH64)"

# Tests need to download some Ruby gems which is not supported.
# To run tests individually comment out above TEST_TARGET settings.
COMPONENT_PRE_TEST_ACTION += ( \
	$(LN) -s $(SOURCE_DIR)/regression_testing/cases $(@D)/cases ; \
        mkdir $(BUILD_DIR)/test-home; export HOME=$(BUILD_DIR)/test-home; \
	export PATH=/usr/ruby/$(RUBY_VERSION)/bin:$(PATH); \
        gem install --user-install thor tty-editor )
COMPONENT_TEST_ENV += HOME=$(BUILD_DIR)/test-home
COMPONENT_TEST_ENV += PATH=$(BUILD_DIR)/test-home/.local/share/gem/ruby/$(RUBY_VERSION).0/bin:/usr/ruby/$(RUBY_VERSION)/bin:/usr/gnu/bin:/usr/bin
COMPONENT_TEST_CMD = $(SOURCE_DIR)/regression_testing/test.rb
COMPONENT_TEST_ARGS = test --tidy=./tidy
COMPONENT_TEST_TARGETS =

# Needed for the 64-bit tab2space executable.
PKG_PROTO_DIRS += $(BUILD_DIR_64)
