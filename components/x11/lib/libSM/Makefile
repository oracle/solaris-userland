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

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libSM
COMPONENT_VERSION=	1.2.3
COMPONENT_ARCHIVE_HASH= \
	sha256:2d264499dcb05f56438dee12a1b4b71d76736ce7ba7aa6efbf15ebb113769cbb
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1726
TPNO=			49563

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=sm.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-unix-transport
CONFIGURE_OPTIONS += --enable-tcp-transport
CONFIGURE_OPTIONS += --enable-IPv6
CONFIGURE_OPTIONS += --without-libuuid

LD_OPTIONS += -M$(COMPONENT_DIR)/mapfile

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/xtrans
