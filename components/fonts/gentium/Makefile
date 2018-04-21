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

COMPONENT_NAME=		gentium
COMPONENT_VERSION=	1.02
COMPONENT_ANITYA_ID=	10086

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_ARCHIVE=	GentiumBasic_110_source.zip
COMPONENT_PROJECT_URL=	https://software.sil.org/gentium/
COMPONENT_DOWNLOAD_URL= https://software.sil.org/downloads/r/gentium/
COMPONENT_ARCHIVE_URL=	$(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:612c053db7322c38915f6c02df79e241a296a4a5b5beda8ac0d6c99378f026b6
# GNU make does not handle spaces in filename well
COMPONENT_POST_UNPACK_ACTION= \
    mv "Gentium Basic 1.1 Source" $(COMPONENT_SRC);
CLEAN_PATHS+=	Gentium\ Basic\ 1.1\ Source

COMPONENT_ARCHIVE_1=	Gentium_102_W.zip
COMPONENT_ARCHIVE_URL_1=$(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1= \
    sha256:9652affcde2c850b6e68b68b8506fa1ba17da5167d2d2ea24ad2de24440105aa
COMPONENT_SRC_1=	Gentium102


COMPONENT_BUGDB=	g11n/font

TPNO=			11259

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	$(MV) $(@D)/FONTLOG.txt $(@D)/FONTLOG.basic.txt; \
	$(CLONEY) $(SOURCE_DIR_1) $(@D); \
	( cd $(@D); for fn in *.TTF; do $(MV) $$fn $${fn/.TTF/.ttf}; done; ); \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/FONTLOG.txt $(@D)/GENTIUM-FAQ.txt $(@D)/OFL.txt \
		$(@D)/OFL-FAQ.txt $(@D)/QUOTES.txt $(@D)/README.txt \
		$(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME)/; \
	$(CP) $(@D)/FONTLOG.basic.txt \
		$(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME)/basic/FONTLOG.txt; \
	$(CP) $(@D)/*.ttf $(@D)/fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRSHAREDOCDIR)/ttf-$(COMPONENT_NAME)/basic; \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME);

REQUIRED_PACKAGES += x11/font-utilities
