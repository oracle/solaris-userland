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

COMPILER=		gcc
BUILD_BITS=		32_and_64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Pillow
COMPONENT_VERSION=	7.2.0
COMPONENT_PROJECT_URL=	https://github.com/python-pillow/Pillow
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:e811de93960d9a1bc96b575e363d9a44c571c2b9a0388a0efac7a94f297b882d
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/pil
COMPONENT_ANITYA_ID=	7974

TPNO=			60093


COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	5.1.0
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:9b9f161664978d8b1d5c5f103935cc00aea88daf5230fbc29593d83e8e7104ca
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)

TPNO_OLD=		42560


# This component is delivered in two different versions.
# The newer one does no longer support Python 2.7; the older one does
# but we don't want to fall behind until those are EOLed.

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Disable tests since it requires packages that are not available in CBE.
$(SKIP_TEST_AT_TOP_LEVEL)

# Convenience variables
TARGET_27.32 = $(BUILD_DIR)/$(MACH32)-2.7/
TARGET_27.64 = $(BUILD_DIR)/$(MACH64)-2.7/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_27.32).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.64).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27.32).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.64).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27.32).tested: COMPONENT_TEST_DIR = $(COMPONENT_SRC_OLD)
$(TARGET_27.64).tested: COMPONENT_TEST_DIR = $(COMPONENT_SRC_OLD)
$(TARGET_27.32).system-tested: COMPONENT_TEST_DIR = $(COMPONENT_SRC_OLD)
$(TARGET_27.64).system-tested: COMPONENT_TEST_DIR = $(COMPONENT_SRC_OLD)

$(MANIFEST_BASE)-pillow-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
$(MANIFEST_BASE)-pillow-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-pillow-37.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-pillow-39.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)pillow-27@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-pillow.mogrified \
		> $(MANIFEST_BASE)-pillow.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-pillow.mogrified-fixed \
		$(MANIFEST_BASE)-pillow.mogrified

$(MANIFEST_BASE)-pillow.mangled: FIX_MANIFEST_VERSIONS

COMPONENT_TEST_DIR =	$(COMPONENT_SRC)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =


# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)


REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += image/library/openjpeg2
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/tcl-8
REQUIRED_PACKAGES += runtime/tk-8
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += x11/library/libxcb
