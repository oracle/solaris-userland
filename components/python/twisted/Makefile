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
# Copyright (c) 2013, 2021, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Twisted
COMPONENT_VERSION=	21.2.0
COMPONENT_PROJECT_URL=	http://twistedmatrix.com/trac/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:15cff97b63a244e14170d3caaeebd61a3d141fa5c9a97f229127f0d583543960
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/twisted
COMPONENT_ANITYA_ID=	4071

TPNO=			67313


COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	18.9.0
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.bz2
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:ab2d9e3c9cad99340d45a26d1432a695c7e2e804b95d5d907cf549509936ade8
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)

TPNO_OLD=		54420


# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Convenience variables
TARGET_27.32 = $(BUILD_DIR)/$(MACH32)-2.7/
TARGET_27.64 = $(BUILD_DIR)/$(MACH64)-2.7/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_27.32).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.64).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27.32).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.64).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27.32).tested-and-compared: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.64).tested-and-compared: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.32).system-tested-and-compared: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27.64).system-tested-and-compared: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(MANIFEST_BASE)-twisted-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
$(MANIFEST_BASE)-twisted-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-twisted-37.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-twisted-39.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)twisted-27@(.*) \
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
	'-e "s/, [0-9]* warnings//" ' \
	'-n -e "s/in .* seconds //p"' \
	'-e "/::.*FAILED/p"' \
	'-e "/::.*ERROR/p"'

COMPONENT_SYSTEM_TEST_DIR=	$(SOURCE_DIR)/src/twisted/test
COMPONENT_SYSTEM_TEST_CMD=	$(PYTHON) -m pytest
COMPONENT_SYSTEM_TEST_ARGS=	--verbose

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)

REQUIRED_PACKAGES += library/python/attrs
REQUIRED_PACKAGES += library/python/automat
REQUIRED_PACKAGES += library/python/constantly
REQUIRED_PACKAGES += library/python/hyperlink
REQUIRED_PACKAGES += library/python/incremental
REQUIRED_PACKAGES += library/python/pyasn1
REQUIRED_PACKAGES += library/python/pyopenssl
REQUIRED_PACKAGES += library/python/python-hamcrest
REQUIRED_PACKAGES += library/python/python-zope-interface
REQUIRED_PACKAGES += system/library
