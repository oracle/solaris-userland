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
# Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER = gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		c-ares
COMPONENT_VERSION=	1.17.1
COMPONENT_PROJECT_URL=	https://c-ares.haxx.se/
COMPONENT_ARCHIVE_HASH= \
    sha256:d73dd0f6de824afd407ce10750ea081af47eba52b8a6cb307d220131ad93fc40
COMPONENT_ARCHIVE_URL=	https://c-ares.haxx.se/download/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/c-ares
COMPONENT_ANITYA_ID=	5840

TPNO = 71079

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk
