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

COMPONENT_NAME=		Mako
COMPONENT_VERSION=	1.2.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3705d9bf76219a3519ffbda568259d9a5f24236ee18fb8d1eba4fa8716e7c740
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.makotemplates.org/
COMPONENT_BUGDB=	python-mod/mako
COMPONENT_ANITYA_ID=	3915
COMPONENT_BAID=		127076

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--ignore test/ext/test_linguaplugin.py

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/markupsafe-%)
REQUIRED_PACKAGES += library/python/importlib-metadata-37

# Testing related components
REQUIRED_PACKAGES += library/python/babel
REQUIRED_PACKAGES += library/python/mock
