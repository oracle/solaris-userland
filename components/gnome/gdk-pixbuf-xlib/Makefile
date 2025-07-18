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

# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=		gcc
BUILD_BITS =		32_and_64
include ../../../make-rules/shared-macros.mk
BUILD_STYLE=            meson

COMPONENT_NAME=		gdk-pixbuf-xlib
COMPONENT_VERSION=	2.40.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GdkPixbuf
COMPONENT_ARCHIVE_HASH= \
     sha256:8b8e1c270ec16a06f665ea841f8e4e167eaa0118d0cbfeeade43745f09198ff7
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	229509
COMPONENT_BAID=		111708

SYSTEM_TEST_TARGET= $(SYSTEM_TESTS_NOT_IMPLEMENTED)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgdk_pixbuf_xlib-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgdk_pixbuf_xlib-2.0.3lib;

# Standard automake test framework results transform
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += x11/library/libx11
