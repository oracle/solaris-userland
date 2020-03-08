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
# Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER = gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		logrotate
COMPONENT_VERSION=	3.15.1
COMPONENT_PROJECT_URL=	https://github.com/logrotate/logrotate/releases/download
COMPONENT_ARCHIVE_HASH= \
    sha256:9eed6d9254f3e2313e15a44b4d1e5f209d35a4483b2c563c823050ec91ac67b8
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	10567

TPNO=			56753

include $(WS_MAKE_RULES)/common.mk

# Unset SHELLOPTS to avoid 'unbound variable' errors during the tests.
unexport SHELLOPTS

# The tests need GNU variants of sed, egrep, etc.
COMPONENT_TEST_ENV = PATH=/usr/gnu/bin:/usr/bin
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL:/p" ' \
	'-e "/SKIP:/p" ' \
	'-e "/PASS:/p" ' \
	'-e "/FAIL:/p" ' \
	'-e "/XFAIL:/p" ' \
	'-e "/XERROR:/p" ' \
	'-e "/ERROR:/p" '	

REQUIRED_PACKAGES += library/popt

