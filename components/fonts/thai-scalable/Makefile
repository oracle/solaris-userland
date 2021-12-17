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

COMPONENT_NAME=		thai-scalable
COMPONENT_VERSION=	0.6.1

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		ttf-tlwg-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_PROJECT_URL=	https://linux.thai.net/projects/fonts-tlwg
COMPONENT_ARCHIVE_URL=	https://linux.thai.net/pub/thailinux/software/fonts-tlwg/fonts/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:aa9cd68969b6f704df3e5b1a2e11204c47f118c8ab052f04c111bd5f299f77c8
COMPONENT_BUGDB=	g11n/font

COMPONENT_BAID=		23731

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType
SRC_SUBDIR=     font/precompiled

COMPONENT_BUILD_ACTION = \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/*.ttf $(@D)/fonts.dir $(@D)/fonts.scale $(PROTOFONTSDIR)/$(COMPONENT_NAME);

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

REQUIRED_PACKAGES += x11/font-utilities
