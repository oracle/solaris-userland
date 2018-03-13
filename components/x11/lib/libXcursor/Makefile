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

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXcursor
COMPONENT_VERSION=	1.1.15
COMPONENT_ARCHIVE_HASH= \
	sha256:294e670dd37cd23995e69aae626629d4a2dfe5708851bbc13d032401b7a3df6b
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1770

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xcursor.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xcursor

# Use /usr/share/icons only, not /usr/X11/share, for consistency with GNOME
CONFIGURE_OPTIONS += --with-icondir=/usr/share/icons
CONFIGURE_OPTIONS += --with-cursorpath='~/.icons:/usr/share/icons:/usr/share/pixmaps'

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxrender
