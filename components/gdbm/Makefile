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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gdbm
COMPONENT_VERSION=	1.23
COMPONENT_ARCHIVE_HASH=	\
    sha256:74b1081d21fff13ae4bd7c16e5d6e504a4c26f7cde1dca0d963a484174bbcacd
COMPONENT_BUGDB=	library/libgdbm
COMPONENT_ANITYA_ID=	882

COMPONENT_BAID=		122551

build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

# The tests build but they are not run automatically.  You have to
# manually run the tests (testdbm, testgdbm, etc) by hand and verify
# the DB operations. (No master test files).
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnu-component.mk

CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=	--enable-shared

COMPONENT_INSTALL_ENV +=	INSTALL_ROOT="$(PROTO_DIR)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV =	PATH="$(PROTOUSRSBINDIR):$(PATH)"

COMPONENT_TEST_TRANSFORMS += '-n'
COMPONENT_TEST_TRANSFORMS += '-e "/ok/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/UNEXPECTED PASS/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/skipped/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/FAILED/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/expected failure/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/successful/p"'
