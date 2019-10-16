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
# Copyright (c) 2013, 2019, Oracle and/or its affiliates. All rights reserved.
#

# Build requirements, needed before inclusion of shared-macros.
# Building for Python 3.7 requires compiler to be gcc.
COMPILER=	gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		python-ldap
COMPONENT_VERSION=	3.2.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:7d1c4b15375a533564aad3d3deade789221e450052b21ebb9720fb822eccdb8e
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.python-ldap.org/
COMPONENT_BUGDB=	python-mod/python-ldap
COMPONENT_ANITYA_ID=	13261

TPNO=			52715

# Building for Python 2.7 and 3.7 only. Ref ../../make-rules/shared-macros.mk
PYTHON_VERSIONS=	3.7 2.7

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

# See README-TESTING.md for details on how to run provided tests and
# a possible future addition to this Makefile.
test:		$(NO_TESTS)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

# Package dependencies.
# ---------------------
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += library/python/pyasn1
REQUIRED_PACKAGES += library/python/pyasn1-modules
REQUIRED_PACKAGES += system/network/ldap/openldap
