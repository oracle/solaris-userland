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

COMPONENT_NAME=		wqy-zenhei
COMPONENT_VERSION=	0.8.38-1

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_SRC=		$(COMPONENT_NAME)
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	https://sourceforge.net/projects/wqy
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/files/$(COMPONENT_NAME)/0.8.38%20%28Pangu%29/$(COMPONENT_ARCHIVE)/download
COMPONENT_ARCHIVE_HASH= \
    sha256:6018eb54243eddc41e9cbe0b71feefa5cb2570ecbaccd39daa025961235dea22
COMPONENT_BUGDB=	g11n/font
COMPONENT_BAID=		23768

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES= 		*.ttc
COMPONENT_FONT_DOC_FILES=	AUTHORS ChangeLog README
COMPONENT_FONT_CONF_FILES=	*.conf

# generate license file
COMPONENT_PREP_ACTION += \
	( $(PERL) -ne 'print if /^\*\* GPL v2/ .. /^=+$$/' $(@D)/README; \
	  $(CAT) $(@D)/COPYING ) > $(@D)/license
