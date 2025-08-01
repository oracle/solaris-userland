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

COMPONENT_NAME=		geoclue
COMPONENT_VERSION=	2.7.2
COMPONENT_PROJECT_URL=	http://freedesktop.org/wiki/Software/GeoClue/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
        sha256:01d24a44a036769049411899ae83c9a86f73d272cca3df6af5a03bfac32456d2
COMPONENT_ARCHIVE_URL=	https://gitlab.freedesktop.org/$(COMPONENT_NAME)/$(COMPONENT_NAME)/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13108

COMPONENT_BAID=		328386

TEST_TARGET = $(NO_TESTS)

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/common.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)

# gtk-doc portion of build has various failures.
CONFIGURE_OPTIONS += -Dgtk-doc=false
CONFIGURE_OPTIONS += -D3g-source=false
CONFIGURE_OPTIONS += -Dcdma-source=false
CONFIGURE_OPTIONS += -Dmodem-gps-source=false
CONFIGURE_OPTIONS += -Dnmea-source=false
CONFIGURE_OPTIONS += -Ddemo-agent=false
CONFIGURE_OPTIONS.32 += -Dintrospection=false

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libsoup-3
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += system/library/math
