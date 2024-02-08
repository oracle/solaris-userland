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
# Copyright (c) 2012, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libdnet
COMPONENT_VERSION=	1.17.0
COMPONENT_PROJECT_URL=	https://github.com/ofalk/libdnet
COMPONENT_ARCHIVE_HASH=	sha256:6be1ed0763151ede4c9665a403f1c9d974b2ffab2eacdb26b22078e461aae1dc
COMPONENT_ARCHIVE_URL=	https://github.com/ofalk/libdnet/archive/refs/tags/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libdnet 
COMPONENT_ANITYA_ID=	6308

COMPONENT_BAID=		155793

include $(WS_MAKE_RULES)/common.mk

# Component archive is wrongly packed upstream
COMPONENT_POST_UNPACK_ACTION = \
	$(MV) libdnet-$(notdir $(SOURCE_DIR)) $(notdir $(SOURCE_DIR))

# Needed for "gmake test" to work successfully.
# If SHELLOPTS is exported (as it is by the userland makefiles),
# then all shell options get exported to child invocations of bash,
# which results in test failures due to nounset and xtrace being
# set unexpectedly, and errors such as "$1: unbound variable" and
# diffs failing due to script tracing in output files.
unexport SHELLOPTS

TEST_TARGET= install $(TEST_32_and_64)
COMPONENT_TEST_DIR =	$(@D)/test/check
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" '

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_32_and_64)
COMPONENT_SYSTEM_TEST_DIR =	$(@D)/test/check

REQUIRED_PACKAGES += developer/test/check
REQUIRED_PACKAGES += shell/ksh93
