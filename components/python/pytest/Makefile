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
# Copyright (c) 2013, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pytest
COMPONENT_VERSION=	9.0.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:75186651a92bd89611d1d9fc20f0b4345fd827c41ccd5c299a868a05d70edf11
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://pytest.org/latest/
COMPONENT_BUGDB=	python-mod/pytest
COMPONENT_ANITYA_ID=	3765
COMPONENT_BAID=		363557


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

# New version of pytest no longer generates -$(PYVER) script for
# each version.  Generate them now for backward compatibility.
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRBINDIR)/pytest $(PROTOUSRBINDIR)/pytest-$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/py.test $(PROTOUSRBINDIR)/py.test-$(PYTHON_VERSION)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/testing
COMPONENT_TEST_CMD =	$(PROTOUSRBINDIR)/py.test-$(PYTHON_VERSION)
COMPONENT_TEST_ARGS =

# Due to the existence of the 'pkg' package on Solaris, several tests
# fail with 3.11 due to incorrect expectations.
$(BUILD_DIR)/$(MACH)-3.11/.tested: COMPONENT_TEST_ARGS = \
	--ignore=test_collection.py \
	--ignore=test_config.py \
	--ignore=test_main.py \
	--ignore=test_terminal.py \
	--ignore=test_threadexception.py \
	--ignore=test_unraisableexception.py \
	--ignore=test_warnings.py

COMPONENT_SYSTEM_TEST_CMD =	$(USRBINDIR)/py.test-$(PYTHON_VERSION)

# Do not use tmp directory for tests to avoid persistent RAM usage.
COMPONENT_TEST_ENV += PYTEST_DEBUG_TEMPROOT=$(BUILD_DIR)/$(MACH)-$(PYTHON_VERSION)/

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/iniconfig-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pluggy-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pygments-%)

# Testing related components
REQUIRED_PACKAGES += library/python/hypothesis
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/pynose
REQUIRED_PACKAGES += library/python/requests
