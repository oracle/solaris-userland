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

COMPONENT_NAME=		xcursor-themes
COMPONENT_VERSION=	1.0.6
COMPONENT_PROJECT_URL=  https://www.x.org
COMPONENT_ARCHIVE_HASH= \
	sha256:ee1ec574741293abcf66ac14ce7e74add7ac6be7deb8b38179ef010d22354999
COMPONENT_BUGDB=        x11/other
COMPONENT_ANITYA_ID=	15905
TPNO=			49493

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

XCURSORGEN_BASE = $(WS_COMPONENTS)/x11/app/xcursorgen/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(XCURSORGEN_BASE)/usr/lib/$(MACH64)/pkgconfig

PATH = $(USRBINDIR):$(XCURSORGEN_BASE)/usr/bin

REQUIRED_PACKAGES += image/xcursorgen
REQUIRED_PACKAGES += x11/library/libxcursor
