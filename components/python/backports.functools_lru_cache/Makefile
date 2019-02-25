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
# Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		backports.functools_lru_cache
COMPONENT_VERSION=	1.5
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:9d98697f088eb1b0fa451391f91afb5e3ebde16bbdb272819fd091151fda4f1a
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://pypi.org/project/backports.functools_lru_cache/
COMPONENT_BUGDB=	python-mod/backports.functools_lru_cache
COMPONENT_ANITYA_ID=	12085

TPNO=			45196

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_ARGS =
COMPONENT_TEST_CMD =	py.test-$(PYTHON_VERSION)
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
  '-e "s/\(in \).*\(seconds\)/\1 x \2/"' \
  '-e "/^platform/d"'

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)
