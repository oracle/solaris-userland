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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER=		gcc
BUILD_ARCH =		i386
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-r128
COMPONENT_VERSION=	6.13.0
COMPONENT_ARCHIVE_HASH= \
	sha256:f20bed5ac201edd517fe0878dd2bcef78c8805c9f7faa3d0d7a4dba2e973f745
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5232
COMPONENT_BAID=		191032

PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

# - Disable DRI since the kernel module isn't ported
CONFIGURE_OPTIONS += --disable-dri

LD_OPTIONS += \
        -L$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERMODS_DIR) \
        -lint10 -lpciaccess -lpixman-1 -lfbdevhw -lvgahw -lexa

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += x11/server/xorg
