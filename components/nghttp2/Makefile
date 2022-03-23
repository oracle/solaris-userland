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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nghttp2
COMPONENT_VERSION=	1.47.0
COMPONENT_BAID=		119046
COMPONENT_PROJECT_URL=	https://nghttp2.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:62f50f0e9fc479e48b34e1526df8dd2e94136de4c426b7680048181606832b7c
COMPONENT_ARCHIVE_URL=	https://github.com/tatsuhiro-t/nghttp2/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/nghttp2
COMPONENT_ANITYA_ID=	8651

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# examples are not being shipped
CONFIGURE_OPTIONS += --disable-examples
CONFIGURE_OPTIONS += --disable-hpack-tools
# Python is a dependency only if --enable-python-bindings is given, which
# is not. Because of that, the detected version is irrelevant.
CONFIGURE_OPTIONS += --disable-python-bindings
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += ac_cv_prog_CYTHON=''
CONFIGURE_OPTIONS += ZLIB_LIBS=-lz
CONFIGURE_OPTIONS += ZLIB_CFLAGS=
