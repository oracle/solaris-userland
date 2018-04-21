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
# Copyright (c) 2017, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		unifont
COMPONENT_VERSION=	8.0.01

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	unifont-8.0.01.tar.gz
COMPONENT_PROJECT_URL=	http://unifoundry.com/unifont.html
COMPONENT_ARCHIVE_URL=	http://unifoundry.com/pub/$(COMPONENT_SRC)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
    sha256:4b20bfc6412bce9302cd321f39d7c0185c3c69f9deaf9ab7ea89c4e105fbcb9c
COMPONENT_BUGDB=	g11n/font

TPNO=			25965

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType
PROTOFONTSX11DIR=	$(PROTOUSRSHAREDIR)/fonts/X11
SRC_SUBDIR=     font/precompiled

COMPONENT_BUILD_ACTION = \
	$(GUNZIP) -c $(@D)/font/precompiled/unifont-$(COMPONENT_VERSION).pcf.gz > $(@D)/unifont.pcf; \
	$(CP) $(@D)/font/precompiled/unifont-8.0.01.ttf $(@D)/unifont.ttf; \
	$(CP) $(@D)/font/precompiled/unifont_upper-8.0.01.ttf $(@D)/unifont_upper.ttf; \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/COPYING $(@D)/ChangeLog $(@D)/README $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
        $(CP) $(@D)/*.ttf $(@D)/*.pcf $(@D)/fonts.dir $(@D)/fonts.scale $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME)/; \
	$(MKDIR) $(PROTOFONTSX11DIR)/$(COMPONENT_NAME)/;

REQUIRED_PACKAGES += x11/font-utilities
