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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 		64_and_32
# For now, all things built for C++11 require gcc.
COMPILER= 		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		enchant
COMPONENT_VERSION=	2.2.7
COMPONENT_PROJECT_URL=	https://abiword.github.io/enchant/
COMPONENT_ARCHIVE_HASH=	\
       sha256:c466a202915e74d63ef60bb0105ba74e3413b65991edec041c69562290052777
COMPONENT_ARCHIVE_URL=	https://github.com/AbiWord/enchant/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/enchant
COMPONENT_ANITYA_ID=	6601

TPNO=			55506

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

CXXFLAGS += -std=c++11

CONFIGURE_OPTIONS += --disable-static

REQUIRED_PACKAGES += developer/build/autoconf
REQUIRED_PACKAGES += developer/build/automake
REQUIRED_PACKAGES += developer/build/gnu-make
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
