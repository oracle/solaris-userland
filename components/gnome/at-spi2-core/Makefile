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
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		at-spi2-core
COMPONENT_VERSION=	2.50.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Accessibility
COMPONENT_ARCHIVE_HASH=	\
    sha256:5b81b1461a62dd8fbed1a276fa9ef5b7112f9ae5ff86e1e32ad9644b654ff78c
COMPONENT_BUGDB=	gnome/a11y-libs-core
COMPONENT_ANITYA_ID=	7841

COMPONENT_BAID=		171874
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk
include $(WS_MAKE_RULES)/test-x11.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
CONFIGURE_OPTIONS += -Ddbus_daemon=$(USRLIBDIR)/dbus-daemon
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled
CONFIGURE_OPTIONS.64 += -Dintrospection=enabled

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/at-spi-registryd.1 \
                $(PROTO_DIR)/usr/share/man/man1/at-spi-registryd.1;

COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
COMPONENT_TEST_TRANSFORMS += \
       '-n ' \
       '-e "/Ok: /p" ' \
       '-e "/Fail: /p" ' \
       '-e "/Pass: /p" ' \
       '-e "/Skipped: /p" ' \
       '-e "/Timeout: /p" '

REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxtst
