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

COMPONENT_NAME=		baobab
COMPONENT_VERSION=	41.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Baobab
COMPONENT_ARCHIVE_HASH= \
	sha256:cad6278d2dcc80c84b57105aa5bb58d8a30ce98d6fabd767519ddb86c857e855
COMPONENT_BUGDB=	gnome/applications
COMPONENT_ANITYA_ID=	10907

COMPONENT_BAID=		108920
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types

COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libhandy
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/math
