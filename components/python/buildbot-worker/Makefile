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
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		buildbot_worker
COMPONENT_VERSION=	4.2.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3d21c5c4caae568f667bac9c97d5dc7d019cff6a5102e9257b143fd2f61614d9
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://buildbot.net/
COMPONENT_BUGDB=	utility/buildbot
COMPONENT_ANITYA_ID=	48000
COMPONENT_BAID=		323565

# all we need is a single variant
PYTHON_VERSION = 3.11
PYTHON_VERSIONS = $(PYTHON_VERSION)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/buildbot_worker/test
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
# Experimental msgpack protocol is not supported at this point.
COMPONENT_TEST_ARGS =	--ignore=unit/test_msgpack.py
COMPONENT_TEST_ENV=	PATH=$(GNUBIN):$(PATH)

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)
PKG_MACROS +=	PYV=$(shell echo $(PYTHON_VERSION) | tr -d .)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PYVS:%=library/python/python-twisted-%)
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network

# Testing related components
REQUIRED_PACKAGES += $(PYVS:%=library/python/psutil-%)
