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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		check
COMPONENT_VERSION=	0.15.2
COMPONENT_PROJECT_URL=	https://libcheck.github.io/check
COMPONENT_ARCHIVE_HASH=	\
    sha256:a8de4e0bacfb4d76dd1c618ded263523b53b85d92a146d8835eb1a52932fa20a
COMPONENT_ARCHIVE_URL=	https://github.com/libcheck/$(COMPONENT_NAME)/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	7593

COMPONENT_BAID=		118784

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_32_and_64)

include $(WS_MAKE_RULES)/common.mk

# Check tests do not like cloney, so a simple copy is used instead.
CLONEY = echo
COMPONENT_PRE_BUILD_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)

# Several tests fail when the Studio compiler is used.
COMPILER =      gcc

# Override tests in m4/acx_pthread.m4 that try to set obsolete/incompatible
# flags for linking threaded code on Solaris.
PTHREAD_CFLAGS = -D__EXTENSIONS__
CONFIGURE_OPTIONS += PTHREAD_CFLAGS="$(PTHREAD_CFLAGS)"
CONFIGURE_OPTIONS += PTHREAD_LIBS="-lc"

# Needed to get all the tests to pass (problems with "inf/nan" vs "Inf/Nan").
CONFIGURE_OPTIONS += --enable-snprintf-replacement

# Needed for "gmake test" to work successfully.
# If SHELLOPTS is exported (as it is by the userland makefiles),
# then all shell options get exported to child invocations of bash,
# which results in test failures due to nounset and xtrace being
# set unexpectedly, and errors such as "$1: unbound variable" and
# diffs failing due to script tracing in output files.
unexport SHELLOPTS

# Master test results are the same for 32-bit and 64-bit, so override
# here, rather than create multiple identical master files.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
	'-e "/passed/p" ' \
	'-e "/failed/p" ' \
	'-e "/Checks:/p" ' \
	'-e "/Total:/p" ' \
	'-e "/Passed/p" ' \
	'-e "/Failed/p" ' \
	'-e "/Failure expected/p" ' \
        '-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
        '-e "/FAIL/p" '

COMPONENT_SYSTEM_TEST_ENV =	CHECKMK_SCRIPT=$(USRBINDIR)/checkmk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES +=	system/library/math
REQUIRED_PACKAGES +=	text/gawk
