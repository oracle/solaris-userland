
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

COMPONENT_NAME=		gnome-desktop
COMPONENT_VERSION=	3.34.0
COMPONENT_PROJECT_URL= 	https://developer.gnome.org/gnome-desktop/
COMPONENT_ARCHIVE_HASH=	\
	sha256:8d331ee655c1d56b2b97562a07c7a7598ff6706a11ff1cdce97423ebc6b62426
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13127

TPNO=			54037
BUILD_STYLE=		meson

# Tests do not pass because of insufficient gsed filtering.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += -Dgnome-distributor=Oracle
CONFIGURE_OPTIONS += --libexecdir=$(USRLIB.$(BITS))
LDFLAGS += -z gnu-version-script-compat

# Assumes GNU versions of various utilities in PATH (e.g. msgfmt).
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgnome-desktop-3.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgnome-desktop-3.3lib;

# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TARGETS += ; cd tests; ./wall-clock;
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/yelp-tools
REQUIRED_PACKAGES += library/gnome/yelp-xsl
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
