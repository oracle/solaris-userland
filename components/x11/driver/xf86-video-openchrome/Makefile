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
# Copyright (c) 2018, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64
BUILD_ARCH =		i386
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-openchrome
COMPONENT_VERSION=	0.6.0
COMPONENT_ARCHIVE_HASH= \
	sha256:da2975c6379358de52c1257710c67eb59139a7f0a1cd28d00cc64cc3e1c02f75
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5230
COMPONENT_BAID=		53006

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

# - Disable DRI since the kernel module isn't ported
CONFIGURE_OPTIONS += --disable-dri
CONFIGURE_OPTIONS += --disable-kms

LD_OPTIONS += \
        -L$(X11_SERVERMODS_DIR) \
        -L$(X11_SERVERLIBS_DIR)/$(MACH64) \
        -R$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERLIBS_DIR)/$(MACH64) \
        -M $(COMPONENT_DIR)/mapfile.externs \
        -lfb -lint10 -lpciaccess -lpixman-1 -lvbe \
        -lexa -lvgahw -lm -ldrm -lshadow

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libdrm
REQUIRED_PACKAGES += x11/server/xorg

