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
COMPONENT_VERSION=	37.0.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:c1380f02ce9e1771bdbaa788c4d602a3e2456e291c81562dcf4c3dea9d844645
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://cryptography.io/
COMPONENT_BUGDB=	python-mod/cryptography
COMPONENT_ANITYA_ID=	5532
COMPONENT_BAID=		124574

# cryptography_vectors package is being used for testing only
# and is not delivered with cryptography
COMPONENT_NAME_VECTORS=		cryptography_vectors
COMPONENT_VERSION_VECTORS=	$(COMPONENT_VERSION)
COMPONENT_SRC_VECTORS=		$(COMPONENT_NAME_VECTORS)-$(COMPONENT_VERSION_VECTORS)
COMPONENT_ARCHIVE_VECTORS=	$(COMPONENT_SRC_VECTORS).tar.gz
COMPONENT_ARCHIVE_HASH_VECTORS=	\
	sha256:02dafd1955edf0060304b3aacc0c6a0411529c918274197beafff32fe3f92439
COMPONENT_ARCHIVE_URL_VECTORS=	$(call pypi_url,VECTORS)


# Python 3.9 is delivered with new, partially rust-based and OpenSSL 3 linked version.
COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	3.1.1
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
    sha256:9d9fc6a16357965d282dd4ab6531013935425d0dc4950df2e0cf2a1b1ac1017d
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=		96619

# cryptography_vectors package is being used for testing only
# and is not delivered with cryptography
COMPONENT_NAME_VECTORS_OLD=		$(COMPONENT_NAME_VECTORS)
COMPONENT_VERSION_VECTORS_OLD=	$(COMPONENT_VERSION_OLD)
COMPONENT_SRC_VECTORS_OLD=		$(COMPONENT_NAME_VECTORS_OLD)-$(COMPONENT_VERSION_VECTORS_OLD)
COMPONENT_ARCHIVE_VECTORS_OLD=	$(COMPONENT_SRC_VECTORS_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_VECTORS_OLD=	\
	sha256:3f1d119b716f3dae1c120804f947fa3fde222aa11cf049a1ee3b2302d760583b
COMPONENT_ARCHIVE_URL_VECTORS_OLD=	$(call pypi_url,VECTORS_OLD)


# This is necessary for vendored rust dependencies
include $(WS_MAKE_RULES)/cargo-vendored.mk
VENDORED_SOURCES_NAME = $(COMPONENT_SRC)-rust-sources
VENDORED_CARGO_LOCK_LOCATION = $(COMPONENT_SRC)/src/rust

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Convenience variables
TARGET_27 = $(BUILD_DIR)/%-2.7/
TARGET_37 = $(BUILD_DIR)/%-3.7/
TARGET_39 = $(BUILD_DIR)/%-3.9/

SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# OpenSSL 3 temporarily lives in non-standard directory.
$(TARGET_39).built: CFLAGS += -I/usr/openssl/3/include
$(TARGET_39).built: LDFLAGS += -L/usr/openssl/3/lib/$(BITS)
$(TARGET_39).built: COMPONENT_BUILD_ENV += LDFLAGS="$(LDFLAGS)"
$(TARGET_39).built: COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo
$(TARGET_39).built: COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)
$(TARGET_39).installed: COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

# Targets updated for older version build
$(TARGET_27).built: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)
$(TARGET_27).system-tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)
$(TARGET_37).system-tested: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).tested: SOURCE_DIR_VECTORS = $(SOURCE_DIR_VECTORS_OLD)
$(TARGET_37).tested: SOURCE_DIR_VECTORS = $(SOURCE_DIR_VECTORS_OLD)
$(TARGET_27).system-tested: SOURCE_DIR_VECTORS = $(SOURCE_DIR_VECTORS_OLD)
$(TARGET_37).system-tested: SOURCE_DIR_VECTORS = $(SOURCE_DIR_VECTORS_OLD)

$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_BAID = $(COMPONENT_BAID_OLD)
$(MANIFEST_BASE)-%-37.mogrified: COMPONENT_BAID = $(COMPONENT_BAID_OLD)

# Make sure that prep is always executed correctly and entirely (see 34726564).
build install publish test: prep

# Manifest convenience variables.
NEW_ONLY = \#
OLD_ONLY =
$(MANIFEST_BASE)-cryptography-39.mogrified: NEW_ONLY =
$(MANIFEST_BASE)-cryptography-39.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)cryptography-.7@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-cryptography.mogrified \
		> $(MANIFEST_BASE)-cryptography.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-cryptography.mogrified-fixed \
		$(MANIFEST_BASE)-cryptography.mogrified

$(MANIFEST_BASE)-cryptography.mangled: FIX_MANIFEST_VERSIONS


COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--ignore=tests/bench
COMPONENT_TEST_ENV += \
	PYTHONPATH=$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE):$(SOURCE_DIR_VECTORS)
COMPONENT_SYSTEM_TEST_ENV += \
	PYTHONPATH=$(PYTHON_VENDOR_PACKAGES_BASE):$(SOURCE_DIR_VECTORS)

# common targets
build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TEST_32_and_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/cffi-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/six-%)
REQUIRED_PACKAGES += library/python/enum-27
REQUIRED_PACKAGES += library/python/ipaddress-27
REQUIRED_PACKAGES += library/python/setuptools-rust
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime

# Testing related components
REQUIRED_PACKAGES += library/python/iso8601
REQUIRED_PACKAGES += library/python/pytz
