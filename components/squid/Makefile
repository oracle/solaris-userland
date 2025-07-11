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
COMPILER =		gcc
CTF_MODE =		off	# C++

include ../../make-rules/shared-macros.mk

PATH=$(USRBINDIR):$(GNUBIN):$(USRSBINDIR):$(USRDIR)/perl5/bin

COMPONENT_NAME=         squid
COMPONENT_PROJECT_URL=  http://www.squid-cache.org/
COMPONENT_VERSION=      6.13
COMPONENT_BAID=		325733
COMPONENT_ARCHIVE_HASH= sha256:9b33de09d733b5933f6c2b54ebe0be51a9fa4751f183f3aead90b3c5d930aa72
COMPONENT_ARCHIVE_URL=  https://github.com/squid-cache/squid/releases/download/SQUID_$(subst .,_,$(COMPONENT_VERSION))/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4880
COMPONENT_PUBLIC_KEY_URL=	http://www.squid-cache.org/pgp.asc

# Enable adiheap security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)

# Disable adistack security extension due to C++ exception handling issues
ADISTACK_MODE =	$(ADISTACK_DISABLE)

TEST_TARGET= $(TEST_64)
include $(WS_MAKE_RULES)/common.mk

CFLAGS += -I$(USRINCDIR)/kerberosv5
CFLAGS += $(CPP_LARGEFILES)

# xmlSetFeature amd htmlDefaultSAXHandlerInit are deprecated since libxml 2.10
CXXFLAGS += -Wno-deprecated-declarations

CONFIGURE_LIBDIR.64 =	$(CONFIGURE_PREFIX)/lib

# Squid has own prefix
CONFIGURE_PREFIX =	$(USRDIR)/squid

CONFIGURE_OPTIONS += --libexecdir=$(CONFIGURE_PREFIX)/libexec
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)/squid
CONFIGURE_OPTIONS += --with-pidfile=/system/volatile/squid.pid
CONFIGURE_OPTIONS += --sharedstatedir=$(VARDIR)/squid
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)/squid
CONFIGURE_OPTIONS += --mandir=$(CONFIGURE_PREFIX)/man
CONFIGURE_OPTIONS += --sbindir=$(CONFIGURE_PREFIX)/sbin
CONFIGURE_OPTIONS += --enable-arp-acl
CONFIGURE_OPTIONS += --enable-auth-basic='DB,NCSA,NIS,LDAP,PAM,getpwnam,POP3,SMB,SMB_LM,SASL'
CONFIGURE_OPTIONS += --enable-cache-digests
CONFIGURE_OPTIONS += --enable-carp
CONFIGURE_OPTIONS += --enable-coss-aio-ops
CONFIGURE_OPTIONS += --enable-delay-pools
CONFIGURE_OPTIONS += --enable-auth-digest='file,LDAP'
CONFIGURE_OPTIONS += --enable-external-acl-helpers='file_userip,unix_group,LDAP_group,wbinfo_group'
CONFIGURE_OPTIONS += --enable-follow-x-forwarded-for
CONFIGURE_OPTIONS += --enable-forward-log
CONFIGURE_OPTIONS += --enable-forw-via-db
CONFIGURE_OPTIONS += --enable-htcp
CONFIGURE_OPTIONS += --enable-icmp
CONFIGURE_OPTIONS += --enable-large-cache-files
CONFIGURE_OPTIONS += --enable-multicast-miss
CONFIGURE_OPTIONS += --enable-auth-negotiate='kerberos'
CONFIGURE_OPTIONS += --enable-auth-ntlm='SMB_LM,fake'
CONFIGURE_OPTIONS += --enable-ntlm-fail-open
CONFIGURE_OPTIONS += --enable-removal-policies='heap,lru'
CONFIGURE_OPTIONS += --enable-snmp
CONFIGURE_OPTIONS += --enable-storeio='aufs,diskd,ufs'
CONFIGURE_OPTIONS += --enable-x-accelerator-vary
CONFIGURE_OPTIONS += --with-aio
CONFIGURE_OPTIONS += --with-aufs-threads=8
CONFIGURE_OPTIONS += --with-build-environment=POSIX_V6_LP64_OFF64
# Due to the current licensing of squid and openssl, gnutls/nettle
# must be enabled and used instead of openssl for tls and/or other
# crypto support.
CONFIGURE_OPTIONS += --with-gnutls
CONFIGURE_OPTIONS += --with-nettle
CONFIGURE_OPTIONS += --with-pthreads
CONFIGURE_OPTIONS += --disable-arch-native
CONFIGURE_OPTIONS += PERL=$(PERL)

# Appends the following line to the end of the squid.conf configuration
# file. This line is necessary for running squid for testing. 
# This starts up squid as user webservd. 
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/etc/squid ; \
	echo '\ncache_effective_user webservd' >> squid.conf)

# Adjust '#!/usr/bin/perl'
PERL_SCRIPTS= $(PROTOUSRDIR)/squid/libexec/helper-mux

# cppunit is required for testing
REQUIRED_PACKAGES += developer/c++/cppunit
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libtool/libltdl
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/library/security/libsasl2
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/ldap/openldap
