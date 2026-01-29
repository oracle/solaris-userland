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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		oslo_log
COMPONENT_VERSION=	8.0.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:7be7300fe8847f9def06191c8e9d1b4093bf01ffe5be30c002461a4ad8d25a7b
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://docs.openstack.org/developer/oslo.log/
COMPONENT_BUGDB=	python-mod/oslo.log
COMPONENT_ANITYA_ID=	7001
COMPONENT_BAID=		366984

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; \
	$(MV) -f convert-json convert-json-$(PYTHON_VERSION))

PYTHON_VENV_TEST_COMPONENTS = oslotest

COMPONENT_TEST_DIR =    $(SOURCE_DIR)
COMPONENT_TEST_CMD =    $(VENV_PYTHON) -m unittest -v
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

venv-test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PYVS:%=library/python/debtcollector-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/dateutil-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.config-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.context-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.i18n-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.serialization-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.utils-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pbr-%)
