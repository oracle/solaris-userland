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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		pycurl
COMPONENT_VERSION=	7.43.0
COMPONENT_PROJECT_URL=	http://pycurl.sourceforge.net/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:aa975c19b79b6aa6c0518c0cc2ae33528900478f0b500531dbcdbf05beec584c
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/pycurl
COMPONENT_ANITYA_ID=	7973

TPNO=			28055

# Temporary solution for Python3.7 ready components
PYTHON_VERSIONS = $(PYTHON3.7_READY)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# to make sure that the docs get installed in the right place.
PYTHON_DATA = /usr

# Testing environment must be clean
test: ENV += -i

# PYTHON_VENDOR_PACKAGES is incorrectly set by the shared-macros.mk
%-3.4/.tested: PYTHON_VENDOR_PACKAGES = $(PYTHON_VENDOR_PACKAGES.32)
%-3.5/.tested: PYTHON_VENDOR_PACKAGES = $(PYTHON_VENDOR_PACKAGES.32)
%-3.7/.tested: PYTHON_VENDOR_PACKAGES = $(PYTHON_VENDOR_PACKAGES.32)

# Rebuild downloaded .so files for each Python version
COMPONENT_PRE_TEST_ACTION = ( \
	cd $(COMPONENT_SRC)/tests/fake-curl/libcurl ; \
	$(RM) *.so ; $(ENV) $(COMPONENT_BUILD_ENV) $(GMAKE) )

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

# test requires bottle and vsftpd which haven't been integrated yet.
test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += web/curl
