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
# Copyright (c) 2012, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		xz
COMPONENT_VERSION=	5.2.5
COMPONENT_BAID=		121288
COMPONENT_PROJECT_URL=	https://tukaani.org/xz/
COMPONENT_ARCHIVE_HASH=	\
    sha256:f6f4910fd033078738bd82bfba4f49219d03b17eb0794eb91efbae419f4aba10
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	5277

# The .1 refers to version 5.2.5-1 to distinguish between community version
# and this package, which contain fix for CVE-2022-1271.
IPS_COMPONENT_VERSION=	5.2.5.1
HUMAN_VERSION=		$(COMPONENT_VERSION)-1

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_32_and_64)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_DIR =		$(@D)/tests

# Master test results are the same for 32-bit and 64-bit, so override
# here, rather than create multiple identical master files.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# The additional xz specific set of transforms to be applied to the
# test results to try to normalize them.
COMPONENT_TEST_TRANSFORMS += \
	'-e "s|^.*$(CC).*$$|XXX_CC_XXX|g" ' \
	'-e "s|^.*source=.*libtool=no.*$$|XXX_CC_XXX|g" ' \
	'-e "s|^.*DEPDIR=.deps.*$$|XXX_CC_XXX|g" ' \
	'-e "/^XXX_CC_XXX$$/d" '

# Needed to build the test programs.
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	(cd $(@D)/src/liblzma ; $(GMAKE) liblzma.la )

COMPONENT_SYSTEM_TEST_DIR =	$(@D)/tests
COMPONENT_SYSTEM_TEST_ENV +=	XZ_SCRIPT=$(USRBINDIR)/xz
COMPONENT_SYSTEM_TEST_ENV +=	XZDEC_SCRIPT=$(USRBINDIR)/xzdec
COMPONENT_SYSTEM_TEST_ENV +=	XZDIFF_SCRIPT=$(USRBINDIR)/xzdiff
COMPONENT_SYSTEM_TEST_ENV +=	XZGREP_SCRIPT=$(USRBINDIR)/xzgrep

include $(WS_MAKE_RULES)/shared-targets.mk

REQUIRED_PACKAGES += system/core-os
