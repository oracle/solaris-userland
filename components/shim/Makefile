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

BUILD_ARCH= i386
BUILD_BITS= 64

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		shim
COMPONENT_VERSION=	15.8
COMPONENT_PROJECT_URL=  https://github.com/rhboot/$(COMPONENT_NAME)
COMPONENT_BUGDB=	kernel/shim
COMPONENT_ANITYA_ID=	10719
COMPONENT_BAID=		170209

BUILD_STYLE= pkg
TEST_TARGET= $(NO_TESTS)

publish: $(COMPONENT_NAME)-$(COMPONENT_VERSION)

$(COMPONENT_NAME)-$(COMPONENT_VERSION): FRC
	$(MKDIR) $@

include $(WS_MAKE_RULES)/common.mk
