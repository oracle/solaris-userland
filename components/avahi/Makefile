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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection 1.46 causes the build to fail when using Studio.
COMPILER =              gcc
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

include $(WS_MAKE_RULES)/common.mk

# Not Python 3.x ready due to configure errors
PYTHON_VERSION=2.7

CONFIGURE_SBINDIR.64 =	$(CONFIGURE_BINDIR.64)
CONFIGURE_OPTIONS	+=	--enable-shared
CONFIGURE_OPTIONS	+=	--disable-static
CONFIGURE_OPTIONS	+=	--sysconfdir="$(ETCDIR)"
CONFIGURE_OPTIONS	+=	--with-avahi-user=daemon
CONFIGURE_OPTIONS	+=	--with-avahi-group=other
CONFIGURE_OPTIONS	+=	--with-distro=none
CONFIGURE_OPTIONS	+=	--disable-gtk3
CONFIGURE_OPTIONS	+=	--disable-pygtk
CONFIGURE_OPTIONS	+=	--disable-qt3
CONFIGURE_OPTIONS	+=	--disable-qt4
CONFIGURE_OPTIONS	+=	--disable-mono
CONFIGURE_OPTIONS	+=	--disable-monodoc
CONFIGURE_OPTIONS	+=	--enable-tests
CONFIGURE_OPTIONS	+=	--disable-autoipd
CONFIGURE_OPTIONS	+=	--disable-gdbm
CONFIGURE_OPTIONS	+=	--enable-dbm
# xmltoman is not available
CONFIGURE_OPTIONS	+=	--disable-manpages
CONFIGURE_OPTIONS.64	+=	--enable-doxygen-man
CONFIGURE_OPTIONS.32	+=	--disable-doxygen-man
CONFIGURE_OPTIONS	+=	CPP="$(CC) -E"
LDFLAGS	+=	-ldns_sd
CONFIGURE_OPTIONS	+=	PYTHON=$(PYTHON.$(PYTHON_VERSION))
CONFIGURE_OPTIONS	+=	am_cv_python_pythondir="$(PYTHON_VENDOR_PACKAGES)"
CONFIGURE_OPTIONS	+=	am_cv_python_pyexecdir="$(PYTHON_VENDOR_PACKAGES)"

# NOCONFIGURE=yes -> do not execute "configure" directly from "autogen.sh" (/wo CONFIGURE_OPTIONS...)
# running of configure /wo CONFIGURE_OPTIONS/ENV -> configure will fail (on --with-distro=none is missing)
# because "sunos" is not among the distros known to avahi.
# Note that GNU Build System files have to be regenerated for automake 1.16.
COMPONENT_PREP_ACTION += \
 ( cd $(@D) ; PATH="$(PATH)" NOCONFIGURE=yes $(CONFIG_SHELL) autogen.sh; autoreconf -fiv)
# g-i-r-scanner also need to have PATH to cc
COMPONENT_BUILD_ENV += CC="$(CC)"
COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ENV += LDFLAGS="$(LDFLAGS)"
$(BUILD_32_and_64): PATH = $(SPRO_VROOT)/bin:$(GNUBIN):$(USRBINDIR)
COMPONENT_POST_INSTALL_ACTION += \
 ( $(PYTHON.$(PYTHON_VERSION)) -m compileall $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES) )

# build standalone sub-components only needed to lib support only
SUBDIRS = avahi-common avahi-core avahi-client avahi-glib avahi-gobject avahi-ui
$(BUILD_32):	COMPONENT_BUILD_TARGETS		+=	SUBDIRS="$(SUBDIRS)"
$(INSTALL_32):	COMPONENT_INSTALL_TARGETS	+=	SUBDIRS="$(SUBDIRS)"

PYTHON_SCRIPTS += $(PROTO_DIR)/usr/bin/avahi-bookmarks
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/bin/avahi-discover
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/python2.7/vendor-packages/64/avahi/ServiceTypeDatabase.py
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/python2.7/vendor-packages/64/avahi/__init__.py
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/python2.7/vendor-packages/64/avahi_discover/__init__.py

COMPONENT_TEST_DIR =             $(@D)/avahi-core
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^PASS:/p" '

# gobject-introspection tools are used to build, not a runtime dependency
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libdaemon
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += service/network/dns/mdns
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libdbus
