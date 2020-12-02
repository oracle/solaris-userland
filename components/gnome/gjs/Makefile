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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gjs
COMPONENT_VERSION=	1.66.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Gjs
COMPONENT_ARCHIVE_HASH= \
	sha256:8d4240455eff642c8bf6d9805077e33e0a60cb2ea13f77a55f7f30c29668344c
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	9532

TPNO=			63540
BUILD_STYLE=		meson

# Tests do not work in Solaris yet
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk

CXXFLAGS += -std=c++17

CONFIGURE_OPTIONS += -Dcairo=enabled
CONFIGURE_OPTIONS += -Dprofiler=disabled
# we don't need to distribute gjs tests
CONFIGURE_OPTIONS += -Dinstalled_tests=false

# Workaround the mozjs issue described in 24935318
ifeq ($(MACH), sparc)
LD_EXEC_OPTIONS.64 += -M $(WS_COMPONENTS)/desktop/polkit/mapfile
COMPONENT_BUILD_ENV.64 += LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS.64)"
COMPONENT_INSTALL_ENV.64 += LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS.64)"
endif

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/libmozjs-78
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
