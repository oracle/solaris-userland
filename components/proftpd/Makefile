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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		proftpd
COMPONENT_VERSION=	1.3.8c
IPS_COMPONENT_VERSION=	1.3.8.3.0
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	http://www.proftpd.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:2a48f2ca338456e750d2373bf671025ed799e04e0baa16c7bb8dbfd67d8734d2
COMPONENT_ARCHIVE_URL= ftp://ftp.proftpd.org/distrib/source/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	service/proftpd
COMPONENT_BAID_PROFTPD=	191398
# For check_anitya target, https://release-monitoring.org/project/7609
COMPONENT_ANITYA_ID=	7609

# mod_gss subcomponent
COMPONENT_NAME_1=	mod_gss
COMPONENT_VERSION_1=	1.3.9
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:de8babe0f13800da2142be74d82686af3984419a2ec09c86516467be58bce9a7
MOD_GSS_URL=https://sourceforge.net/projects/gssmod/files/mod_gss/Version%20
COMPONENT_ARCHIVE_URL_1= $(MOD_GSS_URL)$(COMPONENT_VERSION_1)/$(COMPONENT_ARCHIVE_1)
COMPONENT_ANITYA_ID_1=	17188
# For check_anitya target, https://release-monitoring.org/project/17188
COMPONENT_BAID_MOD_GSS=	157143

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# libcheck and specific Perl Test::Unit version is required for full test
TEST_TARGET= $(TEST_64)
include $(WS_MAKE_RULES)/common.mk

CFLAGS += -I$(USRINCDIR)/kerberosv5 -DHAVE_KRB5_H=1 -DKRB5_DLLIMP= -DHAVE__GETGRPSBYMEMBER -D_SOLARIS_DTRACE
ifeq ($(OS_VERSION), 11.3)
CFLAGS += -D_POSIX_PTHREAD_SEMANTICS
endif
CFLAGS += -DPR_TUNABLE_PATH_MAX=16384	# current ~1k is not sufficient for GSSAPI
LDFLAGS +=	-m$(BITS)
# Force immediate (no-lazy) binding because of chroot() can loose the access
# into (/usr)/lib
LDFLAGS +=	-z now -z guidance=nolazyload -z nolazyload -lbsm

#
# forces build process to pickup /usr/gnu/bin/msgfmt
#
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

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
CONFIGURE_OPTIONS +=	--with-shared=mod_facl:mod_wrap:mod_tls:mod_auth_gss:mod_gss:mod_ifsession
CONFIGURE_OPTIONS +=	--enable-buffer-size=16384
CONFIGURE_OPTIONS +=	--disable-ncurses

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
	$(GPATCH) < ../../mod_gss-patches/002.27914767.patch ; \
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

# Test target, performs the API testing only.  See documentation for perl test.
COMPONENT_TEST_DIR =	$(BUILD_DIR)/$(MACH64)
COMPONENT_TEST_CMD =	$(GMAKE)
COMPONENT_TEST_TARGETS =	check
# Results are identical, no need for $(MACH64) specific files.
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
# Remove the building of the test tools, as that is a little noisy and a
# future minor change within a make-rules file would then show up there.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "1,/^\.\/api-tests/d" '
# Normalize some test specific failure output, ideally this wouldn't be
# necessary had tests all passed.  Transforms DATE, TIME, UID, and [NUMBER].
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]|\\$$(DATE)|g" ' \
	'-e "s|[0-2][0-9]:[0-5][0-9]:[0-5][[0-9]|\\$$(TIME)|g" ' \
	'-e "s|,[0-9]* \[[0-9]*\]|,\\$$(UID) [\\$$(NUMBER)]|" ' \
	'-e "s|^\[[0-9]*\]|[\\$$(NUMBER)]|" '
# Seeing inet_connect_ipv[46]_test getting timeout intermittently.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "/^api\/inet.c:[0-9]*:E:base:inet_connect_ipv[46]_test:0.*/d" '
# localhost is FQDN on test machines.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "/^api\/netaddr.c:[0-9]*:F:base:netaddr_get_dnsstr_test:0: Expected .localhost or localhost.localdomain.*/d" ' \
	'-e "/^api\/netaddr.c:[0-9]*:F:base:netaddr_get_dnsstr_ipv6_test:0: Expected .localhost, localhost.localdomain.*/d" '
# Three other errors being seen on test machines and not on Build machines.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "/^api\/netaddr.c:[0-9]*:F:base:netaddr_fnmatch_test:0: Expected TRUE, got 0/d" ' \
	'-e "/^api\/netacl.c:[0-9]*:F:base:netacl_match_test:0: Failed to positively match ACL to addr: Insufficient privileges/d" ' \
	'-e "/^api\/fsio.c:[0-9]*:F:base:fs_fgetsize_test:0: Failed to get fs size for fd 0: Operation not applicable/d" '
# With the above deletions the FAILED count can vary, so remove it.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|^\(99%: Checks: 813, Failures:\) \([0-9]*\)\(, Errors:\)\(.*\)|\1 ELIDED\3 ELIDED|" ' \
	'-e "/^ FAILED [1-9] test[s]*/d" '


# Do not apply the standard license transforms for this component. The
# license actions in the proftpd.p5m file are already tagged with the
# attributes.
LICENSE_TRANSFORMS =

REQUIRED_PACKAGES += library/libidn
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network
