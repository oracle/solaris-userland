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

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		x11perf
COMPONENT_VERSION=	1.6.1
COMPONENT_ARCHIVE_HASH= \
	sha256:1c7e0b8ffc2794b4ccf11e04d551823abe0ea47b4f7db0637390db6fbe817c34
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15035
TPNO=			50352

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --libdir=$(CONFIGURE_LIBDIR.32)

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxmuu
REQUIRED_PACKAGES += x11/library/libxrender
