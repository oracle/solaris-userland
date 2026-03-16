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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		pycurl
COMPONENT_VERSION=	7.45.7
COMPONENT_PROJECT_URL=	http://pycurl.sourceforge.net/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_BUGDB=	python-mod/pycurl
COMPONENT_ANITYA_ID=	7973
COMPONENT_BAID=		380536

# pypi archive doesn't include the test suite
GIT_REPO=	https://github.com/pycurl/pycurl
GIT_COMMIT_ID=	d923c82e48d5cc4915aa7baa420a4fb06ca2d9b8
GIT_HASH=	sha256:372c33ae315d91a04746b0b8aa83998d9ed8e5da20cec536694e8d7f89bab44e

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

# This component uses venv installed packages for testing
PYTHON_VENV_TEST_COMPONENTS = \
	bottle flaky flask werkzeug blinker click itsdangerous

# to make sure that the docs get installed in the right place.
PYTHON_DATA = /usr

# make sure that correct SSL backend is used (see 32568507)
COMPONENT_SETUP_ARGS += --with-openssl

# Testing environment must be clean
venv-test: ENV += -i

# Rebuild downloaded .so files for each Python version
COMPONENT_PRE_TEST_ACTION = ( \
	cd $(SOURCE_DIR)/tests/fake-curl/libcurl ; \
	$(RM) *.so ; $(ENV) $(COMPONENT_BUILD_ENV) $(GMAKE) )

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(VENV_PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

venv-test:		$(TEST_64)

venv-system-test:	$(SYSTEM_TEST_64)


REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += web/curl
