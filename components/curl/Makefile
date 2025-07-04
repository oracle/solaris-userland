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
BUILD_BITS= 64_and_32
COMPILER= gcc
# debug build? uncomment next line
# GMAKE= /usr/gnu/bin/make V=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		curl
COMPONENT_VERSION=	8.14.1
COMPONENT_ARCHIVE_HASH=	sha256:5760ed3c1a6aac68793fc502114f35c3e088e8cd5c084c2d044abdf646ee48fb
COMPONENT_BAID=		332160
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
CONFIGURE_OPTIONS += --with-openssl
CONFIGURE_OPTIONS += --with-ca-path=$(ETCDIR)/openssl/certs
CONFIGURE_OPTIONS += --enable-ldap
CONFIGURE_OPTIONS += --with-libidn2
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-libssh2
CONFIGURE_OPTIONS += --with-nghttp2
CONFIGURE_OPTIONS += --without-libpsl
# --enable-debug is required by unit tests build but works fine without
#CONFIGURE_OPTIONS += --enable-debug
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

# If you are modifying runtime dependencies in this list, you probably
# also need to make equivalent changes to the ON-boot-archive section of
# tools/notifications.cfg
REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/libssh2
REQUIRED_PACKAGES += library/nghttp2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/network/ldap/openldap
