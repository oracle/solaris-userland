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
# Copyright (c) 2011, 2020, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gettext
COMPONENT_VERSION=	0.20.1
IPS_PKG_NAME=		text/gnu-gettext
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:53f02fbbec9e798b0faaf7c73272f83608e835c6288dd58be6c9bb54624a3800
COMPONENT_SIG_URL=
COMPONENT_BUGDB=	utility/gnu-gettext
COMPONENT_ANITYA_ID=	898

TPNO=			56895

include $(WS_MAKE_RULES)/gnu-component.mk

CONFIGURE_OPTIONS  +=		--disable-java
CONFIGURE_OPTIONS  +=		--disable-libasprintf
CONFIGURE_OPTIONS  +=		--without-emacs
CONFIGURE_OPTIONS  +=		--disable-openmp
CONFIGURE_OPTIONS  +=		--disable-static
CONFIGURE_OPTIONS  +=		--disable-shared

# Fixes coredump in gnulib-test/test-localename test
CONFIGURE_OPTIONS  +=		ac_cv_func_newlocale=no

# Tests should run in a clean environment
COMPONENT_TEST_ENV =	-i
COMPONENT_TEST_ENV +=	PATH=${PATH}:$(SPRO_VROOT)/bin

COMPONENT_TEST_TRANSFORMS += \
	'-e "s/^make\[[0-9]\{1,\}\]/make/g"' \
	'-n ' \
	'-e "/Testsuite /p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/ERROR/p" ' \
	'-e "/=====/p" ' \
	'-e "/TOTAL/p" '


REQUIRED_PACKAGES += developer/icu
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/libcroco
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += source/locale/localedef
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/locale
