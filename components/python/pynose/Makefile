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
# Copyright (c) 2012, 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pynose
COMPONENT_VERSION=	1.5.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=  https://github.com/mdmintz/pynose
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:93dd3045649e3672868fbee5aba319c448041435783b2de13e5f7617c75eece9
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/pynose
COMPONENT_ANITYA_ID=	343621
COMPONENT_BAID=		171617

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; \
	$(MV) pynose pynose-$(PYTHON_VERSION); \
	$(MV) nosetests nosetests-$(PYTHON_VERSION)) ;

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_DIR =	$(PROTO_DIR)$(USRBINDIR)
COMPONENT_TEST_CMD =	./nosetests-$(PYTHON_VERSION)
COMPONENT_TEST_ARGS =	$(SOURCE_DIR)/selftest.py

COMPONENT_PRE_TEST_ACTION = \
	echo "def test_func():\n\tpass" > $(SOURCE_DIR)/selftest.py

COMPONENT_PRE_SYSTEM_TEST_ACTION = \
	echo "def test_func():\n\tpass" > $(SOURCE_DIR)/selftest.py

COMPONENT_SYSTEM_TEST_DIR =	$(USRBINDIR)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)
