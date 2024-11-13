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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ibus
COMPONENT_VERSION=	1.5.29
COMPONENT_PROJECT_URL=	https://github.com/ibus/ibus
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-rc2
COMPONENT_ARCHIVE_HASH=	\
    sha256:3a27ed120485b2077c62e36e788c302f34544ceac3b3b9cda28b7418e8051415
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	g11n/im-ibus
COMPONENT_ANITYA_ID=	1352

COMPONENT_BAID=		158838

# disabled, upstream tests require DISPLAY and ibus daemon running.
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# Required by GCC 14 - it's needed until vala is fixed.
CFLAGS += -Wno-incompatible-pointer-types

# Use explicit Python version rather than the default one
PYTHON_VERSION =	3.11
CONFIGURE_ENV +=	PYTHON=$(PYTHON)

CONFIGURE_ENV +=	PATH=$(GNUBIN):$(USRBINDIR)
CONFIGURE_ENV +=	GI_SCANNER_DISABLE_CACHE=1

CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=	--disable-gtk2
CONFIGURE_OPTIONS +=	--enable-gtk3
CONFIGURE_OPTIONS.64 +=	--enable-gtk4
CONFIGURE_OPTIONS +=	--enable-gtk-doc
CONFIGURE_OPTIONS +=	--enable-xim
CONFIGURE_OPTIONS.32 +=	--disable-introspection
CONFIGURE_OPTIONS.64 +=	--enable-introspection
CONFIGURE_OPTIONS +=	--libexecdir="$(USRLIBDIR)/$(COMPONENT_NAME)"
CONFIGURE_OPTIONS +=	--sysconfdir=/etc
CONFIGURE_OPTIONS +=	--disable-emoji-dict
CONFIGURE_OPTIONS +=	--disable-unicode-dict
CONFIGURE_OPTIONS +=	--disable-appindicator # Requires dbusmenu-gtk3
CONFIGURE_OPTIONS +=	--disable-python2
CONFIGURE_OPTIONS +=	--disable-systemd-services
CONFIGURE_OPTIONS +=	--disable-wayland

# Force rebuilding C sources from vala sources to avoid Wayland dependencies
# Workaround for https://github.com/ibus/ibus/issues/2609
COMPONENT_POST_UNPACK_ACTION += $(TOUCH) $(SOURCE_DIR)/ui/gtk3/*.vala ;

# For autopyc transformation
PKG_MACROS +=   PYVER=$(PYTHON_VERSION)

REQUIRED_PACKAGES +=	data/iso-codes
REQUIRED_PACKAGES +=	developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES +=	library/desktop/at-spi2-core
REQUIRED_PACKAGES +=	library/desktop/cairo
REQUIRED_PACKAGES +=	library/desktop/gdk-pixbuf
REQUIRED_PACKAGES +=	library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES +=	library/desktop/graphene
REQUIRED_PACKAGES +=	library/desktop/gtk3
REQUIRED_PACKAGES +=	library/desktop/gtk4
REQUIRED_PACKAGES +=	library/desktop/libnotify
REQUIRED_PACKAGES +=	library/desktop/pango
REQUIRED_PACKAGES +=	library/glib2
REQUIRED_PACKAGES +=	library/gnome/dconf
REQUIRED_PACKAGES +=	runtime/python-311
REQUIRED_PACKAGES +=	x11/library/libx11
REQUIRED_PACKAGES +=	x11/library/libxfixes
REQUIRED_PACKAGES +=	x11/library/libxi
