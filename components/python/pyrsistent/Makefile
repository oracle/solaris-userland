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
# Copyright (c) 2020, 2024, Oracle and/or its affiliates.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pyrsistent
COMPONENT_VERSION=	0.20.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:4c48f78f62ab596c679086084d0dd13254ae4f3d6c72a83ffdf5ebdef8f265a4
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/tobgu/pyrsistent/
COMPONENT_BUGDB=	python-mod/pyrsistent
COMPONENT_ANITYA_ID=	19676
COMPONENT_BAID=		190198

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TEST_64)
