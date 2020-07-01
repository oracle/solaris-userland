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
# Copyright (c) 2014, 2020, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dnspython
COMPONENT_VERSION=	1.16.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH=	\
    sha256:36c5e8e38d4369a08b6780b7f27d790a292b2b08eea01607865bf0936c558e01
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.python.org/pypi/dnspython
COMPONENT_BUGDB=	python-mod/dnspython
COMPONENT_ANITYA_ID=	13190

TPNO=			49641

PYTHON_VERSIONS=	$(PYTHON2_VERSIONS) 3.7 3.9

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

# Python 2.7 cannot handle some test modules due to typing import
$(BUILD_DIR)/$(MACH)-2.7/.tested: COMPONENT_TEST_ARGS = \
	--ignore=test_name.py --ignore=test_rdtypeanydnskey.py --ignore=test_zone.py
$(BUILD_DIR)/$(MACH)-2.7/.system-tested: COMPONENT_SYSTEM_TEST_ARGS = \
	--ignore=test_name.py --ignore=test_rdtypeanydnskey.py --ignore=test_zone.py

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

