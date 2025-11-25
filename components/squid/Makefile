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

PATH = $(GNUBIN):$(USRBINDIR)

COMPONENT_NAME=         squid
COMPONENT_PROJECT_URL=  http://www.squid-cache.org/
COMPONENT_VERSION=      7.3
COMPONENT_BAID=		357915
COMPONENT_ARCHIVE_HASH= sha256:8bf20632e05158b6993495ad4328569e8ecf51b136e4e5675da608d061c96f89
COMPONENT_ARCHIVE_URL=  https://github.com/squid-cache/squid/releases/download/SQUID_$(subst .,_,$(COMPONENT_VERSION))/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4880
COMPONENT_PUBLIC_KEY_URL=	http://www.squid-cache.org/pgp.asc

# Enable adiheap security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)

include $(WS_MAKE_RULES)/common.mk

CFLAGS += $(CPP_LARGEFILES)

# Squid has own prefix
CONFIGURE_PREFIX =	$(USRDIR)/squid

CONFIGURE_OPTIONS += --libexecdir=$(CONFIGURE_PREFIX)/libexec
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)/squid
CONFIGURE_OPTIONS += --with-pidfile=/system/volatile/squid.pid
CONFIGURE_OPTIONS += --sharedstatedir=$(VARDIR)/squid
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)/squid
CONFIGURE_OPTIONS += --mandir=$(CONFIGURE_PREFIX)/man
CONFIGURE_OPTIONS += --sbindir=$(CONFIGURE_PREFIX)/sbin
CONFIGURE_OPTIONS += --with-default-user=webservd
CONFIGURE_OPTIONS += --enable-cache-digests
CONFIGURE_OPTIONS += --enable-delay-pools
CONFIGURE_OPTIONS += --enable-forw-via-db
CONFIGURE_OPTIONS += --enable-icmp
CONFIGURE_OPTIONS += --enable-removal-policies='heap,lru'
CONFIGURE_OPTIONS += --enable-storeio='aufs,diskd,ufs'
CONFIGURE_OPTIONS += --enable-x-accelerator-vary
CONFIGURE_OPTIONS += --with-aufs-threads=8
CONFIGURE_OPTIONS += --with-build-environment=POSIX_V6_LP64_OFF64
CONFIGURE_OPTIONS += --disable-arch-native
CONFIGURE_OPTIONS += PERL=$(PERL)

REQUIRED_PACKAGES += database/berkeleydb-5
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
