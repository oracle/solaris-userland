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
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

PATH=$(dir $(CC)):$(USRBINDIR):$(GNUBIN)

COMPONENT_NAME=         mpfr
COMPONENT_VERSION=      4.2.1
COMPONENT_PROJECT_URL=	http://www.mpfr.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:116715552bd966c85b417c424db1bbdf639f53836eb361549d1f8d6ded5cb4c6
COMPONENT_DOWNLOAD_URL=	https://ftp.gnu.org/gnu/$(COMPONENT_NAME)
COMPONENT_ARCHIVE_URL=	$(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig

COMPONENT_BUGDB=	library/libmpfr
COMPONENT_ANITYA_ID=	2019

COMPONENT_BAID=		156765

include $(WS_MAKE_RULES)/common.mk

# to fix SPARC test failures
ifeq ($(MACH), sparc)
CC_PIC_MODE = $(CC_PIC_DISABLE)
endif

MPFRMULHIGH = 2048

CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --disable-libtool-lock
CONFIGURE_OPTIONS += --enable-thread-safe
CONFIGURE_OPTIONS += --enable-tests-timeout=0
CONFIGURE_OPTIONS += --with-mulhigh-size=$(MPFRMULHIGH)
CONFIGURE_OPTIONS += --with-pic

COMPONENT_PREP_ACTION = (cd $(@D) ; $(AUTORECONF) -fiv)

# We have to unset SHELLOPTS otherwise the build fails.
unexport SHELLOPTS

# so lint can find the header
LINT_FLAGS += -I$(SOURCE_DIR)/src

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
	'-e "s/^make\[[0-9]\{1,\}\]/make/g"' \
	'-e "s/.*MPFR tuning.*//g"' \
	'-n ' \
	'-e "/make:.*directory/p" ' \
	'-e "/Testsuite /p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/ERROR/p" ' \
	'-e "/=====/p" ' \
	'-e "/TOTAL/p" '

REQUIRED_PACKAGES += library/gmp
