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
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		curl
COMPONENT_VERSION=	$(COMPONENT_NAME)-7_64_0
IPS_COMPONENT_VERSION=	7.64.0
TPNO=			49327
COMPONENT_PROJECT_URL=	http://curl.haxx.se/

#GIT_REPO=	https://github.com/curl/curl.git
## last tag we checkout to it
#GIT_COMMIT_ID=	$(COMPONENT_VERSION)
#GIT_HASH=	sha256:.......

# git clone is fine but download of the archive is much faster
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).zip
COMPONENT_ARCHIVE_HASH=	sha256:767c6039f247439885d87662f91e7e24aed2d15c80437de9f91d1034e68ac7fd
COMPONENT_ARCHIVE_URL=	https://github.com/curl/curl/archive/$(COMPONENT_ARCHIVE)

COMPONENT_BUGDB=	library/curl
COMPONENT_ANITYA_ID=	381

include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I/usr/include/openldap
CPPFLAGS += $(shell pkg-config --cflags libidn2)
# GSS MECH's API is in /usr/include/kerberosv5/gssapi/
CPPFLAGS += $(shell krb5-config --cflags)
CPPFLAGS += $(CPP_LARGEFILES)

# Community code uses different defs
$(BUILD_DIR_32)/.configured:	CPPFLAGS += -D__ILP32=32
$(BUILD_DIR_64)/.configured:	CPPFLAGS += -D__LP64=64

LIBS += $(shell krb5-config --libs gssapi)
LDFLAGS += -m$(BITS)

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

CONFIGURE_OPTIONS += --localstatedir=$(VARDIR) --enable-shared --disable-static
CONFIGURE_OPTIONS += --enable-http --enable-ftp
CONFIGURE_OPTIONS += --enable-file --enable-dict
CONFIGURE_OPTIONS += --enable-manual --disable-libgcc
CONFIGURE_OPTIONS += --enable-rtsp --enable-proxy
CONFIGURE_OPTIONS += --enable-telnet --enable-tftp --enable-pop3
CONFIGURE_OPTIONS += --enable-imap --enable-smtp
CONFIGURE_OPTIONS += --enable-ipv6 --enable-nonblocking
CONFIGURE_OPTIONS += --enable-thread --enable-verbose
CONFIGURE_OPTIONS += --disable-sspi --enable-crypto-auth
CONFIGURE_OPTIONS += --enable-cookies --disable-hidden-symbols
CONFIGURE_OPTIONS += --disable-soname-bump
CONFIGURE_OPTIONS += --with-random=/dev/urandom
CONFIGURE_OPTIONS += --with-gssapi
CONFIGURE_OPTIONS += --with-ssl=/usr --with-ca-path=$(ETCDIR)/openssl/certs
CONFIGURE_OPTIONS += --enable-ldap --with-ldap-lib=ldap_r --with-lber-lib=lber
CONFIGURE_OPTIONS += --with-zlib=$(USRDIR) --with-libidn2=$(USRDIR)
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-libssh2
CONFIGURE_OPTIONS += --with-nghttp2
CONFIGURE_OPTIONS += "curl_disallow_getifaddrs=yes"

CONFIGURE_ENV +=	CPP="$(CC) -E"
CONFIGURE_ENV +=	CFLAGS="$(CFLAGS)"
CONFIGURE_ENV +=	LIBS="$(LIBS)"
CONFIGURE_ENV +=	LDFLAGS="$(LDFLAGS)"
CONFIGURE_ENV +=	KRB5CONFIG=/usr/bin/krb5-config

LINT_FLAGS += -I$(SOURCE_DIR)/include

# Generate configuration scripts form .am-files
COMPONENT_PREP_ACTION = (cd $(@D) ; $(SHELL) buildconf )

COMPONENT_TEST_ENV += CC="$(CC)"
COMPONENT_TEST_ENV += PATH="$(SPRO_VROOT)/bin:$(GNUBIN):$(PATH)"
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
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/network/ldap/openldap
