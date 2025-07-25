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

BUILD_BITS =            64_and_32
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXdamage
COMPONENT_VERSION=	1.1.6
COMPONENT_ARCHIVE_HASH= \
	sha256:52733c1f5262fca35f64e7d5060c6fcd81a880ba8e1e65c9621cf0727afb5d11
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1771
COMPONENT_BAID=		140560

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xdamage.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

# Link with version mapfile
LD_OPTIONS += -M $(COMPONENT_DIR)/mapfile

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxrender
