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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER=gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		coreutils
COMPONENT_VERSION=	8.30
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e831b3a86091496cdba720411f9748de81507798f6130adeaef872d206e1b057
COMPONENT_BUGDB=	utility/gnu-coreutils
COMPONENT_ANITYA_ID=	343

TPNO=			46210

TEST_TARGET= install $(TEST_64)
SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/gnu-component.mk

# We need the GNU grep command to configure/build.
PATH=$(GNUBIN):$(USRBINDIR)

PATCH_LEVEL=		0

CPPFLAGS += -I$(USRINCDIR)/gmp
CONFIGURE_PREFIX	 =	$(USRGNUDIR)
CONFIGURE_OPTIONS	+=	--infodir=$(CONFIGURE_INFODIR)

# Acknowledge that 32bit version will build with 32bit time_t type
# This is needed since version 8.29 because of 'year2038' warning
CONFIGURE_OPTIONS.32 += TIME_T_32_BIT_OK=yes

# Recreate configure and Makefile to pick up changes in .../src/local.mk
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -f && automake)

# Needed to get tests to work when run directly from the tests subdirectory.
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

# Always show the build and link lines for easier debugging.
COMPONENT_BUILD_ARGS +=		V=1

# Needed for "gmake test" to work successfully.
# If SHELLOPTS is exported (as it is by the userland makefiles),
# then all shell options get exported to child invocations of bash,
# which results in test failures due to nounset and xtrace being
# set unexpectedly, and errors such as "$1: unbound variable" and
# diffs failing due to script tracing in output files.
unexport SHELLOPTS

# Get the binaries to test from the component proto area.
COMPONENT_TEST_ENV +=   PATH=$(PROTOUSRSBINDIR):/usr/bin
COMPONENT_TEST_DIR =	$(@D)/tests

# Always show the build and link lines for easier debugging.
COMPONENT_TEST_ARGS +=	V=1
# Deny any color coding of the test output
COMPONENT_TEST_ARGS +=	AM_COLOR_TESTS=no

# Coreutils tests can't pass if they don't have tty available. This script
# makes sure to provide a tty if we are missing one
COMPONENT_TEST_CMD = $(COMPONENT_DIR)/coreutils_test_wrapper

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" '

# If the tests decided they need to execute in screen(1) then move the
# resulting file to final location where the rest of userland infrastructure
# will process it
COMPONENT_POST_TEST_ACTION += \
    if [ -e "$(COMPONENT_TEST_DIR)/outfile" ]; then \
	mv $(COMPONENT_TEST_DIR)/outfile $(COMPONENT_TEST_OUTPUT); \
    fi


# Get the binaries to test from their installed locations.
COMPONENT_SYSTEM_TEST_ENV +=	PATH=/usr/gnu/bin:/usr/bin
COMPONENT_SYSTEM_TEST_DIR =	$(@D)/tests

REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += terminal/screen
