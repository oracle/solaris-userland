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
# Copyright (c) 2013, 2025, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		twisted
COMPONENT_VERSION=	25.5.0
COMPONENT_PROJECT_URL=	http://twistedmatrix.com/trac/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:1deb272358cb6be1e3e8fc6f9c8b36f78eb0fa7c2233d2dbe11ec6fee04ea316
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/twisted
COMPONENT_ANITYA_ID=	4071
COMPONENT_BAID=		360895


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/src/twisted/test
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--verbose

# Move executables into demo directory.
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRDIR)/demo/twisted-python$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/* $(PROTOUSRDIR)/demo/twisted-python$(PYTHON_VERSION)/

# Unfortunately the master test results files are not only different for
# each version of Python, they can also be different for x86 and SPARC platforms.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION).$(MACH).master

COMPONENT_TEST_TRANSFORMS += \
	'-nE -e "s/ ?=+ ?//g" ' \
	'-e "s/ in [0-9]+(\.[0-9]*)?(s| seconds).*//" ' \
	'-e "s/[0-9]+ warnings/x warnings/g" ' \
	'-e "/::.*FAILED/p" ' \
	'-e "/::.*ERROR/p" ' \
	'-e "\\$$p"'

COMPONENT_SYSTEM_TEST_DIR=	$(SOURCE_DIR)/src/twisted/test
COMPONENT_SYSTEM_TEST_CMD=	$(PYTHON) -m pytest
COMPONENT_SYSTEM_TEST_ARGS=	--verbose

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TEST_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/attrs-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/automat-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/constantly-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/hyperlink-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/incremental-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/python-zope-interface-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/typing-extensions-%)
REQUIRED_PACKAGES += system/library

# Testing related components
REQUIRED_PACKAGES += library/python/python-hamcrest
REQUIRED_PACKAGES += library/python/service_identity

# build dependencies
REQUIRED_PACKAGES += library/python/hatchling
