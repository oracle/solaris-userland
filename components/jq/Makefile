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
COMPILER = gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	jq
COMPONENT_VERSION =	1.6
COMPONENT_PROJECT_URL =	https://github.com/stedolan/jq
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION)rc1.tar.gz
COMPONENT_SRC=		jq-jq-$(COMPONENT_VERSION)rc1
COMPONENT_ARCHIVE_HASH =	\
    sha256:1273c34c8db9c33870c559f475247771139d008d9266c673c13111acab3a77d4
COMPONENT_ARCHIVE_URL =	$(COMPONENT_PROJECT_URL)/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB =	utility/jq
COMPONENT_ANITYA_ID=	13252

TPNO =			39651

include $(WS_MAKE_RULES)/common.mk

# noexbss causes onig.test to fail
LD_MAP_NOEXBSS.sparc =

# generate configure
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

# couldn't convince autotools to not include the proto runpath
COMPONENT_POST_INSTALL_ACTION += \
	( /usr/bin/elfedit -e 'dyn:delete RPATH' -e 'dyn:delete RUNPATH' \
		"$(PROTOUSRBINDIR)/jq" )

COMPONENT_TEST_ENV +=	JQ="$(PROTOUSRBINDIR)/jq"
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
test: install

REQUIRED_PACKAGES +=	library/oniguruma
REQUIRED_PACKAGES +=	system/library/math
