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
# Copyright (c) 2014, 2018, Oracle and/or its affiliates. All rights reserved.
#

# Prefer 32-bit over 64-bit as apr-util has its own custom package layout.
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

APU_VERSION=1.6
MICRO_VERSION=1

COMPONENT_NAME=		apr-util
COMPONENT_VERSION=	$(APU_VERSION).$(MICRO_VERSION)
COMPONENT_PROJECT_URL=	https://apr.apache.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:b65e40713da57d004123b6319828be7f1273fbc6490e145874ee1177e112c459
COMPONENT_ARCHIVE_URL=	https://archive.apache.org/dist/apr/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	96

TPNO=			41351

CONFIGURE_DEFAULT_DIRS=no
include $(WS_MAKE_RULES)/common.mk

PKG_MACROS+= APU_VERSION=$(APU_VERSION)
PKG_MACROS+= MICRO_VERSION=$(MICRO_VERSION)

PATCH_LEVEL=0

CONFIGURE_PREFIX=$(USRDIR)/apr-util/$(APU_VERSION)

CONFIGURE_OPTIONS.64 +=	--with-mysql=$(USRDIR)/mysql/5.7
CONFIGURE_OPTIONS +=	--with-expat=$(USRDIR)
CONFIGURE_OPTIONS +=	--with-sqlite3=$(USRDIR)
CONFIGURE_OPTIONS +=	--with-ldap=ldap_r-2.4
CONFIGURE_OPTIONS +=	--with-ldap-include=$(USRINCDIR)/openldap
CONFIGURE_OPTIONS +=	--without-odbc
CONFIGURE_OPTIONS.32 +=	--enable-layout=Solaris
CONFIGURE_OPTIONS.64 +=	--enable-layout=Solaris-$(MACH64)
CONFIGURE_OPTIONS.32 +=	--with-apr=$(USRDIR)/apr/1.6/bin/apr-1-config
CONFIGURE_OPTIONS.64 +=	--with-apr=$(USRDIR)/apr/1.6/bin/$(MACH64)/apr-1-config

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(SPRO_VROOT)/bin:$(USRBINDIR):$(GNUBIN)
else
PATH=$(SPRO_VROOT)/bin:$(USRBINDIR):$(GNUBIN)
endif

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

REQUIRED_PACKAGES += database/mysql-57
REQUIRED_PACKAGES += database/mysql-57/library
REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += library/apr-16
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network/ldap/openldap
