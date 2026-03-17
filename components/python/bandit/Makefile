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
# Copyright (c) 2020, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		bandit
COMPONENT_VERSION=	1.9.4
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:b589e5de2afe70bd4d53fa0c1da6199f4085af666fde00e8a034f152a52cd628
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://bandit.readthedocs.io/en/latest/
COMPONENT_BUGDB=	utility/bandit
COMPONENT_ANITYA_ID=	7319
COMPONENT_BAID=		376438

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
# test core/test_properties is broken, we do not deliver bandit-baseline
COMPONENT_TEST_ARGS = \
	--ignore bandit/core/test_properties.py \
	--ignore tests/unit/cli/test_baseline.py \
	--ignore tests/unit/formatters/test_sarif.py
# runtime test needs path to bandit executable
COMPONENT_TEST_ENV += \
	PATH=$(PROTOUSRBINDIR):$(PATH)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_POST_INSTALL_ACTION = \
	(cd $(PROTO_DIR)/usr/bin ; \
	$(MV) -f bandit bandit-$(PYTHON_VERSION); \
	$(MV) -f bandit-config-generator bandit-config-generator-$(PYTHON_VERSION));

COMPONENT_POST_INSTALL_ACTION += \
	($(MKDIR) $(PROTO_DIR)/usr/share/man/man1; \
	$(CP) $(SOURCE_DIR)/doc/build/man/bandit.1 \
	      $(PROTO_DIR)/usr/share/man/man1/bandit.1);

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/pyyaml-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/stevedore-%)

# Testing related components
REQUIRED_PACKAGES += library/python/beautifulsoup4
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/testtools
