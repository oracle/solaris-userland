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

COMPONENT_NAME=		gom
COMPONENT_VERSION=	0.5.3
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Gom
COMPONENT_ARCHIVE_HASH=	\
	sha256:069d0909fbdc6b4d27edf7a879366194e3ab508b03548bf5b89ff63546d20177
COMPONENT_ARCHIVE_URL=	\
	https://download.gnome.org/sources/$(COMPONENT_NAME)/$(COMPONENT_MAJOR_MINOR)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13230

COMPONENT_BAID=		193243
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Use explicit Python version rather than the default one
CONFIGURE_ENV +=	PYTHON=$(PYTHON.3.11)

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Requires gi-docgen
CONFIGURE_OPTIONS += -Denable-gtk-doc=false
CONFIGURE_OPTIONS.32 += -Denable-introspection=false

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
