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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		bind
COMPONENT_VERSION=	9.10.8-P1
HUMAN_VERSION=		$(COMPONENT_VERSION)
IPS_COMPONENT_VERSION=	9.10.8.1.0
COMPONENT_PROJECT_URL=	http://www.isc.org/software/bind/
COMPONENT_ANITYA_ID=	187

# hash from: sha256sum $(COMPONENT_ARCHIVE) | sed 's/\(.[^ ]*\).*/sha256:\1/'
COMPONENT_ARCHIVE_HASH=	 \
	sha256:26c31406400c7371558aadd55cfb7c529d51fdad1ff9585c5d2e26cffa78162b
COMPONENT_ARCHIVE_URL=	\
	http://ftp.isc.org/isc/bind9/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sha512.asc
COMPONENT_BUGDB=	service/dns-server
TPNO=			45015

TEST_TARGET = $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# PYVER is important for packaging and computing requisites.
PYTHON_VERSION =	3.4
PKG_MACROS +=		PYVER=$(PYTHON_VERSION)

# Some patches need configure script re-creation.
COMPONENT_PREP_ACTION +=(cd $(@D); autoreconf -vfi);

# Specify "configure" options and features.
# FYI, The configure options are displayed by 'named -V'.
CONFIGURE_OPTIONS +=	--enable-full-report
# Python: specifying version helps with packaging.
CONFIGURE_OPTIONS +=	--with-python=$(PYTHON.$(PYTHON_VERSION))
# - libtool: Build dynamic libraries, static libraries are not shipped.
CONFIGURE_OPTIONS +=	--with-libtool
# - openssl: use openssl, required for DNSSEC features.
CONFIGURE_OPTIONS +=	--with-openssl
# - pkcs11: Use openSSL pkcs11 engine (KMIP/KMS)
CONFIGURE_OPTIONS +=	--with-pkcs11
# - Use xml2-config found uder /usr without checking its version.
CONFIGURE_OPTIONS +=	--with-libxml2=$(USRDIR)
CONFIGURE_OPTIONS +=	--enable-threads
CONFIGURE_OPTIONS +=	--enable-devpoll
# - Enabled fixed [order] resource-record sets for backward compatibility.
# - Requires more memory to store the sets so is not the default.
CONFIGURE_OPTIONS +=	--enable-fixed-rrset

# Override / set specific pathnames:
# - DNS libraries are in usr/lib/dns - Override settings from configure.mk
CONFIGURE_LIBDIR.64 =	$(CONFIGURE_PREFIX)/lib/dns/$(MACH64)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--with-randomdev=/dev/random
CONFIGURE_OPTIONS +=	--with-gssapi=krb5-config
CONFIGURE_OPTIONS +=	--with-docbook-xsl=/usr/share/sgml/docbook
CONFIGURE_OPTIONS +=	--with-python-install-dir=$(PYTHON_VENDOR_PACKAGES.32)

# Compiler and compiler options:
# - configure will add "-mt" to CC which is already set in CFLAGS, so override.
CONFIGURE_OPTIONS +=	CC="$(CC)"

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE = $(ADISTACK_ENABLE)

# Package dependencies
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += library/json-c
REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += network/dns/bind
REQUIRED_PACKAGES += runtime/python-34
REQUIRED_PACKAGES += security/kerberos-5
$(SOLARIS_11_3_ONLY)REQUIRED_PACKAGES += service/security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
$(SOLARIS_11_3_ONLY)REQUIRED_PACKAGES += system/library/security/gss
