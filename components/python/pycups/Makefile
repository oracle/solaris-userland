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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pycups
COMPONENT_VERSION=	2.0.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:21a7b64e4c4a5cd1b2d598fec49f8f6e8fdb56f1e658bb0b7359875988a75c5f
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://cyberelk.net/tim/software/pycups/
COMPONENT_BUGDB=	python-mod/pycups
COMPONENT_ANITYA_ID=	7975

TPNO=			73927

PYTHON_VERSIONS=	$(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# pycups requires VERSION to be defined. Originally set in the package Makefile
CFLAGS += -DVERSION=\\\"$(COMPONENT_VERSION)\\\"

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# you have to set up a printer for tests to work
COMPONENT_TEST_ARGS=	test.py
COMPONENT_TEST_DIR=	$(COMPONENT_SRC)

# skip during automated tests because printer setup is needed
$(SKIP_TEST_AT_TOP_LEVEL)

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)


REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += print/cups
REQUIRED_PACKAGES += system/library
