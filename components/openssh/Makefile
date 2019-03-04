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
# Copyright (c) 2013, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

#
# When updating the version of OpenSSH you must add the release notes
# for *all* skipped versions and the new version.
#
# Run:
#  curl https://www.openssh.com/txt/release-X.Y > release-notes/release-X.Y.txt
# Then add a line to network-ssh.p5m to deliver them.

COMPONENT_NAME=		openssh
COMPONENT_VERSION=	7.7p1
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_ANITYA_ID=	2565

# Version for IPS.  The encoding rules are:
#   OpenSSH <x>.<y>p<n>     => IPS <x>.<y>.0.<n>
#   OpenSSH <x>.<y>.<z>p<n> => IPS <x>.<y>.<z>.<n>
IPS_COMPONENT_VERSION=	7.7.0.1

COMPONENT_PROJECT_URL=	https://www.openssh.com/
COMPONENT_ARCHIVE_HASH=	sha256:d73be7e684e99efcd024be15a30bffcbe41b012b2f7b3c9084aed621775e6b8f
COMPONENT_ARCHIVE_URL=	https://mirrors.sonic.net/pub/OpenBSD/OpenSSH/portable/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

TPNO_OPENSSH=		42310
TPNO_GSSKEX=		20377

# Because of set up requirements, test suite is in stc gate.
TEST_TARGET= $(SKIP_TEST)

include $(WS_MAKE_RULES)/common.mk

CFLAGS += -DSET_USE_PAM
CFLAGS += -DDEPRECATE_SUNSSH_OPT
CFLAGS += -DKRB5_BUILD_FIX
CFLAGS += -DDTRACE_SFTP
CFLAGS += -DDISABLE_BANNER
CFLAGS += -DPAM_ENHANCEMENT
CFLAGS += -DPAM_BUGFIX
CFLAGS += -DOPTION_DEFAULT_VALUE
CFLAGS += -DPER_SESSION_XAUTHFILE
CFLAGS += -DOPENSSL_NO_CAST
CFLAGS += -DENABLE_OPENSSL_FIPS
CFLAGS += -DOPENSSL_NO_RC4
CFLAGS += -DWITHOUT_HMAC_MD5
CFLAGS += -DSFTP_AUDIT
CFLAGS += -DDEFAULT_PKCS11_WHITELIST='\"/lib/$(MACH64)/*,/usr/lib/$(MACH64)/*,/usr/lib/security/$(MACH64)/*\"'

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# Build PIE
CC_PIC_MODE =	$(CC_PIC_ENABLE)
LD_Z_PIE_MODE =	$(LD_Z_PIE_ENABLE)

# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)

CONFIGURE_OPTIONS += --with-audit=solaris
CONFIGURE_OPTIONS += --with-libedit
CONFIGURE_OPTIONS += --with-kerberos5
CONFIGURE_OPTIONS += --with-pam
CONFIGURE_OPTIONS += --with-sandbox=solaris
CONFIGURE_OPTIONS += --with-solaris-privs
CONFIGURE_OPTIONS += --with-solaris-contracts
CONFIGURE_OPTIONS += --with-4in6
CONFIGURE_OPTIONS += --with-xauth=$(USRBINDIR)/xauth
CONFIGURE_OPTIONS += --disable-strip
CONFIGURE_OPTIONS += --without-rpath
CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)/ssh
CONFIGURE_OPTIONS += --sbindir=$(USRLIBDIR)/ssh
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)/ssh
CONFIGURE_OPTIONS += --disable-lastlog
CONFIGURE_OPTIONS += --without-hardening

# Copy the sftp dtrace provider file and the header file to source directory
COMPONENT_PRE_BUILD_ACTION = \
    ( echo "Copying dtrace sftp files..."; \
      $(LN) -fs $(COMPONENT_DIR)/dtrace_sftp/*.[dh] $(SOURCE_DIR); \
    )

# Copy Solaris specific source files and generate configuration script
COMPONENT_PREP_ACTION += \
    ( $(CP) sources/moduli sources/*.c sources/*.h $(@D)/; \
      cd $(@D); autoconf; \
    )

REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += text/groff/groff-core
