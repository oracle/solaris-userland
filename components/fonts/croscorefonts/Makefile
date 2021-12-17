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
# Copyright (c) 2017, 2021, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		croscorefonts
COMPONENT_VERSION=	1.31.0

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_PROJECT_URL=	https://fonts.google.com/
COMPONENT_ARCHIVE_URL=	https://gsdview.appspot.com/chromeos-localmirror/distfiles/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:672c3487883ec1ef83d9254240d4327b014212abc823d06d15816095867315e1
COMPONENT_BUGDB=	g11n/font

COMPONENT_BAID=		28052

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/*.ttf $(@D)/fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/; \
	$(CP) fonts.alias $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME);

REQUIRED_PACKAGES += x11/font-utilities
