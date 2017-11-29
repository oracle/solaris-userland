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

COMPONENT_NAME=		wqy-zenhei
COMPONENT_VERSION=	0.8.38-1
IPS_COMPONENT_VERSION=	0.8.38.1
COMPONENT_SRC=		$(COMPONENT_NAME)
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	https://sourceforge.net/projects/wqy
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/files/$(COMPONENT_NAME)/0.8.38%20%28Pangu%29/$(COMPONENT_ARCHIVE)/download
COMPONENT_ARCHIVE_HASH= \
    sha256:6018eb54243eddc41e9cbe0b71feefa5cb2570ecbaccd39daa025961235dea22
COMPONENT_BUGDB=	g11n/font

TPNO=			22854

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType
PROTOETCFONTSDIR=	$(PROTOETCDIR)/fonts/conf.avail

COMPONENT_BUILD_ACTION = \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

# generate license file
COMPONENT_BUILD_ACTION += \
	( perl -ne 'print if /^As a special/ .. /your version.$$/' $(@D)/README; \
	cat $(@D)/COPYING ) > $(@D)/../license

COMPONENT_INSTALL_ACTION = cd $(@D); \
	$(CP) $(@D)/AUTHORS $(@D)/ChangeLog $(@D)/README $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(CP) $(@D)/*.ttc $(@D)/fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/; \
	$(CP) $(@D)/*.conf $(PROTOETCFONTSDIR)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME); \
	$(MKDIR) $(PROTOETCFONTSDIR);
