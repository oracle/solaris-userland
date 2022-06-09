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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libtorrent
COMPONENT_VERSION=	0.13.8
COMPONENT_PROJECT_URL=	https://github.com/rakshasa/libtorrent
COMPONENT_ARCHIVE_HASH=	\
    sha256:ed115a28f4ae8cfcd33b94a597c076ca74fd549867a26e4fac9505c27288e983
COMPONENT_ARCHIVE_URL=	https://github.com/rakshasa/rtorrent-archive/raw/master/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/rtorrent
COMPONENT_ANITYA_ID=	1742

COMPONENT_BAID=		113928

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# GNU Build System files have to be regenerated for automake 1.16.
# It can be removed when the upstream starts to use a newer automake version.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

CONFIGURE_OPTIONS  +=	--disable-debug

ifneq ($(strip $(OPENSSL3)),)
# Build against OpenSSL 3.
PKG_CONFIG_PATHS.64 = /usr/openssl/3/lib/64/pkgconfig
PKG_CONFIG_PATHS.32 = /usr/openssl/3/lib/pkgconfig
PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))

# Without this, linker flags from pkgconfig are added too late to take effect.
LDFLAGS.32 += -L/usr/openssl/3/lib
LDFLAGS.64 += -L/usr/openssl/3/lib/$(MACH64)
COMPONENT_BUILD_ARGS += LDFLAGS="$(LDFLAGS.$(BITS))"
endif

COMPONENT_PRE_TEST_ACTION = (cd $(COMPONENT_TEST_DIR) && /usr/gnu/bin/make LibTorrentTest)
COMPONENT_TEST_DIR =  $(BUILD_DIR)/$(MACH$(BITS))/test
COMPONENT_TEST_CMD = ./LibTorrentTest
COMPONENT_TEST_ARGS =
COMPONENT_TEST_TARGETS = 

# Following line must be there to make the tests pass. Refer to the bug
# to get more info.
REQUIRED_PACKAGES += developer/c++/cppunit
ifneq ($(strip $(OPENSSL3)),)
REQUIRED_PACKAGES += library/security/openssl-3
else
REQUIRED_PACKAGES += library/security/openssl
endif
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
