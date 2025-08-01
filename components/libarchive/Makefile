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
# Copyright (c) 2012, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libarchive
COMPONENT_VERSION=	3.8.1
COMPONENT_PROJECT_URL=	http://www.libarchive.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:bde832a5e3344dc723cfe9cc37f8e54bde04565bfe6f136bc1bd31ab352e9fab
COMPONENT_ARCHIVE_URL= \
    https://github.com/libarchive/libarchive/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libarchive
COMPONENT_ANITYA_ID=	1558


COMPONENT_BAID=		331521

TEST_TARGET= install $(TEST_32_and_64)
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_32_and_64)

include $(WS_MAKE_RULES)/common.mk

# Use GNU compiler instead of Solaris Studio to get a properly aligned
# uncompressed_size attribute (uint64_t) in alone_header structure.
# See file: libarchive/archive_read_support_format_zip.c
COMPILER=gcc

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --enable-largefile
# We prefer openssl over nettle.
CONFIGURE_OPTIONS += --without-nettle
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-xml2
CONFIGURE_OPTIONS += --with-zlib
# Commands bsdtar, bsdcpio, bsdcat and bsdunzip are not delivered.
CONFIGURE_OPTIONS += --disable-bsdtar
CONFIGURE_OPTIONS += --disable-bsdcpio
CONFIGURE_OPTIONS += --disable-bsdcat
CONFIGURE_OPTIONS += --disable-bsdunzip

COMPONENT_BUILD_ARGS +=	CFLAGS="$(CFLAGS)"
COMPONENT_TEST_ARGS +=	CFLAGS="$(CFLAGS)"
COMPONENT_TEST_ENV +=	TMPDIR="$(COMPONENT_TEST_BUILD_DIR)"

# Get correct libarchive.so from the proto area.
TEST_LIBPATH.32 =       $(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =       $(PROTOUSRLIBDIR64)
COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))

# We need GNU awk for the following to work; hence the PATH tweak.
# We then convert BSD-style section numbers in the libarchive man pages to
# Solaris-style section numbers.
COMPONENT_PREP_ACTION = \
	cd $(@D)/doc/man ; rm *.[135] ; env PATH=$(GNUBIN):$$PATH gmake all ; \
	cd $(@D)/libarchive ; \
	find . -name "*\.[35]" | xargs $(GSED) -i 's/\(Xr.*\|Dt.*\)3/\13ARCHIVE/' ; \
	find . -name "*\.[35]" | xargs $(GSED) -i \
	-e 's/Xr \(malloc\|getpwuid\|getgrgud\|strerror\|printf\|getpwnam\|getgrnam\) 3ARCHIVE/Xr \13C/' \
	-e 's/\(Dt.*LIBARCHIVE.*\)3ARCHIVE/\13LIB/' \
	-e 's/Xr \(libarchive\|archive\) 3ARCHIVE/Xr libarchive 3LIB/';

PKG_PROTO_DIRS += $(COMPONENT_SRC)/doc/man

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/ ok/p" ' \
	'-e "/ FAIL/p" ' \
	'-e "/Totals:/p" ' \
	'-e "/Tests run:/p" ' \
	'-e "/Tests failed:/p" ' \
	'-e "/Assertions failed:/p" ' \
	'-e "/Skips reported:/p" ' \
	'-e "/Failing tests:/p" ' \
	'-e "/ failure/p" ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" ' \
        '-e "/=========/p" ' \

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
