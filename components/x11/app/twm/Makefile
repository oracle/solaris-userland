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

COMPONENT_NAME=		twm
COMPONENT_VERSION=	1.0.13.1
COMPONENT_ARCHIVE_HASH= \
	sha256:a52534755aa8b492c884e52fa988bac84ab4d54641954679b9aaf08e323df2c5
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15038
COMPONENT_BAID=		342700

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxrandr
REQUIRED_PACKAGES += x11/library/toolkit/libxt
