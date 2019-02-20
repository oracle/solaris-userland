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

COMPONENT_NAME=		pixman
COMPONENT_VERSION=	0.38.0
COMPONENT_ARCHIVE_HASH= \
	sha256:b768e3f7895ddebdc0f07478729d9cec4fe0a9d2201f828c900d67b0e5b436a8
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	3648
TPNO=			49577

FIX_PC_FILES=pixman-1.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --disable-gtk

# added to avoid the build failure of a void function returning value
CFLAGS.studio += $(studio_FEATURES_EXTENSIONS)

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

REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += system/library/math
