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
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		mpc
COMPONENT_VERSION=	1.3.1
COMPONENT_PROJECT_URL=	http://www.multiprecision.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:ab642492f5cf882b74aa0cb730cd410a81edcdbec895183ce930e706c1c759b8
COMPONENT_ARCHIVE_URL=	https://ftp.gnu.org/gnu/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	1667

COMPONENT_BAID=		156769

TEST_TARGET= install $(TEST_32_and_64)
# Add install dependency when system-test target is implemented.
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS  +=	--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=	--disable-static

COMPONENT_TEST_DIR =	$(BUILD_DIR)/$(MACH$(BITS))/tests
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master

PKG_MACROS +=		COMPONENT_VERSION_1=$(COMPONENT_VERSION_1)

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/=====/p" ' \
	'-e "/^Testsuite/p" ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" '

REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/mpfr
REQUIRED_PACKAGES += system/library/math
