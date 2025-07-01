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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER=gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		coreutils
COMPONENT_VERSION=	9.7
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e8bb26ad0293f9b5a1fc43fb42ba970e312c66ce92c1b0b16713d7500db251bf
COMPONENT_BUGDB=	utility/gnu-coreutils
COMPONENT_ANITYA_ID=	343
COMPONENT_BAID=		331051

TEST_TARGET= install $(TEST_64)
SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/gnu-component.mk

# We need the GNU grep command to configure/build.
PATH=$(GNUBIN):$(USRBINDIR)

PATCH_LEVEL=		0

CPPFLAGS += -I$(USRINCDIR)/gmp
CONFIGURE_PREFIX	 =	$(USRGNUDIR)
CONFIGURE_OPTIONS	+=	--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS	+=	--without-openssl

# Acknowledge that 32bit version will build with 32bit time_t type
CONFIGURE_OPTIONS.32 += --disable-year2038

# Recreate configure and Makefile to pick up changes in .../src/local.mk
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -f && automake)

# Needed to get tests to work when run directly from the tests subdirectory.
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

# Always show the build and link lines for easier debugging.
COMPONENT_BUILD_ARGS +=		V=1

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
