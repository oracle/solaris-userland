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
# Copyright (c) 2014, 2023, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		oslo.utils
COMPONENT_VERSION=	6.1.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:76bc0108d50aca972b68fec8298e791b5fbcbeb9a51a27c6986b41b0a6a62eeb
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://docs.openstack.org/developer/oslo.utils/
COMPONENT_BUGDB=	python-mod/oslo.utils
COMPONENT_ANITYA_ID=	3951
COMPONENT_BAID=		140843

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

# See $(COMPONENT_SRC)/test-requirements.txt for the Python modules
# required to execute unittests.
test:		$(NO_TESTS)

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PYVS:%=library/python/debtcollector-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/iso8601-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/netaddr-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/netifaces-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/oslo.i18n-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyparsing-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pytz-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyyaml-%)
