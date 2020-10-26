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
# Copyright (c) 2014, 2020, Oracle and/or its affiliates.
#

BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cloudbase-init
COMPONENT_VERSION=	1.1.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:9df0b6dea409956aa799514bf4c7dcf870b7e96ed1e1700fb3f89e006634e87b
COMPONENT_ARCHIVE_URL=	\
    https://github.com/openstack/cloudbase-init/archive/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://github.com/cloudbase/cloudbase-init
COMPONENT_BUGDB=	service/cloudbase-init
COMPONENT_ANITYA_ID=	13227

TPNO=			57119

# We need just a single version
PYTHON_VERSIONS=	3.7

# Tests requires ddt which is not integrated
TEST_TARGET= $(NO_TESTS)

BUILD_STYLE= setup.py

ASLR_MODE= $(ASLR_NOT_APPLICABLE)
SMF_MANIFESTS= $(COMPONENT_DIR)/files/cloudbase-init.xml

include $(WS_MAKE_RULES)/common.mk

PKG_MACROS +=		PYVER=$(PYTHON_VERSIONS)
PKG_MACROS +=		PYV=$(shell echo $(PYTHON_VERSIONS) | tr -d .)

# Copy the PKG-INFO file to the build root
COMPONENT_PRE_BUILD_ACTION = \
    $(CP) $(COMPONENT_DIR)/PKG-INFO $(SOURCE_DIR)

COMPONENT_POST_INSTALL_ACTION += \
    $(CP) \
        files/solaris.py \
        $(PROTO_DIR)$(PYTHON_LIB)/cloudbaseinit/metadata/services/osconfigdrive; \
    $(CP) \
	files/oraclecloud.py \
	$(PROTO_DIR)$(PYTHON_LIB)/cloudbaseinit/conf; \
    $(CP) \
	files/oraclecloudservice.py \
	$(PROTO_DIR)$(PYTHON_LIB)/cloudbaseinit/metadata/services; \
    $(PYTHON) -m compileall $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += system/library/python/solaris-core-37
