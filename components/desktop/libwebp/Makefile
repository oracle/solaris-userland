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

BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libwebp
COMPONENT_VERSION=	1.2.1
COMPONENT_PROJECT_URL=	https://www.webmproject.org/
COMPONENT_ARCHIVE_HASH= \
	sha256:808b98d2f5b84e9b27fdef6c5372dac769c3bda4502febbfa5031bd3c4d7d018
COMPONENT_ARCHIVE_URL=	http://downloads.webmproject.org/releases/webp/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/libwebp
COMPONENT_ANITYA_ID=	1761

COMPONENT_BAID=		112813

# Required for 64-bit builds.
LDFLAGS += $(CC_BITS)

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# To generate configure
COMPONENT_PREP_ACTION += ( cd $(@D); autoreconf -fiv);

# needs libgif, so disabling for now
CONFIGURE_OPTIONS += --disable-gif
# build of extras is failing on SDL2
CONFIGURE_OPTIONS += --disable-sdl
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
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/freeglut
