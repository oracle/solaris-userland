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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=		64_and_32
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		glade
COMPONENT_VERSION=	3.22.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Glade
COMPONENT_ARCHIVE_HASH= \
	sha256:dff89a2ef2eaf000ff2a46979978d03cb9202cb04668e01d0ea5c5bb5547e39a
COMPONENT_BUGDB=	gnome/libglade
COMPONENT_ANITYA_ID=	1174

TPNO=			54028

# Requires a display
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk

# Use explicit Python version rather than the default one
CONFIGURE_ENV += PYTHON=$(PYTHON.2.7)

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += --enable-gtk-doc
CONFIGURE_OPTIONS += --enable-gtk-doc-html
CONFIGURE_OPTIONS += --enable-gladeui

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/webkitgtk4
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/python/pygobject-27
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += system/library/math
