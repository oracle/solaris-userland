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
COMPONENT_VERSION=	8.0
COMPONENT_PROJECT_URL=	https://www.nano-editor.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:96002251cc1998c1089c3617b46e6ae38ce0fd11fb277fcbb90fca1742d18028
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)dist/v8/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	2046

COMPONENT_BAID=		165551

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I$(USRINCDIR)/ncurses
CFLAGS += -I$(USRINCDIR)/ncurses

REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += text/groff
