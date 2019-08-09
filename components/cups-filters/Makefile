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
# Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER= gcc
gcc_OPT= -O2
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cups-filters
COMPONENT_VERSION=	1.25.11
COMPONENT_TAG=		release-1-25-11
TPNO=			52837
COMPONENT_ARCHIVE_HASH=	sha256:047275563b8e5b7c74e292ea24bac2ae7511a6aabe36590deb646eff09f24117
COMPONENT_PROJECT_URL=	http://www.openprinting.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_TAG)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_URL=	https://github.com/OpenPrinting/cups-filters/archive/$(COMPONENT_TAG).zip
COMPONENT_BUGDB=	utility/cups

include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I/usr/include/cups

# Ensure dynamic shared objects are linked using same LDFLAGS as executables.
CONFIGURE_ENV += DSOFLAGS="$(LDFLAGS)"

CPPFLAGS += -I/usr/include/cups/private
CPPFLAGS += -I/usr/include/cups/private/cups
CONFIGURE_ENV += CPPFLAGS="$(CPPFLAGS)"

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
CONFIGURE_OPTIONS +=	--disable-ghostscript
CONFIGURE_OPTIONS +=	CFLAGS="$(CFLAGS)"
CONFIGURE_OPTIONS +=	--enable-driverless=no
CONFIGURE_OPTIONS +=	ENABLE_DRIVERLESS_FALSE="Y"
CONFIGURE_OPTIONS +=	--with-php=no
CONFIGURE_OPTIONS +=	--with-test-font-path=/usr/share/fonts/TrueType/dejavu/DejaVuSans.ttf

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS +=  MAKE=$(GMAKE)

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

REQUIRED_PACKAGES += print/filter/poppler
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/filter/qpdf
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
