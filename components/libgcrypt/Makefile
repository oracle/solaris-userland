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
# Copyright (c) 2010, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32

# GCC 5.3 with the default optimization -O3 (set via shared-macros.mk),
# inlines _gcry_cipher_ocb_get_l, double_block_cpy and double_block to
# _gcry_cipher_ocb_authenticate on amd64. Due to a bug in GCC, the
# inlined code is incorrect and the library produces data with errors
# (manifested through failed 'basic' test results).  The optimization is
# lowered down on the affected platform.  For more information see:
# https://lists.gnupg.org/pipermail/gcrypt-devel/2016-April/003858.html
gcc_OPT.i386.64 = -O2

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libgcrypt
COMPONENT_VERSION=	1.8.3
COMPONENT_PROJECT_URL=  https://gnupg.org/software/libgcrypt/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
    sha256:66ec90be036747602f2b48f98312361a9180c97c68a690a5f376fa0f67d0af7c
COMPONENT_ARCHIVE_URL=  https://gnupg.org/ftp/gcrypt/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libgcrypt
COMPONENT_ANITYA_ID=	1623

TPNO= 			43817

COMPONENT_BUILD_TARGETS = all info

include $(WS_MAKE_RULES)/common.mk
#
# Any improvements made by the upstream to enable compilation of
# libgcrypt library on Solaris primarily reference GNU tools.  The
# library assembly source code contains ANSI notations currently not
# supported by Solaris C language preprocessor, cpp(1). Heavy manual
# patching in a potentially dangerous area would be needed to allow use
# of Solaris Studio as the component compiler.
COMPILER =		gcc

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --enable-maintainer-mode 
CONFIGURE_OPTIONS += --disable-asm

include ../../make-rules/shared-targets.mk

# Note: Two test cases (t-secmem and t-sexp) fail with EPERM when executed as
# a normal user. All tests should be successful when executed as a root user.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
        '-n -e "/PASS/p" ' \
        '-e "/FAIL/p" ' \
        '-e "/All/p" '

REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
