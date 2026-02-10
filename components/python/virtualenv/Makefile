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
# Copyright (c) 2012, 2026, Oracle and/or its affiliates.
#

# Even though the component is pure python, some
# tests compilate non pure extensions.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		virtualenv
COMPONENT_VERSION=	20.36.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:8befb5c81842c641f8ee658481e42641c68b5eab3521d8e092d18320902466ba
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pypa/virtualenv
COMPONENT_BUGDB=	python-mod/virtualenv
COMPONENT_ANITYA_ID=	6904
COMPONENT_BAID=		369863

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

# Tests require a network access.
$(SKIP_TEST_AT_TOP_LEVEL)

COMPONENT_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)
COMPONENT_SYSTEM_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =   --ignore-glob=*test_build_c_ext.py

COMPONENT_POST_INSTALL_ACTION +=	\
    (cd $(PROTO_DIR)/usr/bin; $(MV) virtualenv virtualenv-$(PYTHON_VERSION))

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

# While the component itself is pure Python,
# some tests cases need a compiler.
test:		$(TEST_64)

system-test:	$(SYSTEM_TEST_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/distlib-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/filelock-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/platformdirs-%)

# Testing related components
REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/pip
