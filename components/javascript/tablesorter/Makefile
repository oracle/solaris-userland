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
# Copyright (c) 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		tablesorter
COMPONENT_VERSION=	2.31.3
COMPONENT_ARCHIVE_HASH=	\
	sha256:6ba5e2726edd932499abe92444c06115b8d41357c485f3f6bf9ee407cc5f2dc4
COMPONENT_ARCHIVE_URL=	\
	https://github.com/Mottie/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	https://mottie.github.io/tablesorter/
COMPONENT_BUGDB=	javascript/jquery
COMPONENT_ANITYA_ID=	141610

TPNO=			64093

# There is nothing to build, just package the dist files
BUILD_STYLE= pkg
COMMON_TARGETS= no
include $(WS_MAKE_RULES)/common.mk

PROTO_TABLESORTER_DIR=	\
	$(PROTO_DIR)/usr/share/lib/javascript/jquery-$(COMPONENT_NAME)

# move relevant dist files into the proto area
$(BUILD_DIR)/.installed: $(SOURCE_DIR)/.prep
	(cd $(SOURCE_DIR); \
		$(MKDIR) $(PROTO_TABLESORTER_DIR)/$(COMPONENT_VERSION); \
		$(LN) -s $(COMPONENT_VERSION) $(PROTO_TABLESORTER_DIR)/latest; \
		$(CP) -R dist/* $(PROTO_TABLESORTER_DIR)/$(COMPONENT_VERSION))
	$(TOUCH) $@

install: $(BUILD_DIR)/.installed
