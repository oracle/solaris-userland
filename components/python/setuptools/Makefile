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

COMPONENT_NAME=		setuptools
COMPONENT_VERSION=	62.1.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:6623256258c883eb81e8f7d97e5b5ae91ae24df4efd2391eae3bbb259e2e4505
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pypa/setuptools
COMPONENT_BUGDB=	python-mod/setuptools
COMPONENT_ANITYA_ID=	4021
COMPONENT_BAID=		121661

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	44.1.1
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	v$(COMPONENT_VERSION_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:d8203b2425014dd7b15b95c69a41454a98c90e5383c6a23d518f61c2e3e86bfd
COMPONENT_ARCHIVE_URL_OLD= \
    https://github.com/pypa/setuptools/archive/$(COMPONENT_ARCHIVE_OLD)
COMPONENT_BAID_OLD=	106626


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Need to bootstrap setuptools before we can run setup (old version
# only; the new one no longer needs bootstrapping)
COMPONENT_PREP_ACTION = (cd $(SOURCE_DIR_OLD) ; $(PYTHON.2.7) bootstrap.py)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

# requires several components which are not in Solaris yet
test:		$(NO_TESTS)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
