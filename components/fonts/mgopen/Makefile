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
# Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mgopen
COMPONENT_VERSION=	20050515
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	MgOpen-20050515.tar.gz
COMPONENT_PROJECT_URL=	https://ellak.gr/2005/05/mgopen-fonts-are-available/
COMPONENT_ARCHIVE_URL=	http://pkgs.fedoraproject.org/repo/pkgs/mgopen-fonts/MgOpen-20050515.tar.gz/9ad4bba3d173e92734320286bfff4c8e/MgOpen-20050515.tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:9f94c07438152816479d0577694942c902e1219006c371e4b2797236109f0f41
UNPACK_ARGS=		-r $(COMPONENT_SRC)

COMPONENT_BUGDB=	g11n/font

TPNO=			11208

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
        $(CP) $(@D)/*.ttf $(@D)/fonts.dir $(@D)/fonts.scale $(PROTOFONTSDIR)/$(COMPONENT_NAME);

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

REQUIRED_PACKAGES += x11/font-utilities
