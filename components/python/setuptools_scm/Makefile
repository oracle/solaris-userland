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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		setuptools_scm
COMPONENT_VERSION=	8.1.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:20c7018be099048b4fc10c0968734ee76a887f1abf8d149725756c3e458d1d06
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.org/project/setuptools_scm/
COMPONENT_BUGDB=	python-mod/setuptools_scm
COMPONENT_ANITYA_ID=	7874
COMPONENT_BAID=		178886

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

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

REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/setuptools-%)
REQUIRED_PACKAGES += library/python/tomli-39
REQUIRED_PACKAGES += library/python/typing-extensions-39
