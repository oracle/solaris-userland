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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk
BUILD_STYLE=            meson

COMPONENT_NAME=		libnotify
COMPONENT_VERSION=	0.8.3
COMPONENT_PROJECT_URL=	https://developer.gnome.org/libnotify/
COMPONENT_ARCHIVE_HASH=	\
	sha256:ee8f3ef946156ad3406fdf45feedbdcd932dbd211ab4f16f75eba4f36fb2f6c0
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13149

COMPONENT_BAID=		152515

# Tests do not work on Solaris yet
TEST_TARGET= $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk
LDFLAGS += -Wl,-zgnu-version-script-compat

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Required for other components.
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled
CONFIGURE_OPTIONS.64 += -Dintrospection=enabled

CONFIGURE_OPTIONS += -Dman=false
# Requires gi-docgen
CONFIGURE_OPTIONS += -Dgtk_doc=false
CONFIGURE_OPTIONS += -Ddefault_library=shared

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/documentation-tool/xmlto
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
