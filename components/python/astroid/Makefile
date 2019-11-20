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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		astroid
COMPONENT_VERSION=	2.2.5
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:6560e1e1749f68c64a4b5dee4e091fce798d2f0d84ebe638cf0e0585a343acf4
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://bitbucket.org/logilab/$(COMPONENT_NAME)
COMPONENT_BUGDB=	python-mod/astroid
COMPONENT_ANITYA_ID=	12725

TPNO=			51724


COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	1.4.8
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:5f064785a7e45ed519285f2eb30b795e58a4932a0736b32030da6fef3394ddb3
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)

TPNO_OLD=		31346


# This component is delivered in two different versions.
# The newer one does no longer support Python 2.7 and 3.4 would need additional
# dependencies for this new version and since it will be EOL very soon, it
# doesn't really make sense to add them.

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Convenience variables
TARGET_27 = $(BUILD_DIR)/$(MACH)-2.7/
TARGET_34 = $(BUILD_DIR)/$(MACH)-3.4/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_27).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_34).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_34).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)/astroid/tests
$(TARGET_34).tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)/astroid/tests
$(TARGET_27).tested: COMPONENT_TEST_ARGS += unittest_*
$(TARGET_34).tested: COMPONENT_TEST_ARGS += unittest_*

$(MANIFEST_BASE)-astroid-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-astroid-34.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
$(MANIFEST_BASE)-astroid-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-astroid-34.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-astroid-35.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-astroid-37.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)astroid-(27|34)@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-astroid.mogrified \
		> $(MANIFEST_BASE)-astroid.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-astroid.mogrified-fixed \
		$(MANIFEST_BASE)-astroid.mogrified

$(MANIFEST_BASE)-astroid.mangled: FIX_MANIFEST_VERSIONS


COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += library/python/logilab-common
