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
# For this component, prefer 32-bit over 64-bit for now until sufficient
# testing has been performed.
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pam_pkcs11
COMPONENT_VERSION=	0.6.13
COMPONENT_PROJECT_URL=	https://github.com/OpenSC/
COMPONENT_ARCHIVE_HASH=	\
	sha256:8a853f4e6e136ceecdcffad798570e3d6af2fde08e975656b2dc931989c35aff
COMPONENT_ARCHIVE_URL=	\
	$(COMPONENT_PROJECT_URL)$(COMPONENT_NAME)/archive/refs/tags/$(COMPONENT_ARCHIVE)
COMPONENT_POST_UNPACK_ACTION = \
	$(MV) $(COMPONENT_NAME)-$(COMPONENT_NAME)-$(COMPONENT_VERSION) $(COMPONENT_SRC)

COMPONENT_BUGDB=	library/pam-pkcs11
COMPONENT_ANITYA_ID=	13275

COMPONENT_BAID=		326459

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Force regeneration of ancient autoconf scripts to fix 64-bit build detection
# and due to patches to autoconf and automake files.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)

OPENSSL_LIBS.32= -lssl -lcrypto
OPENSSL_LIBS.32 += $(LIBSOCKET) $(LIBNSL)
OPENSSL_LIBS.64= -lssl -lcrypto
OPENSSL_LIBS.64 += $(LIBSOCKET) $(LIBNSL)

CONFIGURE_BINDIR.32= $(USRLIB.32)/pam_pkcs11
CONFIGURE_BINDIR.64= $(USRLIB.64)/pam_pkcs11
CFLAGS += -DMODULE_ISA_FIX -DUPGRADE_BUG_FIX
CONFIGURE_OPTIONS += --datarootdir=$(ETCDIR)/security
CONFIGURE_OPTIONS += --localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --with-confdir=/etc/security/pam_pkcs11
CONFIGURE_OPTIONS += --docdir=/etc/security/pam_pkcs11
CONFIGURE_OPTIONS += OPENSSL_CFLAGS="$(OPENSSL_CFLAGS)"
CONFIGURE_OPTIONS.32= OPENSSL_LIBS="$(OPENSSL_LIBS.32)"
CONFIGURE_OPTIONS.64= OPENSSL_LIBS="$(OPENSSL_LIBS.64)"
CONFIGURE_OPTIONS += --with-pcsclite=yes
CONFIGURE_OPTIONS += PCSC_CFLAGS="-I /usr/include/PCSC"
CONFIGURE_OPTIONS += PCSC_LIBS="-lpcsclite"

$(SOLARIS_11_3_ONLY)REQUIRED_PACKAGES += library/openldap
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/security/pcsc/pcsclite
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network/ldap/openldap
