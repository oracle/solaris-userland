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
# Copyright (c) 2014, 2022, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		testtools
COMPONENT_VERSION=	2.5.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:ee09d3ac2a77e0199c1577f2d9b35caa796e353e23dde98ca8c7ff31d97cbc78
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/testing-cabal/testtools
COMPONENT_BUGDB=	python-mod/testtools
COMPONENT_ANITYA_ID=	4047
COMPONENT_BAID=		118738

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	2.4.0
COMPONENT_SRC_OLD=	$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD= \
    sha256:f5d6c29ae321e78249b33693b4eb08d2cdedb10c94417cf64eb56685963a8c61
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	91399

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

REQUIRED_PACKAGES += $(PYVS:%=library/python/pbr-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/extras-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/fixtures-%)
REQUIRED_PACKAGES += library/python/six-27
