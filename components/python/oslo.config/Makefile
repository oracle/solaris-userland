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
# Copyright (c) 2013, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		oslo_config
COMPONENT_VERSION=	10.2.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:fc0561fc448085d979e03a1bff420efcacbad71722a248aecee0572b871a00f7
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://docs.openstack.org/developer/oslo.config/
COMPONENT_BUGDB=	python-mod/oslo.config
COMPONENT_ANITYA_ID=	3946
COMPONENT_BAID=		366980

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

COMPONENT_POST_INSTALL_ACTION += \
    ($(PYTHON) -m compileall $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES); \
     cd $(PROTO_DIR)/usr/bin ; \
     $(MV) -f oslo-config-generator oslo-config-generator-$(PYTHON_VERSION); \
     $(MV) -f oslo-config-validator oslo-config-validator-$(PYTHON_VERSION))

PYTHON_VENV_TEST_COMPONENTS = \
   oslotest requests_mock testscenarios docutils sphinx

COMPONENT_TEST_DIR =    $(SOURCE_DIR)
COMPONENT_TEST_CMD =    $(VENV_PYTHON) -m unittest -v
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

venv-test:      $(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PYVS:%=library/python/netaddr-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.i18n-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyyaml-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/requests-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/rfc3986-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/stevedore-%)
