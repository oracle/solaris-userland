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
# Copyright (c) 2013, 2025, Oracle and/or its affiliates.
#

# Build requirements, needed before inclusion of shared-macros.
# Building for Python 3.7+ requires compiler to be gcc.
COMPILER=	gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		python-ldap
COMPONENT_VERSION=	3.4.4
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:7edb0accec4e037797705f3a05cbf36a9fde50d08c8f67f2aef99a2628fab828
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.python-ldap.org/
COMPONENT_BUGDB=	python-mod/python-ldap
COMPONENT_ANITYA_ID=	13261
COMPONENT_BAID=		327439


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

# Redact time taken, platform and plugins as version numbers are
# likely to change.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "/^platform sunos/d" ' \
	'-e "/^plugins: /d" ' \
	'-e "s|failed in .*[^=]|failed in REDACTED |" '
# Currently all version of python report the same results.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_ENV +=	PYTHONPATH=$(PROTO_DIR)/$(PYTHON_LIB)
# Update test PATH for slapd (/usr/lib) and slapadd, etc. (/usr/sbin).
COMPONENT_TEST_ENV +=	PATH=$(PATH):/usr/lib:/usr/sbin
COMPONENT_SYSTEM_TEST_ENV +=	PATH=$(PATH):/usr/lib:/usr/sbin

# Slapd has a limit on how long the domain socket path can be; we thus need to
# change the test directory path to a shorter one to get around this limitation.
COMPONENT_TEST_ENV +=	TMP=/tmp
COMPONENT_SYSTEM_TEST_ENV +=	TMP=/tmp

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:	$(SYSTEM_TEST_64)

# Package dependencies.
# ---------------------
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyasn1-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyasn1-modules-%)
REQUIRED_PACKAGES += system/network/ldap/openldap
