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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

MAJOR_VERSION=3.4
MICRO_VERSION=7

COMPONENT_NAME=		wireshark
COMPONENT_VERSION=	$(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_PROJECT_URL=	http://www.wireshark.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:6c4cee51ef997cb9d9aaee84113525a5629157d3c743d7c4e320000de804a09d
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)download/src/all-versions/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	5137

TPNO=			73666

BUILD_STYLE=	cmake

# Enable adiheap security extension
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)

# adistack needs to stay disabled because of 26288117
ADISTACK_MODE =	$(ADISTACK_DISABLE)

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PKG_MACROS+= MAJOR_VERSION=$(MAJOR_VERSION)
PKG_MACROS+= MICRO_VERSION=$(MICRO_VERSION)

# Reported via bug 12923
CFLAGS += -I/usr/include/kerberosv5

# Set path to Qt5 cmake modules.
CMAKE_OPTIONS += -DCMAKE_PREFIX_PATH=$(USRLIBDIR64)/cmake/
# Add non-standard path to perl pod2man and pod2html commands.
CMAKE_OPTIONS += -DCMAKE_PROGRAM_PATH=$(USRDIR)/perl5/bin/
# Install all the wireshark executables to sbin directory.
CMAKE_OPTIONS += -DCMAKE_INSTALL_BINDIR=sbin

# Disable lua support as wireshark doesn't support lua 5.3.X
CMAKE_OPTIONS += -DENABLE_LUA=OFF
CMAKE_OPTIONS += -DBUILD_androiddump=OFF
CMAKE_OPTIONS += -DBUILD_randpkt=OFF
CMAKE_OPTIONS += -DBUILD_dftest=OFF

REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += diagnostic/wireshark/wireshark-common
REQUIRED_PACKAGES += codec/speex
REQUIRED_PACKAGES += library/desktop/qt5
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libcares
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/nghttp2
REQUIRED_PACKAGES += library/snappy
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
