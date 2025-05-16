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

COMPONENT_NAME=		gnome-tweaks
COMPONENT_VERSION=	45.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Tweaks
COMPONENT_ARCHIVE_HASH= \
	sha256:95ffa7f38d9b1dfd5e4cebefb752419fea21cd407021395adc9f112854416d4f
COMPONENT_BUGDB=	gnome/preferences
COMPONENT_ANITYA_ID=	1198
COMPONENT_BAID=		161518

BUILD_STYLE=		meson
PYTHON_VERSION=		3.11

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU msgfmt & xgettext is first in $PATH.
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# pkgdepend doesn't like the first line of a Python script to be:
# '#!/usr/bin/env python3' so turn it into '#!/usr/bin/python3.11'
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/gnome-tweaks

REQUIRED_PACKAGES += gnome/file-manager/nautilus
REQUIRED_PACKAGES += gnome/gnome-settings-daemon
REQUIRED_PACKAGES += gnome/gnome-shell
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += gnome/window-manager/mutter
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libnotify
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/desktop/libhandy
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/python/pygobject-3-311
REQUIRED_PACKAGES += runtime/python-311
