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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		platformdirs
COMPONENT_VERSION=	4.3.6
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:357fb2acbc885b0419afd3ce3ed34564c13c9b95c89360cd9563f73aa5e2b907
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/platformdirs/platformdirs
COMPONENT_BUGDB=	python-mod/platformdirs
COMPONENT_ANITYA_ID=	200932
COMPONENT_BAID=		184901

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

# This component uses venv installed packages for testing
PYTHON_VENV_TEST_COMPONENTS = appdirs pytest-mock

COMPONENT_TEST_DIR =    $(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =    $(VENV_PYTHON) -m pytest
COMPONENT_TEST_ARGS =   --ignore test_android.py

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:          $(BUILD_NO_ARCH)

install:        $(INSTALL_NO_ARCH)

venv-test:           $(TEST_NO_ARCH)

# build dependencies
REQUIRED_PACKAGES += library/python/hatchling
REQUIRED_PACKAGES += library/python/hatch-vcs
