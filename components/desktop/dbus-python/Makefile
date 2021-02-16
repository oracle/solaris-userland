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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =		64
COMPILER =		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dbus-python
COMPONENT_VERSION=	1.2.16
COMPONENT_PROJECT_URL=	http://dbus.freedesktop.org
COMPONENT_ARCHIVE_HASH= \
    sha256:2039b50e8072c78b81ba77d29608bc4dec89302cbe9b4762cd29cb66536d342b
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/dbus
COMPONENT_ANITYA_ID=	402

TPNO=			65103

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

# Do not transform .so files to include standard Python 3 ABI version tag.
PY3_CPYTHON_NAMING = \#

PKG_PROTO_DIRS += $(SOURCE_DIR)/doc/

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses configure instead
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
BUILD_64     = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
INSTALL_64   = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
TEST_64	     = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)

$(foreach pyver, $(PYTHON_VERSIONS), \
  $(eval $(BUILD_DIR)/%-$(pyver)/.configured:          PYTHON_VERSION=$(pyver)) \
  $(eval $(BUILD_DIR)/%-$(pyver)/.built:               PYTHON_VERSION=$(pyver)) \
  $(eval $(BUILD_DIR)/%-$(pyver)/.installed:           PYTHON_VERSION=$(pyver)) \
  $(eval $(BUILD_DIR)/%-$(pyver)/.tested-and-compared: PYTHON_VERSION=$(pyver)) \
)

COMPONENT_TEST_BUILD_DIR = \
    $(BUILD_DIR)/test/$(MACH$(BITS))-$(PYTHON_VERSION)
COMPONENT_TEST_OUTPUT = \
    $(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-$(BITS)-results
COMPONENT_TEST_DIFFS = \
    $(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-$(BITS)-diffs
COMPONENT_TEST_SNAPSHOT = \
    $(COMPONENT_TEST_BUILD_DIR)/results-$(PYTHON_VERSION)-$(BITS).snapshot
COMPONENT_TEST_TRANSFORM_CMD = \
    $(COMPONENT_TEST_BUILD_DIR)/transform-$(PYTHON_VERSION)-$(BITS)-results
COMPONENT_TEST_MASTER = \
    $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += PYTHON="$(PYTHON)"
CONFIGURE_OPTIONS += --disable-dependency-tracking

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES_BASE)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON_VENDOR_PACKAGES_BASE)

COMPONENT_TEST_ENV +=   PYTHONPATH=$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)
# necessary due to 'dbus-daemon' executable
COMPONENT_TEST_ENV +=   PATH=$(PATH):$(USRLIB.32)

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

# Standard automake test framework results transform
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL/p" ' \
        '-e "/SKIP/p" ' \
        '-e "/PASS/p" ' \
        '-e "/FAIL/p" ' \
        '-e "/ERROR/p" '

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/libdbus-glib
