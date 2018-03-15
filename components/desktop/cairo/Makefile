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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#

# Cairo uses atomic intrinsics not supported in Studio 12.4 (ER 19201298)
COMPILER =              gcc
BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cairo
COMPONENT_VERSION=	1.14.8
COMPONENT_PROJECT_URL=	http://cairographics.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:d1f2d98ae9a4111564f6de4e013d639cf77155baf2556582295a0f00a9bc5e20
COMPONENT_ARCHIVE_URL=	http://cairographics.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/cairo
COMPONENT_ANITYA_ID=	247

TPNO=			34482

# Cairo tests currently require an X display & require more work to run properly
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

LDFLAGS += $(CC_BITS)

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

# Needs update to work with latest cogl; optional.
CONFIGURE_OPTIONS += --disable-cogl
CONFIGURE_OPTIONS += --disable-static
# Requires bfd (a newer version?); optional.
CONFIGURE_OPTIONS += --disable-symbol-lookup
CONFIGURE_OPTIONS += --enable-atomic
CONFIGURE_OPTIONS += --enable-ft
CONFIGURE_OPTIONS += --enable-gl
CONFIGURE_OPTIONS += --enable-glx
CONFIGURE_OPTIONS += --enable-gobject
CONFIGURE_OPTIONS += --enable-gtk-doc
CONFIGURE_OPTIONS += --enable-interpreter
CONFIGURE_OPTIONS += --enable-largefile
CONFIGURE_OPTIONS += --enable-pdf
CONFIGURE_OPTIONS += --enable-png
CONFIGURE_OPTIONS += --enable-ps
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --enable-svg
CONFIGURE_OPTIONS += --enable-tee
CONFIGURE_OPTIONS += --enable-xcb
CONFIGURE_OPTIONS += --enable-xcb-shm
CONFIGURE_OPTIONS += --enable-xlib
CONFIGURE_OPTIONS += --enable-xlib-xrender
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-x

# Required due to patches.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += library/glib2
# Requires pixman >= 0.30
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += library/libspectre
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/mesa
