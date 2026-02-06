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
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		hg-git
COMPONENT_VERSION=	1.2.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:d2f1ba00ed9dfdc61b2aff4a2e8809e27564394a609abdd7bbbfa97cd0c65e80
COMPONENT_ARCHIVE_URL= \
    https://foss.heptapod.net/mercurial/$(COMPONENT_NAME)/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://hg-git.github.io/
COMPONENT_BUGDB=	python-mod/hg-git
COMPONENT_ANITYA_ID=	1314
COMPONENT_BAID=		356664

# hg-git mirrors Mercurial versions.
PYTHON_VERSIONS = 3.11

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

# Mercurial does not belong to python incorporation even though it uses
# 'setup.py' BUILD_STYLE
CONSOLIDATION = userland

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON)
COMPONENT_TEST_ARGS =	run-tests.py --with-hg=$(HG)

COMPONENT_TEST_ENV += http_proxy= HTTP_PROXY=
COMPONENT_TEST_ENV += https_proxy= HTTPS_PROXY=

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS = '-n -e "/Ran .* tests/p"'

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

# system-test target is not enabled because it needs 'hg-python'
# mediator switch for each Python variant.
system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PYVS:%=library/python/dulwich-%)
