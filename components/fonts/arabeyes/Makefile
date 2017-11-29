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

COMPONENT_NAME=		arabeyes
COMPONENT_VERSION=	2.0
COMPONENT_SRC=		ae_fonts_$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_PROJECT_URL=	https://www.arabeyes.org
COMPONENT_ARCHIVE_URL=	http://downloads.sourceforge.net/project/arabeyes/Fonts/ae_fonts/ae_fonts_2.0.tar.bz2
COMPONENT_ARCHIVE_HASH= \
    sha256:a274dcbe4f24ba930261b131c50de806a60f6145bc9cdd9227e749cd0d2cf63a
COMPONENT_BUGDB=	g11n/font

TPNO=			11241

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	$(MV) $(@D)/*/*.ttf $(@D)/; \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D); \
	perl -i -nle 'print unless /-ascii-0/ or /-iso8859-6/' $(@D)/fonts.scale $(@D)/fonts.dir; \
	perl -i -ple 's/194/117/' $(@D)/fonts.scale $(@D)/fonts.dir;

# generate license file from sources
COMPONENT_BUILD_ACTION += \
	( perl -ne 'print if /^Typeface/ .. /your version.$$/' $(@D)/README; \
	cat $(@D)/COPYING ) > $(@D)/../license

COMPONENT_INSTALL_ACTION = cd $(@D); \
	$(CP) *.ttf fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/; \
	$(CP) ChangeLog README $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME);

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME);

REQUIRED_PACKAGES += x11/font-utilities
