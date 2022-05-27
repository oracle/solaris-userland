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

COMPILER=		gcc

# Component uses ABI3 naming.
PYTHON3_SOABI=abi3

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cryptography
COMPONENT_VERSION=	3.1.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:9d9fc6a16357965d282dd4ab6531013935425d0dc4950df2e0cf2a1b1ac1017d
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://cryptography.io/
COMPONENT_BUGDB=	python-mod/cryptography
COMPONENT_ANITYA_ID=	5532
COMPONENT_BAID=		96619

# cryptography_vectors package is being used for testing only
# and is not delivered with cryptography
COMPONENT_NAME_VECTORS=		cryptography_vectors
COMPONENT_VERSION_VECTORS=	$(COMPONENT_VERSION)
COMPONENT_SRC_VECTORS=		$(COMPONENT_NAME_VECTORS)-$(COMPONENT_VERSION_VECTORS)
COMPONENT_ARCHIVE_VECTORS=	$(COMPONENT_SRC_VECTORS).tar.gz
COMPONENT_ARCHIVE_HASH_VECTORS=	\
	sha256:3f1d119b716f3dae1c120804f947fa3fde222aa11cf049a1ee3b2302d760583b
COMPONENT_ARCHIVE_URL_VECTORS=	$(call pypi_url,VECTORS)


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

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
