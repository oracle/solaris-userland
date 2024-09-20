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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

COMPILER=	gcc
BUILD_BITS=	64_and_32

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		avahi
COMPONENT_VERSION=	0.8
COMPONENT_BAID=		134572
COMPONENT_ARCHIVE_HASH=	sha256:060309d7a333d38d951bc27598c677af1796934dbd98e1024e7ad8de798fedda
COMPONENT_ARCHIVE_URL=	http://avahi.org/download/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://www.avahi.org/
COMPONENT_BUGDB=	library/avahi
COMPONENT_ANITYA_ID=	147

PYTHON_VERSION=		3.11

include $(WS_MAKE_RULES)/common.mk

# service-type-database/build-db is missing from distribution, but is available
# on github. That must have some reason because other distribution deliver it
# same way. We should update the file during component upgrade. original:
# https://github.com/lathiat/avahi/blob/master/service-type-database/build-db
COMPONENT_PRE_CONFIGURE_ACTION += \
	db=$(SOURCE_DIR)/service-type-database/build-db; \
	$(CP) $(COMPONENT_DIR)/files/build-db $$db && $(CHMOD) +x $$db &&\
	($(CLONEY) $(SOURCE_DIR) $(@D));

# Because of the mapfile patch
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)
# MAKE=gmake is needed because of the autoreconf
CONFIGURE_ENV		+=	MAKE=gmake

CONFIGURE_ENV		+=	PYTHON=$(PYTHON.$(PYTHON_VERSION))
# Avahi doesn't know sunos
CONFIGURE_OPTIONS	+=	--with-distro=none
CONFIGURE_OPTIONS	+=	--sysconfdir="$(ETCDIR)"
CONFIGURE_OPTIONS	+=	--localstatedir=/var
CONFIGURE_OPTIONS	+=	--disable-qt5
CONFIGURE_OPTIONS	+=	--disable-mono
CONFIGURE_OPTIONS	+=	--with-avahi-user=daemon
CONFIGURE_OPTIONS	+=	--with-avahi-group=other
CONFIGURE_OPTIONS	+=	--enable-tests
CONFIGURE_OPTIONS	+=	--disable-autoipd
CONFIGURE_OPTIONS	+=	--enable-compat-libdns_sd
CONFIGURE_OPTIONS.32	+=	--disable-python
CONFIGURE_OPTIONS.32	+=	--disable-pygobject
CONFIGURE_OPTIONS.64	+=	--enable-doxygen-man
CONFIGURE_OPTIONS.32	+=	--disable-doxygen-man
CONFIGURE_ENV.64	+=	PKG_CONFIG_PATH=/usr/lib/$(MACH64)/pkgconfig

# Move site-packages into vendor-packages, compile to satisfy pkgdepend
$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/site-packages \
		$(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages; \
	$(PYTHON) -m compileall $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages;

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^PASS:/p" '

REQUIRED_PACKAGES += library/database/gdbm
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libdaemon
REQUIRED_PACKAGES += library/libevent
REQUIRED_PACKAGES += library/python/dbus-python-311
REQUIRED_PACKAGES += library/python/pygobject-3-311
REQUIRED_PACKAGES += library/python/python-twisted-311
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += system/network/avahi/gui
