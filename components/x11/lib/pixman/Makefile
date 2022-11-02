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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pixman
COMPONENT_VERSION=	0.42.2
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:5747d2ec498ad0f1594878cc897ef5eb6c29e91c53b899f7f71b506785fc1376
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	3648
COMPONENT_BAID=		132429
COMPONENT_SIG_URL= 

FIX_PC_FILES=pixman-1.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

# Regenerate configure script after patching in patches/0001-hwcap.patch
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)

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

REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += system/library/math
