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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates. 
#
BUILD_BITS= 		64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER= 		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gdm
COMPONENT_VERSION=	3.38.2.1
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/GDM
COMPONENT_ARCHIVE_URL=  \
	https://download.gnome.org/sources/gdm/3.38/gdm-3.38.2.1.tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:ca58a205d5ebfcbdab56a11716b898e16ae5dff21aee79d076046444628ec4da
COMPONENT_BUGDB=        gnome/gdm
COMPONENT_ANITYA_ID=	13122

TPNO=			65076
BUILD_STYLE=		meson

# Make sure we haven't broken the SMF manifest formatting
SMF_MANIFESTS= files/gdm.xml

# Tests do not pass because of insufficient gsed filtering.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU msgfmt in PATH.
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)

# intltool may or may not be run depending on previous state of build dir
COMPONENT_TEST_TRANSFORMS += "-e '/\/usr\/bin\/intltool-update/d'"

CONFIGURE_OPTIONS += -Dsolaris=true
CONFIGURE_OPTIONS += -Dselinux=disabled
CONFIGURE_OPTIONS += -Dipv6=true
CONFIGURE_OPTIONS += -Dgdm-xsession=true
CONFIGURE_OPTIONS += -Dlibaudit=disabled
CONFIGURE_OPTIONS += -Dsystemd-journal=false
CONFIGURE_OPTIONS += -Dwayland-support=false
CONFIGURE_OPTIONS += -Dplymouth=disabled
CONFIGURE_OPTIONS += -Dgroup=gdm
CONFIGURE_OPTIONS += -Ddefault-path='$(USRBINDIR):$(USRSBINDIR)'
CONFIGURE_OPTIONS += -Dxauth-dir=/tmp
CONFIGURE_OPTIONS += -Dinitial-vt=7
CONFIGURE_OPTIONS += --libexecdir="$(USRLIBDIR)/gdm"

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gdm-screenshot.1 \
                $(PROTO_DIR)/usr/share/man/man1/gdm-screenshot.1; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gdmflexiserver.1 \
                $(PROTO_DIR)/usr/share/man/man1/gdmflexiserver.1; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gdm.8 \
                $(PROTO_DIR)/usr/share/man/man8/gdm.8; \
        $(INSTALL) -D $(COMPONENT_DIR)/files/xterm.desktop \
                $(PROTO_DIR)/usr/share/xsessions/xterm.desktop; \
        $(INSTALL) -D $(COMPONENT_DIR)/files/gdm.xml \
                $(PROTO_DIR)/lib/svc/manifest/application/graphical-login/gdm.xml; \
        $(INSTALL) -D $(COMPONENT_DIR)/files/gdm-launch-environment.pam \
                $(PROTO_DIR)/etc/gdm/gdm-launch-environment.pam; \
        $(INSTALL) -D $(COMPONENT_DIR)/files/svc-gdm \
                $(PROTO_DIR)/lib/svc/method/svc-gdm; \
        $(INSTALL) -D $(COMPONENT_DIR)/files/org.gnome.login-screen.gschema.override \
                $(PROTO_DIR)/usr/share/glib-2.0/schemas/org.gnome.login-screen.gschema.override;

REQUIRED_PACKAGES += data/iso-codes
REQUIRED_PACKAGES += developer/documentation-tool/itstool
REQUIRED_PACKAGES += file/gnu-coreutils
REQUIRED_PACKAGES += gnome/accessibility/orca
REQUIRED_PACKAGES += gnome/gnome-session
REQUIRED_PACKAGES += gnome/gnome-shell
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += gnome/zenity
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/xdg/libcanberra
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/dconf
REQUIRED_PACKAGES += library/gnome/yelp-tools
REQUIRED_PACKAGES += library/xdg/consolekit
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/io/audio
REQUIRED_PACKAGES += system/library/accountsservice
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/devinfo
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += terminal/xterm
REQUIRED_PACKAGES += x11/keyboard/xkb-utilities
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxdmcp
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/server/xephyr
REQUIRED_PACKAGES += x11/server/xserver-common
REQUIRED_PACKAGES += x11/session/xinit
REQUIRED_PACKAGES += x11/x11-server-utilities

# Required for testing, not building or running:
REQUIRED_PACKAGES += developer/test/check
REQUIRED_PACKAGES += library/libxml2
