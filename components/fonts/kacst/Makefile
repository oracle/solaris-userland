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
# Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		kacst
COMPONENT_VERSION=	2.0
COMPONENT_SRC=		KacstArabicFonts-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)_fonts_$(COMPONENT_VERSION).tar.bz2
COMPONENT_PROJECT_URL=	https://www.arabeyes.org/
COMPONENT_ARCHIVE_URL=	http://downloads.sourceforge.net/project/arabeyes/kacst_fonts/2.0/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:796149ab64dfe5da6334bda280e3bb4bad07a627246dcb24a844bdda24843fd3
COMPONENT_BUGDB=	g11n/font

TPNO=			11246

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = cd $(@D); \
	$(MKFONTSCALE) .; \
	$(MKFONTDIR) .;

COMPONENT_INSTALL_ACTION = cd $(@D); \
	$(CP) README Copyright $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME)/; \
	$(CP) *.ttf fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME);

REQUIRED_PACKAGES += x11/font-utilities
