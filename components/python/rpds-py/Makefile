#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2026, Oracle and/or its affiliates.
#

CTF_MODE =      off # Has no effect

include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		rpds_py
COMPONENT_VERSION=	2026.9.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:1c25a842461fce913c18369b75563502816f93ff1c34990de04826b9305fd896
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/crate-py/rpds
COMPONENT_BUGDB=	python-mod/rpds-py
COMPONENT_ANITYA_ID=	330423
COMPONENT_BAID=		462956

# hash for vendored rust sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:11893f632327b5b50d87ff7371c68b44c4e909ba044c8be125adbed053cd76ca

# This is necessary for vendored rust dependencies
include $(WS_MAKE_RULES)/cargo-vendored.mk
VENDORED_SOURCES_NAME = $(COMPONENT_SRC)-rust-sources

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)
COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo
COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TEST_64)

CBE_PACKAGES += developer/python/maturin

REQUIRED_PACKAGES += $(PYVS:%=runtime/python-%)
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
