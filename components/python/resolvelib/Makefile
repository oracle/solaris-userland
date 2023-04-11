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
# Copyright (c) 2023, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		resolvelib
COMPONENT_VERSION=	1.0.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	https://github.com/sarugaku/resolvelib
COMPONENT_BUGDB=	python-mod/resolvelib
COMPONENT_ANITYA_ID=	98018
COMPONENT_BAID=		140947

# pypi archive doesn't include the test suite
GIT_REPO=   $(COMPONENT_PROJECT_URL)
GIT_COMMIT_ID=  $(COMPONENT_VERSION)
GIT_HASH=   sha256:09ad970cdb502ce24f2da956e547ec320c4ba001506b1327a0f3d2a38de9a0d6

# We need to mirror Ansible
PYTHON_VERSION =	3.11
PYTHON_VERSIONS =	$(PYTHON_VERSION)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
# Ignore tests that need commentjson, which is not available on Solaris
COMPONENT_TEST_ARGS =	--ignore=functional

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)
PKG_MACROS +=	PYV=$(shell echo $(PYTHON_VERSION) | tr -d .)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)
