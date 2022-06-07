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
# Copyright (c) 2013, 2022, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cmd2
COMPONENT_VERSION=	2.4.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:5d0b300df5a25219f81f537f4a42e08f276e2b70cf81119e231201cba2aac0e3
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.python.org/pypi/cmd2
COMPONENT_BUGDB=	python-mod/cmd2
COMPONENT_ANITYA_ID=	13187
COMPONENT_BAID=		119518

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/attrs-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyperclip-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/wcwidth-%)
REQUIRED_PACKAGES += library/python/importlib-metadata-37
REQUIRED_PACKAGES += library/python/typing-extensions-37
