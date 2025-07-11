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

BUILD_BITS =            32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		totem-pl-parser
COMPONENT_VERSION=	3.26.6
COMPONENT_PROJECT_URL=  https://developer.gnome.org/totem-pl-parser/
COMPONENT_ARCHIVE_HASH= \
	sha256:c0df0f68d5cf9d7da43c81c7f13f11158358368f98c22d47722f3bd04bd3ac1c
COMPONENT_BUGDB=        gnome/multimedia
COMPONENT_ANITYA_ID=	13163

COMPONENT_BAID=		110878

BUILD_STYLE=         meson
TEST_TARGET  = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

LD_OPTIONS += -z gnu-version-script-compat

# Required so that configure can find and use 64-bit version of config program.
CONFIGURE_ENV.64 += ac_cv_path_LIBGCRYPT_CONFIG=$(USRBINDIR64)/libgcrypt-config

# Required for other components.
CONFIGURE_OPTIONS.32 += -Dintrospection=false
CONFIGURE_OPTIONS.64 += -Dintrospection=true
CONFIGURE_OPTIONS += -Denable-libarchive=yes
CONFIGURE_OPTIONS += -Denable-libgcrypt=yes
CONFIGURE_OPTIONS += -Ddefault_library=shared

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/security/libgcrypt
