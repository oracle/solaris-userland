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
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

COMPILER=		gcc
CTF_MODE=		off	# Has no effect
BUILD_BITS=		64

include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		dulwich
COMPONENT_VERSION=	1.0.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3d07104735525f22bfec35514ac611cf328c89b7acb059316a4f6e583c8f09bc
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://www.dulwich.io/
COMPONENT_BUGDB=	python-mod/dulwich
COMPONENT_ANITYA_ID=	6077
COMPONENT_BAID=		366240


# This is necessary for vendored rust dependencies
include $(WS_MAKE_RULES)/cargo-vendored.mk
VENDORED_SOURCES_NAME = $(COMPONENT_SRC)-rust-sources

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)
COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo
COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

# make executables for each Python version
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRBINDIR)/dul-receive-pack $(PROTOUSRBINDIR)/dul-receive-pack$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/dul-upload-pack $(PROTOUSRBINDIR)/dul-upload-pack$(PYTHON_VERSION); \
	$(MV) $(PROTOUSRBINDIR)/dulwich $(PROTOUSRBINDIR)/dulwich$(PYTHON_VERSION);

# Testing environment must be clean
test: ENV += -i
system-test: ENV += -i

COMPONENT_TEST_ENV +=	PATH=$(GNUBIN):$(PATH)
COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	--ignore=contrib/test_swift_smoke.py

build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TEST_64)

REQUIRED_PACKAGES += $(PYVS:%=library/python/urllib3-%)
REQUIRED_PACKAGES += library/python/setuptools-rust
REQUIRED_PACKAGES += library/python/typing-extensions-311
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
