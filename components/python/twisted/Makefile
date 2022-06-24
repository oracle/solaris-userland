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
# Copyright (c) 2013, 2022, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Twisted
COMPONENT_VERSION=	22.4.0
COMPONENT_PROJECT_URL=	http://twistedmatrix.com/trac/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:624dda287c097720d12e470f766770a1c7376c2a9b9f19c4828f411d9f9a6f3f
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/twisted
COMPONENT_ANITYA_ID=	4071
COMPONENT_BAID=		123313


# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	18.9.0
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.bz2
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:ab2d9e3c9cad99340d45a26d1432a695c7e2e804b95d5d907cf549509936ade8
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	69507

# Twisted isn't compatible with Python 3.11 yet.
PYTHON_VERSIONS = $(WITHOUT_PYTHON3.11)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk


# Move executables into demo directory.
COMPONENT_INSTALL_ARGS +=	--install-scripts=usr/demo/twisted-python$(PYTHON_VERSION)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/src/twisted/test
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--verbose

# Unfortunately the master test results files are not only different for
# each version of Python, they can also be different for 32-bit and 64-bit
# versions and different for x86 and SPARC platforms.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION)-$(BITS).$(MACH).master

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

build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/attrs-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/automat-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/constantly-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/hyperlink-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/incremental-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/python-hamcrest-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/python-zope-interface-%)
REQUIRED_PACKAGES += library/python/typing-extensions-39
REQUIRED_PACKAGES += library/python/typing-extensions-37
REQUIRED_PACKAGES += system/library
