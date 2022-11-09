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
# Copyright (c) 2008, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXmu
COMPONENT_VERSION=	1.1.4
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:210de3ab9c3e9382572c25d17c2518a854ce6e2c62c5f8315deac7579e758244
COMPONENT_BUGDB=	x11/libraries
COMPONENT_ANITYA_ID=	1785
COMPONENT_BAID=		132858

FIX_PC_FILES=xmu.pc.in xmuu.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

# Symlink Solaris-specific source files into source directory
COMPONENT_PREP_ACTION += \
	$(SYMLINK) ../../../../files/XmuSolaris.h \
		$(SOURCE_DIR)/include/X11/Xmu ; \
	$(SYMLINK) ../../files/{CmapEquiv.c,VisGamma.c,mapfile-Xmu,mapfile-Xmuu} \
		$(SOURCE_DIR)/src ;

# patches/01-solaris-abi.patch changes src/Makefile.am so we need to autoreconf
COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF_ENV) $(AUTORECONF) -fiv);

# sun-src/src/VisGamma.c requires libX11 private headers for _Xcms functions
LIBX11_DIR=	$(WS_COMPONENTS)/x11/lib/libX11
CPPFLAGS += 	-I $(LIBX11_DIR)/libX11-*/src/xcms

CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --disable-static

# Add tests
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV += libtool_install_magic='%%%MAGIC variable%%%'

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxmuu
REQUIRED_PACKAGES += x11/library/toolkit/libxt
