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
# Copyright (c) 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		distlib
COMPONENT_VERSION=	0.3.6
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3db67514593ade94ac548e3513e04124ab8623bdce98611e5bc607188ebb1e1a
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pypa/distlib
COMPONENT_BUGDB=	python-mod/distlib
COMPONENT_ANITYA_ID=	34504
COMPONENT_BAID=		129916

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

# Some tests can fail with proxy set
COMPONENT_TEST_ENV += SKIP_ONLINE=1
COMPONENT_TEST_ENV += http_proxy= HTTP_PROXY=
COMPONENT_TEST_ENV += https_proxy= HTTPS_PROXY=
# Makes the test suite deterministic
COMPONENT_TEST_ENV += PYTHONHASHSEED=0

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)
