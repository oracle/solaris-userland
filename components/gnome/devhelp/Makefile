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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		devhelp
COMPONENT_VERSION=	41.1
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Apps/Devhelp
COMPONENT_ARCHIVE_HASH= \
	sha256:46ea4f8752c22442e0f14be10387a4e8a3872680c3f04882aabeac7daea22e4b
COMPONENT_BUGDB=        gnome/help
COMPONENT_ANITYA_ID=	13119

COMPONENT_BAID=		108917
BUILD_STYLE=		meson

COMPILER= gcc

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Reduce the compiler optimization to workaround assertion issues on x86 platform (pages not loaded).
CFLAGS += -O2

ifeq ($(MACH),sparc)
# Webkit expects that only 48 bits from the address are effectively used.
# This is not true on Solaris SPARC platform, so we use a mapfile to limit virtual address space.
LD_EXEC_OPTIONS += -M $(WS_COMPONENTS)/desktop/webkitgtk4/mapfile_sparc_48bits
endif

LDFLAGS += -z gnu-version-script-compat

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# need to use gnu-gettext
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/webkitgtk4
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/math
