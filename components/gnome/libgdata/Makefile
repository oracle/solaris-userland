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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libgdata
COMPONENT_VERSION=	0.18.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/libgdata
COMPONENT_ARCHIVE_HASH=	\
    sha256:dd8592eeb6512ad0a8cf5c8be8c72e76f74bfe6b23e4dd93f0756ee0716804c7
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13145

COMPONENT_BAID=		110573
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
LDFLAGS += -z gnu-version-script-compat

CONFIGURE_OPTIONS += -Dinstalled_tests=true
CONFIGURE_OPTIONS += -Dgtk_doc=true

COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9]*.[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/GLib-Net-WARNING/d" ' \
        '-e "/OK/p" ' \
        '-e "/Fail/p" ' \
        '-e "/Pass/p" ' \
        '-e "/Ok/p" ' \
        '-e "/ok/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/liboauth
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/uhttpmock
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
