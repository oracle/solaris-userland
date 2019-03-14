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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		coverage
COMPONENT_VERSION=	4.5.2
COMPONENT_PROJECT_URL=	http://nedbatchelder.com/code/coverage/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:ab235d9fe64833f12d1334d29b558aacedfbca2356dfb9691f2d0d38a8a7bfb4
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/coverage
COMPONENT_ANITYA_ID=	3811

TPNO=			48548

# Temporary solution for Python3.7 ready components
PYTHON_VERSIONS = $(PYTHON3.7_READY)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_POST_INSTALL_ACTION =	\
	(cd $(PROTO_DIR)/usr/bin ; $(MV) -f coverage coverage$(PYTHON_VERSION))

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

# Tests need unittest-mixins and flaky just to run
# and several more to complete successfully
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += system/library
