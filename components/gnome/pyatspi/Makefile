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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pyatspi
COMPONENT_VERSION=	2.46.1
COMPONENT_PROJECT_URL=	\
	https://wiki.linuxfoundation.org/accessibility/atk/at-spi/at-spi_on_d-bus
COMPONENT_ARCHIVE_HASH= \
       sha256:f91f6a57434e9c07d13d5c4bf819dd78e8ee605aac2ae45d8c64c28114fb041b
COMPONENT_BUGDB=	gnome/a11y-libs-core
COMPONENT_ANITYA_ID=	13157

COMPONENT_BAID=		163473

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses configure.mk
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
$(BUILD_DIR)/%-3.11/.configured:           PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.configured:           PYTHON_VERSION=3.13

BUILD_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
$(BUILD_DIR)/%-3.11/.built:         PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.built:         PYTHON_VERSION=3.13

INSTALL_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/%-3.11/.installed:            PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.installed:            PYTHON_VERSION=3.13

TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)
$(BUILD_DIR)/%-3.11/.tested-and-compared:         PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.tested-and-compared:         PYTHON_VERSION=3.13

# Test transforms retain only relevant results output.
COMPONENT_TEST_TRANSFORMS += \
       '-n ' \
       '-e "/TOTAL: /p" ' \
       '-e "/PASS: /p" ' \
       '-e "/SKIP: /p" ' \
       '-e "/FAIL: /p" ' \
       '-e "/ERROR: /p" ' \

COMPONENT_TEST_MASTER = \
        $(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master

include $(WS_MAKE_RULES)/gnome-component.mk
include $(WS_MAKE_RULES)/test-x11.mk

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-tests
CONFIGURE_OPTIONS += --with-python=$(PYTHON)

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON_VENDOR_PACKAGES)

REQUIRED_PACKAGES += library/python/pygobject-3
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += runtime/python-313

# These are needed to build & run tests, but not for distributed packages
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/python/dbus-python
REQUIRED_PACKAGES += system/library/libdbus
