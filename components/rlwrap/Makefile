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
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         rlwrap
COMPONENT_VERSION=      0.46.2
COMPONENT_PROJECT_URL=  https://github.com/hanslub42/rlwrap
COMPONENT_ARCHIVE=      $(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:9abb0a0dc19e85794d9b8e72e480530563eb4ee1bf243e87c0e0dd05ea4a2f09
COMPONENT_ARCHIVE_URL=  \
	$(COMPONENT_PROJECT_URL)/archive/refs/tags/v$(COMPONENT_VERSION).tar.gz
COMPONENT_ANITYA_ID=	4199

COMPONENT_BAID=		330257

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Testsuite /p" ' \
        '-e "/=====/p" ' \
        '-e "/TOTAL:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/XFAIL:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/XPASS:/p" ' \
        '-e "/ERROR/p" '

REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
