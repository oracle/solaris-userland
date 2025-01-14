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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nano
COMPONENT_VERSION=	8.2
COMPONENT_PROJECT_URL=	https://www.nano-editor.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:51e57dcecb8a6bb64a1bf5a916615e247d9bcd8e951ac99d01139c897efba20e
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)dist/v8/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	2046

COMPONENT_BAID=	190054

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I$(USRINCDIR)/ncurses
CFLAGS += -I$(USRINCDIR)/ncurses

REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += text/groff
