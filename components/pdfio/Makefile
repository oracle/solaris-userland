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
# Copyright (c) 2026, Oracle and/or its affiliates.
#

BUILD_BITS=             64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         pdfio
COMPONENT_VERSION=      1.6.5
COMPONENT_BAID=         431503
COMPONENT_ARCHIVE_HASH= sha256:2b9e1db7c4a72cbc896098a6682a1e51fc2bfb979f00bec8bb515ee79c338084
COMPONENT_ARCHIVE_URL=  https://github.com/michaelrsweet/pdfio/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  https://www.msweet.org/pdfio
COMPONENT_BUGDB=        library/pdfio

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS +=    --enable-shared
CONFIGURE_OPTIONS +=    --disable-static

COMPONENT_TEST_TARGETS = test

REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
