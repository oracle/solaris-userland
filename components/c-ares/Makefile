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
# Copyright (c) 2020, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER = gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		c-ares
COMPONENT_VERSION=	1.34.3
COMPONENT_PROJECT_URL=	https://c-ares.org
COMPONENT_ARCHIVE_HASH= \
    sha256:26e1f7771da23e42a18fdf1e58912a396629e53a2ac71b130af93bbcfb90adbe
COMPONENT_ARCHIVE_URL=	https://github.com/c-ares/c-ares/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/c-ares
COMPONENT_ANITYA_ID=	5840

COMPONENT_BAID=		186894

# Since C-ares 1.24.0 GoogleTest is no longer bundled. For now it's possible
# to build it separately and provide path to it to be able to run tests.
#
# GoogleTest can be configured like this (define GOOGLETEST and MACH64):
# cmake -DBUILD_SHARED_LIBS=ON -DCMAKE_INSTALL_LIBDIR=lib -DCMAKE_INSTALL_PREFIX=${GOOGLETEST} -DCMAKE_CXX_FLAGS=-m32 .
# cmake -DBUILD_SHARED_LIBS=ON -DCMAKE_INSTALL_LIBDIR=lib/${MACH64} -DCMAKE_INSTALL_PREFIX=${GOOGLETEST} .

ifdef GOOGLETEST
PKG_CONFIG_PATH.32 += $(GOOGLETEST)/lib/pkgconfig
PKG_CONFIG_PATH.64 += $(GOOGLETEST)/lib/$(MACH64)/pkgconfig
COMPONENT_TEST_ENV.32 = LD_LIBRARY_PATH=$(GOOGLETEST)/lib
COMPONENT_TEST_ENV.64 = LD_LIBRARY_PATH=$(GOOGLETEST)/lib/$(MACH64)
COMPONENT_TEST_ENV += $(COMPONENT_TEST_ENV.$(BITS))
PATH=/usr/gnu/bin:/usr/bin
endif

include $(WS_MAKE_RULES)/common.mk
