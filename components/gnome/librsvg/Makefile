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

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		librsvg
COMPONENT_VERSION=	2.56.3
COMPONENT_MAJOR_MINOR=	$(basename $(COMPONENT_VERSION))
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/LibRsvg
COMPONENT_ARCHIVE_HASH=	\
    sha256:5a328048a02d014645cd27f61140f4e0b11280fb2c7f2a21864fe0c59ac1ce88

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:9a72d8d100d362c47b81ad173b1da09e2bf674a79f9439d9f2c436b1f31c7e7e

COMPONENT_BUGDB=        library/librsvg
COMPONENT_ANITYA_ID=	5420

COMPONENT_BAID=		147811

include $(WS_MAKE_RULES)/cargo-vendored.mk
include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += --disable-Bsymbolic
CONFIGURE_OPTIONS += --disable-static
# Required for other components.
CONFIGURE_OPTIONS += --enable-introspection
CONFIGURE_OPTIONS += --enable-vala

# Requires a reconf due to patch to configure.ac.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)
COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo
COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/^[mM]ake/d" ' \
        '-e "s/;[[:space:]]finished[[:space:]].*//" ' \
        '-e "/test result/p" ' \

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH64).master

REQUIRED_PACKAGES += developer/rust/cargo
REQUIRED_PACKAGES += developer/rust/rustc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
