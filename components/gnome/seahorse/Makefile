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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		seahorse
COMPONENT_VERSION=	3.32.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Seahorse
COMPONENT_ARCHIVE_HASH= \
	sha256:9de021088fc9233087ef7759d9762d86b8162723f403417bdad29d4feb6f1f35
COMPONENT_BUGDB=	gnome/security
COMPONENT_ANITYA_ID=	9548

TPNO=			54131

BUILD_STYLE=            meson

# The unit tests failed to start.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
CONFIGURE_OPTIONS += -Dhkp-support=false -Dmanpage=true


REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/libsoup
# for manpage
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/security/gpgme
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += system/network/avahi/gui
REQUIRED_PACKAGES += system/network/ldap/openldap
