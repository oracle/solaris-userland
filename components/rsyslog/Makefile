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
# Copyright (c) 2012, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		rsyslog
COMPONENT_VERSION=	8.1904.0
COMPONENT_PROJECT_URL=	https://www.rsyslog.com/
COMPONENT_ARCHIVE_HASH=	sha256:7098b459dfc3f8bfc35d5b114c56e7945614ba76efa4e513b1db9c38b0ff9c3d
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)files/download/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	service/rsyslog
COMPONENT_ANITYA_ID=	4218

TPNO=                   51086

# The documentation is in a separate download
COMPONENT_SRC_DOC=		$(COMPONENT_NAME)-doc-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_DOC=		$(COMPONENT_SRC_DOC).tar.gz
COMPONENT_ARCHIVE_HASH_DOC=	sha256:ad2bb3522b261f2ab511b68cfcdb5e6168d2cc6b3e8fcea35b112d2ab3310fb1
COMPONENT_ARCHIVE_URL_DOC=	$(COMPONENT_PROJECT_URL)files/download/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE_DOC)

UNPACK_ARGS_DOC=		-r $(COMPONENT_SRC_DOC)

# Libfastjson library statically linked to rsyslog
COMPONENT_NAME_LIB        = libfastjson
COMPONENT_VERSION_LIB     = 0.99.8
COMPONENT_PROJECT_URL_LIB = https://github.com/rsyslog/libfastjson
COMPONENT_SRC_LIB         = $(COMPONENT_NAME_LIB)-$(COMPONENT_VERSION_LIB)
COMPONENT_ARCHIVE_LIB     = v$(COMPONENT_VERSION_LIB).tar.gz
COMPONENT_ARCHIVE_HASH_LIB = sha256:7e49057b26a5a9e3c6623e024f95f9fd9a14b571b9150aeb89d6d475fc3633e3
COMPONENT_ARCHIVE_URL_LIB = https://github.com/rsyslog/libfastjson/archive/$(COMPONENT_ARCHIVE_LIB)
COMPONENT_ANITYA_ID_LIB   = 12043

TPNO_LIB = 46846

include $(WS_MAKE_RULES)/common.mk

# Prepare target specific CONFIGURE_OPTIONS
CONFIGURE_OPTIONS += $(TS_CONFIGURE_OPTIONS)

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS += MAKE=$(GMAKE)

### Libfastjson configuration ###

# Convenience targets
LIB_CONFIGURE := $(BUILD_DIR)/$(COMPONENT_SRC_LIB)/.configured
LIB_BUILD := $(BUILD_DIR)/$(COMPONENT_SRC_LIB)/.built
LIB_TEST_AND_COMPARE := $(BUILD_DIR)/$(COMPONENT_SRC_LIB)/.tested-and-compared

# Generate libfastjson configure file
COMPONENT_PREP_ACTION += (cd $(SOURCE_DIR_LIB) ; autoreconf -fiv )

# Set correct configure source dir
$(LIB_CONFIGURE): SOURCE_DIR = $(SOURCE_DIR_LIB)
# Libfastjson tests can't find their headers or data files unless we clone the source tree
$(LIB_CONFIGURE): COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR_LIB) $(BUILD_DIR)/$(COMPONENT_SRC_LIB));
# Build only static library to prevent accidental dynamic linking
$(LIB_CONFIGURE): TS_CONFIGURE_OPTIONS = --disable-shared
# Libfastjson should be built with these flags to prevent link time errors
$(LIB_CONFIGURE): CFLAGS += -fPIC -DPIC

# Libfastjson must be installed before rsyslog configure can starts
$(BUILD_DIR)/$(MACH64)/.configured: $(LIB_BUILD)


### Rsyslog ###

# Set libfastjson link variables
TS_CONFIGURE_OPTIONS = LIBFASTJSON_CFLAGS=-I$(BUILD_DIR)/$(COMPONENT_SRC_LIB)
TS_CONFIGURE_OPTIONS += LIBFASTJSON_LIBS="-L$(BUILD_DIR)/$(COMPONENT_SRC_LIB)/.libs -lfastjson"

