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
BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		off	# C++
include ../../make-rules/shared-macros.mk

PATH=$(SPRO_VROOT)/bin:$(USRBINDIR):$(GNUBIN):$(USRSBINDIR)

COMPONENT_NAME=		unrar
COMPONENT_VERSION=	7.1.2
COMPONENT_BAID=		189656
COMPONENT_ARCHIVE_HASH=	\
	sha256:143dcacb3a9d9ca0af695adecabe1350b0a3e93d927a065ef8f7cc605ab2d322
COMPONENT_SRC=		$(COMPONENT_NAME)
COMPONENT_PROJECT_URL=	https://www.rarlabs.com/rar_add.htm
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)src-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL=	https://www.rarlab.com/rar/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	13306

# We need this before the default PKG_PROTO_DIRS, so set it before we include
# common.mk, which will append the default set.
PKG_PROTO_DIRS = $(BUILD_DIR_64)

BUILD_STYLE= justmake
INSTALL_TARGET= build
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Needed by .../unrar/os.hpp to correctly define platform endianness.
CXXFLAGS.i386 = -DLITTLE_ENDIAN
CXXFLAGS.sparc = -DBIG_ENDIAN

COMPONENT_BUILD_ENV += DEFINES="$(CPP_LARGEFILES)"

COMPONENT_BUILD_ARGS += -f makefile
COMPONENT_BUILD_ARGS += STRIP="/bin/true"
# Override component makefile flags.
COMPONENT_BUILD_ARGS += CXX="$(CXX)"
COMPONENT_BUILD_ARGS += CXXFLAGS="$(CXXFLAGS)"

REQUIRED_PACKAGES += system/library/c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
