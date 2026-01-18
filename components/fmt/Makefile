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
# Copyright (c) 2023, 2026, Oracle and/or its affiliates.
#

BUILD_BITS= 		64
COMPILER=		gcc
CTF_MODE =		off	# C++
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		fmt
COMPONENT_VERSION=	12.1.0

COMPONENT_PROJECT_URL=	https://github.com/fmtlib/fmt
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL=	https://github.com/fmtlib/fmt/archive/refs/tags/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	sha256:ea7de4299689e12b6dddd392f9896f08fb0777ac7168897a244a6d6085043fea

CMAKE_OPTIONS +=	-DBUILD_SHARED_LIBS=TRUE
CMAKE_OPTIONS +=	-DCMAKE_POSITION_INDEPENDENT_CODE=TRUE

COMPONENT_BUGDB=	library/fmt
COMPONENT_BAID=		362274

BUILD_STYLE=		cmake

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
