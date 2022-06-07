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
# Copyright (c) 2012, 2022, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		PrettyTable
COMPONENT_VERSION=	3.3.0
COMPONENT_SRC=		prettytable-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:57c3f434ad14cc8983a2072d860e5f1594215f1e516b1e4190427c56b44f8fd4
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://code.google.com/p/prettytable/
COMPONENT_BUGDB=	python-mod/prettytable
COMPONENT_ANITYA_ID=	19994
COMPONENT_BAID=		122947

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

# Non-ascii symbols can break the depthlimiter.py when ran with
# Python 3.7+ unless UTF-8 locale is set (see bug 31983111):
COMPONENT_PUBLISH_ENV  +=	LC_ALL=en_US.UTF-8

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/wcwidth-%)
REQUIRED_PACKAGES += library/python/importlib-metadata-37
