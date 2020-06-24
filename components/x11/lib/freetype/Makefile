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
# Copyright (c) 2018, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
# FreeType uses various gcc-isms for optimizations
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		freetype
COMPONENT_VERSION=	2.10.2
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_PROJECT_URL=	https://www.freetype.org/
COMPONENT_ARCHIVE_URL=	https://download.savannah.gnu.org/releases/freetype/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:1543d61025d2e6312e0a1c563652555f17378a204a61e99928c9fcef030a2d8b
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=        x11/font
COMPONENT_ANITYA_ID=	854
TPNO=			59492

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=builds/unix/freetype2.in

# Set here so we only have to update this one line, instead of multiple lines
# in the *.p5m file on every new version
FREETYPE_SOVERSION =	6.17.2
PKG_VARS += FREETYPE_SOVERSION

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-biarch-config
CONFIGURE_OPTIONS += --enable-freetype-config
CONFIGURE_OPTIONS += --with-zlib
CONFIGURE_OPTIONS += --with-bzip2
CONFIGURE_OPTIONS += --with-png
CONFIGURE_OPTIONS += --with-pic
# Avoid to bring a desktop dependency (harfbuzz links glib)
# into poppler that links libfreetype library.
CONFIGURE_OPTIONS += --without-harfbuzz

LDFLAGS += -lc

PROTO_FREETYPE_DOCDIR = $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)

COMPONENT_POST_INSTALL_ACTION.64 += \
	$(MKDIR) $(PROTO_FREETYPE_DOCDIR) ; \
	$(INSTALL) -m 0444 \
		$(SOURCE_DIR)/docs/formats.txt \
		$(SOURCE_DIR)/docs/VERSIONS.TXT \
		$(PROTO_FREETYPE_DOCDIR)/ ; \
	$(GNU_TAR) --directory $(SOURCE_DIR)/docs/reference/ -cf - . | \
		$(GNU_TAR) --directory $(PROTO_FREETYPE_DOCDIR)/ -xf - ; \
	$(MKDIR) $(PROTOUSRSHAREMANDIR)/man3lib ; \
	$(GSED) -e 's%__version__%FreeType $(COMPONENT_VERSION)%' \
		$(COMPONENT_DIR)/files/libfreetype.3lib > \
		$(PROTOUSRSHAREMANDIR)/man3lib/libfreetype.3lib ;

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/zlib
