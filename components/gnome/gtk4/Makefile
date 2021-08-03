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
# Copyright (c) 2021, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS =		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gtk4
COMPONENT_VERSION=	4.3.0
COMPONENT_PROJECT_URL=	https://www.gtk.org/
COMPONENT_SRC=		gtk-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_HASH=	\
    sha256:1f6ddacb549c80923e6a0600c2a795b38add73f75dc0d0780cdf8bad59589c19
COMPONENT_ARCHIVE_URL=	https://download.gnome.org/sources/gtk/4.3/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/gtk+
COMPONENT_ANITYA_ID=	13942

TPNO=			71203
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk
include $(WS_MAKE_RULES)/test-x11.mk

CONFIGURE_OPTIONS += -Dwayland-backend=false
CONFIGURE_OPTIONS += -Dman-pages=true

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_TEST_TRANSFORMS += \
        '-e "s/seed:[0-9]*/seed:/"'
# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9]*[0-9].[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += '-e "s/OK      [0-9]//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH64).master

REQUIRED_PACKAGES += image/library/librsvg
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/fribidi
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/graphene
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/librest
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libepoxy
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxdamage
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxrandr
