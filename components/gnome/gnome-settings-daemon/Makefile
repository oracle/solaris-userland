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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. 
#

BUILD_BITS =            64
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-settings-daemon
COMPONENT_VERSION=	3.34.2
COMPONENT_PROJECT_URL=	http://wiki.gnome.org
COMPONENT_ARCHIVE_HASH= \
	sha256:9fbae67e217e53b99e4f9e7d392c91ffbe31253941c9b136ef09c2d9db7ad7ed
COMPONENT_BUGDB=	gnome/session
COMPONENT_ANITYA_ID=	12860

TPNO=			59728
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/test-x11.mk

# requires python-dbusmock
TEST_TARGET = $(SKIP_TEST)

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^\# /p" ' \

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)

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
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/geoclue
REQUIRED_PACKAGES += library/desktop/geocode-glib
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libnotify
REQUIRED_PACKAGES += library/desktop/libgweather
REQUIRED_PACKAGES += library/desktop/xdg/libcanberra
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += service/gnome/desktop-cache
REQUIRED_PACKAGES += service/image/colord
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/polkit
REQUIRED_PACKAGES += system/library/upower
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxtst
