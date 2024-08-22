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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		orca
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Orca
COMPONENT_VERSION=	45.2
COMPONENT_ARCHIVE_HASH= \
       sha256:f0f2c579a5beedfe5653bc7fe24481c4d6aac5dd1f71c1e7a208595f3c78ef76
COMPONENT_BUGDB= 	gnome/accessibility
COMPONENT_ANITYA_ID=	13156

COMPONENT_BAID=	        175464

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU gettext & msgfmt are first in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

PYTHON_VERSION = 3.11
CONFIGURE_ENV += PYTHON="$(PYTHON)"
PKG_MACROS += PYVER="$(PYTHON_VERSION)" PYV="$(PYTHON_VERSION:3.%=3%)"

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON_VENDOR_PACKAGES)

REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/accessibility/brltty
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libwnck3
REQUIRED_PACKAGES += library/liblouis
REQUIRED_PACKAGES += library/python/pygobject-3-311
REQUIRED_PACKAGES += runtime/python-311
