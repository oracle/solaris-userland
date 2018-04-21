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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		nautilus
COMPONENT_VERSION=	3.24.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Apps/Files
COMPONENT_ARCHIVE_HASH= \
	sha256:8a499247caff3c02437c0ad955f043e675a056912d8553d9c9783c762f5dbbbd
COMPONENT_BUGDB=        gnome/nautilus
COMPONENT_ANITYA_ID=	2050

TPNO=			35134

include $(WS_MAKE_RULES)/gnome-component.mk

# Uses c99 language types (bool, etc.).
CFLAGS += -std=gnu99

# 32-bit gcc builds cause segfaults in Nautilus; see bug 21393975.
gcc_OPT.i386.32 = -O2

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Not yet available for Solaris.
CONFIGURE_OPTIONS += --disable-packagekit
CONFIGURE_OPTIONS += --disable-selinux
# Not desired for production builds.
CONFIGURE_OPTIONS += --disable-profiling
CONFIGURE_OPTIONS += --disable-static
# See --enable-tracker below.
CONFIGURE_OPTIONS += --disable-tracker
CONFIGURE_OPTIONS += --enable-gtk-doc
CONFIGURE_OPTIONS += --enable-introspection
CONFIGURE_OPTIONS += --enable-libexif
CONFIGURE_OPTIONS += --enable-nst-extension
CONFIGURE_OPTIONS += --enable-shared
# Cyclic dependency; must build nautilus first, then build tracker, then build
# nautilus again.
# CONFIGURE_OPTIONS += --enable-tracker
CONFIGURE_OPTIONS += --enable-xmp

REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += image/library/libexif
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gnome-autoar
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/exempi
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += service/gnome/desktop-cache
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
