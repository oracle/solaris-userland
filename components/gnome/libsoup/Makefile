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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS= 32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libsoup
COMPONENT_VERSION=	2.72.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/libsoup
COMPONENT_ARCHIVE_HASH=	\
    sha256:170c3f8446b0f65f8e4b93603349172b1085fb8917c181d10962f02bb85f5387
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	11483

TPNO=			64827
BUILD_STYLE=		meson

# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)

CONFIGURE_OPTIONS += -Dsysprof=disabled
CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libsoup-2.4.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libsoup-2.4.3lib;

# for the tests
unexport SHELLOPTS
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "s|\s\+[0-9]\+\.[0-9]\+s||p" ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" ' \
        '-e "/The output from the failed tests:/q" '

# ssl-test fails due to new glib-networking with slightly different behavior
# and this know issue: https://gitlab.gnome.org/GNOME/libsoup/-/issues/120.

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib-networking
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-common
REQUIRED_PACKAGES += library/libpsl
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += text/gnu-gettext
