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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =		64
BUILD_STYLE=		meson
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		lndir
COMPONENT_VERSION=	1.0.6
COMPONENT_ARCHIVE_HASH= \
	sha256:18f6d664e52894b7dee0d2fc9b171e0e58566e5091e44f9535f10e6d941912a4
COMPONENT_BUGDB=        x11/builds
COMPONENT_ANITYA_ID=	374579
COMPONENT_BAID=		428110

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

CBE_PACKAGES += x11/header/x11-protocols

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
