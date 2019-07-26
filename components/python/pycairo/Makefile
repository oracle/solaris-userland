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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

COMPILER=		gcc
BUILD_BITS=		32_and_64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pycairo
COMPONENT_VERSION=	1.18.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:83f4711ed0c7545427dd21665bdbf7f42484f90115016319e1877544b72f3848
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://cairographics.org/pycairo/
COMPONENT_BUGDB=	python-mod/pycairo
COMPONENT_ANITYA_ID=	13166

TPNO=			53159

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Manifest convenience variables
$(MANIFEST_BASE)-pycairo-27.mogrified: PYTHON3_ONLY = \#
$(MANIFEST_BASE)-pycairo-34.mogrified: PYTHON2_ONLY = \#
$(MANIFEST_BASE)-pycairo-35.mogrified: PYTHON2_ONLY = \#
$(MANIFEST_BASE)-pycairo-37.mogrified: PYTHON2_ONLY = \#

PKG_MACROS += PYTHON2_ONLY="$(PYTHON2_ONLY)"
PKG_MACROS += PYTHON3_ONLY="$(PYTHON3_ONLY)"

# Build testing related binary files
COMPONENT_PRE_TEST_ACTION = (\
	cd $(SOURCE_DIR) ; $(ENV) HOME=$(BUILD_DIR)/config-$* $(COMPONENT_BUILD_ENV) \
	$(PYTHON.$(BITS)) ./setup.py $(COMPONENT_SETUP_ARGS) build_tests)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += runtime/python-34
REQUIRED_PACKAGES += runtime/python-35

# Testing related components
REQUIRED_PACKAGES += library/python/pytest
