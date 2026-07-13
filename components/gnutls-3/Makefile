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
# Copyright (c) 2010, 2026, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnutls
COMPONENT_VERSION=	3.8.13
COMPONENT_BAID=		398631
COMPONENT_ARCHIVE_HASH= sha256:ffed8ec1bf09c2426d4f14aae377de4753b53e537d685e604e99a8b16ca9c97e
COMPONENT_ARCHIVE_URL=	https://www.gnupg.org/ftp/gcrypt/gnutls/v3.8/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  https://www.gnutls.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
#COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/gnutls
COMPONENT_ANITYA_ID=	1221

include $(WS_MAKE_RULES)/common.mk

CFLAGS += -I$(USRINCDIR)/idn

COMPONENT_BUILD_TARGETS = all info
COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF_ENV) $(AUTORECONF) -fiv);

CONFIGURE_OPTIONS += MAKE=$(MAKE)
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --mandir=$(USRSHAREDIR)/man
CONFIGURE_OPTIONS += --includedir=$(USRINCDIR)/
CONFIGURE_OPTIONS.32 += --libdir=$(USRLIBDIR)/
CONFIGURE_OPTIONS.64 += --libdir=$(USRLIBDIR64)/
CONFIGURE_OPTIONS.32 += --libexecdir=$(USRLIBDIR)/pkgconfig/
CONFIGURE_OPTIONS.64 += --libexecdir=$(USRLIBDIR64)/pkgconfig/
CONFIGURE_OPTIONS += --localedir=$(USRSHARELOCALEDIR)/
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --disable-guile
CONFIGURE_OPTIONS += --with-included-libtasn1
CONFIGURE_OPTIONS += --with-included-unistring
CONFIGURE_OPTIONS += --without-p11-kit
CONFIGURE_OPTIONS += --disable-openssl-compatibility
CONFIGURE_OPTIONS += --disable-tests
CONFIGURE_OPTIONS += --with-default-trust-store-file=/etc/certs/ca-certificates.crt
CONFIGURE_OPTIONS += --enable-hardware-acceleration

# Workaround gcc 14 errors in m4/select.m4 from gnulib
CONFIGURE_OPTIONS += gl_cv_func_select_detects_ebadf=yes
CONFIGURE_OPTIONS += gl_cv_func_pselect_detects_ebadf=yes

include ../../make-rules/shared-targets.mk

PKG_MACROS += COMPONENT_VERSION=$(COMPONENT_VERSION)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

COMPONENT_TEST_TRANSFORMS += \
	'-n -e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/TOTAL/p" ' \
	'-e "/ERROR/p" '

CBE_PACKAGES += compress/zstd
CBE_PACKAGES += library/security/trousers
CBE_PACKAGES += library/zlib

REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
