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
# Copyright (c) 2021, 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		docutils
COMPONENT_VERSION=	0.21.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3a6b18732edf182daa3cd12775bbb338cf5691468f91eeeb109deff6ebfa986f
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://docutils.sourceforge.io/
COMPONENT_ANITYA_ID=	3849
COMPONENT_BUGDB=	python-mod/docutils
COMPONENT_BAID=		164670

# We need just a single version
PYTHON_VERSION =	3.11
PYTHON_VERSIONS =	$(PYTHON_VERSION)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/test
COMPONENT_TEST_CMD =	$(PYTHON) alltests.py
COMPONENT_TEST_ARGS =

# This directory is necessary for tests to pass.
COMPONENT_PRE_TEST_ACTION = mkdir -p $(SOURCE_DIR)/test/functional/output

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)
