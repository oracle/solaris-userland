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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		sqlite
TARBALL_VERSION=	3350500
COMPONENT_VERSION=	3.35.5
COMPONENT_PROJECT_URL=	http://www.sqlite.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-autoconf-$(TARBALL_VERSION)
COMPONENT_ARCHIVE_HASH= \
    sha256:a62f792ed3fd615f6717e02ac2f2a6e4f8a274862cdb94729a0a80ecf08b9ffa
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)2021/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	database/sqlite3
COMPONENT_ANITYA_ID=	4877

# Documentation
DOC_VERSION=		$(TARBALL_VERSION)
COMPONENT_SRC_1=        $(COMPONENT_NAME)-doc-$(DOC_VERSION)
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).zip
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:098257e33eb50254cccd31333b09eeafd5843fdd446e1c856c4b48b758573cb9
COMPONENT_ARCHIVE_URL_1=         $(COMPONENT_PROJECT_URL)2021/$(COMPONENT_ARCHIVE_1)
PKG_PROTO_DIRS +=       $(COMPONENT_SRC_1)

COMPONENT_BAID=		100003

TEST_TARGET= $(NO_TESTS)
COMPILER= gcc

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D)/tea; autoreconf -fiv)

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# Enable DSQLITE_ENABLE_FTS3_TOKENIZER to allow thunderbird work. Should disable it if
# thunderbird fixes that. Bugzilla id https://bugzilla.mozilla.org/show_bug.cgi?id=1252937
# Enable the column metadata since it is required by Qt5 framework.
CFLAGS +=	-D_POSIX_PTHREAD_SEMANTICS
CFLAGS +=	-DNDEBUG
CFLAGS +=	-DSQLITE_SECURE_DELETE
CFLAGS +=	-DSQLITE_ENABLE_FTS3
CFLAGS +=	-DUSE_PREAD
CFLAGS +=	-DHAVE_USLEEP
CFLAGS +=	-DHAVE_FDATASYNC
CFLAGS +=	-DHAVE_STATVFS
CFLAGS +=	-DSQLITE_ENABLE_DBSTAT_VTAB
CFLAGS +=	-DSQLITE_ENABLE_UNLOCK_NOTIFY
CFLAGS +=	-DSQLITE_ENABLE_FTS3_TOKENIZER
CFLAGS +=	-DSQLITE_ENABLE_STAT2
CFLAGS +=	-DSQLITE_ENABLE_COLUMN_METADATA
CFLAGS +=	-DSQLITE_MAX_SCHEMA_RETRY=25
CFLAGS +=	-DSQLITE_DEFAULT_PAGE_SIZE=32768
CFLAGS +=	-DSQLITE_MAX_DEFAULT_PAGE_SIZE=32768
CFLAGS +=	-DSQLITE_DEFAULT_PCACHE_INITSZ=0
CFLAGS +=	-I.

LDFLAGS+= $(CC_BITS)

CONFIGURE_OPTIONS +=	--enable-threadsafe
CONFIGURE_OPTIONS +=	--enable-dynamic-extensions
CONFIGURE_OPTIONS +=	--enable-shared
CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=   CC=$(CC)

TEA_CONFIGURE_OPTIONS.32 += --with-tcl="$(USRLIBDIR)"
TEA_CONFIGURE_OPTIONS.64 += --with-tcl="$(USRLIBDIR64)"
TEA_CONFIGURE_OPTIONS.64 += --enable-64bit
TEA_CONFIGURE_OPTIONS.sparc.64 += --enable-64bit-vis
TEA_CONFIGURE_OPTIONS = --enable-shared
TEA_CONFIGURE_OPTIONS += $(TEA_CONFIGURE_OPTIONS.$(BITS))
TEA_CONFIGURE_OPTIONS += $(TEA_CONFIGURE_OPTIONS.$(MACH))
TEA_CONFIGURE_OPTIONS += $(TEA_CONFIGURE_OPTIONS.$(MACH).$(BITS))
TEA_CONFIGURE_OPTIONS += ac_cv_cross=no
TEA_CONFIGURE_OPTIONS += CC=$(CC)

COMPONENT_POST_CONFIGURE_ACTION = \
	(cd $(@D)/tea ; $(ENV) $(CONFIGURE_ENV) $(CONFIG_SHELL) \
	./configure $(TEA_CONFIGURE_OPTIONS));

COMPONENT_POST_BUILD_ACTION = \
	(cd $(@D)/tea ; $(ENV) $(COMPONENT_BUILD_ENV) \
	$(GMAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS));

TCL_DIR := $(PROTO_DIR)/usr/lib/tcl$(TCL_VERSION)/sqlite$(COMPONENT_VERSION)

COMPONENT_POST_INSTALL_ACTION.32 = \
  (cd $(@D)/tea; $(MKDIR) $(TCL_DIR)/32; \
   cp libsqlite$(COMPONENT_VERSION).so $(TCL_DIR)/32/);

COMPONENT_POST_INSTALL_ACTION.64 = \
  (cd $(@D)/tea; $(MKDIR) $(TCL_DIR)/64; \
   cp libsqlite$(COMPONENT_VERSION).so $(TCL_DIR)/64/);

COMPONENT_POST_INSTALL_ACTION += \
  ( \
    cp $(COMPONENT_DIR)/files/pkgIndex.tcl $(TCL_DIR); \
    $(GSED) -i -e "s/%%%SQLITE_VERSION%%%/$(COMPONENT_VERSION)/g" $(TCL_DIR)/pkgIndex.tcl; \
    $(MKDIR) $(PROTO_DIR)/usr/share/doc/sqlite3/; \
    rsync -r $(COMPONENT_DIR)/$(COMPONENT_SRC_1)/ $(PROTO_DIR)/usr/share/doc/sqlite3/ \
  )

PKG_MACROS += TCL_VERSION=$(TCL_VERSION)

REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/math
