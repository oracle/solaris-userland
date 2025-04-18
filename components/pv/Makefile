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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pv
COMPONENT_VERSION=	1.9.15
COMPONENT_PROJECT_URL=	http://www.ivarch.com/programs/pv.shtml
COMPONENT_ARCHIVE_HASH=	\
	sha256:e2b17564ab9eba1ec2caae285960cbf363b4401dffda191a60a0befe68e17dac
COMPONENT_ARCHIVE_URL=	http://www.ivarch.com/programs/sources/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	3736

COMPONENT_BAID=	189935

SYSTEM_TEST_TARGET= $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/common.mk

PKG_PROTO_DIRS += $(BUILD_DIR_64)

COMPONENT_TEST_ENV +=  PATH="$(GNUBIN):$(PATH)"

COMPONENT_TEST_TRANSFORMS += \
	'-e "s|^sh .*$$|XXX_CC_XXX|g" ' \
	'-e "s|^make.*: Leaving directory.*$$|XXX_CC_XXX|g" ' \
	'-e "s|^make.*: Entering directory.*$$|XXX_CC_XXX|g" ' \
	'-e "/^XXX_CC_XXX$$/d" '

COMPONENT_SYSTEM_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_SYSTEM_TEST_CMD =	sh $(SOURCE_DIR)/autoconf/scripts/run-test.sh
COMPONENT_SYSTEM_TEST_ARGS =	$(USRBINDIR)/pv $(SOURCE_DIR)
COMPONENT_SYSTEM_TEST_TARGETS =
REQUIRED_PACKAGES += system/library/math
