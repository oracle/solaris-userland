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
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-input-synaptics
COMPONENT_VERSION=	1.9.1
COMPONENT_ARCHIVE_HASH= \
	sha256:7af83526eff1c76e8b9e1553b34245c203d029028d8044dd9dcf71eef1001576
COMPONENT_BUGDB=        x11/input
COMPONENT_ANITYA_ID=	5239
TPNO=			49217

PKG_PROTO_DIRS += $(SOURCE_DIR)/conf
PKG_PROTO_DIRS += $(BUILD_DIR_64)/tools

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --bindir=/usr/lib/xorg

COMPONENT_INSTALL_ARGS += pkgconfigdir="$(DESTDIR)/usr/share/pkgconfig"

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxtst
