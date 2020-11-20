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

# gobject-introspection bindings are only built correctly for gtk when building
# with gcc, this would otherwise build with Studio.
COMPILER =		gcc
BUILD_BITS =		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pygobject
COMPONENT_VERSION=	3.38.0
COMPONENT_PROJECT_URL=	https://pygobject.readthedocs.io/en/latest
COMPONENT_ARCHIVE_HASH= \
	sha256:0372d1bb9122fc19f500a249b1f38c2bb67485000f5887497b4b205b3e7084d5
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13158

TPNO=			63377
BUILD_STYLE=		meson

PYTHON_VERSIONS=	$(PYTHON3_VERSIONS)

PKG_CONFIG_PATHS+=$(PYTHON_VENDOR_PACKAGES_BASE)/lib/pkgconfig/

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses configure.mk
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
$(BUILD_DIR)/%-3.7/.configured:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.configured:		PYTHON_VERSION=3.9

BUILD_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
$(BUILD_DIR)/%-3.7/.built:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.built:		PYTHON_VERSION=3.9

INSTALL_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/%-3.7/.installed:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.installed:		PYTHON_VERSION=3.9

TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)
$(BUILD_DIR)/%-3.7/.tested-and-compared:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.tested-and-compared:		PYTHON_VERSION=3.9

include $(WS_MAKE_RULES)/test-x11.mk

COMPONENT_TEST_TRANSFORMS += '-n -e "/:/p"'

include $(WS_MAKE_RULES)/gnome-component.mk

# The build process modifies the shebang line to use the version of Python
# automatically found; to avoid using the current system default, one is
# explicitly specified here.
CONFIGURE_OPTIONS += -Dpython=$(PYTHON)
CONFIGURE_OPTIONS += -Dtests=true

# Move into vendor-packages and pycompile all python sources
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/site-packages \
		$(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages; \
	$(PYTHON) -m compileall $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/python/pycairo
# Pyflakes is needed for tests, but not build or install
REQUIRED_PACKAGES += library/python/pyflakes
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += runtime/python-39
