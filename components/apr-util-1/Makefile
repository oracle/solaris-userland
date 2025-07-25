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
# Copyright (c) 2014, 2025, Oracle and/or its affiliates.
#

# Prefer 32-bit over 64-bit as apr-util has its own custom package layout.
BUILD_BITS =		32_and_64
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

APU_VERSION=1
MINOR_VERSION=6
MICRO_VERSION=3

COMPONENT_NAME=		apr-util
COMPONENT_VERSION=	$(APU_VERSION).$(MINOR_VERSION).$(MICRO_VERSION)
COMPONENT_PROJECT_URL=	https://apr.apache.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:2b74d8932703826862ca305b094eef2983c27b39d5c9414442e9976a9acf1983
COMPONENT_ARCHIVE_URL=	https://archive.apache.org/dist/apr/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	96

COMPONENT_BAID=		138301

CONFIGURE_DEFAULT_DIRS=no
include $(WS_MAKE_RULES)/common.mk

PKG_MACROS+= APU_VERSION=$(APU_VERSION)
PKG_MACROS+= MICRO_VERSION=$(MICRO_VERSION)

PATCH_LEVEL=0

CONFIGURE_PREFIX=$(USRDIR)/apr-util/1

CONFIGURE_OPTIONS +=    --with-openssl
CONFIGURE_OPTIONS +=    --with-nss

CONFIGURE_OPTIONS.64 +=	--with-mysql=$(USRDIR)/mysql/8.0
CONFIGURE_OPTIONS +=	--with-crypto
CONFIGURE_OPTIONS +=	--with-expat=$(USRDIR)
CONFIGURE_OPTIONS +=	--with-sqlite3=$(USRDIR)
CONFIGURE_OPTIONS +=	--with-ldap
CONFIGURE_OPTIONS +=	--without-odbc
CONFIGURE_OPTIONS.32 +=	--enable-layout=Solaris
CONFIGURE_OPTIONS.64 +=	--enable-layout=Solaris-$(MACH64)
CONFIGURE_OPTIONS.32 +=	--with-apr=$(USRDIR)/apr/1/bin/apr-1-config
CONFIGURE_OPTIONS.64 +=	--with-apr=$(USRDIR)/apr/1/bin/$(MACH64)/apr-1-config

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(SPRO_VROOT)/bin:$(USRBINDIR):$(GNUBIN)
else
PATH=$(SPRO_VROOT)/bin:$(USRBINDIR):$(GNUBIN)
endif

# Avoid RPATH to Studio compiler for apr_dbd_mysql-1.so.
COMPONENT_PRE_BUILD_ACTION += (cd $(@D); gsed -i 's/-latomic//g' Makefile);

COMPONENT_TEST_TARGETS= test

COMPONENT_TEST_TRANSFORMS += \
	'-e "/^teststatus=0;/,/make\[2\]: Leaving directory/p" ' \
	'-e "/.*/d" '

$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
        cd $(SOURCE_DIR); \
        sed 's;OUTPUT_DIRECTORY=.*;OUTPUT_DIRECTORY=$(PROTO_DIR)$(CONFIGURE_PREFIX);' \
          docs/doxygen.conf | doxygen - ;

# Some patches need configure script recreation.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fi);

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += database/mysql-80
REQUIRED_PACKAGES += database/mysql-80/library
REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += library/apr-1
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network/ldap/openldap
