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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 		64
COMPILER=		gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		paps
COMPONENT_VERSION=	0.8.0

# due to 27244651 the IPS version should be the solaris version
IPS_COMPONENT_VERSION= $(PKG_SOLARIS_VERSION)

COMPONENT_PROJECT_URL=	https://github.com/dov/paps
COMPONENT_ARCHIVE_URL=	https://github.com/dov/paps/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	sha256:bb5a826db364117a5ae79c833c4a000197f3b5b3eff10e31fb1513a583f96ff2

COMPONENT_BUGDB=	utility/paps
COMPONENT_BAID=		154385
COMPONENT_ANITYA_ID=	2592

BUILD_STYLE=		meson

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PYTHON_VERSION = 3.11
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/bin/src-to-paps

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/fmt
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
