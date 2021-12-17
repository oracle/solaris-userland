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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		hexedit
COMPONENT_VERSION=	1.5
COMPONENT_PROJECT_URL=	http://merd.sourceforge.net/pixel/hexedit.html
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ANITYA_ID=	13305

GIT_REPO=		https://github.com/pixel/hexedit.git
GIT_COMMIT_ID=		$(COMPONENT_VERSION)
GIT_HASH=		sha256:27a2349f659e995d7731ad672450f61a2e950330049a6fb59b77490c5e0015ac

COMPONENT_BAID=		111295

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Fix 64-bit linking done via compiler.
LDFLAGS += $(CC_BITS)

COMPONENT_PRE_CONFIGURE_ACTION =  \
        ($(CLONEY) $(SOURCE_DIR) $(@D)) && \
        (cd $(SOURCE_DIR); ./autogen.sh)

# Don't use the original curses library.
CONFIGURE_OPTIONS += ac_cv_lib_curses_initscr=no

# Without this, initscr32 and w32attrset are undefined at link time.
# The usual Solaris curses.h vs ncurses/curses.h mess.
CFLAGS += -I/usr/include/ncurses

CFLAGS += "-Dinline"

REQUIRED_PACKAGES += library/ncurses
