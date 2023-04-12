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

COMPONENT_NAME=		arphic-uming
COMPONENT_VERSION=	0.1.20060928

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		ttf-$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	ttf-$(COMPONENT_NAME)_$(COMPONENT_VERSION).orig.tar.gz
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/wiki/Software/CJKUnifonts
COMPONENT_ARCHIVE_URL=	https://archive.debian.org/debian/pool/main/t/ttf-$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:410085d5f86362d00c47705a36a1557d78043a1db7ed427b4abccc117f45fe6d
COMPONENT_BUGDB=	g11n/font
COMPONENT_ANITYA_ID=	289
COMPONENT_BAID=		9839

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES=	*.ttf fonts.dir fonts.scale

PROTOFONTSALIAS=	$(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)/fonts.alias

# Strip off first line of upstream file (line count) and append our aliases
COMPONENT_POST_INSTALL_ACTION += \
	tail +2 $(SOURCE_DIR)/fonts.alias > $(PROTOFONTSALIAS) ; \
	cat $(COMPONENT_DIR)/fonts.alias >> $(PROTOFONTSALIAS) ;

