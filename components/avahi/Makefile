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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

COMPILER=	gcc
BUILD_BITS=	64_and_32

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		avahi
COMPONENT_VERSION=	0.8.2024.12
COMPONENT_BAID=		191476
GIT_REPO=		https://github.com/avahi/avahi
GIT_COMMIT_ID=		1dade81
COMPONENT_PROJECT_URL=	http://www.avahi.org/
COMPONENT_BUGDB=	library/avahi
COMPONENT_ANITYA_ID=	147

COMPONENT_NAME_1=	xmltoman
GIT_REPO_1=		https://github.com/atsb/xmltoman
GIT_COMMIT_ID_1=	46403b9

PYTHON_VERSION=		3.11

include $(WS_MAKE_RULES)/common.mk

# Give xmltoman script executable rights
COMPONENT_PRE_CONFIGURE_ACTION += \
	$(CHMOD) +x $(COMPONENT_SRC_1)/xmltoman;

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
CONFIGURE_ENV		+=	PATH="$(PATH):$(COMPONENT_DIR)/$(COMPONENT_SRC_1)"
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
CONFIGURE_OPTIONS	+=	--disable-libsystemd
CONFIGURE_OPTIONS.32	+=	--disable-python
CONFIGURE_OPTIONS.32	+=	--disable-pygobject
CONFIGURE_ENV.64	+=	PKG_CONFIG_PATH=/usr/lib/$(MACH64)/pkgconfig

COMPONENT_BUILD_ENV	+=	PATH="$(PATH):$(COMPONENT_DIR)/$(COMPONENT_SRC_1)"

# Move site-packages into vendor-packages, compile to satisfy pkgdepend
$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
	$(RM) -rf $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages; \
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
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/network
