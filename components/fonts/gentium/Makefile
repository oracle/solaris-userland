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

COMPONENT_NAME=		gentium
COMPONENT_VERSION=	6.200
COMPONENT_ANITYA_ID=	10086

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC_NAME=	GentiumPlus
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_PROJECT_URL=	https://software.sil.org/gentium/
COMPONENT_DOWNLOAD_URL= https://software.sil.org/downloads/r/gentium/
COMPONENT_ARCHIVE_URL=	$(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:9b21103b79961149b6508791572acb3b2fe7eb621474c57d5e4ee37e76d7b073

COMPONENT_BUGDB=	g11n/font
COMPONENT_BAID=		143355

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES= 		*.ttf $(COMPONENT_DIR)/files/fonts.alias
COMPONENT_FONT_DOC_FILES=	*.txt

COMPONENT_FONT_CONF_SRC_DIR=	../files
COMPONENT_FONT_CONF_FILES=	*.conf
