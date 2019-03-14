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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
BUILD_ARCH =		i386
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-r128
COMPONENT_VERSION=	6.12.0
COMPONENT_ARCHIVE_HASH= \
	sha256:801c86882cbd2bbb3084d471dcc5cfee2c1754dcbfb4dc446676d58a6bd9e057
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5232
TPNO=			49215

PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

# - Disable DRI since the kernel module isn't ported
CONFIGURE_OPTIONS += --disable-dri

LD_OPTIONS += \
        -L$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERMODS_DIR) \
        -lint10 -lpciaccess -lfb -lpixman-1 -lvbe -lfbdevhw -lvgahw -lexa

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += x11/server/xorg
