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
# Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		rabbitmq-c
COMPONENT_VERSION=	0.8.0
COMPONENT_ANITYA_ID=	13768
COMPONENT_PROJECT_URL=	https://github.com/alanxz/rabbitmq-c
COMPONENT_ARCHIVE_HASH=	sha256:277acd9f624a03a0918d3ba517b9b2950718821844b29d7115e12a716c9d1a07
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)

TPNO=			35521

BUILD_STYLE=		cmake
CMAKE_BUILD_TYPE=	Release
SYSTEM_TEST_TARGET= $(SYSTEM_TEST_32_and_64)
COMPONENT_TEST_TARGETS=	test
COMPONENT_TEST_TRANSFORMS += \
        '-e "s/[0-9]\.[0-9][0-9] sec//" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
include $(WS_MAKE_RULES)/common.mk

CMAKE_CFLAGS.32=	$(CC_BITS)
CMAKE_CFLAGS.64=	$(CC_BITS)

# Providing component specific build options to cmake
CMAKE_OPTIONS += -DCMAKE_INSTALL_PREFIX=$(CMAKE_PREFIX)
CMAKE_OPTIONS += -DINSTALL_BINDIR=$(CMAKE_BINDIR)
CMAKE_OPTIONS += -DINSTALL_LIBDIR=$(CMAKE_LIBDIR.$(BITS))
CMAKE_OPTIONS += -DENABLE_SSL_SUPPORT=ON
CMAKE_OPTIONS += -DBUILD_SHARED_LIBS=ON
# Building a static version of the library is required for the tests to run.
# We don't deliver the .a version of the library.
CMAKE_OPTIONS += -DBUILD_STATIC_LIBS=ON
CMAKE_OPTIONS += -DBUILD_TESTS=ON
CMAKE_OPTIONS += -DBUILD_TOOLS=ON
CMAKE_OPTIONS += -DBUILD_TOOLS_DOCS=ON
CMAKE_OPTIONS += -DENABLE_THREAD_SAFETY=ON
CMAKE_OPTIONS += -DCMAKE_C_COMPILER=$(CC)
CMAKE_OPTIONS += -DCMAKE_C_FLAGS="$(CMAKE_CFLAGS.$(BITS))"

# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)

REQUIRED_PACKAGES += library/popt
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += system/library
