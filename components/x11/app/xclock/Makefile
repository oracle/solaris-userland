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

BUILD_BITS =		64
BUILD_STYLE=		meson
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xclock
COMPONENT_VERSION=	1.2.1
COMPONENT_ARCHIVE_HASH= \
	sha256:e326cac20f7ad2af5412b9c4b70b1c3d392e08cd3cc6246e0a77b7c3935a4851
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15032
COMPONENT_BAID=		427538

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CBE_PACKAGES += x11/header/x11-protocols

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxkbfile
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
