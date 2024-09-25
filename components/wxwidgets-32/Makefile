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
# 32-bit preferred as only *-config and source generation scripts delivered.
BUILD_BITS= 32_and_64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		wxWidgets
COMPONENT_VERSION=	3.2.4
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:0640e1ab716db5af2ecb7389dbef6138d7679261fbff730d23845ba838ca133e
COMPONENT_ARCHIVE_URL=	https://github.com/wxWidgets/wxWidgets/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  http://www.wxwidgets.org/
COMPONENT_BUGDB=	library/wxwidgets
COMPONENT_ANITYA_ID=	5150

COMPONENT_BAID=		163725

# GNU grep features are expected
PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

CXXFLAGS += -std=c++11

# patch 002-gst1.0.2.patch modifies configure.in
COMPONENT_PREP_ACTION += (cd $(@D); autoconf);

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PKG_PROTO_DIRS += $(COMPONENT_DIR)/man

LDFLAGS += $(CC_BITS)

CONFIGURE_OPTIONS += --with-gtk=3
CONFIGURE_OPTIONS += --enable-mimetype
CONFIGURE_OPTIONS += --enable-xrc
CONFIGURE_OPTIONS += --with-subdirs
CONFIGURE_OPTIONS += --with-expat
CONFIGURE_OPTIONS += --with-sdl
CONFIGURE_OPTIONS += --without-gtkprint
CONFIGURE_OPTIONS += --without-gnomevfs
CONFIGURE_OPTIONS += --with-opengl
CONFIGURE_OPTIONS += --with-regex=sys
CONFIGURE_OPTIONS += --disable-webviewwebkit

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libnotify
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/sdl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxkbcommon
REQUIRED_PACKAGES += x11/library/libxtst
REQUIRED_PACKAGES += x11/library/libxxf86vm
REQUIRED_PACKAGES += x11/library/mesa
