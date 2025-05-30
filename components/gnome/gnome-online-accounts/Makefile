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

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-online-accounts
COMPONENT_VERSION=	3.40.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GnomeOnlineAccounts
COMPONENT_ARCHIVE_HASH= \
	sha256:955a03128d0e87855d34d7c534e088f6286ed7ac01baa4ef824ef42a2cb39aad
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	10943

COMPONENT_BAID=		115243

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

LD_OPTIONS += -lresolv

# Doesn't build currently; conflicts between Solaris krb5.h and p11-kit.
CONFIGURE_OPTIONS += --disable-kerberos
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-exchange
CONFIGURE_OPTIONS += --enable-documentation
CONFIGURE_OPTIONS += --enable-gtk-doc
# This requires webkitgtk and is used for the online accounts registration
CONFIGURE_OPTIONS += --disable-backend
# Required for other components.
CONFIGURE_OPTIONS += --enable-introspection
CONFIGURE_OPTIONS += --enable-facebook
CONFIGURE_OPTIONS += --enable-flickr
CONFIGURE_OPTIONS += --enable-google
CONFIGURE_OPTIONS += --enable-imap-smtp
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --enable-windows-live
CONFIGURE_OPTIONS += --with-pic

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
