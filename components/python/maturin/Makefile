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
# Copyright (c) 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk
COMPILER=	gcc

COMPONENT_NAME=		maturin
COMPONENT_VERSION=	1.7.8
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:649c6ef3f0fa4c5f596140d761dc5a4d577c485cc32fb5b9b344a8280352880d
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/pyo3/maturin
COMPONENT_BUGDB=	utility/maturin
COMPONENT_ANITYA_ID=	323858
COMPONENT_BAID=		190702

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:94a210dda8e43f47476885aeddd756400326f8319b458ed5cab907c5f656e8c5

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

REQUIRED_PACKAGES += library/python/tomli-39
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
