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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS =		64
CTF_MODE =		off	# C++
export PARFAIT_BUILD =	no
include ../../make-rules/shared-macros.mk

MAJOR_VERSION=8.0
MICRO_VERSION=43

COMPONENT_NAME        = mysql
COMPONENT_VERSION     = $(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_SRC         = $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE     = $(COMPONENT_NAME)-boost-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= \
			sha256:85fd5c3ac88884dc5ac4522ce54ad9c11a91f9396fecaa27152c757a3e6e936f
COMPONENT_ARCHIVE_URL = https://dev.mysql.com/get/Downloads/MySQL-$(MAJOR_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL = https://dev.mysql.com/
COMPONENT_BUGDB       = database/mysql
COMPONENT_ANITYA_ID=	334

BUILD_STYLE= cmake
SYSTEM_TEST_TARGET= $(NO_TESTS)

# MySQL being one of Oracle's own product doesn't require to have a BAID
# License number, but it uses Boost and others, which do have such a requirement.
COMPONENT_BAID_BOOST=136501
COMPONENT_BAID_GOOGLE_TEST=177141
COMPONENT_BAID_LIBBACTRACE=177079
COMPONENT_BAID_LIBCNO=177135
COMPONENT_BAID_LZ4=189541 # this covers lz4 xxhash.h usage (elsewhere system lz4 is used)
COMPONENT_BAID_PROTOBUF=177136 # this covers also Abseil
COMPONENT_BAID_RAPID_JSON=177138
COMPONENT_BAID_UNORDERED_DENSE=177139
COMPONENT_BAID_XXHASH=326758

include $(WS_MAKE_RULES)/common.mk

# Not all contents from "extra" directory is really needed for MySQL Server.
NOT_NEEDED_EXTRAS += curl
NOT_NEEDED_EXTRAS += icu
NOT_NEEDED_EXTRAS += libedit
NOT_NEEDED_EXTRAS += libevent
NOT_NEEDED_EXTRAS += libfido2
NOT_NEEDED_EXTRAS += zlib
NOT_NEEDED_EXTRAS += zstd
NOT_NEEDED_EXTRAS += tirpc
NOT_NEEDED_EXTRAS += libcbor
NOT_NEEDED_EXTRAS += gperftools

# Make it clear which BAIDs are really needed.
COMPONENT_PREP_ACTION = (cd $(SOURCE_DIR)/extra; $(RM) -r $(NOT_NEEDED_EXTRAS));

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
CMAKE_OPTIONS += -DWITH_ZLIB=system
CMAKE_OPTIONS += -DWITH_ZSTD=system
CMAKE_OPTIONS += -DWITH_ICU=system
CMAKE_OPTIONS += -DWITH_INNODB_MEMCACHED=1
CMAKE_OPTIONS += -DWITH_BOOST=$(SOURCE_DIR)/boost
CMAKE_OPTIONS += -DWITH_ROUTER=OFF
CMAKE_OPTIONS += -DCMAKE_VERBOSE_MAKEFILE:BOOL=TRUE

# merge_innodb_tests-t fails on SPARC:  https://bugs.mysql.com/bug.php?id=111824
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

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
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network
