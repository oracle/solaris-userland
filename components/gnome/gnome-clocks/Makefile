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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-clocks
COMPONENT_VERSION=	44.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Clocks
COMPONENT_ARCHIVE_HASH= \
	sha256:17d7a97365cb8f1a023a1d78f7501f3353217fa7577d73afe7d0ca1e3b4f3838
COMPONENT_BUGDB=	gnome/applications
COMPONENT_ANITYA_ID=	10905

COMPONENT_BAID=		161769
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types

# Assumes GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/geoclue
REQUIRED_PACKAGES += library/desktop/geocode-glib
REQUIRED_PACKAGES += library/desktop/gsound
REQUIRED_PACKAGES += library/desktop/gtk4
REQUIRED_PACKAGES += library/desktop/libadwaita
REQUIRED_PACKAGES += library/desktop/libgweather
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += system/library/math
