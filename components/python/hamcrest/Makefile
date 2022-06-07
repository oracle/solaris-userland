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
# Copyright (c) 2019, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		PyHamcrest
COMPONENT_VERSION=	2.0.3
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:cf3cad90c004f22973ea0e86f004d41a600be24472d18e07f641705837153bad
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/hamcrest/PyHamcrest
COMPONENT_BUGDB=	python-mod/pyhamcrest
COMPONENT_ANITYA_ID=	11633
COMPONENT_BAID=		122905

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	1.10.1
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:74efac903a361ee05076679d12c84ad278970d55dcf7508fa7669d244a19dc8b
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	86821

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

# Tests are available only in the new version
test:		$(BUILD_DIR)/$(MACH)-3.7/.tested \
		$(BUILD_DIR)/$(MACH)-3.9/.tested

system-test:	$(BUILD_DIR)/$(MACH)-3.7/.system-tested \
		$(BUILD_DIR)/$(MACH)-3.9/.system-tested

REQUIRED_PACKAGES += $(PYVS:%=library/python/six-%)
