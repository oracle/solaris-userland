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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ibus
COMPONENT_VERSION=	1.5.19
COMPONENT_PROJECT_URL=	https://github.com/ibus/ibus
COMPONENT_ARCHIVE_HASH=	\
    sha256:4b66c798dab093f0fa738e5c10688d395a463287d13678c208a81051af5d2429
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	g11n/im-ibus
COMPONENT_ANITYA_ID=	1352

TPNO=			48784

# disabled, upstream tests require DISPLAY and ibus daemon running.
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV +=	PATH=$(GNUBIN):$(USRBINDIR)
CONFIGURE_ENV +=	GI_SCANNER_DISABLE_CACHE=1

CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=	--enable-gtk2
CONFIGURE_OPTIONS +=	--enable-gtk3
CONFIGURE_OPTIONS +=	--enable-xim
CONFIGURE_OPTIONS +=	--enable-introspection
CONFIGURE_OPTIONS +=	--libexecdir="$(USRLIBDIR)/$(COMPONENT_NAME)"
CONFIGURE_OPTIONS +=	--sysconfdir=/etc
CONFIGURE_OPTIONS +=	--disable-emoji-dict
CONFIGURE_OPTIONS +=	--disable-unicode-dict

# gtkdoc fails on current sources
CONFIGURE_OPTIONS +=	--disable-gtk-doc

COMPONENT_POST_INSTALL_ACTION += \
    $(GUNZIP) -f $(PROTO_DIR)/usr/share/man/man*/*.gz ;

REQUIRED_PACKAGES +=	library/desktop/atk
REQUIRED_PACKAGES +=	library/desktop/cairo
REQUIRED_PACKAGES +=	library/desktop/gdk-pixbuf
REQUIRED_PACKAGES +=	library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES +=	library/desktop/gtk2
REQUIRED_PACKAGES +=	library/desktop/gtk3
REQUIRED_PACKAGES +=	library/desktop/libnotify
REQUIRED_PACKAGES +=	library/desktop/pango
REQUIRED_PACKAGES +=	library/glib2
REQUIRED_PACKAGES +=	library/gnome/dconf
REQUIRED_PACKAGES +=	library/popt
REQUIRED_PACKAGES +=	runtime/python-27
REQUIRED_PACKAGES +=	x11/library/libx11
REQUIRED_PACKAGES +=	x11/library/libxi
