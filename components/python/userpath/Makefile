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
# Copyright (c) 2024, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		userpath
COMPONENT_VERSION=	1.9.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:ce8176728d98c914b6401781bf3b23fccd968d1647539c8788c7010375e02796
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/ofek/userpath
COMPONENT_BUGDB=	utility/userpath
COMPONENT_ANITYA_ID=	37501
COMPONENT_BAID=		158057

# No need for multiple versions, we need just the one used py pipx
PYTHON_VERSIONS= 3.11
PYV=$(shell echo $(PYTHON_VERSIONS) | tr -d .)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =    $(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =    $(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

PKG_MACROS += PYVER=$(PYTHON_VERSIONS)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:          $(BUILD_NO_ARCH)

install:        $(INSTALL_NO_ARCH)

test:           $(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)
