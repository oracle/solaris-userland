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
# Copyright (c) 2021, 2022, Oracle and/or its affiliates.
#

BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_VERSION=	3.0.1
IPS_COMPONENT_VERSION=	3
COMPONENT_NAME=		openssl-$(IPS_COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	https://www.openssl.org/
COMPONENT_SRC=		openssl-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:c311ad853353bce796edad01a862c50a8a587f62e7e2100ef465ab53ec9b06d1
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)source/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/openssl
COMPONENT_ANITYA_ID=	2566
COMPONENT_BAID=		114107


CONFIGURE_PREFIX = /usr/openssl/3
CONFIGURE_OPTIONS = --openssldir=/etc/openssl/3

# build FIPS capable library
CONFIGURE_OPTIONS += enable-fips
# disabled engines
CONFIGURE_OPTIONS += no-afalgeng
CONFIGURE_OPTIONS += no-capieng

CONFIGURE_OPTIONS.64 += --libdir=$(CONFIGURE_PREFIX)/lib/$(MACH64) -Wl,-rpath=$(CONFIGURE_PREFIX)/lib/$(MACH64)
CONFIGURE_OPTIONS.i386.64  +=	solaris64-x86_64-cc
CONFIGURE_OPTIONS.sparc.64 +=	solaris64-sparcv9-cc

CONFIGURE_DEFAULT_DIRS = no

include $(WS_MAKE_RULES)/common.mk

# OpenSSL does not use autoconf but its own configure system.
CONFIGURE_SCRIPT= $(SOURCE_DIR)/config

# Alsways be super careful when appending to POST/PRE actions.
# We need to make sure that if any sub-action fails, the whole recipe fails,
# hence explicit exit is added to each append.
COMPONENT_POST_BUILD_ACTION += \
    ../common/verify_build.sh $(@D) $(CC) $(BITS) openssl-3.p5m || exit 1;

COMPONENT_POST_CONFIGURE_ACTION = \
      $(GPATCH) -p1 --verbose $(@D)/Makefile patches-post-config/Makefile.patch

COMPONENT_INSTALL_ARGS += MANSUFFIX=openssl

LINT_FLAGS += -I$(@D)/include -erroff=E_STATIC_UNUSED

#
# There is also separate STC test suite 'openssl'
# for regression testing. These internal tests are unit tests only.
#
COMPONENT_TEST_TARGETS = test
system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += developer/build/makedepend
# Perl is needed for Configure, tests and the distributed CA.pl script.
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/core-os
