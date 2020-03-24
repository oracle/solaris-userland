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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libwebp
COMPONENT_VERSION=	1.1.0
COMPONENT_PROJECT_URL=	https://www.webmproject.org/
COMPONENT_ARCHIVE_HASH= \
	sha256:98a052268cc4d5ece27f76572a7f50293f439c17a98e67c4ea0c7ed6f50ef043
COMPONENT_ARCHIVE_URL=	http://downloads.webmproject.org/releases/webp/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/libwebp
COMPONENT_ANITYA_ID=	1761

TPNO=			57963

# Required for 64-bit builds.
LDFLAGS += $(CC_BITS)

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# To generate configure
COMPONENT_PREP_ACTION += ( cd $(@D); autoreconf -fiv);

# needs libgif, so disabling for now
CONFIGURE_OPTIONS += --disable-gif
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-gl
CONFIGURE_OPTIONS += --enable-threading
CONFIGURE_OPTIONS += --enable-png
CONFIGURE_OPTIONS += --enable-jpeg
CONFIGURE_OPTIONS += --enable-tiff
CONFIGURE_OPTIONS += --enable-everything
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/freeglut
REQUIRED_PACKAGES += x11/library/mesa
