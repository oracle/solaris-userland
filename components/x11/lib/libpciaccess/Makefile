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

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpciaccess
COMPONENT_VERSION=	0.16
COMPONENT_ARCHIVE_HASH= \
	sha256:214c9d0d884fdd7375ec8da8dcb91a8d3169f263294c9a90c575bf1938b9f489
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1703
TPNO=			53646

# GNU Build System files have to be regenerated for automake 1.16.
# It can be removed when the upstream starts to use a newer automake version.
COMPONENT_PREP_ACTION = (cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

PKG_PROTO_DIRS +=  $(BUILD_DIR_64)/scanpci/.libs
PKG_PROTO_DIRS +=  $(BUILD_DIR_64)/man

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=pciaccess.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += system/library/devinfo
