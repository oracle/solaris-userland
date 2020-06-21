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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk
BUILD_STYLE=               meson

COMPONENT_NAME=		libpeas
COMPONENT_VERSION=	1.24.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/Libpeas
COMPONENT_ARCHIVE_HASH=	\
    sha256:0b9a00138c129a663de3eef5569b00ace03ce31d345f7af783768e9f35c8e6f9
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	6871

TPNO=			54122

include $(WS_MAKE_RULES)/gnome-component.mk

# build Python 3.7 support
PYTHON_VERSIONS=3.7
CONFIGURE_ENV += PYTHON=$(PYTHON)

CONFIGURE_OPTIONS += -Dpython2=false
CONFIGURE_OPTIONS += -Dpython3=true

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# for the tests
unexport SHELLOPTS
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/ok/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/documentation-tool/xmlto
REQUIRED_PACKAGES += developer/ui-designer/glade
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/lua/lgi-54
REQUIRED_PACKAGES += library/python/pygobject-3
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += runtime/python-37
