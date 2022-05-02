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
# Copyright (c) 2013, 2022, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		beautifulsoup4
COMPONENT_VERSION=	4.11.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e575792b4b9b83d1b168e999be70ed497e9d1b0d4c579e8cdc7d033eee0dd71e
COMPONENT_ARCHIVE_URL=	\
    https://www.crummy.com/software/BeautifulSoup/bs4/download/4.11/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://pypi.python.org/pypi/beautifulsoup4
COMPONENT_BUGDB=	python-mod/beautifulsoup4
COMPONENT_ANITYA_ID=	3779
COMPONENT_BAID=		121754

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	4.9.3
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:41623f60fe6d1c21fb2a9682b84b5deaeb0c8a7a8e4f305dda6569d458576911
COMPONENT_ARCHIVE_URL_OLD= \
    https://www.crummy.com/software/BeautifulSoup/bs4/download/4.9/$(COMPONENT_ARCHIVE_OLD)
COMPONENT_BAID_OLD=	107598

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

COMPONENT_TEST_DIR =	$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)/bs4/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
