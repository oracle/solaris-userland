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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		proftpd
COMPONENT_VERSION=	1.3.6
COMPONENT_SUBVERSION=
HUMAN_VERSION=		$(COMPONENT_VERSION)$(COMPONENT_SUBVERSION)
COMPONENT_PROJECT_URL=	http://www.proftpd.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH=	\
    sha256:3132515ea8eb30fd29812d57a0366a926244df956d74fbc3d2710a2b13bb47ba
COMPONENT_ARCHIVE_URL=	https://github.com/proftpd/proftpd/archive/v$(COMPONENT_VERSION).zip
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	service/proftpd
TPNO_PROFTPD=		42272
COMPONENT_ANITYA_ID=	7609

# mod_gss subcomponent
COMPONENT_NAME_1=	mod_gss
COMPONENT_VERSION_1=	1.3.8
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
#
# Note: we want to fetch mod_gss-1.3.8b.tar.gz
#
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1)b.tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:5322b11901108f4a6f0009c4a67bf6e6980fa9c016b24fc64b986c8529d3e58b
MOD_GSS_URL=https://sourceforge.net/projects/gssmod/files/mod_gss/Version%20
COMPONENT_ARCHIVE_URL_1= $(MOD_GSS_URL)$(COMPONENT_VERSION_1)/$(COMPONENT_ARCHIVE_1)
TPNO_MOD_GSS=		42688

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# libcheck and specific Perl Test::Unit version is required for full test
TEST_TARGET= $(SKIP_TEST)
include $(WS_MAKE_RULES)/common.mk

CFLAGS += -I$(USRINCDIR)/kerberosv5 -DHAVE_KRB5_H=1 -DKRB5_DLLIMP= -DHAVE__GETGRPSBYMEMBER -D_SOLARIS_DTRACE
ifeq ($(OS_VERSION), 11.3)
CFLAGS += -D_POSIX_PTHREAD_SEMANTICS
endif
LDFLAGS +=	-m$(BITS)
# Force immediate (no-lazy) binding because of chroot() can loose the access
# into (/usr)/lib
LDFLAGS +=	-z now -z guidance=nolazyload -z nolazyload -lbsm

CONFIGURE_OPTIONS +=	install_user=`id -nu`
CONFIGURE_OPTIONS +=	install_group=`groups | cut -f 1 -d ' '`
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)/run
CONFIGURE_OPTIONS +=	--libexecdir=$(USRLIBDIR)/proftpd/$(MACH64)
CONFIGURE_OPTIONS +=	--enable-ipv6
CONFIGURE_OPTIONS +=	--enable-ctrls
CONFIGURE_OPTIONS +=	--enable-facl
CONFIGURE_OPTIONS +=	--enable-nls
CONFIGURE_OPTIONS +=	--enable-dso
CONFIGURE_OPTIONS +=	--enable-openssl
CONFIGURE_OPTIONS +=	--enable-tests
CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=	--with-modules=mod_solaris_audit:mod_solaris_priv
CONFIGURE_OPTIONS +=	--with-shared=mod_facl:mod_wrap:mod_tls:mod_tls-fips-140:mod_auth_gss:mod_gss:mod_ifsession
CONFIGURE_OPTIONS +=	--enable-buffer-size=16384
CONFIGURE_OPTIONS +=	FIPS_CPPFLAGS="-I/usr/include/openssl/fips-140"
CONFIGURE_OPTIONS +=	FIPS_LDFLAGS="-R/lib/openssl/fips-140/64"

# Copy Solaris modules and GSSAPI modules to proftpd source tree.
COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CP) mod_solaris_audit.c $(SOURCE_DIR)/contrib ; \
	$(CP) mod_solaris_priv.c $(SOURCE_DIR)/contrib ; \
	cd $(SOURCE_DIR) ; \
	autoconf ; \
	cd .. ; \
	cd $(BUILD_DIR) ; \
	$(UNPACK) $(UNPACK_ARGS) ../$(COMPONENT_ARCHIVE_1) ; \
	cd $(COMPONENT_SRC_1) ; \
	$(GPATCH) < ../../mod_gss-patches/001.24934631.patch ; \
	./configure CC="$(CC)" CFLAGS="-I/usr/include/kerberosv5"; \
	$(CP) mod_gss.c mod_auth_gss.c $(SOURCE_DIR)/contrib ; \
	$(CP) mod_gss.h $(SOURCE_DIR)/include ; \
	$(CP) mod_gss.html $(SOURCE_DIR)/doc/contrib ; \
	$(CLONEY) $(SOURCE_DIR) $(@D))

# Build Solaris dtrace object files and copy to proftpd build tree.
COMPONENT_PRE_BUILD_ACTION = \
	(cd dtrace && make CP="$(CP)" CC="$(CC)" BD="$(BUILD_DIR)/$(MACH$(BITS))" BITS="$(BITS)")

# proftpd configure and build is not ready for run out of the source tree
CONFIGURE_SCRIPT =	$(@D)/configure

# Do not apply the standard license transforms for this component. The
# license actions in the proftpd.p5m file are already tagged with the
# attributes.
LICENSE_TRANSFORMS =

REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network
