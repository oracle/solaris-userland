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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS = 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	onig
COMPONENT_VERSION =	6.8.2
COMPONENT_PROJECT_URL =	https://github.com/kkos/oniguruma
COMPONENT_ARCHIVE_HASH =	\
    sha256:adeada5f6b54c2a6f58ff021831a01b18a62b55ea9935e972e36ebb19e7c4903
COMPONENT_ARCHIVE_URL =	$(COMPONENT_PROJECT_URL)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB =	library/oniguruma
COMPONENT_ANITYA_ID=	11184

TPNO =			44976

include $(WS_MAKE_RULES)/common.mk

COMPILER =		gcc
CONFIGURE_OPTIONS +=	--enable-static=no

COMPONENT_TEST_ARGS +=	CFLAGS+=-I$(PROTOUSRINCDIR)
COMPONENT_TEST_ENV +=	libtool_install_magic='%%%MAGIC variable%%%'
COMPONENT_TEST_ENV +=	libtool_execute_magic='%%%MAGIC variable%%%'
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/XPASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/XFAIL/p" ' \
	'-e "/ERROR/p" '

# need proto to run tests
test:	install
