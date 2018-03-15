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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpeas
COMPONENT_VERSION=	1.20.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/Libpeas
COMPONENT_ARCHIVE_HASH=	\
	sha256:f392fffe2dc00072a51bb2a1b274224a06bdc5f9c3b3c0ac4816909e9933d354
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	6871

TPNO=			36125

include $(WS_MAKE_RULES)/gnome-component.mk

# Only build Python 2.7 support; most of GNOME still uses Python 2.x.  Building
# both would lead to the possibility of both Python runtimes being loaded into
# the same process space (not a good idea).
PYTHON_VERSIONS=2.7

CONFIGURE_ENV.32 += PYTHON=$(PYTHON.2.7.32)
CONFIGURE_ENV.64 += PYTHON=$(PYTHON.2.7.64)

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-gtk
CONFIGURE_OPTIONS += --enable-lua5.2
CONFIGURE_OPTIONS += --enable-python2
CONFIGURE_OPTIONS += --disable-python3
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Required due to patches.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

# for the tests
unexport SHELLOPTS
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
# Strip pids from test output, since they're always different
COMPONENT_TEST_TRANSFORMS += '-e "s% (pid=[0-9]*)%%"'
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TEST:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/documentation-tool/xmlto
REQUIRED_PACKAGES += developer/ui-designer/glade
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/lua/lgi-52
REQUIRED_PACKAGES += library/python/pygobject-3
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += runtime/python-27
