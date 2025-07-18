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

PATH=$(USRBINDIR):$(GNUBIN)

COMPONENT_NAME=		gnupg
COMPONENT_VERSION=	2.5.6
COMPONENT_PROJECT_URL=	http://www.gnupg.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:377f9d79af0ce494c0946dbe7c92197425bb522d7edd6f54acbc9869695131a8
COMPONENT_ARCHIVE_URL=	https://www.gnupg.org/ftp/gcrypt/gnupg/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	1215

COMPONENT_BAID=		329938

include $(WS_MAKE_RULES)/gnu-component.mk

# Enable C99 mode 
CC += -std=gnu99

# builtins have been known to be buggy
CFLAGS += -fno-builtin

CFLAGS += $(XPG6MODE)
CFLAGS += $(CPP_C99_EXTENDED_MATH)

# If we pass -lc, -mt won't link with -lthread
# (which is what it does by default, and we don't
# want that, because we use POSIX threads).
LDFLAGS += -lc $(LD_Z_DEFS)
LD_OPTIONS += $(LD_Z_DEFS)

COMPONENT_TEST_TRANSFORMS += \
     '-e "/libtool/d"' \
     '-e "/-m32/d"' \
     '-e "/-m64/d"' \
     '-e "/ld: warning/d"' \
     '-e "/warning/d"' \
     '-e "/Generat/d"' \
     '-e "/Creat/d"' \
     '-e "/Compos/d"' \
     '-e "/Writ/d"' \
     '-e "/Read/d"' \
     '-e "/Home/d"' \
     '-e "/from/d"' \
     '-e "/--run/d"' \
     '-e "/rm -f/d"' \
     '-e "/Nothing/d"' \
     '-e "/Leaving/d"' \
     '-e "/Entering/d"' \
     '-e "/Making/d"' \
     '-e "/Known envvars/d"' \
     '-e "/make/d"' \
     '-e "/\/tmp\/gpg/d"' \
     '-e "s/[0-9]\{1,\}\.[0-9]\{1,\} s, //g"' \
     '-e "s^[0-9]\{1,\} kB/s^^g"'  \
     '-e "s^[0-9]\{1,\}  kB/s^^g"'  \
     '-e "s^[0-9]\{1,\}\.[0-9]\{1,\}  MB/s^^g"' \
     '-e "s^[0-9]\{1,\}\.[0-9]\{1,\} MB/s^^g"' \
     '-e "s/([0-9]\{1,\} B)//g"' \
     '-e "s/([0-9]\{1,\}  B)//g"' \
     '-e "s/copied,/copied/g"'  \
     '-e "s/ \{1,\}copied/ copied/g"'  \
     '-e "s/copied $$/copied/g"'  \
     '-e "s/copied [0-9]\{1,\}\./copied/g"'

CONFIGURE_ENV +=	INSTALL="$(INSTALL)"

# Without this GnuPG's ./configure will complain that we're not using
# GNU make. But we are.
CONFIGURE_ENV +=	MAKE="$(GMAKE)"

CONFIGURE_OPTIONS  +=		--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=		--libexecdir=$(USRBINDIR)
CONFIGURE_OPTIONS  +=		--datadir=$(CONFIGURE_PREFIX)/share
CONFIGURE_OPTIONS  +=		--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=		--enable-nls
CONFIGURE_OPTIONS  +=		--enable-largefile
CONFIGURE_OPTIONS  +=		--disable-selinux-support
CONFIGURE_OPTIONS  +=		--with-pinentry-pgm=$(CONFIGURE_PREFIX)/lib/pinentry
CONFIGURE_OPTIONS  +=		--with-gpg-error-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-libassuan-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-ksba-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-npth-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-libiconv-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-libintl-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-zlib=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-bzip2=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-pic
CONFIGURE_OPTIONS  +=		--with-readline=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--enable-gpg-is-gpg2

# The 'doc' directory uses CC_FOR_BUILD which does not respect our compilation
# flags. This is a workaround to make gnupg use PIC build.
COMPONENT_BUILD_ARGS += CC_FOR_BUILD='$(CC) $(CONFIGURE_CPPFLAGS) $(CC_PIC_ENABLE)'

COMPONENT_POST_INSTALL_ACTION += \
	( cd $(PROTOUSRSHARELOCALEDIR) ; \
	    $(CP) -R 'en@boldquot' en )

# Testing expects gpg binary instead of gpg2
COMPONENT_PRE_TEST_ACTION += \
	( cd $(COMPONENT_DIR)/build/$(MACH64)/bin ; \
	    /usr/bin/ln gpg gpg2 )

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/npth
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/security/libassuan
REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += library/security/libksba
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += security/pinentry
