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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=             64
COMPILER=               gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-shell-extensions
COMPONENT_VERSION=	45.2
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/GnomeShell/Extensions
COMPONENT_ARCHIVE_HASH= \
	sha256:ee32f6387a2d18adbff7a956689bc747866b4a8712d73790c002abeae4ccaaaf
COMPONENT_BUGDB=	gnome/gnome-shell
COMPONENT_ANITYA_ID=	1195

COMPONENT_BAID=		157325
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Dclassic_mode=true
CONFIGURE_OPTIONS += -Dextension_set=all

REQUIRED_PACKAGES += gnome/file-manager/nautilus
REQUIRED_PACKAGES += gnome/gnome-shell
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += gnome/window-manager/mutter
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-menus
