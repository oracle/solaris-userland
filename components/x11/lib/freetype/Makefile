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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
# FreeType uses various gcc-isms for optimizations
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		freetype
COMPONENT_VERSION=	2.14.1
COMPONENT_PROJECT_URL=	https://www.freetype.org/
COMPONENT_ARCHIVE_URL=	https://download.savannah.gnu.org/releases/freetype/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:32427e8c471ac095853212a37aef816c60b42052d4d9e48230bab3bdf2936ccc
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=        x11/font
COMPONENT_ANITYA_ID=	854
COMPONENT_BAID=		345966

BUILD_STYLE=            meson

TEST_TARGET = $(NO_TESTS)

# Set here so we only have to update this one line, instead of multiple lines
# in the *.p5m file on every new version
FREETYPE_SOVERSION =	6.20.4
PKG_VARS += FREETYPE_SOVERSION

include $(WS_MAKE_RULES)/x11-component.mk

# Requires a grep command that accepts -E
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Dzlib=system
CONFIGURE_OPTIONS += -Dbzip2=enabled
CONFIGURE_OPTIONS += -Dpng=enabled
CONFIGURE_OPTIONS += -Dmmap=enabled
# attempt to dlopen harfbuzz at runtime to avoid dependency loop
CONFIGURE_OPTIONS += -Dharfbuzz=dynamic

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
REQUIRED_PACKAGES += library/zlib
