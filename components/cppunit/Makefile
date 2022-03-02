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

COMPILER= gcc
# Prefer 32-bit as only "binary" delivered is a script with embedded paths.
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cppunit
COMPONENT_VERSION=	1.15.1
COMPONENT_PROJECT_URL=	http://freedesktop.org/wiki/Software/cppunit/
COMPONENT_ARCHIVE_HASH=	\
    sha256:89c5c6665337f56fd2db36bc3805a5619709d51fb136e51937072f63fcc717a7
COMPONENT_ARCHIVE_URL=	http://dev-www.libreoffice.org/src/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	9543

COMPONENT_BAID=		118085

# Do not print deprecation warnings in test results.
CXXFLAGS += -Wno-deprecated-declarations

include $(WS_MAKE_RULES)/common.mk

export PATH=$(GCC_ROOT)/bin:$(GNUBIN):$(USRBINDIR)

CONFIGURE_OPTIONS  +=	--disable-static

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
