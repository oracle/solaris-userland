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
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-control-center
COMPONENT_VERSION=	3.34.4
COMPONENT_PROJECT_URL=  https://git.gnome.org/browse/gnome-control-center
COMPONENT_ARCHIVE_HASH= \
	sha256:17ea6db4b9cee75e99e77f0161a0e5209a3b86444ae775c2068ec192aba6272e
COMPONENT_BUGDB=	gnome/preferences
COMPONENT_ANITYA_ID=	5408

TPNO=			57223
BUILD_STYLE=		meson

# Tests do not pass because of insufficient gsed filtering.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Dgnome_session_libexecdir=$(USRLIBDIR)
CONFIGURE_OPTIONS += -Ddocumentation=true
CONFIGURE_OPTIONS += -Dibus=true
# Required for other components.
# No webcam support.
CONFIGURE_OPTIONS += -Dcheese=false
CONFIGURE_OPTIONS += -Dwayland=false

CFLAGS += -Wstack-protector -fdata-sections -fstack-protector-all

COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok/p" ' \
        '-e "/Fail/p" ' \
        '-e "/Pass/p" ' \
        '-e "/Skipped/p" ' \
        '-e "/Timeout/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += gnome/gnome-settings-daemon
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/clutter
REQUIRED_PACKAGES += library/desktop/clutter/clutter-gtk
REQUIRED_PACKAGES += library/desktop/colord-gtk
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/grilo
REQUIRED_PACKAGES += library/desktop/gsound
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libgweather
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/xdg/libcanberra
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/libgtop
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += service/image/colord
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/input-method/ibus
REQUIRED_PACKAGES += system/library/accountsservice
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libv12n
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/polkit
REQUIRED_PACKAGES += system/library/upower
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/mesa
