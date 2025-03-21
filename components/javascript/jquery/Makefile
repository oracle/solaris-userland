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
# Copyright (c) 2021, 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		jquery
COMPONENT_VERSION=	3.7.1
COMPONENT_ARCHIVE_HASH=	\
	sha256:aeb6ee9b1606c016e76fb91a93f8ff3987ee6c39b51cfe0993f8dcc81271c32f
COMPONENT_ARCHIVE_URL=	\
	https://github.com/jquery/$(COMPONENT_NAME)/archive/$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	https://jquery.com/
COMPONENT_BUGDB=	javascript/jquery
COMPONENT_ANITYA_ID=	7363
COMPONENT_BAID=		175701

# There is nothing to build, just package the dist files
BUILD_STYLE= pkg
COMMON_TARGETS= no
include $(WS_MAKE_RULES)/common.mk

PROTO_JQUERY_DIR=	\
	$(PROTO_DIR)/usr/share/lib/javascript/$(COMPONENT_NAME)

# move relevant dist files into the proto area
$(BUILD_DIR)/.installed: $(SOURCE_DIR)/.prep
	(cd $(SOURCE_DIR); \
		$(MKDIR) $(PROTO_JQUERY_DIR)/$(COMPONENT_VERSION); \
		$(LN) -s $(COMPONENT_VERSION) $(PROTO_JQUERY_DIR)/latest; \
		$(CP) -R dist/* $(PROTO_JQUERY_DIR)/$(COMPONENT_VERSION))
	$(TOUCH) $@

install: $(BUILD_DIR)/.installed
