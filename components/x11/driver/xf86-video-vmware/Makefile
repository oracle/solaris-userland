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
COMPILER = 		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-vmware
COMPONENT_VERSION=	13.3.0
COMPONENT_ARCHIVE_HASH= \
	sha256:47971924659e51666a757269ad941a059ef5afe7a47b5101c174a6022ac4066c
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5245
TPNO=			49216

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

LD_OPTIONS += \
        -L$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERMODS_DIR) \
        -lfb -lpixman-1 -lshadowfb -lvgahw -lpciaccess

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += x11/server/xorg
