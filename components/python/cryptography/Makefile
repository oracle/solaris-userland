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
# Copyright (c) 2014, 2021, Oracle and/or its affiliates.
#

COMPILER=		gcc

# Component uses ABI3 naming.
PYTHON3_SOABI=abi3

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cryptography
COMPONENT_VERSION=	2.5
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:4946b67235b9d2ea7d31307be9d5ad5959d6c4a8f98f900157b47abddf698401
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://cryptography.io/
COMPONENT_BUGDB=	python-mod/cryptography
COMPONENT_ANITYA_ID=	5532

TPNO=			49366

# cryptography_vectors package is being used for testing only
# and is not delivered with cryptography
COMPONENT_NAME_VECTORS=		cryptography_vectors
COMPONENT_VERSION_VECTORS=	$(COMPONENT_VERSION)
COMPONENT_SRC_VECTORS=		$(COMPONENT_NAME_VECTORS)-$(COMPONENT_VERSION_VECTORS)
COMPONENT_ARCHIVE_VECTORS=	$(COMPONENT_SRC_VECTORS).tar.gz
COMPONENT_ARCHIVE_HASH_VECTORS=	\
	sha256:949f1fb3d1cf5430cab6aa24980347eade966a128d9bedf0b57af28bad8c0265
COMPONENT_ARCHIVE_URL_VECTORS=	$(call pypi_url,VECTORS)


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Use the CFFI version in the gate because if the CFFI version changes
# everything using CFFI will break.
CFFI = $(WS_COMPONENTS)/python/cffi/build/prototype/$(MACH)/$(PYTHON_LIB)

COMPONENT_BUILD_ENV +=		PYTHONPATH=$(CFFI)
COMPONENT_INSTALL_ENV +=	PYTHONPATH=$(CFFI)

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =
COMPONENT_TEST_ENV += \
	PYTHONPATH=$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE):$(SOURCE_DIR_VECTORS)
COMPONENT_SYSTEM_TEST_ENV += \
	PYTHONPATH=$(PYTHON_VENDOR_PACKAGES_BASE):$(SOURCE_DIR_VECTORS)

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)

REQUIRED_PACKAGES += library/python/asn1crypto
REQUIRED_PACKAGES += library/python/cffi
REQUIRED_PACKAGES += library/python/enum
REQUIRED_PACKAGES += library/python/ipaddress
REQUIRED_PACKAGES += library/python/six
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += system/library

# Testing related components
REQUIRED_PACKAGES += library/python/iso8601
REQUIRED_PACKAGES += library/python/pytz
