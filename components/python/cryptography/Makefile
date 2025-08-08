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
# Copyright (c) 2014, 2025, Oracle and/or its affiliates.
#

COMPILER =		gcc
CTF_MODE =		relaxed

# Component uses ABI3 naming.
PYTHON3_SOABI=abi3

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cryptography
COMPONENT_VERSION=	43.0.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:203e92a75716d8cfb491dc47c79e17d0d9207ccffcbcb35f598fbe463ae3444d
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://cryptography.io/
COMPONENT_BUGDB=	python-mod/cryptography
COMPONENT_ANITYA_ID=	5532
COMPONENT_BAID=		180165

# cryptography_vectors package is being used for testing only
# and is not delivered with cryptography
COMPONENT_NAME_VECTORS=		cryptography_vectors
COMPONENT_VERSION_VECTORS=	$(COMPONENT_VERSION)
COMPONENT_SRC_VECTORS=		$(COMPONENT_NAME_VECTORS)-$(COMPONENT_VERSION_VECTORS)
COMPONENT_ARCHIVE_VECTORS=	$(COMPONENT_SRC_VECTORS).tar.gz
COMPONENT_ARCHIVE_HASH_VECTORS=	\
	sha256:54cf7b9ded04aafc9b21dd83cf88c511300810167e940833c93b5f1d3542874c
COMPONENT_ARCHIVE_URL_VECTORS=	$(call pypi_url,VECTORS)


# This is necessary for vendored rust dependencies
include $(WS_MAKE_RULES)/cargo-vendored.mk
VENDORED_SOURCES_NAME = $(COMPONENT_SRC)-rust-sources
VENDORED_CARGO_LOCK_LOCATION = $(COMPONENT_SRC)/src/rust
COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--ignore=tests/bench
COMPONENT_TEST_ENV += \
	PYTHONPATH=$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES):$(SOURCE_DIR_VECTORS)
COMPONENT_SYSTEM_TEST_ENV += \
	PYTHONPATH=$(PYTHON_VENDOR_PACKAGES):$(SOURCE_DIR_VECTORS)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TEST_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/cffi-%)
REQUIRED_PACKAGES += developer/python/maturin
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
