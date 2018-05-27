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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#

#
# This component is not to be installed. It is used to build FIPS-140
# certified OpenSSL libraries.
#

include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME =	OpenSSL_2.0.13_OracleFIPS
COMPONENT_VERSION =	1.0
COMPONENT_SRC =		OracleFIPS_$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_NAME)_$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:8658626c8fe9ef4602e91973b8785a9e690a7e3d55132624c9ecc51a8c58ce99
COMPONENT_ARCHIVE_URL =	https://github.com/oracle/solaris-openssl-fips/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/openssl
COMPONENT_ANITYA_ID=	13290

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/configure.mk

PATH=$(SPRO_VROOT)/bin:/usr/bin:/usr/gnu/bin:/usr/perl5/bin

# HMAC-SHA-1 digest of the OpenSSL FIPS tar file is used for the
# integrity test requirement for the FIPS-140 validation.
# Note: COMPONENT_ARCHIVE_HASH is a SHA256 digest used by the Userland
# Consolidation to check the file integrity.
OPENSSL_FIPS_HMAC_KEY = etaonrishdlcupfm
OPENSSL_FIPS_HMAC = ef8f7a91979cad14d033d8803a89fdf925102a30

# There is a broken link in the tarball which causes cp(1) to fail which would
# fail the whole configure process. It's safer to get rid of the link than
# adding "true" at the end of COMPONENT_PRE_CONFIGURE_ACTION since that could
# hide real issues.
COMPONENT_PRE_CONFIGURE_ACTION = ( cd $(@D); \
    $(RM) $(SOURCE_DIR)/test/fips_aes_data; $(CP) -r $(SOURCE_DIR)/* .; )


ifeq ($(MACH), sparc)
CONFIGURE_OPTIONS.32 =	solaris-sparcv9-cc
CONFIGURE_OPTIONS.64 =	solaris64-sparcv9-cc
else
CONFIGURE_OPTIONS.32 =	solaris-x86-cc
CONFIGURE_OPTIONS.64 =	solaris64-x86_64-cc
endif
CONFIGURE_SCRIPT = ./Configure


CONFIGURE_OPTIONS = fipscanisterbuild
CONFIGURE_OPTIONS += $(CONFIGURE_OPTIONS.$(BITS))
COMPONENT_BUILD_ARGS =
COMPONENT_BUILD_TARGETS =
COMPONENT_INSTALL_ARGS =
COMPONENT_INSTALL_TARGETS =
# Ignore default CC_FOR_BUILD, CC, and CXX in CONFIGURE_ENV.
CONFIGURE_ENV += CC_FOR_BUILD=
CONFIGURE_ENV += CC=
CONFIGURE_ENV += CXX=
CONFIGURE_ENV += FIPS_SITE_LD=$(LD)
# Add COMPONENT_DIR to PATH so cc wrapper can be found.
COMPONENT_BUILD_ENV += FIPS_SITE_LD=$(LD) MYMAKE=$(MAKE) PATH=$(COMPONENT_DIR):$(PATH)

# You should not use this target with this component unless testing or
# debugging. The OpenSSL FIPS-140 policy is strict and full U2 command set
# should be run. See above for more information.
configure:	$(CONFIGURE_32_and_64)

build:		$(BUILD_32_and_64)


# We must make the "install" target a no-op (but must run it to be compliant).
# See above for more information.
install:	$(BUILD_DIR_32)/.verified $(BUILD_DIR_64)/.verified

# This is a recommended set of commands to verify that the FIPS-140 mode can be
# used and that we used the correct tarball.
$(BUILD_DIR)/%/.verified:	$(BUILD_DIR)/%/.installed
	(printf x; \
	$(ENV) - OPENSSL_FIPS=1 LD_LIBRARY_PATH=/lib/openssl/fips-140/64 \
	/lib/openssl/fips-140/openssl sha1 -hmac $(OPENSSL_FIPS_HMAC_KEY) \
	    $(COMPONENT_ARCHIVE)) | \
	    $(NAWK) '{ if ($$2 != "$(OPENSSL_FIPS_HMAC)") exit 1 }'
	@echo Basic FIPS-140 mode verification passed.
	$(TOUCH) $@

test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

