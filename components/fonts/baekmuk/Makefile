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

COMPONENT_NAME=		baekmuk
COMPONENT_VERSION=	2.1

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		baekmuk-ttf-$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	http://kldp.net/baekmuk/
COMPONENT_ARCHIVE_URL=	http://pkgs.fedoraproject.org/repo/pkgs/fonts-korean/$(COMPONENT_ARCHIVE)/afb58ae36c74fdcc232ec4a2084a956c/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:f367c48519bde6ff9941381f1eec7279ad8cec6ca2b20b4f1884752bd42f95da
COMPONENT_BUGDB=	g11n/font
COMPONENT_ANITYA_ID=	17137

TPNO=			9365

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

# The baekmuk tarball doesn't unpack cleanly into its own directory.
UNPACK_ARGS= -r $(COMPONENT_SRC)


include $(WS_MAKE_RULES)/common.mk

PROTOFONTSDIR=	$(PROTOUSRSHAREDIR)/fonts/TrueType

COMPONENT_BUILD_ACTION = \
	$(MKFONTSCALE) $(@D); \
	$(MKFONTDIR) $(@D);

COMPONENT_INSTALL_ACTION = \
	$(CP) $(@D)/*.ttf $(@D)/fonts.* $(PROTOFONTSDIR)/$(COMPONENT_NAME)/;

COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTOFONTSDIR)/$(COMPONENT_NAME);

REQUIRED_PACKAGES += x11/font-utilities
