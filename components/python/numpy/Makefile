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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS = 		32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		numpy
COMPONENT_VERSION=	1.19.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH=	\
    sha256:76766cc80d6128750075378d3bb7812cf146415bd29b588616f72c943c00d598
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.numpy.org/
COMPONENT_BUGDB=	python-mod/numpy
COMPONENT_ANITYA_ID=	2509

TPNO=			59912


COMPONENT_NAME_OLD=	$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	1.14.2
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).zip
COMPONENT_ARCHIVE_HASH_OLD= \
	sha256:facc6f925c3099ac01a1f03758100772560a0b020fb9d70f210404be08006bcb
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)

TPNO_OLD=		42611

# This component is not yet built for Python 3.9
PYTHON_VERSIONS = $(WITHOUT_PYTHON3.9)

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.

BUILD_STYLE= setup.py
TEST_TARGET = $(BUILD_DIR)/$(MACH64)-3.7/.tested-and-compared \
	$(BUILD_DIR)/$(MACH64)-3.9/.tested-and-compared
include $(WS_MAKE_RULES)/common.mk

# Convenience variables
TARGET_27  = $(BUILD_DIR)/$(MACH32)-2.7/
TARGET_27x = $(BUILD_DIR)/$(MACH64)-2.7/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# Targets updated for older version build
$(TARGET_27).built:  SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27x).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).installed:  SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27x).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(MANIFEST_BASE)-numpy-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
$(MANIFEST_BASE)-numpy-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-numpy-37.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-numpy-39.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)numpy-27@(.*) \
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

# Merge 32-bit & 64-bit versions of header with different SIZEOF values
install: $(BUILD_DIR)/.merged-header
$(BUILD_DIR)/.merged-header:	PYTHON_VERSION=2.7

NUMPYCONFIG_H = $(PYTHON_VENDOR_PACKAGES_BASE)/numpy/core/include/numpy/_numpyconfig.h
$(BUILD_DIR)/.merged-header: $(TARGET_27).installed $(TARGET_27x).installed
	-$(RM) $(PROTO_DIR)/$(NUMPYCONFIG_H)
	print '#include <sys/isa_defs.h>' > $(PROTO_DIR)/$(NUMPYCONFIG_H)
	$(GDIFF) -D _LP64 \
	    $(TARGET_27)src.solaris-*.32bit-2.7/numpy/core/include/numpy/_numpyconfig.h \
	    $(TARGET_27x)src.solaris-*.64bit-2.7/numpy/core/include/numpy/_numpyconfig.h \
	    >> $(PROTO_DIR)/$(NUMPYCONFIG_H) ; \
	diffstatus=$$? ; \
	if (( $$diffstatus != 1 )) ; then exit $$diffstatus ; fi
	touch $@

COMPONENT_TEST_DIR  = $(@D)
COMPONENT_TEST_ARGS = -c 'import numpy; numpy.test()'
COMPONENT_TEST_ENV += F90="$(GCC_ROOT)/bin/gfortran -m$(BITS)"

COMPONENT_TEST_TRANSFORMS = '-n -e "s/, [0-9]* warnings//" -e "s/\(in \).*\(seconds\)/\1x \2/p"'
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION)-$(BITS).$(MACH).master

REQUIRED_PACKAGES += library/python/nose
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/math
