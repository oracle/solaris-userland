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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		poppler
COMPONENT_VERSION=	22.10.0
COMPONENT_PROJECT_URL=	https://poppler.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= sha256:04e40fad924a6de62e63017a6fd4c04696c1f526dedc2ba5ef275cedf646292a
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/poppler
COMPONENT_ANITYA_ID=	3686
COMPONENT_BAID_POPPLER=	131371

COMPONENT_NAME_1=	poppler-data
COMPONENT_VERSION_1=	0.4.11
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:2cec05cd1bb03af98a8b06a1e22f6e6e1a65b1e2f3816cb3069bb0874825f08c
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE_1)
COMPONENT_ANITYA_ID_1=	3687
COMPONENT_BAID_POPPLER_DATA=	110157

COMPONENT_NAME_2=	testfiles
GIT_REPO_2=		https://gitlab.freedesktop.org/poppler/test.git
GIT_COMMIT_ID_2=	920c89f8

# Only cmake is currently supported to build libpoppler.
BUILD_STYLE = cmake

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

COMPONENT_TEST_ENV =	LC_ALL=en_US.UTF-8

include $(WS_MAKE_RULES)/common.mk

# The path to cmake configure file has to be specified explicitly,
# otherwise 32-bit openjpeg library is attempted to be linked to 64-bit 
OPENJPEG_CMAKE_DIR = $(shell pkg-config --modversion libopenjp2 | \
                       perl -F'\.' -nae 'print "openjpeg-$$F[0].$$F[1]"')
CMAKE_OPTIONS.32 += -DOpenJPEG_DIR=/usr/lib/cmake/$(OPENJPEG_CMAKE_DIR)
CMAKE_OPTIONS.64 += -DOpenJPEG_DIR=/usr/lib/$(MACH64)/cmake/$(OPENJPEG_CMAKE_DIR)

# Not necessary for the userland consolidation.
CMAKE_OPTIONS += -DENABLE_QT5=OFF

# Required by other components.
CMAKE_OPTIONS += -DWITH_Cairo=ON
CMAKE_OPTIONS += -DWITH_GLIB=ON
CMAKE_OPTIONS += -DWITH_GTK=ON
CMAKE_OPTIONS += -DWITH_NSS3=ON
CMAKE_OPTIONS += -DWITH_JPEG=ON
CMAKE_OPTIONS += -DWITH_PNG=ON
CMAKE_OPTIONS += -DWITH_TIFF=ON
CMAKE_OPTIONS.32 += -DWITH_GObjectIntrospection=OFF
CMAKE_OPTIONS.64 += -DWITH_GObjectIntrospection=ON
CMAKE_OPTIONS += -DENABLE_UNSTABLE_API_ABI_HEADERS=ON
CMAKE_OPTIONS += -DENABLE_BOOST=OFF
CMAKE_OPTIONS += -DTESTDATADIR=$(COMPONENT_DIR)/$(COMPONENT_NAME_2)-$(GIT_COMMIT_ID_2)

# Install the poppler data files.
COMPONENT_POST_BUILD_ACTION = \
	(cd $(COMPONENT_DIR)/$(COMPONENT_SRC_1); \
	$(GMAKE) prefix=/usr DESTDIR=$(PROTO_DIR) install)

# Always show the build and link lines for easier debugging.
COMPONENT_BUILD_ARGS += V=1

PKG_OBJ =	poppler
SUBPKG_OBJ =	poppler-desktop
EXCLUSION_FILE = poppler-desktop-deps

include $(WS_MAKE_RULES)/pkgobjs.mk
$(EXCLUSION_FILE_TARGET): $(HEAP_OBJ)
	find $(PROTO_DIR) -type f | (while read f; do file "$$f"; done) | grep -w ELF | cut -f1 -d\: | (while read f; do echo $$f: `ldd "$$f"`; done) | egrep 'libXrender|gobj|libX11|glib|libGL' | cut -f1 -d\: | sed -e 's$$$(PROTO_DIR)/$$$$' | sed -e 's/$(MACH64)/$$(MACH64)/' > $@.tmp ; \
	find $(PROTO_DIR) -type f | egrep 'cairo' | sed -e 's$$$(PROTO_DIR)/$$$$' | sed -e 's/$(MACH64)/$$(MACH64)/' >> $@.tmp ; \
	find $(PROTO_DIR) -type f -o -type l | egrep 'glib|gir|g-i-r' | sed -e 's$$$(PROTO_DIR)/$$$$' | sed -e 's/$(MACH64)/$$(MACH64)/' >> $@.tmp ; \
	sort -u $@.tmp > $@ ; \
	rm $@.tmp

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/openjpeg2
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/filter/poppler
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
