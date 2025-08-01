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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		32_and_64
# For now, all things built for C++11 require gcc.
COMPILER =		gcc
CTF_MODE =		off	# C++
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		taglib
COMPONENT_VERSION=	1.13.1
COMPONENT_PROJECT_URL=	https://taglib.github.io/
COMPONENT_ARCHIVE_HASH= \
	sha256:c8da2b10f1bfec2cd7dbfcd33f4a2338db0765d851a50583d410bacf055cfd0b
COMPONENT_ARCHIVE_URL=	https://taglib.github.io/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/taglib
COMPONENT_ANITYA_ID=	1982

COMPONENT_BAID=		146742

BUILD_STYLE= cmake

include $(WS_MAKE_RULES)/common.mk

CXXFLAGS += -std=c++11
CMAKE_OPTIONS += -DBUILD_SHARED_LIBS=ON

# Override values from make-rules/cmake.mk to get correct pkgconfig files.
CMAKE_OPTIONS.32 += -DCMAKE_INSTALL_LIBDIR="lib"
CMAKE_OPTIONS.64 += -DCMAKE_INSTALL_LIBDIR="lib/$(MACH64)"

REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
