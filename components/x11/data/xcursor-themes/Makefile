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

COMPONENT_NAME=		xcursor-themes
COMPONENT_VERSION=	1.0.7
COMPONENT_ARCHIVE_HASH= \
	sha256:95bae8f48823d894a05bf42dfbf453674ab7dbdeb11e2bc079e8525ad47378c8
COMPONENT_BUGDB=        x11/other
COMPONENT_ANITYA_ID=	15905
COMPONENT_BAID=		147488

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += image/xcursorgen
REQUIRED_PACKAGES += x11/library/libxcursor
