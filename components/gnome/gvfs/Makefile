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

BUILD_BITS =            64_and_32
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gvfs
COMPONENT_VERSION=	1.52.2
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/gvfs
COMPONENT_ARCHIVE_HASH= \
	sha256:a643aceaa053caac0d8eff9a015f636e4bd1bb09cfe27864e347db67460e7b91
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	5496

COMPONENT_BAID=		158541
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

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
CONFIGURE_OPTIONS += -Dgoogle=false
CONFIGURE_OPTIONS += -Dman=true
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

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/libsoup-3
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/network/avahi
