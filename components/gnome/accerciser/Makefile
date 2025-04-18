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

COMPONENT_NAME=		accerciser
COMPONENT_VERSION=	3.42.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Accerciser
COMPONENT_ARCHIVE_HASH= \
	sha256:7769bd4f4f63dc89a143e86cdc44feaebd7f8c969bea5c1f5a86ac9311902f48
COMPONENT_BUGDB= 	gnome/accessibility
COMPONENT_ANITYA_ID=	13116

COMPONENT_BAID=		154469

# The unit tests failed to start.
$(SKIP_TEST_AT_TOP_LEVEL)

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

# plugins are not compiled automatically
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)$(USRSHAREDIR)/accerciser/plugins/*.py ; \
	$(PYTHON) -m compileall $(PROTO_DIR)$(USRSHAREDIR)/accerciser/plugindata/validate/basic.py ;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# msgfmt may or may not be run depending on previous state of build dir
COMPONENT_TEST_TRANSFORMS += "-e '/\/usr\/gnu\/bin\/msgfmt/d'"

REQUIRED_PACKAGES += developer/documentation-tool/itstool
REQUIRED_PACKAGES += image/library/librsvg
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libwnck3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/python/pyatspi2-311
REQUIRED_PACKAGES += library/python/pycairo-311
REQUIRED_PACKAGES += library/python/pygobject-3-311
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += text/gnu-gettext
