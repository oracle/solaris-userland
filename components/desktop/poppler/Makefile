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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		poppler
COMPONENT_VERSION=	0.70.1
COMPONENT_PROJECT_URL=	http://poppler.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:66972047d9ef8162cc8c389d7e7698291dfc9f2b3e4ea9a9f08ae604107451bd
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/poppler
COMPONENT_ANITYA_ID=	3686
TPNO_POPPLER=		46911

COMPONENT_NAME_1=	poppler-data
COMPONENT_VERSION_1=	0.4.9
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:1f9c7e7de9ecd0db6ab287349e31bf815ca108a5a175cf906a90163bdbe32012
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE_1)
COMPONENT_ANITYA_ID_1=	3687
TPNO_POPPLER_DATA=	46916

# Only cmake is currently supported to build libpoppler.
BUILD_STYLE = cmake

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# For now, all things built for C++11 require gcc.
# (Poppler provides a C++ wrapper.)
COMPILER=gcc

# There isn't a 64-bit version of pkg-config's nss.pc, so set these "manually".
MPSLIB.32 = -L/usr/lib/mps -R/usr/lib/mps
MPSLIB.64 = -L/usr/lib/mps/64 -R/usr/lib/mps/64
NSS3_LIBS = $(MPSLIB.$(BITS)) -lnss3 -lsmime3 -lssl3 -lnssutil3 -lplds4 -lplc4 -lnspr4 -lpthread -ldl -lposix4

# Uses strcpy_s, etc. c11 functions.
CFLAGS += -std=c11
CXXFLAGS += -std=c++11 -D__STDC_WANT_LIB_EXT1__=1 $(NSS3_LIBS)
# Set CC environment variable to the compiler path, it is required by g-ir-scanner.
COMPONENT_BUILD_ENV.32 += CC="$(CC) -m32"
COMPONENT_BUILD_ENV.64 += CC="$(CC) -m64"

# The path to cmake configure file has to be specified explicitly,
# otherwise 32-bit openjpeg library is attempted to be linked to 64-bit 
OPENJPEG_CMAKE_DIR = $(shell pkg-config --modversion libopenjp2 | \
                       perl -F'\.' -nae 'print "openjpeg-$$F[0].$$F[1]"')
CMAKE_OPTIONS.32 += -DOpenJPEG_DIR=/usr/lib/cmake/$(OPENJPEG_CMAKE_DIR)
CMAKE_OPTIONS.64 += -DOpenJPEG_DIR=/usr/lib/$(MACH64)/cmake/$(OPENJPEG_CMAKE_DIR)

# Reduce build time dependencies since we don't ship this
# or can't run it as an automated test.
CMAKE_OPTIONS += -DBUILD_CPP_TESTS=OFF
CMAKE_OPTIONS += -DBUILD_GTK_TESTS=OFF
CMAKE_OPTIONS += -DBUILD_QT5_TESTS=OFF

# Build shared libpoppler libraries.
CMAKE_OPTIONS += -DBUILD_SHARED_LIBS=ON

# Not necessary for the userland consolidation.
CMAKE_OPTIONS += -DENABLE_ZLIB=OFF
CMAKE_OPTIONS += -DENABLE_QT5=OFF
CMAKE_OPTIONS += -DENABLE_GTK_DOC=OFF

# Required by other components.
CMAKE_OPTIONS += -DWITH_Cairo=ON
CMAKE_OPTIONS += -DWITH_Iconv=ON
CMAKE_OPTIONS += -DWITH_GLIB=ON
CMAKE_OPTIONS += -DWITH_GTK=ON
CMAKE_OPTIONS += -DWITH_NSS3=ON
CMAKE_OPTIONS += -DWITH_JPEG=ON
CMAKE_OPTIONS += -DWITH_PNG=ON
CMAKE_OPTIONS += -DWITH_TIFF=ON
CMAKE_OPTIONS += -DWITH_GObjectIntrospection=ON
CMAKE_OPTIONS += -DENABLE_CPP=ON
CMAKE_OPTIONS += -DENABLE_SPLASH=ON
CMAKE_OPTIONS += -DENABLE_LIBCURL=ON
CMAKE_OPTIONS += -DENABLE_XPDF_HEADERS=ON
CMAKE_OPTIONS += -DENABLE_CMS=lcms2
CMAKE_OPTIONS += -DENABLE_LIBOPENJPEG=openjpeg2
CMAKE_OPTIONS += -DENABLE_DCTDECODER=libjpeg
CMAKE_OPTIONS += -DFONT_CONFIGURATION=fontconfig

# Install the poppler data files.
COMPONENT_POST_BUILD_ACTION = \
	(cd $(COMPONENT_DIR)/$(COMPONENT_SRC_1); \
	$(GMAKE) prefix=$(CONFIGURE_PREFIX) DESTDIR=$(PROTO_DIR)/usr install)

# Always show the build and link lines for easier debugging.
COMPONENT_BUILD_ARGS += V=1

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/openjpeg2
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/c++-runtime
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
