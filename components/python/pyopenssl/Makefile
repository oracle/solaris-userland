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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		pyOpenSSL
COMPONENT_VERSION=	22.0.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:7aabc61c91ffae4cac31cd7ffd38bb24e863cd60281202fabe85e4ae9754af6a
COMPONENT_ARCHIVE_URL=  $(call pypi_url)
COMPONENT_PROJECT_URL=  https://pyopenssl.org/
COMPONENT_BUGDB=	python-mod/pyopenssl
COMPONENT_ANITYA_ID=	5535
COMPONENT_BAID=		124801

COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	19.0.0
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:aeca66338f6de19d1aa46ed634c3b9ae519a64b458f8468aec688e7e3c20f200
COMPONENT_ARCHIVE_URL_OLD=  $(call pypi_url,OLD)
COMPONENT_BAID_OLD=		61821

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Convenience variables
TARGET_27 = $(BUILD_DIR)/%-2.7/
TARGET_37 = $(BUILD_DIR)/%-3.7/
TARGET_39 = $(BUILD_DIR)/%-3.9/

SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_27).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).tested: COMPONENT_SRC = $(COMPONENT_SRC_OLD)
$(TARGET_37).tested: COMPONENT_SRC = $(COMPONENT_SRC_OLD)

$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_BAID = $(COMPONENT_BAID_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_BAID = $(COMPONENT_BAID_OLD)

# Common generate transform for python uses files from the 3.7 variant as
# a baseline; hence, to make it work as expected, we have to pass 3.7
# related COMPONENT_VERSION to make it work correctly.
$(MANIFEST_BASE)-pyopenssl-PYVER.constructed: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
NEW_ONLY = \#
OLD_ONLY =
$(MANIFEST_BASE)-pyopenssl-39.mogrified: NEW_ONLY =
$(MANIFEST_BASE)-pyopenssl-39.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)pyopenssl-.7@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-pyopenssl.mogrified \
		> $(MANIFEST_BASE)-pyopenssl.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-pyopenssl.mogrified-fixed \
		$(MANIFEST_BASE)-pyopenssl.mogrified

$(MANIFEST_BASE)-pyopenssl.mangled: FIX_MANIFEST_VERSIONS


# Testing directly inside the build directory prevents ELFCLASS errors (because
# both 32bit and 64bit versions of Python 2.7 have their own directory and
# cached versions of 32/64 bit precompiled .so files are thus not a problem.)
COMPONENT_PRE_TEST_ACTION = $(CP) -r $(COMPONENT_SRC)/tests $(@D)
COMPONENT_TEST_DIR =	$(@D)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--disable-warnings

# Some tests require unicode characters, otherwise ~17 tests will fail
COMPONENT_TEST_ENV += TZ=UTC LC_ALL=en_US.UTF-8

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PYVS:%=library/python/cryptography-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/six-%)
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += system/library
