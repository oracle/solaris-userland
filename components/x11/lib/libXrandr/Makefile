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

BUILD_BITS =            64_and_32
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXrandr
COMPONENT_VERSION=	1.5.4
COMPONENT_ARCHIVE_HASH= \
	sha256:1ad5b065375f4a85915aa60611cc6407c060492a214d7f9daf214be752c3b4d3
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1788
COMPONENT_BAID=		175864

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xrandr.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xrandr

LD_OPTIONS += -M$(COMPONENT_DIR)/mapfile

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxrender
