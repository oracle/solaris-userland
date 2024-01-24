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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libspectre
COMPONENT_VERSION=	0.2.12
COMPONENT_PROJECT_URL=	https://libspectre.freedesktop.org
COMPONENT_ARCHIVE_HASH= \
    sha256:55a7517cd3572bd2565df0cf450944a04d5273b279ebb369a895391957f0f960
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libspectre
COMPONENT_ANITYA_ID=	1724

COMPONENT_BAID=		157623

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

REQUIRED_PACKAGES += image/ghostscript
