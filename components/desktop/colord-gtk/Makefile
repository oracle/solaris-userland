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
COMPILER =              gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		colord-gtk
COMPONENT_VERSION=	0.3.1
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/software/colord/
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:c176b889b75630a17f4e3d7ef24c09a3e12368e633496087459c8b53ac3a122d
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	331

COMPONENT_BAID=		159961

TEST_TARGET = $(NO_TESTS)

BUILD_STYLE= 		meson
include $(WS_MAKE_RULES)/common.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext first in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# We have no need for a gtk2 version any longer
CONFIGURE_OPTIONS += -Dgtk2=false
# We need gtk3 for gnome-control-center 41 (until we upgrade to 45)
CONFIGURE_OPTIONS += -Dgtk3=true
# We need gtk4 for gnome-control-center 45, but gtk4 is 64-bit-only
CONFIGURE_OPTIONS.32 += -Dgtk4=false
CONFIGURE_OPTIONS.64 += -Dgtk4=true
# Cannot build man pages without docbook-xsl-ns
CONFIGURE_OPTIONS += -Dman=false
# gobject-introspection & Vala API required for other components
CONFIGURE_OPTIONS.32 += -Dintrospection=false -Dvapi=false
CONFIGURE_OPTIONS.64 += -Dintrospection=true -Dvapi=true

REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtk4
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += service/image/colord
REQUIRED_PACKAGES += text/gnu-gettext
