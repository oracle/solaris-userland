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
# Copyright (c) 2018, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64
BUILD_ARCH = 		i386
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-input-vmmouse
COMPONENT_VERSION=	13.2.0
COMPONENT_ARCHIVE_HASH= \
	sha256:56f077580ab8f02e2f40358c5c46b0ae3e1828fc77744526b24adf1ceea339b8
COMPONENT_BUGDB=        x11/input
COMPONENT_ANITYA_ID=	5244
COMPONENT_BAID=		134616

PKG_PROTO_DIRS += $(BUILD_DIR_64)/tools

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --with-hal-bin-dir=/usr/sbin
CONFIGURE_OPTIONS += --with-hal-callouts-dir=/usr/lib/hal
CONFIGURE_OPTIONS += --with-hal-fdi-dir=/etc/hal/fdi/policy/10osvendor
CONFIGURE_OPTIONS += --bindir=/usr/lib/xorg

REQUIRED_PACKAGES += system/library/math
