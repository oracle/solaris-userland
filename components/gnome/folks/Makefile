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

COMPONENT_NAME=		folks
COMPONENT_VERSION=	0.13.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Folks
COMPONENT_ARCHIVE_HASH= \
	sha256:3df1c663b82fe211aead2b31cae1fc41d124e85436375762f6745c45ba46aa5d
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13121

TPNO=			54020
BUILD_STYLE=            meson

include $(WS_MAKE_RULES)/gnome-component.mk

# __EXTENSIONS__ required for various non-standard function usages.
CFLAGS += -D__EXTENSIONS__
# Not compiled as an xpg6 application, but configure defines this, so we
# override and undefine it to avoid feature_tests.h failures; unclear what the
# correct fix is.
CFLAGS += -U_POSIX_SOURCE

# A pkg-config file isn't shipped in Solaris for nss/nspr 64-bit, so we
# workaround this by using the one-off copy in the evolution-data-server
# component directory
PKG_CONFIG_PATHS.64 += $(WS_COMPONENTS)/gnome/evolution-data-server
PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# bluetooth support (unnecessary)
CONFIGURE_OPTIONS += -Dbluez-backend=false
# GSM Telephony Support (unnecessary).
CONFIGURE_OPTIONS += -Dofono-backend=false
CONFIGURE_OPTIONS += -Dinspect_tool=false
CONFIGURE_OPTIONS += -Dtracker_backend=true

LDFLAGS += -z gnu-version-script-compat

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/evolution-data-server
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/libgee
REQUIRED_PACKAGES += library/desktop/search/tracker
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/telepathy-glib
