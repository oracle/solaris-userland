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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		evince
COMPONENT_VERSION=	41.3
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Evince
COMPONENT_ARCHIVE_HASH= \
    sha256:3346b01f9bdc8f2d5ffea92f110a090c64a3624942b5b543aad4592a9de33bb0
COMPONENT_BUGDB=	gnome/evince
COMPONENT_ANITYA_ID=	8178

COMPONENT_BAID=		115222
BUILD_STYLE=		meson

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Need to pick up the GNU version of xgettext.
PATH=$(GNUBIN):$(USRBINDIR)

# For now, all things built for C++11 require gcc.
# Also, all components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=gcc
CXXFLAGS += -std=c++11

CPPFLAGS +=	"-I$(USRINCDIR)/libxml2"
LDFLAGS +=	$(CC_BITS) -lgmodule-2.0 -lm

CONFIGURE_OPTIONS +=	--libexecdir="$(USRLIB)"
CONFIGURE_OPTIONS +=	--sysconfdir="$(ETCDIR)"

# Requires djvulibre library.
CONFIGURE_OPTIONS +=	-Ddjvu=disabled
# Requires LaTeX libraries.
CONFIGURE_OPTIONS +=	-Ddvi=disabled
# Required for other components.
CONFIGURE_OPTIONS.32 +=	-Dintrospection=false
CONFIGURE_OPTIONS.32 +=	-Dnautilus=false
CONFIGURE_OPTIONS +=	-Dps=enabled

# Needed to find GNU msgfmt.
COMPONENT_BUILD_ENV += PATH="/usr/gnu/bin:$(PATH)"

REQUIRED_PACKAGES += desktop/pdf-viewer/poppler-viewer
REQUIRED_PACKAGES += gnome/file-manager/nautilus
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libgxps
REQUIRED_PACKAGES += library/desktop/libhandy
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/libspectre
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/filter/poppler
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
