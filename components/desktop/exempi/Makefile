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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
# For now, all things built for C++11 require gcc.
COMPILER =		gcc
CTF_MODE =		off	# C++
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		exempi
COMPONENT_VERSION=	2.6.1
COMPONENT_PROJECT_URL=	https://libopenraw.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
	sha256:072451ac1e0dc97ed69a2e5bfc235fd94fe093d837f65584d0e3581af5db18cd
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/download/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/exempi
COMPONENT_ANITYA_ID=	767

COMPONENT_BAID=		119389

# disable for now since it requires boost C++ libraries
TEST_TARGET= $(SKIP_TEST)

# For now, all things built for C++11 require gcc.
CXXFLAGS += -std=c++11

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic
# Unit tests require boost C++ libraries.
CONFIGURE_OPTIONS += --disable-unittest
CONFIGURE_OPTIONS += --without-boost

REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/crypto
