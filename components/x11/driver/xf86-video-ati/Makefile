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
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-ati
COMPONENT_VERSION=	18.1.0
COMPONENT_ARCHIVE_HASH= \
	sha256:6c335f423c1dc3d904550d41cb871ca4130ba7037dda67d82e3f1555e1bfb9ac
COMPONENT_BUGDB=        x11/devices-ati
COMPONENT_ANITYA_ID=	5214
TPNO=			49208

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
