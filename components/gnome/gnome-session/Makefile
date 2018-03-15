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

BUILD_BITS=             64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-session
COMPONENT_VERSION=	3.24.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/SessionManagement
COMPONENT_ARCHIVE_HASH= \
	sha256:87e380a54628f0e6e4506887c409ec0f99024e7840d614edfeeb511dea884d2c
COMPONENT_BUGDB=	gnome/session
COMPONENT_ANITYA_ID=	13136

TPNO=			34626

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Use xdg autostart instead of gconf-based autostart; gconf is obsolete and has
# been replaced by dconf.
CONFIGURE_OPTIONS += --disable-gconf
# Linux-specific.
CONFIGURE_OPTIONS += --disable-systemd
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)
# ConsoleKit is deprecated; need to figure out long-term solution with
# upstream.
CONFIGURE_OPTIONS += --enable-consolekit
CONFIGURE_OPTIONS += --enable-docbook-docs
CONFIGURE_OPTIONS += --enable-ipv6
CONFIGURE_OPTIONS += --enable-man
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-xtrans

# Required due to patches.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

# Assumes GNU msgfmt, xgettext, tail, etc. are first in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)

REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/xdg/consolekit
REQUIRED_PACKAGES += service/gnome/desktop-cache
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/libdbus-glib
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libepoxy
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/mesa
REQUIRED_PACKAGES += x11/library/xtrans
