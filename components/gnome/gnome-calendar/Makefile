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

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-calendar
COMPONENT_VERSION=	41.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Calendar
COMPONENT_ARCHIVE_HASH= \
	sha256:956b2f190322651c67fe667223896f8aa5acf33b70ada5a3b05a5361bda6611a
COMPONENT_BUGDB=	gnome/applications
COMPONENT_ANITYA_ID=	10906

COMPONENT_BAID=		115846
BUILD_STYLE=		meson

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/evolution-data-server
REQUIRED_PACKAGES += library/desktop/geoclue
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libhandy
REQUIRED_PACKAGES += library/desktop/libdazzle
REQUIRED_PACKAGES += library/desktop/libgweather
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/libical
REQUIRED_PACKAGES += library/libsoup-3
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