# This is needed for things to be built correctly.
CFLAGS += -std=c99

# A normal 64-bit build would result in /usr/lib/$(MACH64)/rsyslog but since we
# have a self-contained eco-system, simplify things for customers and just use
# /usr/lib/rsyslog .
CONFIGURE_LIBDIR.64 =	$(CONFIGURE_LIBDIR.32)

# The configure script runs the pkg-config command. This allows it to
# find the non-default GnuTLS v3 library.

# Rsyslog sources contain __FILE__ macros which contain full path to the workspace
# This may appear in debug output which is not nice. By specifying the source
# path relative we force the macro to be relative path too.
TS_CONFIGURE_OPTIONS += --srcdir=../../$(COMPONENT_NAME)-$(COMPONENT_VERSION)
TS_CONFIGURE_OPTIONS += --enable-imsolaris
TS_CONFIGURE_OPTIONS += --enable-mail
TS_CONFIGURE_OPTIONS += --enable-gssapi_krb5
TS_CONFIGURE_OPTIONS += --enable-gnutls
TS_CONFIGURE_OPTIONS += --disable-klog
TS_CONFIGURE_OPTIONS += --sbindir=$(USRLIBDIR)/rsyslog

TS_CONFIGURE_OPTIONS += --enable-imfile
TS_CONFIGURE_OPTIONS += --enable-impstats
TS_CONFIGURE_OPTIONS += --enable-mysql
TS_CONFIGURE_OPTIONS += --enable-omstdout
TS_CONFIGURE_OPTIONS += --enable-omuxsock
TS_CONFIGURE_OPTIONS += --enable-extended-tests

# Configure test suite
TS_CONFIGURE_OPTIONS += --enable-testbench
TS_CONFIGURE_OPTIONS += --enable-imdiag
TS_CONFIGURE_OPTIONS += --enable-extended-tests

# libgcrypt is not approved.
TS_CONFIGURE_OPTIONS += --disable-libgcrypt

# There are man pages in the tarball, which will require modification for
# content. Also, building them from here requires python-docutils.
TS_CONFIGURE_OPTIONS += --disable-generate-man-pages

CONFIGURE_ENV += "MYSQL_CONFIG=/usr/mysql/5.7/bin/mysql_config"

# Make the build verbose, show executed commands
COMPONENT_BUILD_ARGS += AM_DEFAULT_VERBOSITY=1

# common targets
PROTODOCDIR = $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_NAME)

# Docs to install are the tree under docs/build with some exceptions.
COMPONENT_POST_INSTALL_ACTION += \
	($(MKDIR) $(PROTODOCDIR) ; \
	cd $(COMPONENT_SRC_DOC)/build ; \
	find . \(    -name '_sources' \
	          -o -name '.doctrees' \
	          -o -name '.buildinfo' \
	          -o -name 'objects.inv' \) \
	     -prune -o -print0 \
	| cpio -pd0u $(PROTODOCDIR))


# run Libfastjson tests as well (before running rsyslog tests)
$(BUILD_DIR)/$(MACH64)/.tested-and-compared: $(LIB_TEST_AND_COMPARE)

libtest: $(LIB_TEST_AND_COMPARE)

$(LIB_TEST_AND_COMPARE): COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-libfastjson.master
$(LIB_TEST_AND_COMPARE): COMPONENT_TEST_BUILD_DIR = $(BUILD_DIR)/test/$(COMPONENT_SRC_LIB)

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-rsyslog.master

# Tests need gnu version of coreutils to work correctly
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"

# gmake test will generate different outputs if run multiple
# times. This gets rid of all the unimportant output

COMPONENT_TEST_TRANSFORMS += '-n -e "/=====/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/PASS/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/SKIP/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/FAIL/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/ERROR/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/TOTAL/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/Testsuite summary/p"'

REQUIRED_PACKAGES += database/mysql-57
REQUIRED_PACKAGES += database/mysql-57/library
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/json-c
REQUIRED_PACKAGES += library/libestr
REQUIRED_PACKAGES += library/liblogging
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += web/curl
