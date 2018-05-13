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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            32_and_64
# FreeType uses various gcc-isms for optimizations
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		freetype
COMPONENT_VERSION=	2.9.1
COMPONENT_PROJECT_URL=	https://www.freetype.org/
COMPONENT_ARCHIVE_URL=	https://download.savannah.gnu.org/releases/freetype/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:db8d87ea720ea9d5edc5388fc7a0497bb11ba9fe972245e0f7f4c7e8b1e1e84d
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=        x11/font
COMPONENT_ANITYA_ID=	854
TPNO=			42908

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=builds/unix/freetype2.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-biarch-config
CONFIGURE_OPTIONS += --enable-freetype-config
CONFIGURE_OPTIONS += --with-zlib
CONFIGURE_OPTIONS += --with-bzip2
CONFIGURE_OPTIONS += --with-png
CONFIGURE_OPTIONS += --with-pic
# FreeType 2.9 requires a minimum of HarfBuzz 1.3.0
CONFIGURE_OPTIONS += --without-harfbuzz

LDFLAGS += -lc

install: $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)/index.html

$(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)/index.html: $(INSTALL_TARGET)
	$(RM) -rf $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)
	$(INSTALL) -m 0444 \
		$(SOURCE_DIR)/docs/reference/*.html \
		$(SOURCE_DIR)/docs/formats.txt \
		$(SOURCE_DIR)/docs/VERSIONS.TXT \
		$(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)/
	$(SYMLINK) ft2-toc.html \
		$(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)/index.html
	$(MKDIR) $(PROTOUSRSHAREMANDIR)/man3lib
	$(GSED) -e 's%__version__%FreeType $(COMPONENT_VERSION)%' \
		$(COMPONENT_DIR)/files/libfreetype.3lib > \
		$(PROTOUSRSHAREMANDIR)/man3lib/libfreetype.3lib

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += library/zlib
