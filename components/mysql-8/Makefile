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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#

COMPILER= gcc
BUILD_BITS= 64
export PARFAIT_BUILD=no
include ../../make-rules/shared-macros.mk

MAJOR_VERSION=8.0
MICRO_VERSION=32

COMPONENT_NAME        = mysql
COMPONENT_VERSION     = $(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_SRC         = $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE     = $(COMPONENT_NAME)-boost-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= \
			sha256:1a83a2e1712a2d20b80369c45cecbfcc7be9178d4fc0e81ffba5c273ce947389
COMPONENT_ARCHIVE_URL = https://dev.mysql.com/get/Downloads/MySQL-$(MAJOR_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL = https://dev.mysql.com/
COMPONENT_BUGDB       = database/mysql
COMPONENT_ANITYA_ID=	334

BUILD_STYLE= cmake
SYSTEM_TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# MySQL being one of Oracle's own product doesn't require to have a BAID
# License number, but it uses Boost, which does have such a requirement.
COMPONENT_BAID=136501

PKG_MACROS+= MAJOR_VERSION=$(MAJOR_VERSION)

# This component uses cmake to generate Makefiles and thus does not
# run any configure script
CMAKE               = $(shell which cmake)
CMAKE_PREFIX        = $(USRDIR)/mysql/$(MAJOR_VERSION)
CONFDIR             = $(ETCDIR)/mysql/$(MAJOR_VERSION)
DATA_PREFIX         = $(VARDIR)/mysql/$(MAJOR_VERSION)

# The install layout differs from "INSTALL_LAYOUT=STANDALONE" in that
# we put scripts into the "bin" directory and the "lib" directory has
# an architecture subdirectory. We also use a simplified CFLAGS/CXXFLAGS
# setting and let the MySQL CMake setup add the other flags.
# For "lib", 64-bit uses subdir but 32-bit does not
CMAKE_BINDIR.64     = bin
CMAKE_LIBDIR.64     = lib/$(MACH64)
CMAKE_PLUGINDIR.64  = lib/$(MACH64)/plugin

# Providing component specific build options to cmake
CMAKE_OPTIONS += -DBUILD_CONFIG=mysql_release
CMAKE_OPTIONS += -DINSTALL_LAYOUT=STANDALONE
CMAKE_OPTIONS += -DCMAKE_INSTALL_PREFIX=$(CMAKE_PREFIX)
CMAKE_OPTIONS += -DINSTALL_BINDIR=$(CMAKE_BINDIR.$(BITS))
CMAKE_OPTIONS += -DINSTALL_SBINDIR=$(CMAKE_BINDIR.$(BITS))
CMAKE_OPTIONS += -DINSTALL_SCRIPTDIR=$(CMAKE_BINDIR.$(BITS))
CMAKE_OPTIONS += -DINSTALL_LIBDIR=$(CMAKE_LIBDIR.$(BITS))
CMAKE_OPTIONS += -DINSTALL_PLUGINDIR=$(CMAKE_PLUGINDIR.$(BITS))
CMAKE_OPTIONS += -DSYSCONFDIR=$(CONFDIR)
CMAKE_OPTIONS += -DMYSQL_DATADIR=$(DATA_PREFIX)
CMAKE_OPTIONS += -DENABLED_LOCAL_INFILE=ON
CMAKE_OPTIONS += -DCMAKE_CXX_COMPILER=$(CXX)
CMAKE_OPTIONS += -DCMAKE_C_COMPILER=$(CC)

CMAKE_OPTIONS += '-DCOMPILATION_COMMENT=MySQL Community Server (GPL)'

CMAKE_OPTIONS += -DWITH_CURL=system
CMAKE_OPTIONS += -DWITH_EDITLINE=system
CMAKE_OPTIONS += -DWITH_LIBEVENT=system
CMAKE_OPTIONS += -DWITH_LZ4=system
CMAKE_OPTIONS += -DWITH_LZMA=system
CMAKE_OPTIONS += -DWITH_ZLIB=system
#CMAKE_OPTIONS += -DWITH_ZSTD=system # not installed in CBE
CMAKE_OPTIONS += -DWITH_ICU=system
ifeq ($(strip $(OPENSSL3)),)
CMAKE_OPTIONS += -DWITH_SSL=system
else
CMAKE_OPTIONS += -DWITH_SSL=/usr/openssl/3
endif
CMAKE_OPTIONS += -DWITH_INNODB_MEMCACHED=1
CMAKE_OPTIONS += -DWITH_BOOST=$(SOURCE_DIR)/boost
CMAKE_OPTIONS += -DWITH_ROUTER=OFF
CMAKE_OPTIONS += -DCMAKE_VERBOSE_MAKEFILE:BOOL=TRUE

COMPONENT_TEST_TRANSFORMS +=  \
	'-e "s/   [0-9]\.[0-9][0-9] sec$$//" '  \
	'-e "s/  [0-9][0-9]\.[0-9][0-9] sec$$//" '  \
	'-e "s/ [0-9][0-9][0-9]\.[0-9][0-9] sec$$//" ' \
	'-e "s/[0-9][0-9][0-9][0-9]\.[0-9][0-9] sec$$//" ' \
	'-e "/Running tests.../d" ' \
	'-e "/^Total Test time/d" '

REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/libevent
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += library/security/libsasl2
ifeq ($(strip $(OPENSSL3)),)
REQUIRED_PACKAGES += library/security/openssl
else
REQUIRED_PACKAGES += library/security/openssl-3
endif
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network
