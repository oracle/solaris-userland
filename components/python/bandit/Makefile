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
# Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		bandit
COMPONENT_VERSION=	1.6.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:41e75315853507aa145d62a78a2a6c5e3240fe14ee7c601459d0df9418196065
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://bandit.readthedocs.io/en/latest/
COMPONENT_BUGDB=	utility/bandit
COMPONENT_ANITYA_ID=	7319

TPNO=			59998

# we only need to build for a single version, not all of them.
PYTHON_VERSIONS:=	$(PYTHON_VERSION)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
# test core/test_properties is broken, we do not deliver bandit-baseline
COMPONENT_TEST_ARGS = \
	--ignore bandit/core/test_properties.py \
	--ignore tests/unit/cli/test_baseline.py \
	--ignore tests/functional/test_baseline.py
# runtime test needs path to bandit executable
COMPONENT_TEST_ENV += \
	PATH=$(PROTOUSRBINDIR):$(PATH)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

# Testing related components
REQUIRED_PACKAGES += library/python/beautifulsoup4
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/stevedore
REQUIRED_PACKAGES += library/python/testtools
