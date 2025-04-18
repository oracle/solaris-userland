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
COMPILER=		gcc
BUILD_BITS=		64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		mutt
COMPONENT_VERSION=	2.2.12
COMPONENT_ARCHIVE_HASH=	\
    sha256:043af312f64b8e56f7fd0bf77f84a205d4c498030bd9586457665c47bb18ce38
COMPONENT_ARCHIVE_URL=	ftp://ftp.mutt.org/pub/mutt/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://www.mutt.org/
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	2035
COMPONENT_BAID=		150300

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =		$(ADIHEAP_ENABLE)
ADISTACK_MODE =		$(ADISTACK_ENABLE)

TEST_TARGET= 		$(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# We have a patch against configure.ac, we need to regenerate configure script
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

CONFIGURE_OPTIONS  +=		--sysconfdir="$(ETCDIR)/$(COMPONENT_NAME)"
CONFIGURE_OPTIONS  +=		--enable-debug
CONFIGURE_OPTIONS  +=		--enable-pop
CONFIGURE_OPTIONS  +=		--enable-imap
CONFIGURE_OPTIONS  +=		--enable-smtp
CONFIGURE_OPTIONS  +=		--enable-hcache
CONFIGURE_OPTIONS  +=		--enable-sidebar
CONFIGURE_OPTIONS  +=		--with-gdbm
CONFIGURE_OPTIONS  +=		--with-regex
CONFIGURE_OPTIONS  +=		--with-curses
CONFIGURE_OPTIONS  +=		--with-idn
CFLAGS +=			-I"$(USRINCDIR)/idn"
CONFIGURE_OPTIONS  +=		--with-wc-funcs
CONFIGURE_OPTIONS  +=		--with-sasl
CONFIGURE_OPTIONS  +=		--with-ssl

REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += data/docbook/docbook-style-xsl
REQUIRED_PACKAGES += data/xml-common
REQUIRED_PACKAGES += library/database/gdbm
REQUIRED_PACKAGES += library/libidn
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libsasl2
