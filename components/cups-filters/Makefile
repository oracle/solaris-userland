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
# Copyright (c) 2019, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
gcc_OPT= -O2
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cups-filters
COMPONENT_VERSION=	1.28.17
COMPONENT_BAID=		154306
COMPONENT_ARCHIVE_HASH=	sha256:270a3752a960368aa99d431fb5d34f4039b2ac943c576d840612d1d8185c9bb9
COMPONENT_PROJECT_URL=	http://www.openprinting.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_URL=	https://github.com/OpenPrinting/cups-filters/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/cups
COMPONENT_ANITYA_ID=	5541

include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I/usr/include/cups

# Ensure dynamic shared objects are linked using same LDFLAGS as executables.
CONFIGURE_ENV += DSOFLAGS="$(LDFLAGS)"

CPPFLAGS += -I/usr/include/cups/private
CPPFLAGS += -I/usr/include/cups/private/cups
CONFIGURE_ENV += CPPFLAGS="$(CPPFLAGS)"
# C++ 17 is required by qpdf
CXXFLAGS += -std=c++17

CONFIGURE_OPTIONS +=	--libdir=/usr/lib/cups/$(MACH64)
CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--with-cups-rundir=/system/volatile/cups
CONFIGURE_OPTIONS +=	--with-ldap-includes=/usr/include/openldap
CONFIGURE_OPTIONS +=	--with-fontdir=$(USRSHAREFONTSDIR)
CONFIGURE_OPTIONS +=	--disable-static
# use pdftops (poppler) renderer instead
CONFIGURE_OPTIONS +=	--with-pdftops=pdftops
CONFIGURE_OPTIONS +=	--disable-mutool
# gs has better collor management but crashes
CONFIGURE_OPTIONS +=	--enable-poppler
CONFIGURE_OPTIONS +=	CFLAGS="$(CFLAGS)"
CONFIGURE_OPTIONS +=	--enable-driverless=no
CONFIGURE_OPTIONS +=	ENABLE_DRIVERLESS_FALSE="Y"
CONFIGURE_OPTIONS +=	--with-php=no
CONFIGURE_OPTIONS +=	--with-test-font-path=/usr/share/fonts/TrueType/dejavu/DejaVuSans.ttf

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS +=  MAKE=$(GMAKE)

# Needed for compilation with libqpdf
PKG_CONFIG_PATHS.64 = /usr/openssl/3/lib/64/pkgconfig
PKG_CONFIG_PATHS.32 = /usr/openssl/3/lib/pkgconfig
PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))

COMPONENT_BUILD_ENV  += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV+= PATH="$(GNUBIN):$(PATH)"

COMPONENT_PREP_ACTION += (cd $(@D) ; \
   PATH=:/usr/gnu/bin:/usr/bin: $(CONFIG_SHELL) autogen.sh )

COMPONENT_PRE_CONFIGURE_ACTION = \
   ($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_TEST_ENV +=   libtool_install_magic='%%%MAGIC variable%%%'
COMPONENT_TEST_ENV +=   libtool_execute_magic='%%%MAGIC variable%%%'
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/ TOTAL:/p" ' \
	'-e "/PASS:/p" ' \
	'-e "/ SKIP:/p" ' \
	'-e "/ XFAIL:/p" ' \
	'-e "/ FAIL:/p" ' \
	'-e "/ ERROR:/p" '

cups-filters.license: $(SOURCE_DIR)/COPYING \
	$(COMPONENT_DIR)/licenses/GPL-2.txt \
	$(COMPONENT_DIR)/licenses/GPL-3.txt \
	$(COMPONENT_DIR)/licenses/LGPL-2.0.txt \
	$(COMPONENT_DIR)/licenses/LGPL-2.1.txt
	cat $? > $@

REQUIRED_PACKAGES += image/library/libexif
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/filter/poppler
REQUIRED_PACKAGES += print/filter/qpdf
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
