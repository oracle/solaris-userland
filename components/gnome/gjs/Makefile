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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gjs
COMPONENT_VERSION=	1.78.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Gjs
COMPONENT_ARCHIVE_HASH= \
	sha256:7e90511c429127c39eac0068c4ac9a353df7e6fbbc646f5f18e8962882c18641
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	9532

COMPONENT_BAID=		156453
BUILD_STYLE=		meson

# Workaround the mozjs issue described in 24935318
ifeq ($(MACH), sparc)
ADDITIONAL_PATCHES += patches/01-mozjs-workaround.sparc
COMPONENT_POST_UNPACK_ACTION += $(CP) /usr/lib/ld/map.vas47 $(SOURCE_DIR) ;
LD_EXEC_OPTIONS.64 += -M /usr/lib/ld/map.vas47
endif

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

CXXFLAGS += -std=c++17

CONFIGURE_OPTIONS += -Dcairo=enabled
CONFIGURE_OPTIONS += -Dprofiler=disabled
# we don't need to distribute gjs tests
CONFIGURE_OPTIONS += -Dinstalled_tests=false

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" '

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/libmozjs-115
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
