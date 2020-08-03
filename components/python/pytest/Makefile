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
# Copyright (c) 2013, 2020, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pytest
COMPONENT_VERSION=	4.4.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:f21d2f1fb8200830dcbb5d8ec466a9c9120e20d8b53c7585d180125cce1d297a
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://pytest.org/latest/
COMPONENT_BUGDB=	python-mod/pytest
COMPONENT_ANITYA_ID=	3765

TPNO=			50840

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# There are some test failures, the master test file is missing.
$(SKIP_TEST_AT_TOP_LEVEL)

# New version of pytest no longer generates -$(PYVER) script for
# each version.  Generate them now for backward compatibility.
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRBINDIR)/py.test $(PROTOUSRBINDIR)/py.test-$(PYTHON_VERSION)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/testing
COMPONENT_TEST_CMD =	$(PROTOUSRBINDIR)/py.test-$(PYTHON_VERSION)
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

# Testing related components
REQUIRED_PACKAGES += library/python/hypothesis
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/nose
REQUIRED_PACKAGES += library/python/requests
