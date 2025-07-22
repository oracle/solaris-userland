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

COMPILER =		gcc
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pygobject
COMPONENT_VERSION=	3.48.2
COMPONENT_PROJECT_URL=	https://pygobject.readthedocs.io/en/latest
COMPONENT_ARCHIVE_HASH= \
	sha256:00d956512f43a4782676eb04b25438b4b799e90273d8b805072dffc11a718c1e
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13158

COMPONENT_BAID=		163884
BUILD_STYLE=		meson

PKG_CONFIG_PATHS+=$(PYTHON_VENDOR_PACKAGES)/lib/pkgconfig/

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses configure.mk
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
$(BUILD_DIR)/%-3.9/.configured:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.configured:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.configured:		PYTHON_VERSION=3.13

BUILD_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
$(BUILD_DIR)/%-3.9/.built:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.built:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.built:		PYTHON_VERSION=3.13

INSTALL_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/%-3.9/.installed:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.installed:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.installed:		PYTHON_VERSION=3.13

TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)
$(BUILD_DIR)/%-3.9/.tested-and-compared:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.tested-and-compared:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.tested-and-compared:		PYTHON_VERSION=3.13

include $(WS_MAKE_RULES)/test-x11.mk

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# The build process modifies the shebang line to use the version of Python
# automatically found; to avoid using the current system default, one is
# explicitly specified here.
CONFIGURE_OPTIONS += -Dpython=$(PYTHON)
CONFIGURE_OPTIONS += -Dtests=true

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/python/pycairo
REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += runtime/python-313
