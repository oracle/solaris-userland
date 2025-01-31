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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

# Cairo uses atomic intrinsics not supported in Studio 12.4 (ER 19201298)
COMPILER =              gcc
BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cairo
COMPONENT_VERSION=	1.18.2
COMPONENT_PROJECT_URL=	http://cairographics.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:a62b9bb42425e844cc3d6ddde043ff39dbabedd1542eba57a2eb79f85889d45a
COMPONENT_ARCHIVE_URL=	https://www.cairographics.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/cairo
COMPONENT_ANITYA_ID=	247

COMPONENT_BAID=		194215
BUILD_STYLE= 	 	meson	

include $(WS_MAKE_RULES)/common.mk

LDFLAGS += $(CC_BITS)

CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += -Dtee=enabled
CONFIGURE_OPTIONS += -Dtests=disabled

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libcairo.3lib\
                $(PROTO_DIR)/usr/share/man/man3lib/libcairo.3lib;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" '


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
