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
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libexpat
COMPONENT_VERSION=	2.5.0
COMPONENT_PROJECT_URL=	https://libexpat.github.io/
COMPONENT_SRC_NAME=	expat
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:6f0e6e01f7b30025fa05c85fdad1e5d0ec7fd35d9f61b22f34998de11969ff67
COMPONENT_ARCHIVE_URL= \
    http://downloads.sourceforge.net/project/expat/expat/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libexpat
COMPONENT_ANITYA_ID=	770
COMPONENT_BAID=		132634

include $(WS_MAKE_RULES)/common.mk

CFLAGS += $(CPP_LARGEFILES)

PATCH_LEVEL = 2

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS = \
  '-n '\
  '-e "/^\#/p" '
