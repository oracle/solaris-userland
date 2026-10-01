#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
CTF_MODE =		off
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		poppler
COMPONENT_VERSION=	26.09.0
# must not be zero padded
IPS_COMPONENT_VERSION=	$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\.0\([^.]\)/.\1/g')
COMPONENT_PROJECT_URL=	https://poppler.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= sha256:8059eadb6805340768f138c465b57f8164c92b4a0773c37ef031ea6c0d987b2e
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/poppler
COMPONENT_ANITYA_ID=	3686
COMPONENT_BAID=		443659

COMPONENT_NAME_1=	poppler-data
COMPONENT_VERSION_1=	0.4.12
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.gz
COMPONENT_ARCHIVE_HASH_1= \
	sha256:c835b640a40ce357e1b83666aabd95edffa24ddddd49b8daff63adb851cdab74
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1=	$(COMPONENT_ARCHIVE_URL_1).sig
COMPONENT_ANITYA_ID_1=	3687
COMPONENT_BAID_1=	151084

COMPONENT_NAME_2=	testfiles
GIT_REPO_2=		https://gitlab.freedesktop.org/poppler/test.git
GIT_COMMIT_ID_2=	48b6219b
GIT_HASH_2=		sha256:f8bcdb5846ad21634f8ed9112c02a555814003fc0022641a9114acc035c8074d

# Only cmake is currently supported to build libpoppler.
BUILD_STYLE = cmake

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

PATH = /usr/gnu/bin:/usr/bin

include $(WS_MAKE_RULES)/common.mk

# The path to cmake configure file has to be specified explicitly,
# otherwise 32-bit openjpeg library is attempted to be linked to 64-bit 
OPENJPEG_CMAKE_DIR = $(shell pkg-config --modversion libopenjp2 | \
                       perl -F'\.' -nae 'print "openjpeg-$$F[0].$$F[1]"')
CMAKE_OPTIONS.32 += -DOpenJPEG_DIR=/usr/lib/cmake/$(OPENJPEG_CMAKE_DIR)
CMAKE_OPTIONS.64 += -DOpenJPEG_DIR=/usr/lib/$(MACH64)/cmake/$(OPENJPEG_CMAKE_DIR)

# The HarfBuzz CMake package files contain ISA-specific library paths.
CMAKE_OPTIONS.32 += -Dharfbuzz_DIR=/usr/lib/cmake/harfbuzz
CMAKE_OPTIONS.64 += -Dharfbuzz_DIR=/usr/lib/$(MACH64)/cmake/harfbuzz

# Not necessary for the userland consolidation.
CMAKE_OPTIONS += -DENABLE_QT5=OFF
CMAKE_OPTIONS += -DENABLE_QT6=OFF

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
CMAKE_OPTIONS += -DENABLE_GPGME=OFF
CMAKE_OPTIONS += -DTESTDATADIR=$(COMPONENT_DIR)/$(COMPONENT_NAME_2)-$(GIT_COMMIT_ID_2)

# Install the poppler data files.
COMPONENT_POST_BUILD_ACTION = \
	(cd $(COMPONENT_DIR)/$(COMPONENT_SRC_1); \
	$(GMAKE) prefix=/usr DESTDIR=$(PROTO_DIR) install)

COMPONENT_TEST_ENV = LC_ALL=en_US.UTF-8

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/openjpeg2
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
