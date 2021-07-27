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
COMPONENT_VERSION=	1.7.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:786a2d867c894ac53b390c284f24aae9ff03d8721c719d081503bdba6a204b22
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://bandit.readthedocs.io/en/latest/
COMPONENT_BUGDB=	utility/bandit
COMPONENT_ANITYA_ID=	7319

TPNO=			72994

# we do not plan deliver Python 2.7 version
PYTHON_VERSIONS:=	$(PYTHON3_VERSIONS)

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

COMPONENT_POST_INSTALL_ACTION = \
	(cd $(PROTO_DIR)/usr/bin ; \
	$(MV) -f bandit bandit-$(PYTHON_VERSION); \
	$(MV) -f bandit-config-generator bandit-config-generator-$(PYTHON_VERSION))

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += library/python/pyyaml
REQUIRED_PACKAGES += library/python/six
REQUIRED_PACKAGES += library/python/stevedore

# Testing related components
REQUIRED_PACKAGES += library/python/beautifulsoup4
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/testtools
