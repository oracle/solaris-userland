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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

COMPILER=		gcc
BUILD_BITS=		32_and_64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pycairo
COMPONENT_VERSION=	1.21.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:9fe4d1a4356697bfe088ba7ac57b6644a7233e4e275a301ac587d5bdaeec93f4
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://cairographics.org/pycairo/
COMPONENT_BUGDB=	python-mod/pycairo
COMPONENT_ANITYA_ID=	13166
COMPONENT_BAID=		122799

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	1.18.1
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:83f4711ed0c7545427dd21665bdbf7f42484f90115016319e1877544b72f3848
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	66833

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

# Disable tests since cairo fails to import.
$(SKIP_TEST_AT_TOP_LEVEL)

# Manifest convenience variables
$(MANIFEST_BASE)-pycairo-27.mogrified: PYTHON3_ONLY = \#
$(MANIFEST_BASE)-pycairo-37.mogrified: PYTHON2_ONLY = \#
$(MANIFEST_BASE)-pycairo-39.mogrified: PYTHON2_ONLY = \#
$(MANIFEST_BASE)-pycairo-311.mogrified: PYTHON2_ONLY = \#

PKG_MACROS += PYTHON2_ONLY="$(PYTHON2_ONLY)"
PKG_MACROS += PYTHON3_ONLY="$(PYTHON3_ONLY)"

# Required to setup the prefix path to generate valid *.pc files.
COMPONENT_INSTALL_ARGS+= --prefix $(PYTHON_VENDOR_PACKAGES_BASE)

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

# We get spurious test failures with 64bit version of python 2.7
test:		$(BUILD_DIR)/$(MACH32)-2.7/.tested \
		$(BUILD_DIR)/$(MACH64)-3.7/.tested \
		$(BUILD_DIR)/$(MACH64)-3.9/.tested \
		$(BUILD_DIR)/$(MACH64)-3.11/.tested

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += library/desktop/cairo

# Testing related components
REQUIRED_PACKAGES += library/python/pytest
