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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64
BUILD_ARCH =		i386
COMPILER = 		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-vesa
COMPONENT_VERSION=	2.6.0
COMPONENT_ARCHIVE_HASH= \
	sha256:10082771b1a8f659c60b3d9b70456a4b59948a75b3cade2dfa33b8b05e549bb1
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5243
COMPONENT_BAID=		134665

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

# Libraries/modules to link with
LD_OPTIONS += \
        -L$(PROTODIR)$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERMODS_DIR) \
        -lpciaccess -lshadow

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += x11/server/xorg
