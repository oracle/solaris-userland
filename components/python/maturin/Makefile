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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

COMPILER =		gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		maturin
COMPONENT_VERSION=	1.9.6
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:2c2ae37144811d365509889ed7220b0598487f1278c2441829c3abf56cc6324a
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pyo3/maturin
COMPONENT_BUGDB=	utility/maturin
COMPONENT_ANITYA_ID=	323858
COMPONENT_BAID=		354112

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:6aebff4594e9c66e51566266a5bf782731a0514716e25dfd8a25cac2f5a8b610

# This is necessary for vendored rust dependencies
include $(WS_MAKE_RULES)/cargo-vendored.mk
VENDORED_SOURCES_NAME = $(COMPONENT_SRC)-rust-sources
COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo
COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(NO_TESTS)

REQUIRED_PACKAGES += library/python/setuptools-rust
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
