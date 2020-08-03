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
# Copyright (c) 2014, 2020, Oracle and/or its affiliates.
#

COMPILER=		gcc
BUILD_BITS=		32_and_64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cffi
COMPONENT_VERSION=	1.14.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:edd884e4ee79fae4699e34f625921a23f03fe7a1bc62e5d0b2a6d6b55ca31751
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://cffi.readthedocs.org/
COMPONENT_BUGDB=	python-mod/cffi
COMPONENT_ANITYA_ID=	5536

TPNO=			57851

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# The unit tests fail because of permission errors.
$(SKIP_TEST_AT_TOP_LEVEL)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

CFLAGS = -DXOPEN_SOURCE=700
CFLAGS += $(CC_BITS)
CFLAGS += -Dno_inline=noinline


COMPONENT_TEST_DIR =	$(@D)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ENV +=	TESTOWNLIB_CC="$(CC) $(CC_PIC) %s $(CC_BITS) -shared -o %s.so"

COMPONENT_TEST_ARGS =	-p no:codechecker
COMPONENT_TEST_ARGS +=	-v
COMPONENT_TEST_ARGS +=	c testing

COMPONENT_SYSTEM_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_SYSTEM_TEST_ENV +=	TESTOWNLIB_CC="$(CC) $(CC_PIC) %s $(CC_BITS) -shared -o %s.so"

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)


ifneq ($(TOP_LEVEL_TEST),yes)

# Copy the tests and a few of the source files they read into a scratch
# directory so running the tests don't leave turds in the source directory.
COMPONENT_PRE_TEST_ACTION = \
	$(MKDIR) $(@D)/tests/doc/source; \
	$(CP) -r $(SOURCE_DIR)/c $(SOURCE_DIR)/testing $(SOURCE_DIR)/cffi $(@D)/tests; \
	$(CP) $(SOURCE_DIR)/setup.py $(@D)/tests; \
	$(CP) \
	    $(SOURCE_DIR)/doc/source/conf.py \
	    $(SOURCE_DIR)/doc/source/index.rst \
	    $(SOURCE_DIR)/doc/source/installation.rst \
	    $(@D)/tests/doc/source

# We get spurious test failures with 64bit version of python 2.7
test:		$(BUILD_DIR)/$(MACH32)-2.7/.tested \
		$(BUILD_DIR)/$(MACH64)-3.5/.tested   \
		$(BUILD_DIR)/$(MACH64)-3.7/.tested

system-test:	$(BUILD_DIR)/$(MACH32)-2.7/.system-tested \
		$(BUILD_DIR)/$(MACH64)-3.5/.system-tested   \
		$(BUILD_DIR)/$(MACH64)-3.7/.system-tested

endif


REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/python/pycparser
REQUIRED_PACKAGES += system/library
