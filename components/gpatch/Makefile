#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		patch
COMPONENT_VERSION=	2.8.1
COMPONENT_ARCHIVE_HASH=	\
    sha256:35ff1c589a640ae5ae8bad1546ced72aca852a8e90b764d8c00974aa94c0b107
COMPONENT_BUGDB=	utility/gpatch
COMPONENT_ANITYA_ID=	2597
COMPONENT_BAID=		457293

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

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
