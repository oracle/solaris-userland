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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		setuptools_scm
COMPONENT_VERSION=	6.4.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:b60e8bdcd6f87553a3e8f5c46029b1c1520dbfe9845dc2064d3b25b797e43045
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.org/project/setuptools_scm/
COMPONENT_BUGDB=	python-mod/setuptools_scm
COMPONENT_ANITYA_ID=	7874
COMPONENT_BAID=		121660

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	5.0.2
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
	sha256:83a0cedd3449e3946307811a4c7b9d89c4b5fd464a2fb5eeccd0a5bb158ae5c8
COMPONENT_ARCHIVE_URL_OLD= $(call pypi_url, OLD)
COMPONENT_BAID_OLD=	106627


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

# Tests require a network access.
$(SKIP_TEST_AT_TOP_LEVEL)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/testing
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	-v
COMPONENT_TEST_TRANSFORMS += \
	'-nE -e "s/ ?=+ ?//g" ' \
	'-e "s/ in [0-9]+(\.[0-9]*)?(s| seconds).*//" ' \
	'-e "s/[0-9]+ warnings/x warnings/g" ' \
	'-e "/::.*FAILED/p" ' \
	'-e "/::.*ERROR/p" ' \
	'-e "\\$$p"'

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += library/python/packaging-39
REQUIRED_PACKAGES += library/python/packaging-37
REQUIRED_PACKAGES += $(PYVS:%=library/python/setuptools-%)
REQUIRED_PACKAGES += library/python/tomli-39
REQUIRED_PACKAGES += library/python/tomli-37
