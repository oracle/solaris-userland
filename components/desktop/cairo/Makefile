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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

# Cairo uses atomic intrinsics not supported in Studio 12.4 (ER 19201298)
COMPILER =              gcc
BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cairo
COMPONENT_VERSION=	1.17.8
COMPONENT_PROJECT_URL=	http://cairographics.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:5b10c8892d1b58d70d3f0ba5b47863a061262fa56b9dc7944161f8c8b783bc64
COMPONENT_ARCHIVE_URL=	https://cairographics.org/snapshots/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/cairo
COMPONENT_ANITYA_ID=	247

COMPONENT_BAID=		153973
BUILD_STYLE= 	 	meson	

# Cairo tests currently require an X display & require more work to run properly
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

LDFLAGS += $(CC_BITS)

CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += -Dtee=enabled
CONFIGURE_OPTIONS += -Dtests=disabled

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libcairo.3lib\
                $(PROTO_DIR)/usr/share/man/man3lib/libcairo.3lib;

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += image/library/libpng16
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
