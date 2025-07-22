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
# Copyright (c) 2013, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		zope.interface
COMPONENT_VERSION=	7.1.1
COMPONENT_PROJECT_URL=	http://zope.org/Wikis/Interfaces/FrontPage
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:4284d664ef0ff7b709836d4de7b13d80873dc5faeffc073abdb280058bfac5e3
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/zope
COMPONENT_ANITYA_ID=	4112
COMPONENT_BAID=		185742

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)
COMPONENT_TEST_CMD =	$(PYTHON) -m unittest discover -s zope/interface -t .
COMPONENT_TEST_ARGS =

COMPONENT_SYSTEM_TEST_DIR =	$(SOURCE_DIR)/src
COMPONENT_SYSTEM_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_SYSTEM_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

# Testing related components
REQUIRED_PACKAGES += library/python/coverage
REQUIRED_PACKAGES += library/python/pynose
