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

COMPONENT_NAME=		xf86-video-mach64
COMPONENT_VERSION=	6.10.0
COMPONENT_ARCHIVE_HASH= \
	sha256:d6b96b47a27cd2dc6dea612f5dc51fcc1a8561d5ad1d48d04ec2d47751222724
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5225
COMPONENT_BAID=		191035

PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --disable-dri

LD_OPTIONS += \
        -L$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERMODS_DIR) \
        -lexa -lint10 -lpciaccess -lpixman-1 -lshadowfb 

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += x11/server/xorg
