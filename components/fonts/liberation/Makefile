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
# Copyright (c) 2008, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =		NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		liberation-fonts-ttf
COMPONENT_VERSION=	1.07.2
IPS_COMPONENT_VERSION=	1.7.2
COMPONENT_PROJECT_URL=	https://pagure.io/liberation-fonts
COMPONENT_ARCHIVE_HASH= \
	sha256:b1bbf2df80f388ca1748a41068fafebc8efdfdee7612afb78a7a7cd31004d50f
COMPONENT_ARCHIVE_URL=	\
	https://releases.pagure.org/liberation-fonts/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	x11/font
COMPONENT_ANITYA_ID=	16833

TPNO= 			9925

COMPONENT_FONT_FILES= 		License.txt *.ttf
COMPONENT_FONT_DEST_DIR= 	$(USRSHARETTFONTSDIR)/liberation

include $(WS_MAKE_RULES)/font.mk

# Generate a combined license file
LICENSE_FILE = $(BUILD_DIR)/pkg-license.txt

COMPONENT_POST_INSTALL_ACTION += (set -e ; \
	fmt $(SOURCE_DIR)/License.txt > $(LICENSE_FILE) ; \
	print '\n________________________________________________________________________________\n' >> $(LICENSE_FILE) ; \
	cat $(SOURCE_DIR)/COPYING >> $(LICENSE_FILE) );
