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

# Even though the component is pure python, some
# tests compilate non pure extensions.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		virtualenv
COMPONENT_VERSION=	20.26.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:82bf0f4eebbb78d36ddaee0283d43fe5736b53880b8a8cdcd37390a07ac3741c
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pypa/virtualenv
COMPONENT_BUGDB=	python-mod/virtualenv
COMPONENT_ANITYA_ID=	6904
COMPONENT_BAID=		167476

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

# Tests require a network access.
$(SKIP_TEST_AT_TOP_LEVEL)

COMPONENT_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)
COMPONENT_SYSTEM_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)

# Force use of native distutils rather than the setuptools one
# that otherwise takes over and breaks some tests.
# https://github.com/pypa/setuptools/issues/3007
COMPONENT_TEST_ENV +=	SETUPTOOLS_USE_DISTUTILS=stdlib
COMPONENT_SYSTEM_TEST_ENV +=	SETUPTOOLS_USE_DISTUTILS=stdlib

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

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
