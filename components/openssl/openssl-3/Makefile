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
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

include Makefile.com

CONFIGURE_PREFIX = /usr/openssl/3
CONFIGURE_OPTIONS = --openssldir=/etc/openssl/3

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# build FIPS capable library
CONFIGURE_OPTIONS += enable-fips
# disabled engines
CONFIGURE_OPTIONS += no-afalgeng
CONFIGURE_OPTIONS += no-capieng
CONFIGURE_OPTIONS += no-padlockeng

CONFIGURE_OPTIONS.32 += --libdir=$(CONFIGURE_PREFIX)/lib no-asm
CONFIGURE_OPTIONS.64 += --libdir=$(CONFIGURE_PREFIX)/lib/$(MACH64)
CONFIGURE_OPTIONS.i386.32  +=	solaris-x86-gcc
CONFIGURE_OPTIONS.sparc.32 +=	solaris-sparcv9-gcc
CONFIGURE_OPTIONS.i386.64  +=	solaris64-x86_64-gcc
CONFIGURE_OPTIONS.sparc.64 +=	solaris64-sparcv9-gcc

PROTOUSRLIBDIR = $(PROTO_DIR)$(CONFIGURE_PREFIX)/lib
PROTOUSRLIBDIR64 = $(PROTO_DIR)/$(CONFIGURE_PREFIX)/lib/$(MACH64)
include $(WS_MAKE_RULES)/common.mk

# Always be super careful when appending to POST/PRE actions.
# We need to make sure that if any sub-action fails, the whole recipe fails,
# hence explicit exit is added to each append.
COMPONENT_POST_BUILD_ACTION += \
    ../common/verify_build.sh $(@D) $(CC) $(BITS) openssl-3.p5m regular || exit 1;

COMPONENT_POST_CONFIGURE_ACTION = \
      $(GPATCH) -p1 --verbose $(@D)/Makefile patches-post-config/Makefile.patch

COMPONENT_INSTALL_ARGS += MANSUFFIX=openssl

# 32 and 64 bits configuration.h headers need to be merged to the final one.
# Note: because diff returns 1 when files are not equal, we have to suppress
# gmake failure. It is reason why 'true' command was added.
# Both of the 32 and 64 bit bin/openssl are needed by the fips-140 SMF method.
OPENSSLH=include/openssl/configuration.h
$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
	cd $(PROTO_DIR)$(CONFIGURE_PREFIX)/bin/ ; \
	mkdir 64 ; \
	mv openssl 64 ; \
	ln 64/openssl openssl ; \
	diff -D _LP64 $(BUILD_DIR_32)/$(OPENSSLH) \
	$(BUILD_DIR_64)/$(OPENSSLH) > \
	$(PROTO_DIR)$(CONFIGURE_PREFIX)/$(OPENSSLH); \
	true;

$(INSTALL_32): COMPONENT_POST_INSTALL_ACTION += \
	cd $(PROTO_DIR)$(CONFIGURE_PREFIX)/bin/ ; \
	mkdir 32 ; \
	mv openssl 32

LINT_FLAGS += -I$(@D)/include -erroff=E_STATIC_UNUSED

#
# There is also separate STC test suite 'openssl'
# for regression testing. These internal tests are unit tests only.
#
COMPONENT_TEST_TARGETS = test
system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

#
# Avoid test failures on a system behind a proxy. Some tests may spawn a local
# HTTP server instance and try to connect to it.
#
COMPONENT_TEST_ENV+=	http_proxy=
COMPONENT_TEST_ENV+=	https_proxy=
COMPONENT_TEST_ENV+=	HTTP_PROXY=
COMPONENT_TEST_ENV+=	HTTPS_PROXY=

