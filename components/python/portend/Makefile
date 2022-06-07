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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		portend
COMPONENT_VERSION=	3.1.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:f710d6cfdc6bd7bd12189d0f54aea77b3030d5ea930b236b6e43d25129320afc
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.org/project/portend
COMPONENT_BUGDB=	python-mod/portend
COMPONENT_ANITYA_ID=	20203
COMPONENT_BAID=		122839

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	test_portend.py

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/tempora-%)

# Setup related components
REQUIRED_PACKAGES += library/python/setuptools_scm
