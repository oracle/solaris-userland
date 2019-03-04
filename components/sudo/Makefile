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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		sudo
SRC_VERSION=	1.8.21
SRC_PATCH_VERSION=2
ifdef SRC_PATCH_VERSION
COMPONENT_VERSION=	$(SRC_VERSION).$(SRC_PATCH_VERSION)
COMPONENT_SRC=		$(COMPONENT_NAME)-$(SRC_VERSION)p$(SRC_PATCH_VERSION)
else
COMPONENT_VERSION=	$(SRC_VERSION)
COMPONENT_SRC=		$(COMPONENT_NAME)-$(SRC_VERSION)
endif
COMPONENT_ARCHIVE_HASH=	\
    sha256:74c5746cd33a814e2431c39faf0d76f7f8a697379bd073862e3b156cf0d76368
COMPONENT_ARCHIVE_URL=	https://www.sudo.ws/sudo/dist/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_PROJECT_URL=  https://www.sudo.ws/
COMPONENT_ANITYA_ID=	4906

TPNO=			39599

include $(WS_MAKE_RULES)/common.mk

# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)
LDFLAGS += -lldap_r-2.4

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# Allows zero-sized struct/union declarations and void functions with return
# statements returning a value to work.
CFLAGS += -features=extensions

COMPONENT_PREP_ACTION = ( cd $(@D) ; $(AUTORECONF) -f -I m4 )

CPPFLAGS += -I$(USRINCDIR)/openldap
CONFIGURE_ENV +=	"MAKE=$(GMAKE)"

CONFIGURE_OPTIONS +=	--enable-openssl
CONFIGURE_OPTIONS +=	--with-ldap
CONFIGURE_OPTIONS +=	--with-project
CONFIGURE_OPTIONS +=	--with-rundir=/system/volatile/sudo
CONFIGURE_OPTIONS +=	--with-pam
CONFIGURE_OPTIONS +=	--with-pam-login
CONFIGURE_OPTIONS +=	--with-tty-tickets
CONFIGURE_OPTIONS +=	--without-insults
CONFIGURE_OPTIONS +=	--without-lecture
CONFIGURE_OPTIONS +=	--with-ignore-dot
CONFIGURE_OPTIONS +=	--with-solaris-audit
CONFIGURE_OPTIONS +=	--libexecdir=$(USRLIBDIR64)/sudo
CONFIGURE_OPTIONS +=	"sudo_cv_var_nroff_opt_Tascii=no"

COMPONENT_INSTALL_TARGETS = install

# Avoid calling "chown 0" on installed files
COMPONENT_INSTALL_ARGS += INSTALL_OWNER=

# Make sure that sudo is NOT built with its internal sha2 implementation
# http://www.sudo.ws/bugs/show_bug.cgi?id=641
COMPONENT_TEST_ENV_CMD =
COMPONENT_TEST_CMD = \
	: Test that $(VISUDO) is an ELF && \
	if [[ -z $$( file "$(VISUDO)" | (grep ELF||:) ) ]]; then \
		echo "ERROR: File '$(VISUDO)' is not an ELF type, this test is broken" ; \
		exit 1; \
	fi && \
	: Test that all the SHA* functions are UNDEFined thus loaded from external library && \
	if [[ -n $$( elfdump -s "$(VISUDO)" | (grep SHA256Init||:) | (grep -v UNDEF||:) ) ]]; then \
		echo "ERROR: SHA256Init is not an undefined symbol in $(VISUDO)"; \
		exit 1; \
	fi && \
	$(GMAKE)

# Tests may output some compilation lines, so just pull out the relevant test
# output lines for the test results comparison
COMPONENT_TEST_TRANSFORMS += '-e "/^parse_gids_test\|^strsplit_test\|^atofoo_test\|^hltq_test\|^sudo_conf\|^sudo_parseln\|^check_addr\|^check_base64\|^check_fill\|^iolog_path\|^check_symbols\|^sudoers\|^testsudoers\|^visudo\|^check_ttyname\|^ERROR/!d"'

# The terminal name can differ between runs. It can either be /dev/pts/<number> or
# it can be word 'none'
COMPONENT_TEST_TRANSFORMS += '-e "s/\(check_ttyname:.*\)(.*)/\1/"'

VISUDO=$(BUILD_DIR_64)/plugins/sudoers/.libs/visudo

$(SOLARIS_11_3_ONLY)REQUIRED_PACKAGES += library/openldap
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += text/groff/groff-core
