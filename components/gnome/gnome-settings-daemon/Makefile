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
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-settings-daemon
COMPONENT_VERSION=	45.1
COMPONENT_PROJECT_URL=	http://wiki.gnome.org
COMPONENT_ARCHIVE_HASH= \
	sha256:c62bfec9817eee5b83ebe901a9286189a67eb5ff033c5dd41506574f822bf090
COMPONENT_BUGDB=	gnome/session
COMPONENT_ANITYA_ID=	12860

COMPONENT_BAID=		157184
BUILD_STYLE=		meson

# Tests require python-dbusmock and umockdev packages
# that are not available in Userland consolidation.
TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# gudev not yet supported on Solaris.
CONFIGURE_OPTIONS += -Dgudev=false
# GNOME NetworkManager not yet supported on Solaris.
CONFIGURE_OPTIONS += -Dnetwork_manager=false
# Linux-specific.
CONFIGURE_OPTIONS += -Drfkill=false
# Wayland not yet supported on Solaris.
CONFIGURE_OPTIONS += -Dwayland=false
CONFIGURE_OPTIONS += -Dwwan=false
CONFIGURE_OPTIONS += -Dudev_dir=''
CONFIGURE_OPTIONS += -Dsystemd=false
CONFIGURE_OPTIONS += -Dalsa=false
CONFIGURE_OPTIONS += --libexecdir=$(USRLIB.$(BITS))

REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/desktop/geoclue
REQUIRED_PACKAGES += library/desktop/geocode-glib
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libgweather
REQUIRED_PACKAGES += library/desktop/libnotify
REQUIRED_PACKAGES += library/desktop/p11-kit
REQUIRED_PACKAGES += library/desktop/xdg/libcanberra
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr-4
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += service/image/colord
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/polkit
REQUIRED_PACKAGES += system/library/upower
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxi
