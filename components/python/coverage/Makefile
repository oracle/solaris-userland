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

include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		coverage
COMPONENT_VERSION=	5.5
COMPONENT_PROJECT_URL=	http://nedbatchelder.com/code/coverage/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:96a3b9f1a660406f3f2495cd8428978db2e2e9c722d77ca94fd218ea61674b6e
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/coverage
COMPONENT_ANITYA_ID=	3811

TPNO=			70901

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
