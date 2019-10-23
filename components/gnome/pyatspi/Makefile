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

BUILD_BITS =		32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pyatspi
COMPONENT_VERSION=	2.34.0
COMPONENT_PROJECT_URL=	\
	https://wiki.linuxfoundation.org/accessibility/atk/at-spi/at-spi_on_d-bus
COMPONENT_ARCHIVE_HASH= \
       sha256:97bc5248cc376348ad5cf8a2e9929d3847a7710ad99fa72b52ccb40f64396e48
COMPONENT_BUGDB=	gnome/a11y-libs-core
COMPONENT_ANITYA_ID=	13157

TPNO=		        56714

# This is needed for 32 bit variant of pyatspi
PYTHON_VERSION = 2.7

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses configure.mk
CONFIGURE_64 += $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
$(BUILD_DIR)/%-2.7/.configured:		PYTHON_VERSION=2.7
$(BUILD_DIR)/%-3.5/.configured:		PYTHON_VERSION=3.5
$(BUILD_DIR)/%-3.7/.configured:		PYTHON_VERSION=3.7
$(BUILD_DIR)/$(MACH64)-%/.configured:	BITS=64

BUILD_64 += $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
$(BUILD_DIR)/%-2.7/.built:		PYTHON_VERSION=2.7
$(BUILD_DIR)/%-3.5/.built:		PYTHON_VERSION=3.5
$(BUILD_DIR)/%-3.7/.built:		PYTHON_VERSION=3.7
$(BUILD_DIR)/$(MACH64)-%/.built:	BITS=64

INSTALL_64 += $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/%-2.7/.installed:		PYTHON_VERSION=2.7
$(BUILD_DIR)/%-3.5/.installed:		PYTHON_VERSION=3.5
$(BUILD_DIR)/%-3.7/.installed:		PYTHON_VERSION=3.7
$(BUILD_DIR)/$(MACH64)-%/.installed:	BITS=64

# Tests require dbus python module, which we don't have for python3 yet
TEST_TARGET= $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += --disable-static
# Tests require dbus python module, which we don't have for python3 yet
CONFIGURE_OPTIONS += --disable-tests
CONFIGURE_OPTIONS += --with-python=$(PYTHON)

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON_VENDOR_PACKAGES)

# Make install path match what autopyc transforms look for
COMPONENT_POST_INSTALL_ACTION += \
     case "$(PYTHON_VERSION)" in \
	3.*) $(SYMLINK) 64/pyatspi $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)/pyatspi ;; \
     esac ;

REQUIRED_PACKAGES += library/python/pygobject-3
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += runtime/python-35
REQUIRED_PACKAGES += runtime/python-37

# These are needed to build & run tests, but not for distributed packages
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/python/dbus-python
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/libdbus-glib
