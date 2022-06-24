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

# Even though the component is pure python, some
# tests compilate non pure extensions.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		virtualenv
COMPONENT_VERSION=	20.16.5
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:554609a339c7d15b21dceb191938c57d06d17067224c7e891a1ff13dfba312cc
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pypa/virtualenv
COMPONENT_BUGDB=	python-mod/virtualenv
COMPONENT_ANITYA_ID=	6904
COMPONENT_BAID=		129917

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	16.7.10
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:92f8fece996e62f97b6e56ee878a3f9c978781f59ab22bccdd0ab3e457371c33
COMPONENT_ARCHIVE_URL_OLD= $(call pypi_url,OLD)
COMPONENT_BAID_OLD=	77545

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

# Tests require a network access.
$(SKIP_TEST_AT_TOP_LEVEL)

COMPONENT_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)
COMPONENT_SYSTEM_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

COMPONENT_POST_INSTALL_ACTION +=	\
    (cd $(PROTO_DIR)/usr/bin; $(MV) virtualenv virtualenv-$(PYTHON_VERSION))

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_64)

system-test:	$(SYSTEM_TEST_64)

REQUIRED_PACKAGES += $(PYVS3:%=library/python/distlib-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/filelock-%)
REQUIRED_PACKAGES += library/python/importlib-metadata-37

# Testing related components
REQUIRED_PACKAGES += library/python/mock
