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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gsettings-desktop-schemas
COMPONENT_VERSION=	45.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/HowDoI/GSettings
COMPONENT_ARCHIVE_HASH= \
    sha256:365c8d04daf79b38c8b3dc9626349a024f9e4befdd31fede74b42f7a9fbe0ae2
COMPONENT_BUGDB=	gnome/gconf
COMPONENT_ANITYA_ID=	13139

COMPONENT_BAID=		153631
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS.32 += -Dintrospection=false

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)

REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += system/core-os
