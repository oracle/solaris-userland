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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
BUILD_ARCH =		i386
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-ati
COMPONENT_VERSION=	7.8.0
COMPONENT_ARCHIVE_HASH= \
	sha256:401f5de772928f3dc4ce43a885adb0a47a2f61aa4a9e45d2ab3d184136a9d6fa
COMPONENT_BUGDB=        x11/devices-ati
COMPONENT_ANITYA_ID=	5214

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --disable-glamor
CONFIGURE_OPTIONS += --disable-kms

# Paths to find libraries/modules to link with
radeon_drv_la_LDFLAGS_add = \
	-L$(X11_SERVERMODS_DIR) \
        -L$(X11_SERVERLIBS_DIR)/$(MACH64) \
	-R$(X11_SERVERMODS_DIR) \
	-R$(X11_SERVERLIBS_DIR)/$(MACH64)
COMPONENT_BUILD_ENV += radeon_drv_la_LDFLAGS_add='$(radeon_drv_la_LDFLAGS_add)'

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += x11/library/libdrm
REQUIRED_PACKAGES += x11/server/xorg
