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

COMPONENT_NAME=		indic-fonts-core
COMPONENT_VERSION=	0.1

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		MuktiNarrow0.94
COMPONENT_ARCHIVE=	MuktiNarrow-0.94.tar.bz2
COMPONENT_PROJECT_URL=	http://www.nongnu.org/freebangfont/sdf
COMPONENT_ARCHIVE_URL=	http://download.savannah.nongnu.org/releases/freebangfont/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	sha256:bb8af9b9437f1d13ff8cdc8784188ebf0c2ee8b97e328281cd814a3afd4f82f3

COMPONENT_PROJECT_URL_1=http://www.malayalamfont.com/
COMPONENT_ARCHIVE_1=	MalOtf.ttf
COMPONENT_ARCHIVE_URL_1=http://malayalamlinux.sourceforge.net/downloads/fonts/MalOtf.ttf
COMPONENT_ARCHIVE_HASH_1=sha256:2fea9a759d82610a7cea85d6bf6eef46a586a32231f10819421e67b642501905
# hack to disable UNPACK for just one component
UNPACK_ARGS_1= & true 

COMPONENT_PROJECT_URL_2=https://fedoraproject.org/wiki/Vemana2000_fonts
COMPONENT_ARCHIVE_2=	Vemana2k-Li.zip
COMPONENT_ARCHIVE_URL_2=http://pkgs.fedoraproject.org/repo/pkgs/vemana2000-fonts/Vemana2k-Li.zip/a044265b4fbdede4d58f51eb1c9a9c7f/$(COMPONENT_ARCHIVE_2)
COMPONENT_ARCHIVE_HASH_2=sha256:01d6df6d6387f7cd6b609ac5c0ac5c042a8ccba04c0e10800a4412d303579fe9

COMPONENT_PROJECT_URL_3=http://brahmi.sourceforge.net/
COMPONENT_ARCHIVE_3=	kanotf.zip
COMPONENT_ARCHIVE_URL_3=http://prdownloads.sourceforge.net/brahmi/kanotf.zip?download
COMPONENT_ARCHIVE_HASH_3=sha256:0fcf5e9772b583f4a36c1e931ac1ed7e90587d699251028f609f61c6036649b2

COMPONENT_BUGDB=	g11n/font

PKG_VARS+=	COMPONENT_ARCHIVE_URL_1
PKG_VARS+=	COMPONENT_ARCHIVE_URL_2
PKG_VARS+=	COMPONENT_ARCHIVE_URL_3
PKG_VARS+=	COMPONENT_PROJECT_URL
PKG_VARS+=	COMPONENT_PROJECT_URL_1
PKG_VARS+=	COMPONENT_PROJECT_URL_2
PKG_VARS+=	COMPONENT_PROJECT_URL_3


TPNO=			11254

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	$(CP) $(COMPONENT_ARCHIVE_1) $(@D); \
	$(UNZIP) -d $(@D) $(COMPONENT_ARCHIVE_2) vemana2000.ttf; \
	$(UNZIP) -d $(@D) -j $(COMPONENT_ARCHIVE_3) kanotf/fonts/Malige-b.TTF kanotf/fonts/Malige-n.TTF; \
	for fn in $(@D)/*.TTF; do $(MV) $$fn $${fn/.TTF/.ttf}; done; \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/*.ttf $(@D)/fonts.dir $(@D)/fonts.scale $(PROTOFONTSDIR)/$(COMPONENT_NAME);

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

REQUIRED_PACKAGES += x11/font-utilities
