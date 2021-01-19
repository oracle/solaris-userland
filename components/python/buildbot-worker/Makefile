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
# Copyright (c) 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		buildbot-worker
COMPONENT_VERSION=	2.10.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:1b3e1045d35185d8eeb868416eb4b91da0a1b97e8f2694ba100b3ee7d97dbe0a
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://buildbot.net/
COMPONENT_BUGDB=	utility/buildbot
COMPONENT_ANITYA_ID=	48000

TPNO=			64410

# all we need is a single variant
PYTHON_VERSIONS = 3.7

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/buildbot_worker/test
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =
COMPONENT_TEST_ENV=	PATH=$(GNUBIN):$(PATH)

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)
PKG_MACROS +=	PYV=$(shell echo $(PYTHON_VERSION) | tr -d .)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
