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

COMPONENT_NAME=		popt
COMPONENT_VERSION=	1.19
COMPONENT_PROJECT_URL=	https://rpm.org/index.html
COMPONENT_ARCHIVE_HASH= \
	sha256:c25a4838fc8e4c1c8aacb8bd620edb3084a3d63bf8987fdad3ca2758c63240f9
COMPONENT_ARCHIVE_URL=	https://ftp.osuosl.org/pub/rpm/$(COMPONENT_NAME)/releases/$(COMPONENT_NAME)-1.x/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/popt
COMPONENT_ANITYA_ID=	3689

COMPONENT_BAID=	175783	

TEST_TARGET= install $(TEST_32_and_64)
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_32_and_64)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION = \
        (cd $(@D) ; $(TOUCH) config.rpath) ;

# Needed to get "gmake test" to work.
COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# Add /usr/gnu/bin at the front of $PATH for GNU gettext.
CONFIGURE_ENV +=	PATH=$(GNUBIN):$(PATH)

CONFIGURE_OPTIONS +=	--disable-nls

# Master test results are the same for 32-bit and 64-bit, so override
# here, rather than create multiple identical master files.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Get correct libpopt.so.0 from the proto area.
TEST_LIBPATH.32 =       $(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =       $(PROTOUSRLIBDIR64)
COMPONENT_TEST_ENV +=   LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))

# api-sanity-autotest.pl is part of the API Sanity Checker
# http://ispras.linuxbase.org/index.php/API_Sanity_Autotest
# (which we don't have in Solaris), so expect that test to fail.

COMPONENT_TEST_TRANSFORMS += \
	'-e "/Entering directory/d"' \
	'-e "/Leaving directory/d"' \
	'-e "/recursive/d"' \
	'-e "/check-local/d"' \
	'-e "/check-TESTS/d"' \
	'-e "/^Making/d"' \
	'-e "/^make/d"'
