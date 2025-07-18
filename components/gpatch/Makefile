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
BUILD_BITS= 64
COMPILER=gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		patch
COMPONENT_VERSION=	2.8
COMPONENT_ARCHIVE_HASH=	\
    sha256:308a4983ff324521b9b21310bfc2398ca861798f02307c79eb99bb0e0d2bf980
COMPONENT_BUGDB=	utility/gpatch
COMPONENT_ANITYA_ID=	2597
COMPONENT_BAID=		332684

# The .1 refers to version 2.8-1 to distinguish between community version
# binutils and this package, which contains all known fixes.  A similar approach
# is adopted by some Linux distros.
IPS_COMPONENT_VERSION=	2.8.0.1
HUMAN_VERSION=		$(COMPONENT_VERSION)-1

# Although system-test doesn't run against the built bits, the tests
# require the bits are built.  Using build as a pre-requisite
# to system-test separates the compilation output from the
# test output, so the master test results will be consistent between
# test and system-test targets.
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/gnu-component.mk

COMPONENT_INSTALL_ARGS += bindir=$(USRBINDIR)

COMPONENT_SYSTEM_TEST_ENV += PATCH=$(GPATCH)

# Keep only the test results
COMPONENT_TEST_TRANSFORMS += \
    '-n '\
    '-e "/^\#/p" '	
