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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS=		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		iso-codes
COMPONENT_VERSION=	4.18.0
COMPONENT_PROJECT_URL=	https://salsa.debian.org/iso-codes-team/iso-codes
COMPONENT_SRC=		$(COMPONENT_NAME)-v$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_HASH=	\
    sha256:06f606e733e7da5f9e133ab9401896e2a0b47cc13429807f08e1db398ff4de57
COMPONENT_ARCHIVE_URL=	\
    https://salsa.debian.org/iso-codes-team/$(COMPONENT_NAME)/-/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)

COMPONENT_BUGDB=	utility/docbook
COMPONENT_ANITYA_ID=	1406
COMPONENT_BAID=		335264

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk
