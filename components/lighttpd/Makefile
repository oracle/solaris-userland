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
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		lighttpd
COMPONENT_VERSION=	1.4.71
COMPONENT_PROJECT_URL=	http://www.lighttpd.net/
COMPONENT_ARCHIVE_HASH=	sha256:3855dfed5ce7a4b006e3d434b00985852b5a91c2abc56d92071f98bfe79f9d80
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)download/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	1817

COMPONENT_BAID=		144376

LIGHTTPD_INSTALLDIR =	$(USRDIR)/lighttpd/1.4
LIGHTTPD_ETC =		$(ETCDIR)/lighttpd/1.4

# lighttpd doesn't install config files and docs by default
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)/$(LIGHTTPD_ETC) && \
	$(CP) -r $(COMPONENT_SRC)/doc/config/* $(PROTO_DIR)/$(LIGHTTPD_ETC)

include $(WS_MAKE_RULES)/common.mk

# Some binaries (like lemon) are built by compiler in CC_FOR_BUILD. That
# does not respect our PIE config so we need to work around it
COMPONENT_BUILD_ARGS += CC_FOR_BUILD='$(CC) $(CONFIGURE_CPPFLAGS) $(CC_PIC_ENABLE)'

# lighttpd is logging using __FILE__ macro. Cloning will make this happen
# using just source file names (without full absolute paths).
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_PREFIX= $(LIGHTTPD_INSTALLDIR)
CONFIGURE_MANDIR= $(CONFIGURE_PREFIX)/man

# Force lighttpd binaries and private modules to standard path
CONFIGURE_LIBDIR.64 = $(CONFIGURE_PREFIX)/lib

CONFIGURE_OPTIONS +=	--with-pic
CONFIGURE_OPTIONS +=	--with-lua
CONFIGURE_OPTIONS +=	--with-openssl
CONFIGURE_OPTIONS +=	--with-ldap
CONFIGURE_OPTIONS +=	--with-mysql=$(USRDIR)/mysql/8.0/bin/mysql_config

COMPONENT_TEST_TRANSFORMS += \
	'-e "s/, *[0-9][0-9]* wallclock secs (.*CPU)$$/, <TIMINGS REMOVED>/" ' \
	'-e "/^preparing infrastructure/,//p" ' \
	'-e "/.*/d" '

REQUIRED_PACKAGES += database/mysql-80/library
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += web/fastcgi/spawn-fcgi
