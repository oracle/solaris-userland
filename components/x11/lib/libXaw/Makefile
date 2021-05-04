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
# Copyright (c) 2018, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXaw
COMPONENT_VERSION=	1.0.14
COMPONENT_ARCHIVE_HASH= \
	sha256:76aef98ea3df92615faec28004b5ce4e5c6855e716fa16de40c32030722a6f8e
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1766
COMPONENT_SIG_URL=
TPNO=			69912

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xaw7.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xaw

# We only ship libXaw.so.7, since we don't need to maintain binary
# compatibility with the libXaw.so.6 version we never shipped, and never
# started shipping the now-dropped-by-X.Org libXaw.so.8 (Xaw + Xprint)
CONFIGURE_OPTIONS += --disable-xaw6

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxpm
REQUIRED_PACKAGES += x11/library/toolkit/libxt
