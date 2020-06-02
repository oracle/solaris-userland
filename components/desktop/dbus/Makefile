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

# Static assertions fail when building with Studio
COMPILER =		gcc
BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dbus
COMPONENT_VERSION=	1.10.32
COMPONENT_PROJECT_URL=	http://dbus.freedesktop.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:28baa6061a2b89b4c49688df0fab1f74b390c7fa6fac28c637622ee36ec49c8f
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/dbus
COMPONENT_ANITYA_ID=	5356

TPNO=			60493

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

include $(WS_MAKE_RULES)/common.mk

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

# Will break parallel 32/64-bit builds; needs update when that happens.
CONFIGURE_BINDIR.32 =   $(CONFIGURE_PREFIX)/bin

CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--with-dbus-daemondir=$(USRLIBDIR)
CONFIGURE_OPTIONS +=	--with-dbus-user=root
CONFIGURE_OPTIONS +=	--libexecdir=$(USRLIBDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--disable-static

# Python is a dependency only if --enable-tests is given, which
# is not. Because of that, the detected version is irrelevant.

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS +=	MAKE=$(GMAKE)

# GNU Build System files have to be regenerated for automake 1.16.
# It can be removed when the upstream starts to use a newer automake version.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/documentation-tool/xmlto
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += x11/library/libx11
