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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS = 64_and_32
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		glib-networking
COMPONENT_VERSION=	2.62.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GLib
COMPONENT_ARCHIVE_HASH=	\
    sha256:9321685f7956df74acb54785a6b9e1013ed1546c193a153100798007b67afbdc
COMPONENT_BUGDB=	gnome/glib
COMPONENT_ANITYA_ID=	10024

TPNO=			54029
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += --libexecdir=$(CONFIGURE_LIBDIR.$(BITS))

# for the tests
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Fail:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-common
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libproxy
REQUIRED_PACKAGES += text/gnu-gettext
