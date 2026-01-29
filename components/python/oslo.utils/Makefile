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
# Copyright (c) 2014, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		oslo_utils
COMPONENT_VERSION=	9.2.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:f502eb63fb8339149cacf37baef62fdae477d90bd8db832c46002b84dab1cce0
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://docs.openstack.org/developer/oslo.utils/
COMPONENT_BUGDB=	python-mod/oslo.utils
COMPONENT_ANITYA_ID=	3951
COMPONENT_BAID=		366986

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

PYTHON_VENV_TEST_COMPONENTS = \
    ddt oslotest testscenarios

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
REQUIRED_PACKAGES += $(PYVS:%=library/python/iso8601-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/netaddr-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.i18n-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pbr-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/psutil-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyparsing-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyyaml-%)
