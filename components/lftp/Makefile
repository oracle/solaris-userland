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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		lftp
COMPONENT_VERSION=	4.9.2
COMPONENT_PROJECT_URL=	https://lftp.yar.ru/
COMPONENT_ARCHIVE_HASH=	\
    sha256:a37589c61914073f53c5da0e68bd233b41802509d758a022000e1ae2076da733
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)ftp/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	1555

COMPONENT_BAID=		89377

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

PATCH_LEVEL =   0

CONFIGURE_OPTIONS  +=		--localedir=$(CONFIGURE_LOCALEDIR)

# Workaround gcc 14 errors in m4/needtrio.m4 in 4.9.2 (fixed in git in 2023)
CONFIGURE_OPTIONS += ac_cv_need_trio=no

# Workaround gcc 14 errors in m4/select.m4 from gnulib
CONFIGURE_OPTIONS += gl_cv_func_select_detects_ebadf=yes

REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
