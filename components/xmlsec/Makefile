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
# Copyright (c) 2019, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		xmlsec
COMPONENT_VERSION=	1.2.37
COMPONENT_PROJECT_URL=	https://www.aleksey.com/xmlsec
COMPONENT_SRC_NAME=	xmlsec1
COMPONENT_ARCHIVE_HASH= \
    sha256:5f8dfbcb6d1e56bddd0b5ec2e00a3d0ca5342a9f57c24dffde5c796b2be2871c
COMPONENT_ARCHIVE_URL=	http://www.aleksey.com/xmlsec/download/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/xmlsec
COMPONENT_ANITYA_ID=	5200

COMPONENT_BAID=		134732

PKG_CONFIG_PATH.64=	/usr/lib/64/pkgconfig

#
# most of tests using the gcrypt/gnutls backend skipped as they try
# to use secure memory, which requires additional privileges
# run sudo gmake test to get a better pass rate
#
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += '-e "/^--- TOTAL/p" ' \
	'-e "/.*/d" '

include $(WS_MAKE_RULES)/common.mk

# Make docs does not like cloney, so a simple copy is used instead.
COMPONENT_PRE_CONFIGURE_ACTION= \
	$(CP) -rp $(SOURCE_DIR)/. $(@D) ;

ifneq ($(strip $(OPENSSL3)),)
COMPONENT_POST_CONFIGURE_ACTION.64 += $(GSED) -i 's;-L$${libdir} ;;' $(@D)/xmlsec1-config ;
COMPONENT_POST_CONFIGURE_ACTION.64 += $(GSED) -i 's;-L/usr/lib/$(MACH64);;' $(@D)/xmlsec1-openssl.pc ;
COMPONENT_POST_CONFIGURE_ACTION.64 += $(GSED) -i 's;-L/usr/lib/$(MACH64);;' $(@D)/src/openssl/Makefile ;
COMPONENT_POST_CONFIGURE_ACTION.64 += $(GSED) -i 's;-L/usr/openssl/3/lib ;-L/usr/openssl/3/lib/64 ;' $(@D)/xmlsec1-config
COMPONENT_POST_CONFIGURE_ACTION.64 += $(GSED) -i 's;-L/usr/openssl/3/lib ;-L/usr/openssl/3/lib/64 ;' $(@D)/xmlsec1-openssl.pc ;
COMPONENT_POST_CONFIGURE_ACTION.64 += $(GSED) -i 's;-L/usr/openssl/3/lib ;-L/usr/openssl/3/lib/64 ;' $(@D)/src/openssl/Makefile ;
COMPONENT_POST_CONFIGURE_ACTION += $(COMPONENT_POST_CONFIGURE_ACTION.$(BITS))
CONFIGURE_OPTIONS+=	--with-openssl=/usr/openssl/3
endif
CONFIGURE_OPTIONS+=	PATH="$(GNUBIN):$$PATH"

COMPONENT_PRE_TEST_ACTION+= $(MKDIR) $(@D)/tests-tmp ;
COMPONENT_TEST_ENV+=    TMPFOLDER=$(@D)/tests-tmp
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES+=	system/library
REQUIRED_PACKAGES+=	system/library/math
REQUIRED_PACKAGES+=	library/libxml2
REQUIRED_PACKAGES+=	library/libxslt
REQUIRED_PACKAGES+=	system/library/security/libgcrypt
REQUIRED_PACKAGES+=	library/gnutls-3
ifneq ($(strip $(OPENSSL3)),)
REQUIRED_PACKAGES+=	library/security/openssl-3
else
REQUIRED_PACKAGES+=	library/security/openssl
endif
REQUIRED_PACKAGES+=	library/security/nss
REQUIRED_PACKAGES+=	library/nspr
