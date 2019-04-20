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
# Copyright (c) 2007, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =		NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dejavu-fonts-ttf
COMPONENT_VERSION=	2.37
COMPONENT_PROJECT_URL= 	https://dejavu-fonts.github.io/
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
	sha256:fa9ca4d13871dd122f61258a80d01751d603b4d3ee14095d65453b4e846e17d7
COMPONENT_ARCHIVE_URL=	http://downloads.sourceforge.net/project/dejavu/dejavu/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	x11/font
COMPONENT_ANITYA_ID=	418

TPNO= 			30836

TEST_TARGET= $(NO_TESTS)

COMPONENT_FONT_FILES= 		LICENSE ttf/*.ttf
COMPONENT_FONT_DEST_DIR= 	$(USRSHARETTFONTSDIR)/dejavu

include $(WS_MAKE_RULES)/font.mk

# Generate README file
COMPONENT_POST_INSTALL_ACTION += \
	grep -v travis-ci.org $(SOURCE_DIR)/README.md > \
		$(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)/README ;

# Install fontconfig files
FONTCONF_DEST_DIR=$(PROTO_DIR)/etc/fonts

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(FONTCONF_DEST_DIR)/conf.avail \
		$(FONTCONF_DEST_DIR)/conf.d ; \
	$(INSTALL) -m 0444 $(SOURCE_DIR)/fontconfig/*.conf \
		$(FONTCONF_DEST_DIR)/conf.avail/ ; \
	(cd $(FONTCONF_DEST_DIR)/conf.d/ ; $(SYMLINK) -f ../conf.avail/* .) ;
