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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpciaccess
COMPONENT_VERSION=	0.19
COMPONENT_ARCHIVE_HASH= \
	sha256:3c55aa86c82e54a4e3109786f0463530d53b36b6d1cfd14616454f985dd2aa43
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1703
COMPONENT_BAID=		390339

BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=pciaccess.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS.32 += -Dinstall-scanpci=false
CONFIGURE_OPTIONS.64 += -Dinstall-scanpci=true

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/devinfo
