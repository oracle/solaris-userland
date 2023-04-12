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
# Copyright (c) 2017, 2023, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		unifont
COMPONENT_VERSION=	8.0.01

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_PROJECT_URL=	https://unifoundry.com/unifont/index.html
COMPONENT_ARCHIVE_URL=	https://unifoundry.com/pub/$(COMPONENT_NAME)/$(COMPONENT_SRC)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
    sha256:4b20bfc6412bce9302cd321f39d7c0185c3c69f9deaf9ab7ea89c4e105fbcb9c
COMPONENT_BUGDB=	g11n/font
COMPONENT_BAID=		28016

BUILD_STYLE=		justmake
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk
include $(WS_MAKE_RULES)/font.mk

# We don't ship or use the tools needed to rebuild the font, so don't build them
COMPONENT_BUILD_ACTION = print "Nothing to build"

COMPONENT_INSTALL_ARGS += -C font
COMPONENT_INSTALL_ARGS += PCFDEST=$(PROTO_DIR)/$(COMPONENT_FONT_DEST_DIR)
COMPONENT_INSTALL_ARGS += TTFDEST=$(PROTO_DIR)/$(COMPONENT_FONT_DEST_DIR)

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)$(COMPONENT_FONT_DOC_DEST_DIR) ; \
	$(INSTALL) -m 0444 $(@D)/COPYING $(@D)/ChangeLog $(@D)/README \
	    $(PROTO_DIR)$(COMPONENT_FONT_DOC_DEST_DIR) ;

# For some reason we've never shipped unifont_{csur,sample} fonts
COMPONENT_POST_INSTALL_ACTION += \
	$(RM) $(PROTO_DIR)/$(COMPONENT_FONT_DEST_DIR)/unifont_*{csur,sample}.* ;

# We ship pcf fonts uncompressed in Solaris, as explained in fonts.mk
COMPONENT_POST_INSTALL_ACTION += \
	$(GUNZIP) $(PROTO_DIR)/$(COMPONENT_FONT_DEST_DIR)/*.pcf.gz ;

# Need to regenerate these after prior actions
COMPONENT_POST_INSTALL_ACTION += \
	$(MKFONTSCALE) $(PROTO_DIR)/$(COMPONENT_FONT_DEST_DIR) ; \
	$(MKFONTDIR) $(PROTO_DIR)/$(COMPONENT_FONT_DEST_DIR) ;
