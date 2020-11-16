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

COMPONENT_NAME=		source-sans-pro
COMPONENT_VERSION=	2.020R-ro-1.075R-it
IPS_COMPONENT_VERSION=	20150831
COMPONENT_SRC=		source-sans-pro-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	https://fonts.google.com/specimen/Source+Sans+Pro
COMPONENT_ARCHIVE_URL=	https://github.com/adobe-fonts/source-sans-pro/archive/2.020R-ro/1.075R-it.tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:bb45283fa9979c4821c99da3b54313012821aba0246e2ec0057f2b03ca24912c

#GIT_REPO=		https://github.com/adobe-fonts/source-sans-pro
#GIT_COMMIT_ID=		778e10a
#GIT_HASH=		sha256:bb45283fa9979c4821c99da3b54313012821aba0246e2ec0057f2b03ca24912c

COMPONENT_BUGDB=	g11n/font

TPNO=			25998

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType
SRC_SUBDIR=     font/precompiled

COMPONENT_BUILD_ACTION = \
	$(CP) $(COMPONENT_SRC_1)/TTF/*.ttf $(@D)/TTF; \
	$(MKFONTSCALE) $(@D)/TTF; \
	$(MKFONTDIR) $(@D)/TTF;

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/LICENSE.txt $(@D)/README.md $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(CP) $(@D)/TTF/* $(PROTOFONTSDIR)/$(COMPONENT_NAME);

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

REQUIRED_PACKAGES += x11/font-utilities
