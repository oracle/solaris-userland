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
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		curl
COMPONENT_VERSION=	7.87.0
COMPONENT_ARCHIVE_HASH=	sha256:5d6e128761b7110946d1276aff6f0f266f2b726f5e619f7e0a057a474155f307
COMPONENT_BAID=		135919
COMPONENT_PROJECT_URL=	http://curl.haxx.se/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_URL=	https://curl.se/download/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_BUGDB=	library/curl
COMPONENT_ANITYA_ID=	381

# Disable the unit tests since the test results are outdated.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += $(CPP_LARGEFILES)
CPPFLAGS += $(CC_PIC_ENABLE)
CPPFLAGS += -DNAME_MAX=256

CPPFLAGS += -I/usr/include/openldap
CPPFLAGS += $(shell pkg-config --cflags libidn2)
# GSS MECH's API is in /usr/include/kerberosv5/gssapi/
CPPFLAGS += $(shell krb5-config --cflags)
LIBS	 += $(shell krb5-config --libs gssapi)

# Community code uses different defs
$(BUILD_DIR_32)/.configured:	CPPFLAGS += -D__ILP32=32
$(BUILD_DIR_64)/.configured:	CPPFLAGS += -D__LP64=64

LDFLAGS	+= -m$(BITS)
LDFLAGS	+= $(LD_Z_DEFS)

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# Automatically detect OpenSSL 3 headers and libs.
ifneq ($(strip $(OPENSSL3)),)
SSL_PKG_CONFIG_PATH.64 = /usr/openssl/3/lib/64/pkgconfig
SSL_PKG_CONFIG_PATH.32 = /usr/openssl/3/lib/pkgconfig
PKG_CONFIG_PATHS += $(SSL_PKG_CONFIG_PATH.$(BITS))
endif

CONFIGURE_OPTIONS += --localstatedir=$(VARDIR) --enable-shared --disable-static
CONFIGURE_OPTIONS += --enable-http --enable-ftp
CONFIGURE_OPTIONS += --enable-file --enable-dict
CONFIGURE_OPTIONS += --enable-manual --disable-libgcc
CONFIGURE_OPTIONS += --enable-rtsp --enable-proxy
CONFIGURE_OPTIONS += --enable-telnet --enable-tftp --enable-pop3
CONFIGURE_OPTIONS += --enable-imap --enable-smtp
CONFIGURE_OPTIONS += --enable-ipv6
CONFIGURE_OPTIONS += --enable-verbose
CONFIGURE_OPTIONS += --disable-sspi --enable-crypto-auth
CONFIGURE_OPTIONS += --enable-cookies
CONFIGURE_OPTIONS += --with-random=/dev/urandom
CONFIGURE_OPTIONS += --with-zlib
CONFIGURE_OPTIONS += --with-gssapi
ifneq ($(strip $(OPENSSL3)),)
CONFIGURE_OPTIONS += --with-openssl=/usr/openssl/3
else
CONFIGURE_OPTIONS += --with-ssl
endif
CONFIGURE_OPTIONS += --with-ca-path=$(ETCDIR)/openssl/certs
CONFIGURE_OPTIONS += --enable-ldap --with-ldap-lib=ldap_r --with-lber-lib=lber
CONFIGURE_OPTIONS += --with-libidn2
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-libssh2
CONFIGURE_OPTIONS += --with-nghttp2
CONFIGURE_OPTIONS += --without-libpsl
CONFIGURE_OPTIONS += --without-zstd
CONFIGURE_OPTIONS += "curl_disallow_getifaddrs=yes"

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS += MAKE=$(GMAKE)

CONFIGURE_ENV +=	CPP="$(CC) -E"
CONFIGURE_ENV +=	CPPFLAGS="$(CPPFLAGS)"
CONFIGURE_ENV +=	CFLAGS="$(CFLAGS)"
CONFIGURE_ENV +=	LIBS="$(LIBS)"
CONFIGURE_ENV +=	LDFLAGS="$(LDFLAGS)"
CONFIGURE_ENV +=	KRB5CONFIG=/usr/bin/krb5-config

LINT_FLAGS += -I$(SOURCE_DIR)/include

# Generate configuration scripts form .am-files
# GNU Build System files have to be regenerated for automake 1.16.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fi ; )

# verbose gmake
ifneq ($(strip $(GMAKE_VERBOSE_MAKEFILE)),)
COMPONENT_BUILD_ARGS += V=1
endif

COMPONENT_TEST_ENV += CC="$(CC)"
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_TEST_ARGS+= -k -i

# Only the #'s of passed/failed tests are verified for change
# note: Test 1119 is failing permannently and it only checks library symbols
# by a Linux way.
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "s/ during [0-9][0-9]* seconds.//" ' \
	'-e "/TESTDONE:/p" ' \
	'-e "/TESTFAIL:/p" ' \
	'-e "/ TOTAL:/p" ' \
	'-e "/ PASS:/p" ' \
	'-e "/ SKIP:/p" ' \
	'-e "/ XFAIL:/p" ' \
	'-e "/ FAIL:/p" ' \
	'-e "/ XPASS:/p" ' \
	'-e "/ ERROR:/p" '

REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/libssh2
REQUIRED_PACKAGES += library/nghttp2
ifneq ($(strip $(OPENSSL3)),)
REQUIRED_PACKAGES += library/security/openssl-3
else
REQUIRED_PACKAGES += library/security/openssl
endif
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/network/ldap/openldap
