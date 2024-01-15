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

BUILD_BITS=             64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-session
COMPONENT_VERSION=	45.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/SessionManagement
COMPONENT_ARCHIVE_HASH= \
	sha256:706d2ffcacac38553a3c0185793f5a2b4aac940bb5e789d953c9808163bef2f1
COMPONENT_BUGDB=	gnome/session
COMPONENT_ANITYA_ID=	13136

COMPONENT_BAID=		157185
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Linux-specific.
CONFIGURE_OPTIONS += -Dsystemd_session=disable
CONFIGURE_OPTIONS += -Dsystemd=false
CONFIGURE_OPTIONS += -Dsystemd_journal=false
CONFIGURE_OPTIONS += -Dconsolekit=true
CONFIGURE_OPTIONS += -Dsession_selector=true

REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += system/library/dbus/dbus-x11
REQUIRED_PACKAGES += x11/library/libepoxy
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/mesa
