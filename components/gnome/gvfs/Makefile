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

BUILD_BITS =            64_and_32
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gvfs
COMPONENT_VERSION=	1.42.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/gvfs
COMPONENT_ARCHIVE_HASH= \
	sha256:d0958d9ceefb54bb8ddda74ef51e10fe03dff93f74634784bd309ea434066cf1
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	5496

TPNO=			54079
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Assumes GNU xgettext is first in $PATH.
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# We build goa only 64-bit in Solaris
CONFIGURE_OPTIONS.32 += -Dgoa=false
CONFIGURE_OPTIONS += -Dsmb=false
CONFIGURE_OPTIONS += -Dnfs=false
# google backend requires goa which is only 64-bit in Solaris
CONFIGURE_OPTIONS.32 += -Dgoogle=false
CONFIGURE_OPTIONS += -Dman=true
CONFIGURE_OPTIONS += -Ddevel_utils=true
# admin requires libcap
CONFIGURE_OPTIONS += -Dadmin=false
CONFIGURE_OPTIONS += -Dbluray=false
CONFIGURE_OPTIONS += -Dfuse=false
# Requires linux specific systemd
CONFIGURE_OPTIONS += -Dlogind=false
CONFIGURE_OPTIONS += -Dsystemduserunitdir=no
CONFIGURE_OPTIONS += -Dtmpfilesdir=no
CONFIGURE_OPTIONS += -Dgudev=false
# Requires dependencies we don't have on Solaris - gudev
CONFIGURE_OPTIONS += -Dudisks2=false
CONFIGURE_OPTIONS += -Dcdda=false
CONFIGURE_OPTIONS += -Dgphoto2=false
CONFIGURE_OPTIONS += -Dmtp=false
# Requires dependencies we don't have on Solaris - libimobiledevice, libplist
CONFIGURE_OPTIONS += -Dafc=false
CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libgdata
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += library/gnome/gcr
