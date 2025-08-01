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
# Copyright (c) 2012, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ncurses
COMPONENT_VERSION=	6.5-20250614
IPS_COMPONENT_VERSION=	6.5.0.20250614
COMPONENT_PROJECT_URL=	https://invisible-island.net/ncurses/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_HASH= \
    sha256:c78a054fd86b0d6cbaad4a2489c0fe685a8e5ad123da20083f7b443f6223da3c
COMPONENT_ARCHIVE_URL=	https://invisible-mirror.net/archives/ncurses/current/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/ncurses
COMPONENT_ANITYA_ID=	2057
COMPONENT_BAID=		332302

# Tests are interactive and require ncurses to be installed in CBE.
# You can compile and run them from ncurses' test directory.
TEST_TARGET = $(NO_TESTS)
SYSTEM_TEST_TARGET = $(NO_TESTS)

# Required to deliver ncurses manual page.
COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D))

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_PREFIX =	/usr/gnu

# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)

# Choose a standard in case the default changes.
CXXFLAGS += -std=sun03

CONFIGURE_OPTIONS +=	--with-shared
CONFIGURE_OPTIONS +=	--with-abi-version=5
CONFIGURE_OPTIONS +=	--with-normal
CONFIGURE_OPTIONS +=	--enable-rpath
CONFIGURE_OPTIONS +=	--enable-widec
CONFIGURE_OPTIONS +=	--enable-symlinks
CONFIGURE_OPTIONS +=	--enable-pc-files
CONFIGURE_OPTIONS +=	--with-pkg-config-libdir=$(PKG_CONFIG_DEFAULT)
CONFIGURE_OPTIONS +=	--includedir=$(USRINCDIR)/ncurses
CONFIGURE_OPTIONS +=	--with-default-terminfo-dir=$(GNUSHARE)/terminfo
# With gcc 11 ncurses suddenly try to build ada bindings and fail. So we just
# disable it.
CONFIGURE_OPTIONS +=	--with-ada=no

# We only deliver 64-bit binaries and in /usr/bin.
COMPONENT_POST_INSTALL_ACTION.32 += \
	$(GSED) -i -e 's|$(GNUBIN)/i86|$(GNUBIN)|' \
		$(PROTOGNUBIN)/$(MACH32)/ncursesw5-config;

REQUIRED_PACKAGES += shell/bash
