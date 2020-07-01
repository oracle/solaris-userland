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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
COMPILER =		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dbus-python
COMPONENT_VERSION=	1.2.8
COMPONENT_PROJECT_URL=	http://dbus.freedesktop.org
COMPONENT_ARCHIVE_HASH= \
    sha256:abf12bbb765e300bf8e2a1b2f32f85949eab06998dbda127952c31cb63957b6f
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/dbus
COMPONENT_ANITYA_ID=	402

TPNO=			52290

# This component is not yet built for Python 3.9
PYTHON_VERSIONS = $(WITHOUT_PYTHON3.9)

PKG_PROTO_DIRS += $(SOURCE_DIR)/doc/

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses configure instead
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
BUILD_64     = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
INSTALL_64   = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
TEST_64	     = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)

# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)

$(foreach pyver, $(PYTHON_VERSIONS), \
  $(eval $(BUILD_DIR)/%-$(pyver)/.configured:          PYTHON_VERSION=$(pyver)) \
  $(eval $(BUILD_DIR)/%-$(pyver)/.built:               PYTHON_VERSION=$(pyver)) \
  $(eval $(BUILD_DIR)/%-$(pyver)/.installed:           PYTHON_VERSION=$(pyver)) \
  $(eval $(BUILD_DIR)/%-$(pyver)/.tested-and-compared: PYTHON_VERSION=$(pyver)) \
)

# This is needed for 32 bit variant of dbus-python
PYTHON_VERSION = 2.7

$(BUILD_DIR)/$(MACH64)-%/.configured:		BITS=64
$(BUILD_DIR)/$(MACH64)-%/.built:		BITS=64
$(BUILD_DIR)/$(MACH64)-%/.installed:		BITS=64
$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared:	BITS=64

PYTHON_MAJOR = $(basename $(PYTHON_VERSION))

COMPONENT_TEST_OUTPUT = \
    $(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-$(BITS)-results
COMPONENT_TEST_DIFFS = \
    $(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-$(BITS)-diffs
COMPONENT_TEST_SNAPSHOT = \
    $(COMPONENT_TEST_BUILD_DIR)/results-$(PYTHON_VERSION)-$(BITS).snapshot
COMPONENT_TEST_TRANSFORM_CMD = \
    $(COMPONENT_TEST_BUILD_DIR)/transform-$(PYTHON_VERSION)-$(BITS)-results
COMPONENT_TEST_MASTER = \
    $(COMPONENT_TEST_RESULTS_DIR)/results-py$(PYTHON_MAJOR).master

include $(WS_MAKE_RULES)/common.mk

# Need to replace the py-compile in the 1.2.0 tarball with the one from a
# newer version of automake in order to output *pyc to the right paths for
# Python 3.5
COMPONENT_PREP_ACTION += (cd $(@D); rm -f py-compile ; autoreconf -fiv);

CONFIGURE_OPTIONS += PYTHON="$(PYTHON)"
CONFIGURE_OPTIONS += --disable-dependency-tracking

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES_BASE)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON.$(PYTHON_VERSION).VENDOR_PACKAGES)

COMPONENT_TEST_ENV +=   PYTHONPATH=$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)

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
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += runtime/python-35
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/libdbus-glib
