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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		readline
COMPONENT_VERSION=	8.2
COMPONENT_PROJECT_URL=	https://tiswww.cwru.edu/php/chet/readline/rltop.html
COMPONENT_ARCHIVE_HASH=	\
    sha256:08835e57b5eb84f07f8fa50c7530e4b13b08265ffef340e4a4cce4ad6fb575fe
COMPONENT_BUGDB=	library/readline
COMPONENT_ANITYA_ID=	4173
COMPONENT_BAID=		134778

TEST_TARGET= install $(TEST_32)
SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_32)
include $(WS_MAKE_RULES)/gnu-component.mk

LINT_FLAGS += -I$(PROTOUSRINCDIR)

# readline likes to use ld directly and this is the easiest
# way to get it to add -lc
LDFLAGS += -lc
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=		--enable-shared

# Build the readline examples as well.
COMPONENT_BUILD_TARGETS =	everything

COMPONENT_TEST_DIR =		$(@D)/examples
COMPONENT_TEST_CMD =		$(CAT) $(SOURCE_DIR)/examples/Inputrc | ./rlcat
COMPONENT_TEST_TARGETS =

# Master test results are the same for 32-bit and 64-bit, so override
# here, rather than create multiple identical master files.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Needed to build the test program.
COMPONENT_PRE_TEST_ACTION += \
	(cd $(@D) ; $(GMAKE) libreadline.a ) ;

# Build the test program.
COMPONENT_PRE_TEST_ACTION += \
	(cd $(@D)/examples ; $(GMAKE) rlcat ) ;

# Needed to build the test program.
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	(cd $(@D) ; $(GMAKE) libreadline.a ) ;

# Build the test program.
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	(cd $(@D)/examples ; $(GMAKE) rlcat ) ;

# Get correct libreadline.so.8 from the proto area.
TEST_LIBPATH.32 =       $(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =       $(PROTOUSRLIBDIR64)
COMPONENT_TEST_ENV +=   LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))

COMPONENT_SYSTEM_TEST_DIR =	$(@D)/examples
COMPONENT_SYSTEM_TEST_CMD =	$(CAT) $(SOURCE_DIR)/examples/Inputrc | ./rlcat
COMPONENT_SYSTEM_TEST_TARGETS =
