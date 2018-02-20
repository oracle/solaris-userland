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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xkeyboard-config
COMPONENT_VERSION=	2.16
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/wiki/Software/XKeyboardConfig/
COMPONENT_ARCHIVE_URL=	https://www.x.org/releases/individual/$(COMPONENT_CATEGORY)/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:1e8a1f212c96b7f71ca0b05da361cac1816d27baae1d8e03e7b53049b58d1d58
COMPONENT_BUGDB=        x11/other
COMPONENT_ANITYA_ID=	5191

TPNO=	26022

PKG_PROTO_DIRS += $(SOURCE_DIR)/compat
PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

# Assumes xgettext is first in $PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_INSTALL_ARGS += pkgconfigdir="$(DESTDIR)/usr/lib/$(MACH64)/pkgconfig"



