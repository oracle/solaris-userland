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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#

COMPILER=		gcc
BUILD_BITS=		32_and_64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dulwich
COMPONENT_VERSION=	0.20.42
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:5c3ac2c35d49aece7adef4a748a9eec40f37563dac6fd88b1da87752fa19dbbf
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://www.dulwich.io/
COMPONENT_BUGDB=	python-mod/dulwich
COMPONENT_ANITYA_ID=	6077
COMPONENT_BAID=		123809

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# make executables for each Python version
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRBINDIR)/dul-receive-pack $(PROTOUSRBINDIR)/dul-receive-pack$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/dul-upload-pack $(PROTOUSRBINDIR)/dul-upload-pack$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/dulwich $(PROTOUSRBINDIR)/dulwich$(PYTHON_VERSION);

# Testing environment must be clean
test: ENV += -i
system-test: ENV += -i

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/$(COMPONENT_NAME)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/urllib3-%)
