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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		lxml
COMPONENT_VERSION=	5.3.0
COMPONENT_PROJECT_URL=	http://lxml.de/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:4e109ca30d1edec1ac60cdbe341905dc3b8f55b16855e03a54aaf59e51ec8c6f
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/lxml
COMPONENT_ANITYA_ID=	3914
COMPONENT_BAID=		185773

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_ARGS=	test
COMPONENT_TEST_CMD=	$(MAKE) -i
COMPONENT_TEST_DIR=	$(COMPONENT_SRC)

# Prevent errors like: 'UnicodeEncodeError: 'ascii' codec can't encode
# characters in position 5-18: ordinal not in range(128)'
# Taken from https://illumos.org/issues/6538
COMPONENT_TEST_ENV+=	LC_ALL=en_US.UTF-8

# Point the test suite to already built libraries and
# stop it from rebuilding everything during testing.
COMPONENT_TEST_ENV+=	HOME=$(BUILD_DIR)/config-$*

# Prevent errors like: OSError: Error reading file 'http://127.0.0.1:59951/':
# failed to load HTTP resource
COMPONENT_TEST_ENV+=	http_proxy=
COMPONENT_TEST_ENV+=	https_proxy=
COMPONENT_TEST_ENV+=	HTTP_PROXY=
COMPONENT_TEST_ENV+=	HTTPS_PROXY=
# Do not create the test coverage report.
COMPONENT_TEST_ENV+=	CYTHON_WITH_COVERAGE=

# Use the correct version of Python each time.
COMPONENT_TEST_ENV+=	PYTHON=$(PYTHON)

COMPONENT_TEST_TRANSFORMS += \
	'-n -e "/OK/p" ' \
	'-e "/FAILED/p" ' \
	'-e "s|\(Ran [0-9][0-9]* tests\).*|\1|p" '

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/math
