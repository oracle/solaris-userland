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
# Copyright (c) 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libsodium
COMPONENT_VERSION=	1.0.20
COMPONENT_PROJECT_URL=	https://doc.libsodium.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:ebb65ef6ca439333c2bb41a0c1990587288da07f6c7fd07cb3a18cc18d30ce19
COMPONENT_ARCHIVE_URL=	https://github.com/jedisct1/libsodium/releases/download/$(COMPONENT_VERSION)-RELEASE/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libsodium
COMPONENT_ANITYA_ID=	1599

COMPONENT_BAID=		326006

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_TRANSFORMS += '-e "/^make/d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^  CC/d"'

REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
