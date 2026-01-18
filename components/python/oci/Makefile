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
# Copyright (c) 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		oci
COMPONENT_VERSION=	2.164.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	https://docs.oracle.com/en-us/iaas/tools/python/latest/index.html
COMPONENT_BUGDB=	python-mod/oci
COMPONENT_ANITYA_ID=	34634
COMPONENT_BAID=		363285

# pypi archive doesn't include the test suite
GIT_REPO=   https://github.com/oracle/oci-python-sdk
GIT_COMMIT_ID=  v$(COMPONENT_VERSION)
GIT_HASH=   sha256:0fe3d036022c9ebd9e02b6233e1fde135c19224705126640d696080323b01dd5

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

PYTHON_VENV_TEST_COMPONENTS = vcrpy

COMPONENT_TEST_DIR =    $(SOURCE_DIR)
COMPONENT_TEST_CMD =    $(VENV_PYTHON) -m pytest -v
COMPONENT_TEST_ARGS =   tests

# --config-file option is conflicting with the one used by
# pytest since 7.4.0. This issue is known upstream:
# https://github.com/oracle/oci-python-sdk/pull/566
COMPONENT_PRE_TEST_ACTION += \
	$(GSED) -i 's/--config-file/--config-file-path/' $(SOURCE_DIR)/tests/conftest.py

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

venv-test:      $(TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/circuitbreaker-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/cryptography-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/dateutil-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyopenssl-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pytz-%)
