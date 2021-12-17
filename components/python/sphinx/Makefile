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
# Copyright (c) 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Sphinx
COMPONENT_VERSION=	4.2.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:a188f70f81ffcf91adb279c833438639d1879bb186fbc3ce4ea2405147aa8612
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://www.sphinx-doc.org/en/master/
COMPONENT_BUGDB=	utility/sphinx
COMPONENT_ANITYA_ID=	4031

COMPONENT_BAID=		110613

# We need just a single version
PYTHON_VERSION =	3.9
PYTHON_VERSIONS =	$(PYTHON_VERSION)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_ENV +=	no_proxy=localhost
COMPONENT_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_SYSTEM_TEST_ENV +=	no_proxy=localhost
COMPONENT_SYSTEM_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"

# While the Sphinx itself is pure python only, tests using
# Cython need the following setup properly.
COMPILER =	gcc
BITS =		64

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	-v

# Failing tests were reported upstream:
# https://github.com/sphinx-doc/sphinx/issues/9741
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS +=	'-n -e "/::.*FAILED/p"'

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)
PKG_MACROS +=	PYV=$(shell echo $(PYTHON_VERSION) | tr -d .)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += developer/documentation-tool/docutils
REQUIRED_PACKAGES += developer/documentation-tool/sphinx/alabaster
REQUIRED_PACKAGES += library/python/babel
REQUIRED_PACKAGES += library/python/jinja2
REQUIRED_PACKAGES += library/python/packaging
REQUIRED_PACKAGES += library/python/pygments
REQUIRED_PACKAGES += library/python/requests
