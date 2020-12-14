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
# Copyright (c) 2017, 2020, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		anonymous-pro
COMPONENT_VERSION=	1.002

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		AnonymousPro-$(COMPONENT_VERSION).001
COMPONENT_ARCHIVE=	AnonymousPro-$(COMPONENT_VERSION).zip
COMPONENT_PROJECT_URL=	https://www.marksimonson.com/assets/content/fonts
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:86665847a51cdfb58a1e1dfd8b1ba33f183485affe50b53e3304f63d3d3552ab
COMPONENT_BUGDB=	g11n/font

TPNO=			26193

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)
SYSTEM_TEST_TARGET=$(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	( cd $(@D); for fn in *.ttf; do $(MV) "$$fn" "$${fn// /-}"; done; ); \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/*.txt $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME)/; \
	$(CP) $(@D)/*.ttf $(@D)/fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME);

CLEAN_PATHS += ._AnonymousPro-1.002.001

REQUIRED_PACKAGES += x11/font-utilities
