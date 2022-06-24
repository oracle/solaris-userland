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
# Copyright (c) 2013, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pytest
COMPONENT_VERSION=	7.1.3
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e2f6e91c0025003be74334dea914ed66a712ab7732e9a7b5dd9095c3b3bddc89
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://pytest.org/latest/
COMPONENT_BUGDB=	python-mod/pytest
COMPONENT_ANITYA_ID=	3765
COMPONENT_BAID=		131846

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	4.4.0
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:f21d2f1fb8200830dcbb5d8ec466a9c9120e20d8b53c7585d180125cce1d297a
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	61987


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

# New version of pytest no longer generates -$(PYVER) script for
# each version.  Generate them now for backward compatibility.
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRBINDIR)/pytest $(PROTOUSRBINDIR)/pytest-$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/py.test $(PROTOUSRBINDIR)/py.test-$(PYTHON_VERSION)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/testing
COMPONENT_TEST_CMD =	$(PROTOUSRBINDIR)/py.test-$(PYTHON_VERSION)
COMPONENT_TEST_ARGS =

COMPONENT_SYSTEM_TEST_CMD =	$(USRBINDIR)/py.test-$(PYTHON_VERSION)

# Do not use tmp directory for tests to avoid persistent RAM usage.
COMPONENT_TEST_ENV += PYTEST_DEBUG_TEMPROOT=$(BUILD_DIR)/$(MACH)-$(PYTHON_VERSION)/
COMPONENT_TEST_ENV += INPUTRC=$(BUILD_DIR)/.inputrc

# In Bash 5.1, bracketed paste mode is enabled by default, which is not
# anticipated by the pexpect test suite. There is no fix yet, but
# workaround is available:
# https://github.com/pexpect/pexpect/issues/669
COMPONENT_PRE_TEST_ACTION += echo "set enable-bracketed-paste off" > $(BUILD_DIR)/.inputrc

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS3:%=library/python/iniconfig-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/tomli-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/attrs-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pluggy-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/py-%)
REQUIRED_PACKAGES += library/python/atomicwrites-27
REQUIRED_PACKAGES += library/python/funcsigs-27
REQUIRED_PACKAGES += library/python/importlib-metadata-37
REQUIRED_PACKAGES += library/python/more_itertools-27
REQUIRED_PACKAGES += library/python/pathlib2-27
REQUIRED_PACKAGES += library/python/six-27

# Testing related components
REQUIRED_PACKAGES += library/python/hypothesis
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/nose
REQUIRED_PACKAGES += library/python/requests
