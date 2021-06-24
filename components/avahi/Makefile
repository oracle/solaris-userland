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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#
COMPILER=	gcc
BUILD_BITS=	64_and_32
include ../../make-rules/shared-macros.mk
# Override PATH set in shared-macros.mk by setting the GNU PATH as default.
PATH=$(GNUBIN):$(USRBINDIR)

COMPONENT_NAME=		avahi
COMPONENT_VERSION=	0.7
TPNO=			39210
COMPONENT_ARCHIVE_HASH=	sha256:57a99b5dfe7fdae794e3d1ee7a62973a368e91e414bd0dfa5d84434de5b14804
COMPONENT_ARCHIVE_URL=	http://avahi.org/download/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://www.avahi.org/
COMPONENT_BUGDB=	library/avahi
COMPONENT_ANITYA_ID=	147

# Needed to avoid test failures (unbounded variables in libtool).
unexport SHELLOPTS

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_SBINDIR.64 =	$(CONFIGURE_BINDIR.64)
CONFIGURE_OPTIONS	+=	--mandir=$(USRSHAREDIR)/man
CONFIGURE_OPTIONS	+=	--enable-shared
CONFIGURE_OPTIONS	+=	--disable-static
CONFIGURE_OPTIONS	+=	--disable-python
CONFIGURE_OPTIONS	+=	--sysconfdir="$(ETCDIR)"
CONFIGURE_OPTIONS	+=	--with-avahi-user=daemon
CONFIGURE_OPTIONS	+=	--with-avahi-group=other
CONFIGURE_OPTIONS	+=	--with-distro=none
CONFIGURE_OPTIONS	+=	--disable-gtk3
CONFIGURE_OPTIONS	+=	--disable-qt3
CONFIGURE_OPTIONS	+=	--disable-qt4
CONFIGURE_OPTIONS	+=	--disable-mono
CONFIGURE_OPTIONS	+=	--disable-monodoc
CONFIGURE_OPTIONS	+=	--enable-tests
CONFIGURE_OPTIONS	+=	--disable-autoipd
CONFIGURE_OPTIONS	+=	--disable-gdbm
CONFIGURE_OPTIONS	+=	--enable-dbm
CONFIGURE_OPTIONS	+=	--disable-pygobject
# xmltoman is not available
CONFIGURE_OPTIONS	+=	--disable-manpages
CONFIGURE_OPTIONS.64	+=	--enable-doxygen-man
CONFIGURE_OPTIONS.32	+=	--disable-doxygen-man
CONFIGURE_OPTIONS	+=	CPP="$(CC) -E"
LDFLAGS	+=	-ldns_sd

# NOCONFIGURE=yes -> do not execute "configure" directly from "autogen.sh" (/wo CONFIGURE_OPTIONS...)
# running of configure /wo CONFIGURE_OPTIONS/ENV -> configure will fail (on --with-distro=none is missing)
# because "sunos" is not among the distros known to avahi.
# Note that GNU Build System files have to be regenerated for automake 1.16.
COMPONENT_PREP_ACTION += \
 ( cd $(@D) ; PATH="$(PATH)" NOCONFIGURE=yes $(CONFIG_SHELL) autogen.sh; autoreconf -fiv)

# build standalone sub-components only needed to lib support only
SUBDIRS = avahi-common avahi-core avahi-client avahi-glib avahi-gobject avahi-ui
$(BUILD_32):	COMPONENT_BUILD_TARGETS		+=	SUBDIRS="$(SUBDIRS)"
$(INSTALL_32):	COMPONENT_INSTALL_TARGETS	+=	SUBDIRS="$(SUBDIRS)"

COMPONENT_TEST_DIR =             $(@D)/avahi-core
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^PASS:/p" '

REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libdaemon
REQUIRED_PACKAGES += service/network/dns/mdns
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
