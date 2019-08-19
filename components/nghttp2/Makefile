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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nghttp2
COMPONENT_VERSION=	1.39.2
COMPONENT_PROJECT_URL=	https://nghttp2.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:fc820a305e2f410fade1a3260f09229f15c0494fc089b0100312cd64a33a38c0
COMPONENT_ARCHIVE_URL=	https://github.com/tatsuhiro-t/nghttp2/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/nghttp2
COMPONENT_ANITYA_ID=	8651

TPNO = 53508

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Use explicit Python version rather than the default one
CONFIGURE_ENV += PYTHON=$(PYTHON.2.7)

# examples are not being shipped and currently do not build when using Studio.
CONFIGURE_OPTIONS += --disable-examples
CONFIGURE_OPTIONS += --disable-hpack-tools
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += ac_cv_prog_CYTHON=''
CONFIGURE_OPTIONS += ZLIB_LIBS=-lz
CONFIGURE_OPTIONS += ZLIB_CFLAGS=
