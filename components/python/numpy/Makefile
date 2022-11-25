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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS = 		32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		numpy
COMPONENT_VERSION=	1.23.4
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:ed2cc92af0efad20198638c69bb0fc2870a58dabfba6eb722c933b48556c686c
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.numpy.org/
COMPONENT_BUGDB=	python-mod/numpy
COMPONENT_ANITYA_ID=	2509
COMPONENT_BAID=		132926

COMPONENT_NAME_OLD=	$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	1.21.6
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).zip
COMPONENT_ARCHIVE_HASH_OLD=	\
    sha256:ecb55251139706669fdec2ff073c98ef8e9a84473e51e716211b41aa0f18e656
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	133199

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

BUILD_STYLE= setup.py
include $(WS_MAKE_RULES)/common.mk

# Convenience variables
TARGET_37 = $(BUILD_DIR)/%-3.7/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_37).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).system-tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)

$(TARGET_37).tested: SOURCE_DIR_VECTORS = $(SOURCE_DIR_VECTORS_OLD)
$(TARGET_37).system-tested: SOURCE_DIR_VECTORS = $(SOURCE_DIR_VECTORS_OLD)

$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_BAID = $(COMPONENT_BAID_OLD)

# Make sure that prep is always executed correctly and entirely (see 34726564).
build install publish test: prep

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)numpy-37@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-numpy.mogrified \
		> $(MANIFEST_BASE)-numpy.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-numpy.mogrified-fixed \
		$(MANIFEST_BASE)-numpy.mogrified

$(MANIFEST_BASE)-numpy.mangled: FIX_MANIFEST_VERSIONS


COMPONENT_BUILD_ARGS.gcc	+= --compiler=gnu --fcompiler=gnu95
COMPONENT_BUILD_ARGS 		+= $(COMPONENT_BUILD_ARGS.$(COMPILER)) -lm

PYTHON_ENV +=   CC="$(CC) $(CC_BITS)"

PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES_BASE)/numpy/*.py
PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES_BASE)/numpy/*/*.py
PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES_BASE)/numpy/*/*/*.py

# Our PYTHON_SCRIPTS processing modifies some files after they have been
# compiled, making the previously created pyc files stale. Because of that,
# we have to recompile them all.
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)


COMPONENT_TEST_DIR  = $(@D)
COMPONENT_TEST_ARGS = -c 'import numpy; numpy.test()'
COMPONENT_TEST_ENV += F90="$(GCC_ROOT)/bin/gfortran -m$(BITS)"
# Do not use tmp directory for tests to avoid persistent RAM usage.
COMPONENT_TEST_ENV += PYTEST_DEBUG_TEMPROOT=$(BUILD_DIR)/$(MACH64)-$(PYTHON_VERSION)/

COMPONENT_TEST_TRANSFORMS += \
	'-nE -e "s/ ?=+ ?//g" ' \
	'-e "s/ in [0-9]+(\.[0-9]*)?s.*//" ' \
	'-e "s/[0-9]+ warnings/x warnings/g" ' \
	'-e "/^FAILED/p" ' \
	'-e "/^ERROR/p" ' \
	'-e "/passed,/p"'

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION)-$(BITS).$(MACH).master

REQUIRED_PACKAGES += library/python/cython
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/math
