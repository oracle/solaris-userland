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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
# For this component, prefer 32-bit over 64-bit for now until sufficient
# testing has been performed.
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pam_pkcs11
COMPONENT_VERSION=	0.6.11
COMPONENT_PROJECT_URL=	https://sourceforge.net/projects/opensc/
COMPONENT_ARCHIVE_HASH=	\
    sha256:44d717d285ad862cd63002e901b21fcbd808c65b063f71be1c2aece04dfa23ca
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)files/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/pam-pkcs11
COMPONENT_ANITYA_ID=	13275

COMPONENT_BAID=		128294

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Force regeneration of ancient autoconf scripts to fix 64-bit build detection
# and due to patches to autoconf and automake files.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)

OPENSSL_LIBS= -lssl -lcrypto
OPENSSL_LIBS +=	$(LIBSOCKET) $(LIBNSL)

CONFIGURE_BINDIR.32= $(USRLIB.32)/pam_pkcs11
CONFIGURE_BINDIR.64= $(USRLIB.64)/pam_pkcs11
CPPFLAGS += -I$(USRINCDIR)/openldap
CFLAGS += -DMODULE_ISA_FIX -DUPGRADE_BUG_FIX
CONFIGURE_OPTIONS += --datarootdir=$(ETCDIR)/security
CONFIGURE_OPTIONS += --localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --with-confdir=/etc/security/pam_pkcs11
CONFIGURE_OPTIONS += --docdir=/etc/security/pam_pkcs11
CONFIGURE_OPTIONS += OPENSSL_LIBS="$(OPENSSL_LIBS)"
CONFIGURE_OPTIONS += --with-pcsclite=yes
CONFIGURE_OPTIONS += PCSC_CFLAGS="-I /usr/include/PCSC"
CONFIGURE_OPTIONS += PCSC_LIBS="-lpcsclite"

$(SOLARIS_11_3_ONLY)REQUIRED_PACKAGES += library/openldap
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/pcsc/pcsclite
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network/ldap/openldap 
