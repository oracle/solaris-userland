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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
COMPILER= gcc
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		spawn-fcgi
COMPONENT_VERSION=	1.6.6
COMPONENT_PROJECT_URL=	https://redmine.lighttpd.net/projects/spawn-fcgi
COMPONENT_ARCHIVE_HASH=	\
    sha256:4ffe2e9763cf71ca52c3d642a7bfe20d6be292ba0f2ec07a5900c3110d0e5a85
COMPONENT_ARCHIVE_URL=	\
	https://download.lighttpd.net/spawn-fcgi/releases-1.6.x/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	5388

COMPONENT_BAID=		434247

BUILD_STYLE=		meson

LDFLAGS +=		-fstack-protector

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
