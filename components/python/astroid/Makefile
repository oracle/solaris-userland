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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		astroid
COMPONENT_VERSION=	2.12.5
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	https://github.com/PyCQA/astroid
COMPONENT_BUGDB=	python-mod/astroid
COMPONENT_ANITYA_ID=	12725
COMPONENT_BAID=		129340

# pypi archive doesn't include the test suite
GIT_REPO=	$(COMPONENT_PROJECT_URL)
GIT_COMMIT_ID=	v$(COMPONENT_VERSION)
GIT_HASH=	sha256:3f2eb8f6ef55734c15e6a0caf705e96734ec7559a22dc6a7995bf8fff3b47c65

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	1.4.8
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:5f064785a7e45ed519285f2eb30b795e58a4932a0736b32030da6fef3394ddb3
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	34811

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

$(BUILD_DIR)/%-2.7/.tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)/astroid/tests
$(BUILD_DIR)/%-2.7/.tested: COMPONENT_TEST_ARGS += unittest_*
$(BUILD_DIR)/%-2.7/.system-tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)/astroid/tests
$(BUILD_DIR)/%-2.7/.system-tested: COMPONENT_TEST_ARGS += unittest_*


COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/lazy-object-proxy-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/wrapt-%)
REQUIRED_PACKAGES += library/python/six-27
REQUIRED_PACKAGES += $(PYVS3:%=library/python/typing-extensions-%)
