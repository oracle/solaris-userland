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
# Copyright (c) 2017, 2023, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		arabeyes
COMPONENT_VERSION=	2.0

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		ae_fonts_$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_PROJECT_URL=	https://www.arabeyes.org
COMPONENT_ARCHIVE_URL=	https://downloads.sourceforge.net/project/arabeyes/Fonts/ae_fonts/ae_fonts_2.0.tar.bz2
COMPONENT_ARCHIVE_HASH= \
    sha256:a274dcbe4f24ba930261b131c50de806a60f6145bc9cdd9227e749cd0d2cf63a
COMPONENT_BUGDB=	g11n/font
COMPONENT_BAID=		10449

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES=		*/*.ttf
COMPONENT_FONT_DOC_FILES=	ChangeLog README

COMPONENT_POST_INSTALL_ACTION += \
	$(PERL) -i -nle 'print unless /-ascii-0/ or /-iso8859-6/' \
	    $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)/fonts.scale \
	    $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)/fonts.dir; \
	$(PERL) -i -ple 's/194/117/' \
	    $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)/fonts.scale \
	    $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)/fonts.dir;

# generate license file from sources
COMPONENT_POST_INSTALL_ACTION += \
	( $(PERL) -ne 'print if /^Typeface/ .. /your version.$$/' \
	    $(SOURCE_DIR)/README; \
	    $(CAT) $(SOURCE_DIR)/COPYING ) > $(@D)/../license

