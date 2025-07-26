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
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-mga
COMPONENT_VERSION=	2.1.0
COMPONENT_ARCHIVE_HASH= \
	sha256:7bf85dbf4efa17b7cdd483be8f61cf11fd73d0310514b6ae10d89358de63ab73
COMPONENT_BUGDB=        x11/devices-matrox
COMPONENT_ANITYA_ID=	5226
COMPONENT_BAID=		191034

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

CONFIGURE_OPTIONS += --disable-dri
ifeq ($(MACH), sparc)
CONFIGURE_OPTIONS += --disable-exa
endif

# Extra flags to link mga_drv.so, but not util/stormdwg binary with
DRIVER_LD_FLAGS = \
        -L$(X11_SERVERMODS_DIR) \
        -R$(X11_SERVERMODS_DIR)
CONFIGURE_OPTIONS += XORG_LIBS="$(DRIVER_LD_FLAGS)"

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += x11/server/xorg
