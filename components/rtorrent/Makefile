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
BUILD_BITS= 64
COMPILER= gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		rtorrent
COMPONENT_VERSION=	0.9.8
COMPONENT_PROJECT_URL=	https://rakshasa.github.io/rtorrent/
COMPONENT_ARCHIVE_HASH=	\
    sha256:9edf0304bf142215d3bc85a0771446b6a72d0ad8218efbe184b41e4c9c7542af
COMPONENT_ARCHIVE_URL=	\
	https://github.com/rakshasa/rtorrent/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	4221

COMPONENT_BAID=		114021

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# Needed during configuration to correctly find ncurses.h
CFLAGS +=		-I$(USRINCDIR)/ncurses

# Needed during the build stage.
CXXFLAGS +=		-I$(USRINCDIR)/ncurses

CONFIGURE_OPTIONS +=	--disable-debug

COMPONENT_PRE_TEST_ACTION = (cd $(COMPONENT_TEST_DIR) && /usr/gnu/bin/make rtorrentTest)
COMPONENT_TEST_DIR =  $(BUILD_DIR)/$(MACH$(BITS))/test
COMPONENT_TEST_CMD = ./rtorrentTest
COMPONENT_TEST_ARGS =
COMPONENT_TEST_TARGETS =

REQUIRED_PACKAGES += library/libtorrent
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
