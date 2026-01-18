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
# Copyright (c) 2014, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cloudbase-init
COMPONENT_VERSION=	1.1.6
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:00cf7f97c0f50e25f5fab08a7e7fb7cd7b5e99bb6dbd434c50ecb00583a880c0
COMPONENT_ARCHIVE_URL=	\
    https://github.com/openstack/cloudbase-init/archive/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://github.com/cloudbase/cloudbase-init
COMPONENT_BUGDB=	service/cloudbase-init
COMPONENT_ANITYA_ID=	13227
COMPONENT_BAID=		185495

# We need just a single version
PYTHON_VERSIONS=	3.11
PYV=$(shell echo $(PYTHON_VERSIONS) | tr -d .)

# This component uses venv installed packages for testing.
TEST_TARGET= $(NO_TESTS)

BUILD_STYLE= setup.py

ASLR_MODE= $(ASLR_NOT_APPLICABLE)

include $(WS_MAKE_RULES)/common.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

PYTHON_VENV_TEST_COMPONENTS = ddt

COMPONENT_TEST_DIR =    $(SOURCE_DIR)
COMPONENT_TEST_CMD =    $(VENV_PYTHON) -m unittest -v
COMPONENT_TEST_ARGS =

venv-test:      $(TEST_NO_ARCH)

PKG_MACROS +=		PYVER=$(PYTHON_VERSIONS)
PKG_MACROS +=		PYV=$(PYV)

COMPONENT_PREP_ACTION += \
    $(CP) PKG-INFO $(SOURCE_DIR); \
    $(CP) files/solaris.py \
        $(SOURCE_DIR)/cloudbaseinit/metadata/services/osconfigdrive/; \
    $(CP) files/oraclecloud.py \
        $(SOURCE_DIR)/cloudbaseinit/conf/; \
    $(CP) files/oraclecloudservice.py \
        $(SOURCE_DIR)/cloudbaseinit/metadata/services/;

REQUIRED_PACKAGES += library/python/cryptography-$(PYV)
REQUIRED_PACKAGES += library/python/jinja2-$(PYV)
REQUIRED_PACKAGES += library/python/netaddr-$(PYV)
REQUIRED_PACKAGES += library/python/oauthlib-$(PYV)
REQUIRED_PACKAGES += library/python/oslo.config-$(PYV)
REQUIRED_PACKAGES += library/python/oslo.log-$(PYV)
REQUIRED_PACKAGES += library/python/pbr-$(PYV)
REQUIRED_PACKAGES += library/python/pyyaml-$(PYV)
REQUIRED_PACKAGES += library/python/requests-$(PYV)
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += runtime/python-$(PYV)
REQUIRED_PACKAGES += system/library/python/solaris-core-$(PYV)
