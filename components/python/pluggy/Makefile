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
# Copyright (c) 2019, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		pluggy
COMPONENT_VERSION=	1.0.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3de456014e94bece0528e6562bf1e1ad2d8c9ae9791113742932150ae3753a4f
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pytest-dev/pluggy
COMPONENT_BUGDB=	python-mod/pluggy
COMPONENT_ANITYA_ID=	7500
COMPONENT_BAID=		116643

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	0.9.0
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:19ecf9ce9db2fce065a7a0586e07cfb4ac8614fe96edf628a264b1c70116cf8f
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	65053

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/testing
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += library/python/importlib-metadata-37

# Setup related components
REQUIRED_PACKAGES += library/python/setuptools_scm
