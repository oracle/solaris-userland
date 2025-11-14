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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Wand
COMPONENT_VERSION=	0.6.13
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_ARCHIVE_HASH= \
    sha256:f5013484eaf7a20eb22d1821aaefe60b50cc329722372b5f8565d46d4aaafcca
COMPONENT_PROJECT_URL=	https://github.com/emcconville/wand
COMPONENT_BUGDB=	python-mod/wand
COMPONENT_ANITYA_ID=	9335
COMPONENT_BAID=		178171

# We need just a version pspdfutils is delivered with
PYTHON_VERSIONS=	3.13

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

PKG_MACROS += PYVER=$(PYTHON_VERSIONS)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)
