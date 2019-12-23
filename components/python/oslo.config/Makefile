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
# Copyright (c) 2013, 2020, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		oslo.config
COMPONENT_VERSION=	6.12.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:7b71ea5035e981aba1f601dbd55d913cf2747f031c8763eb9f77ab81ded29fe0
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://docs.openstack.org/developer/oslo.config/
COMPONENT_BUGDB=	python-mod/oslo.config
COMPONENT_ANITYA_ID=	3946

TPNO=			56286

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_POST_INSTALL_ACTION += \
    ($(PYTHON) -m compileall $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES); \
     cd $(PROTO_DIR)/usr/bin ; \
     $(MV) -f oslo-config-generator oslo-config-generator-$(PYTHON_VERSION); \
     $(MV) -f oslo-config-validator oslo-config-validator-$(PYTHON_VERSION))

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

# See $(COMPONENT_SRC)/test-requirements.txt for the Python modules
# required to execute unittests.
test:		$(NO_TESTS)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
