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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xterm
COMPONENT_VERSION=	333
COMPONENT_PROJECT_URL=	http://invisible-island.net/xterm/
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL=  https://invisible-mirror.net/archives/xterm/$(COMPONENT_ARCHIVE:.tar.gz=.tgz)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ARCHIVE_HASH= \
	sha256:2f1d42014e55c8036c6b29a847b31d3b5c1a3a35b126993ae6d3f05e8da0ef78
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	5272
TPNO=			43016

PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CPPFLAGS += -D_XOPEN_SOURCE=700 -D__EXTENSIONS__

CONFIGURE_OPTIONS += --enable-256-color
CONFIGURE_OPTIONS += --enable-88-color
CONFIGURE_OPTIONS += --enable-wide-chars
CONFIGURE_OPTIONS += --disable-setuid
CONFIGURE_OPTIONS += --disable-setgid
CONFIGURE_OPTIONS += --enable-luit
CONFIGURE_OPTIONS += --disable-imake
CONFIGURE_OPTIONS += --with-app-defaults=/usr/share/X11/app-defaults
CONFIGURE_OPTIONS += --with-icondir=/usr/share/pixmaps
CONFIGURE_OPTIONS += --enable-logging
CONFIGURE_OPTIONS += LUIT=$(USRBINDIR)/luit

# xterm uses desktop-file-install
REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
# xterm uses ncurses/term.h
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += terminal/luit
REQUIRED_PACKAGES += text/groff
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxpm
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
