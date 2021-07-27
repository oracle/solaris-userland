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
# Copyright (c) 2014, 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		fixtures
COMPONENT_VERSION=	1.4.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3e1c61753d0fafc1429591d33ad6b828a0673a200eae63dd6ac0685479db5d36
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/testing-cabal/fixtures
COMPONENT_BUGDB=	python-mod/fixtures
COMPONENT_ANITYA_ID=	8047

TPNO=			28000

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/$(COMPONENT_NAME)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
# one test is problematic with Python 2.7
COMPONENT_TEST_ARGS =	-k 'not test_useFixture_uses_raise_first'

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(NO_TESTS)

REQUIRED_PACKAGES += library/python/extras
REQUIRED_PACKAGES += library/python/pbr
REQUIRED_PACKAGES += library/python/six
REQUIRED_PACKAGES += library/python/testtools
