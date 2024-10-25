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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		eog-plugins
COMPONENT_VERSION=	44.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/EyeOfGnome
COMPONENT_ARCHIVE_HASH= \
	sha256:c4c384155fabb34889d76b616065483f94c8310fa0147236d009c68cd4a85c93
COMPONENT_BUGDB=	gnome/applications
COMPONENT_ANITYA_ID=	13120

COMPONENT_BAID=		182869
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

PYTHON_VERSION = 3.11

# Disable map plugin so we don't need libchamplain or clutter
CONFIGURE_OPTIONS += -Dplugin_map=false

# Set runpath to find libeog.so library.
LDFLAGS += -Wl,-R$(USRLIBDIR64)/eog

# Assumes GNU msgfmt is in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
CONFIGURE_ENV += PYTHON=$(PYTHON)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += image/library/libexif
REQUIRED_PACKAGES += image/viewer/eog
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libgdata
REQUIRED_PACKAGES += library/desktop/libpeas
REQUIRED_PACKAGES += library/glib2
