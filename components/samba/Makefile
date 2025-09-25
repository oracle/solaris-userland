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

COMPILER =		gcc
BUILD_BITS =		64_and_32
CTF_MODE =		relaxed

include			../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		samba
COMPONENT_PROJECT_URL=	http://www.samba.org/
COMPONENT_BUGDB=	utility/samba
COMPONENT_ANITYA_ID=	4758
COMPONENT_BAID=		342856
COMPONENT_VERSION=	4.22.4
COMPONENT_ARCHIVE_URL=	https://download.samba.org/pub/samba/stable/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	\
	sha256:a41a828848abdf5e942c900ca178597e18aab7b61d3c06a9b5ba43661988010b
COMPONENT_SRC_URL=	$(COMPONENT_ARCHIVE_URL)

#
# Install target is 64-bit only. In 32-bit mode, just do partial build to make
# NSS and PAM plugins and NSS hook. Don't install anything.... The binaries
# will be cherry-picked from the build directory.
#
INSTALL_TARGET=		$(INSTALL_64) $(BUILD_32)

TEST_TARGET=		$(NO_TESTS)

include	$(WS_MAKE_RULES)/common.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types -Wno-int-conversion

#
# Linker refuses to link 32-bit binaries without explicit -m32 LDFLAGS.
#
LDFLAGS+=		-m$(BITS)

COMPONENT_PRE_CONFIGURE_ACTION+= \
	$(CLONEY) $(SOURCE_DIR) $(@D);

PREFIX=			/usr/lib/samba
CONFIGURE_PREFIX=	$(PREFIX)
CONFIGURE_DEFAULT_DIRS=	no

PYTHON_VERSION=		3.11
SAMBA_PROTO_PYDIR=	$(PROTO_DIR)$(PREFIX)/lib/python$(PYTHON_VERSION)
#
# List of python scripts can be obtained by:
# ggrep -rlI '^\#!.*python' build/prototype/$(uname -p)/ | \
#	sed -e "s@build/prototype/$(uname -p)/@\$(PROTO_DIR)/@"
#
PYTHON_SCRIPTS+=	\
	$(PROTO_DIR)$(PREFIX)/sbin/samba-gpupdate \
	$(PROTO_DIR)$(PREFIX)/bin/samba-log-parser \
	$(PROTO_DIR)$(PREFIX)/bin/samba-tool \
	$(SAMBA_PROTO_PYDIR)/site-packages/samba/subunit/run.py \
	$(SAMBA_PROTO_PYDIR)/site-packages/tests/*.py

CONFIGURE_ENV+=		\
	PATH=$(GNUBIN):$(USRBINDIR):/usr/perl5/$(PERL_VERSION)/bin \
	ADDITIONAL_CFLAGS='-DDISABLE_PROC_FDS=1'
CONFIGURE_ENV+=		PYTHON="$(PYTHON)"
CONFIGURE_OPTIONS+=	--localstatedir=/var/samba
CONFIGURE_OPTIONS+=	--includedir=/usr/include/samba
CONFIGURE_OPTIONS+=	--sysconfdir=/etc/samba
CONFIGURE_OPTIONS+=	--datarootdir=$(PREFIX)
CONFIGURE_OPTIONS+=	--mandir=/usr/share/man
CONFIGURE_OPTIONS+=	--with-logfilebase=/var/samba/log
CONFIGURE_OPTIONS+=	--with-privatedir=/etc/samba/private
CONFIGURE_OPTIONS+=	--with-privatelibdir=$(PREFIX)/private/$(MACH64)
CONFIGURE_OPTIONS+=	--with-pammodulesdir=$(PREFIX)/security/$(MACH64)
CONFIGURE_OPTIONS+=	--with-ads
CONFIGURE_OPTIONS+=	--with-winbind
CONFIGURE_OPTIONS+=	--with-ldap
CONFIGURE_OPTIONS+=	--without-ldb-lmdb
CONFIGURE_OPTIONS+=	--without-ad-dc
CONFIGURE_OPTIONS+=	--without-quotas
CONFIGURE_OPTIONS+=	--without-fam
CONFIGURE_OPTIONS+=	--bundled-libraries=ALL
CONFIGURE_OPTIONS+=	--with-system-mitkrb5
CONFIGURE_OPTIONS+=	--with-shared-modules=vfs_worm,vfs_zfsacl,vfs_cacheprime,vfs_commit,idmap_ldap,idmap_tdb2,idmap_rid,idmap_ad,idmap_hash,idmap_adex
#
# 32-bit build is only to build NSS winbind plugin,
# don't bother with python modules.
#
CONFIGURE_OPTIONS.32+=	--disable-python

#
# In 32-bit mode, only build NSS plugin and hook.
# There seems to be a race condition in build in WAF scripts so force -j 1.
# The -j 1 makes WAF single threaded, but it doesn't hurt since we do it
# only in 32-bit mode which is a partial build only.
#
COMPONENT_BUILD_ARGS.32= \
			-j 1 nss_winbind winbind_nss_hook pamwinbind

RMRPATH= 		$(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH"

COMPONENT_POST_INSTALL_ACTION.64+=	\
	echo "Creating $(PROTO_DIR)/etc/samba/smb.conf-example"; \
	$(MKDIR) $(PROTO_DIR)/etc/samba ; \
	sed -f $(COMPONENT_DIR)/Solaris/smbconf.sed \
	$(SOURCE_DIR)/examples/smb.conf.default \
	> $(PROTO_DIR)/etc/samba/smb.conf-example; \
	echo "Compiling .pyc's..."; \
	$(PYTHON) -m compileall $(SAMBA_PROTO_PYDIR);

COMPONENT_POST_BUILD_ACTION.32+=	\
	echo "Copying NSS and PAM libraries..."; \
	mkdir -p $(PROTO_DIR)$(PREFIX)/lib/ $(PROTO_DIR)$(PREFIX)/security/; \
	cp $(BUILD_DIR_32)/bin/plugins/nss_winbind.so.1 \
	$(PROTO_DIR)$(PREFIX)/lib/nss_winbind.so.1; \
	cp $(BUILD_DIR_32)/bin/plugins/pam_winbind.so \
	$(PROTO_DIR)$(PREFIX)/security/pam_winbind.so; \
	cp $(BUILD_DIR_32)/bin/shared/libwinbind_nss_hook.so.1 \
	$(PROTO_DIR)$(PREFIX)/lib/libwinbind_nss_hook.so.1; \
	echo "Fixing RPATH..."; \
	$(RMRPATH) $(PROTO_DIR)$(PREFIX)/lib/nss_winbind.so.1; \
	$(RMRPATH) $(PROTO_DIR)$(PREFIX)/security/pam_winbind.so; \
	$(RMRPATH) $(PROTO_DIR)$(PREFIX)/lib/libwinbind_nss_hook.so.1;

#
# Feed transforms/autopyc with PYVER
#
PKG_MACROS += PYVER=$(PYTHON_VERSION)

REQUIRED_PACKAGES += library/desktop/search/tracker
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/jansson
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/perl-5/parse-yapp
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += system/network/ldap/openldap
