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
# Copyright (c) 2013, 2020, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cmd2
COMPONENT_VERSION=	0.9.13
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:b873ade57ebf6c42a9d4e8c705fc2b16777e9d2e53fec5b113914dc65f2eae38
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.python.org/pypi/cmd2
COMPONENT_BUGDB=	python-mod/cmd2
COMPONENT_ANITYA_ID=	13187

TPNO=			52381


COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	0.6.8
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:ac780d8c31fc107bf6b4edcbcea711de4ff776d59d89bb167f8819d2d83764a8
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)

TPNO_OLD=		28756


# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Convenience variables
TARGET_27 = $(BUILD_DIR)/$(MACH)-2.7/
TARGET_37 = $(BUILD_DIR)/$(MACH)-3.7/
TARGET_39 = $(BUILD_DIR)/$(MACH)-3.9/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_27).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(MANIFEST_BASE)-cmd2-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
$(MANIFEST_BASE)-cmd2-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-cmd2-37.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-cmd2-39.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)cmd2-27@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-cmd2.mogrified \
		> $(MANIFEST_BASE)-cmd2.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-cmd2.mogrified-fixed \
		$(MANIFEST_BASE)-cmd2.mogrified

$(MANIFEST_BASE)-cmd2.mangled: FIX_MANIFEST_VERSIONS

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TARGET_37).tested $(TARGET_39).tested

system-test:    $(NO_TESTS)

