#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2013, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		simplejson
COMPONENT_VERSION=	4.1.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:6ae4186f90362e9c03c80a1cd5062a20f3a11ac9d391f7ee0ef0701a0e2b7394
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/simplejson/simplejson
COMPONENT_BUGDB=	python-mod/simplejson
COMPONENT_ANITYA_ID=	4026
COMPONENT_BAID=		430130

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/$(COMPONENT_NAME)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TEST_64)

REQUIRED_PACKAGES += $(PYVS:%=runtime/python-%)
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
