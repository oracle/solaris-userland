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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#
COMPILER= studio
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nano
COMPONENT_VERSION=	9.0
COMPONENT_PROJECT_URL=	https://www.nano-editor.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:48a9cf0d021ddaf9d7b567ed30396147d4d2e3f7a32644f83257a7efead2b380
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)dist/v9/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	2046

COMPONENT_BAID=	389444

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I$(USRINCDIR)/ncurses
CFLAGS += -I$(USRINCDIR)/ncurses

REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += text/groff
