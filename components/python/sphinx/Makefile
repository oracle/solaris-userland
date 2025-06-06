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
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		sphinx
COMPONENT_VERSION=	8.2.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:30c93548c3005ceaa525d102d1f14f005bcc92dc141852e6b73fd0dbcdfddbd3
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://www.sphinx-doc.org/en/master/
COMPONENT_BUGDB=	utility/sphinx
COMPONENT_ANITYA_ID=	4031
COMPONENT_BAID=		200846

# We need just a single version
PYTHON_VERSION =	3.11
PYTHON_VERSIONS =	$(PYTHON_VERSION)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_ENV +=	no_proxy=localhost
COMPONENT_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_SYSTEM_TEST_ENV +=	no_proxy=localhost
COMPONENT_SYSTEM_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"

# While the Sphinx itself is pure python only, tests using
# Cython need the following setup properly.
COMPILER =	gcc
BITS =		64

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/babel-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/jinja2-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pygments-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/requests-%)
REQUIRED_PACKAGES += developer/documentation-tool/docutils
REQUIRED_PACKAGES += developer/documentation-tool/sphinx/alabaster

# build dependencies
REQUIRED_PACKAGES += library/python/flit_core
