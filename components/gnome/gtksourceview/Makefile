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
# Gtksourceview build sometimes fails when building by parallel jobs
COMPONENT_MAKE_JOBS=1

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gtksourceview
COMPONENT_VERSION=	4.8.4
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GtkSourceView
COMPONENT_ARCHIVE_HASH= \
    sha256:7ec9d18fb283d1f84a3a3eff3b7a72b09a10c9c006597b3fbabbb5958420a87d
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	7724

COMPONENT_BAID=		153253
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk
include $(WS_MAKE_RULES)/test-x11.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

CONFIGURE_OPTIONS.32 += -Dgir=false
CONFIGURE_OPTIONS += -Dgtk_doc=true

# Uses gcc extensions for zero-sized struct/union.
CFLAGS.studio += $(studio_FEATURES_EXTENSIONS)

CFLAGS += -Wstack-protector -fdata-sections -fstack-protector-all

# Version 4.8.1 requires following for GCC 11 build.
CFLAGS += -Wno-error=incompatible-pointer-types

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/fribidi
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math

