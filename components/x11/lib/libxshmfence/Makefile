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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxshmfence
COMPONENT_VERSION=	1.3
COMPONENT_ARCHIVE_HASH= \
	sha256:b884300d26a14961a076fbebc762a39831cb75f92bed5ccf9836345b459220c7
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1792
TPNO=			49156

FIX_PC_FILES=xshmfence.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

# Don't include path to x11proto headers in our proto area in the *.pc files.
COMPONENT_FIX_PC_FLAGS += -e 's| \@XPROTO_CFLAGS\@||g;'

# for tests
unexport SHELLOPTS
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += x11/header/x11-protocols
