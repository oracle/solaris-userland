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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

PATH=$(dir $(CC)):$(USRBINDIR):$(GNUBIN)

COMPONENT_NAME=		unixODBC
COMPONENT_VERSION=	2.3.11
COMPONENT_PROJECT_URL=	http://www.unixodbc.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:d9e55c8e7118347e3c66c87338856dad1516b490fb7c756c1562a2c267c73b5c
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	library/unixodbc
COMPONENT_ANITYA_ID=	7344

COMPONENT_BAID=		142158

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)

# Enable C99 mode + -Xc for its additional warnings.
studio_C99MODE = -Xc $(studio_C99_ENABLE)

# -xinline=%auto -- we like inlining where appropriate
CFLAGS.studio += -xinline=%auto

# -xbuiltin=%none -- builtins have been known to be buggy
CFLAGS.studio += -xbuiltin=%none

CFLAGS += $(CPP_LARGEFILES)
CFLAGS += $(XPG6MODE)
CFLAGS += $(CPP_POSIX)
CFLAGS += $(CPP_C99_EXTENDED_MATH)
CFLAGS.studio += $(studio_PIC)

X11LIB.32 = $(CONFIGURE_LIBDIR.32)
X11LIB.64 = $(CONFIGURE_LIBDIR.64)

LD_OPTIONS += $(LIBSOCKET) $(LIBNSL)
LD_OPTIONS += -lresolv -lgen

CONFIGURE_OPTIONS  +=	--includedir=$(CONFIGURE_PREFIX)/include/odbc
CONFIGURE_OPTIONS  +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=	--sysconfdir=$(ETCDIR)/odbc
CONFIGURE_OPTIONS  +=	--x-includes="$(CONFIGURE_PREFIX)/include"
CONFIGURE_OPTIONS  +=	--x-libraries="$(X11LIB.$(BITS))"
CONFIGURE_OPTIONS  +=	--enable-shared
CONFIGURE_OPTIONS  +=	--disable-static
CONFIGURE_OPTIONS  +=	--disable-libtool-lock
CONFIGURE_OPTIONS  +=	--disable-gui
CONFIGURE_OPTIONS  +=	--enable-threads
CONFIGURE_OPTIONS  +=	--disable-gnuthreads
CONFIGURE_OPTIONS  +=	--enable-readline
CONFIGURE_OPTIONS  +=	--enable-inicaching
CONFIGURE_OPTIONS  +=	--enable-drivers=yes
CONFIGURE_OPTIONS  +=	--enable-driver-config=yes
CONFIGURE_OPTIONS  +=	--enable-fdb
CONFIGURE_OPTIONS  +=	--enable-odbctrace
CONFIGURE_OPTIONS  +=	--enable-iconv
CONFIGURE_OPTIONS  +=	--enable-stats
CONFIGURE_OPTIONS  +=	--enable-rtldgroup
CONFIGURE_OPTIONS  +=	--disable-ltdllib
CONFIGURE_OPTIONS  +=	--without-pth
CONFIGURE_OPTIONS  +=	--without-pth-test
CONFIGURE_OPTIONS  +=	--with-libiconv-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=	--disable-ltdl-install
CONFIGURE_OPTIONS  +=	--with-pic
CONFIGURE_OPTIONS  +=   MAKE="$(GMAKE)"

CONFIGURE_ENV  +=   LD="$(CC) $(CFLAGS) $(LDFLAGS)"
CONFIGURE_ENV  +=   INSTALL="$(INSTALL)"

COMPONENT_POST_INSTALL_ACTION.32 += \
	($(MKDIR) $(PROTOPKGCONFIGDIR); \
	$(GSED) -e 's|SED_SIZEOF_LONG|4|g' -e 's|SED_VERSION|$(COMPONENT_VERSION)|g' \
	    $(COMPONENT_DIR)/Solaris/unixODBC.pc > \
	    $(PROTOPKGCONFIGDIR)/unixODBC.pc);

COMPONENT_POST_INSTALL_ACTION.64 += \
	($(MKDIR) $(PROTOPKGCONFIGDIR64); \
	$(GSED) -e 's|SED_SIZEOF_LONG|8|g' -e 's|SED_VERSION|$(COMPONENT_VERSION)|g' \
	    $(COMPONENT_DIR)/Solaris/unixODBC.pc > \
	    $(COMPONENT_DIR)/unixODBC.pc.1; \
	$(GSED) -e 's|/lib|/lib/$(MACH64)|g' \
	    $(COMPONENT_DIR)/unixODBC.pc.1 > \
	    $(PROTOPKGCONFIGDIR64)/unixODBC.pc; \
	$(RM) -f $(COMPONENT_DIR)/unixODBC.pc.1);

COMPONENT_POST_INSTALL_ACTION.64 += ( \
	diff -D _LP64 $(BUILD_DIR_32)/unixodbc.h \
   	  $(BUILD_DIR_64)/unixodbc.h > $(PROTOUSRINCDIR)/odbc/unixodbc.h; \
	diff -D _LP64 $(BUILD_DIR_32)/config.h \
   	  $(BUILD_DIR_64)/config.h > $(PROTOUSRINCDIR)/odbc/unixODBC/config.h ; \
	diff -D _LP64 $(BUILD_DIR_32)/unixodbc_conf.h \
   	  $(BUILD_DIR_64)/unixodbc_conf.h > $(PROTOUSRINCDIR)/odbc/unixODBC/unixodbc_conf.h ; \
	true );

REQUIRED_PACKAGES += library/libtool/libltdl
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += system/library/math
