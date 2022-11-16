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
# Copyright (c) 2013, 2023, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Twisted
COMPONENT_VERSION=	22.10.0
COMPONENT_PROJECT_URL=	http://twistedmatrix.com/trac/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:32acbd40a94f5f46e7b42c109bfae2b302250945561783a8b7a059048f2d4d31
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/twisted
COMPONENT_ANITYA_ID=	4071
COMPONENT_BAID=		133256


# Python 3.7 is still based on OpenSSL 1.0.2 meaning that
# it is limited by the cryptography and openssl versions.
COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	22.4.0
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:624dda287c097720d12e470f766770a1c7376c2a9b9f19c4828f411d9f9a6f3f
COMPONENT_ARCHIVE_URL_OLD=  $(call pypi_url,OLD)
COMPONENT_BAID_OLD=		123313

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Convenience variables
TARGET_37 = $(BUILD_DIR)/%-3.7/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_37).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).tested-and-compared: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).system-tested-and-compared: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_BAID = $(COMPONENT_BAID_OLD)

# Make sure that prep is always executed correctly and entirely (see 34726564).
build install publish test: prep

# Manifest convenience variables.
NEW_ONLY = \#
OLD_ONLY =
$(MANIFEST_BASE)-twisted-39.mogrified: NEW_ONLY =
$(MANIFEST_BASE)-twisted-39.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-twisted-311.mogrified: NEW_ONLY =
$(MANIFEST_BASE)-twisted-311.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)twisted-37@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-twisted.mogrified \
		> $(MANIFEST_BASE)-twisted.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-twisted.mogrified-fixed \
		$(MANIFEST_BASE)-twisted.mogrified

$(MANIFEST_BASE)-twisted.mangled: FIX_MANIFEST_VERSIONS


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
REQUIRED_PACKAGES += $(PYVS:%=library/python/typing-extensions-%)
REQUIRED_PACKAGES += system/library

# Testing related components
REQUIRED_PACKAGES += library/python/service_identity
