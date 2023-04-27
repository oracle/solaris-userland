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
# Copyright (c) 2015, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER=gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		mtr
COMPONENT_VERSION=	0.95
COMPONENT_PROJECT_URL=	http://www.bitwizard.nl/mtr/
COMPONENT_ARCHIVE_HASH=	\
    sha256:12490fb660ba5fb34df8c06a0f62b4f9cbd11a584fc3f6eceda0a99124e8596f
COMPONENT_ARCHIVE_URL=	https://github.com/traviscross/mtr/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_ANITYA_ID=	2029

COMPONENT_BAID=		142513

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_SBINDIR.64 =		$(CONFIGURE_PREFIX)/bin
CONFIGURE_OPTIONS  +=		--without-gtk
CONFIGURE_OPTIONS  +=		--without-ipinfo
CONFIGURE_OPTIONS  +=		--disable-dependency-tracking

COMPONENT_PRE_CONFIGURE_ACTION += (cd $(SOURCE_DIR); ./bootstrap.sh)

REQUIRED_PACKAGES += library/jansson
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += system/library/math
