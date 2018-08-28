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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS = 64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		openjpeg
COMPONENT_VERSION_1=    2.3
COMPONENT_VERSION=	$(COMPONENT_VERSION_1).0
COMPONENT_PROJECT_URL=	http://www.openjpeg.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:3dc787c1bb6023ba846c2a0d9b1f6e179f1cd255172bde9eb75b01f1e6c7d71a
COMPONENT_ARCHIVE_URL=	https://github.com/uclouvain/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	library/openjpeg
COMPONENT_ANITYA_ID=	2550

TPNO=			43064

BUILD_STYLE = cmake

# Requires images from an external source
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/common.mk

studio_C99MODE=$(studio_C99_ENABLE)

# Workaround non-standard type usage in big endian builds.
CFLAGS.studio.sparc += -Du_int16_t=uint16_t

# We must disable the compilation of static libraries explicitly,
# otherwise, invalid *.cmake files are generated and delivered.
CMAKE_OPTIONS += -DBUILD_STATIC_LIBS=OFF

# Paths to 64-bit binaries and libraries must be relative,
# otherwise, pkg-config files with wrong paths are generated.
CMAKE_OPTIONS.32 += -DOPENJPEG_INSTALL_BIN_DIR=bin/$(MACH32)
CMAKE_OPTIONS.64 += -DOPENJPEG_INSTALL_BIN_DIR=bin
CMAKE_OPTIONS.32 += -DOPENJPEG_INSTALL_LIB_DIR=lib
CMAKE_OPTIONS.64 += -DOPENJPEG_INSTALL_LIB_DIR=lib/$(MACH64)

# Install cmake configure files to the standard Solaris paths.
OPENJPEG_CMAKE_DIR = openjpeg-$(COMPONENT_VERSION_1)
CMAKE_OPTIONS.32 += -DOPENJPEG_INSTALL_PACKAGE_DIR=lib/cmake/$(OPENJPEG_CMAKE_DIR)
CMAKE_OPTIONS.64 += -DOPENJPEG_INSTALL_PACKAGE_DIR=lib/$(MACH64)/cmake/$(OPENJPEG_CMAKE_DIR)

# Path to lcms2 headers is explicitly required, otherwise the library is not used.
CMAKE_OPTIONS += -DLCMS2_INCLUDE_DIR=$(USRINCDIR)/lcms

REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += system/library/math
