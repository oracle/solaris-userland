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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-input-mouse
COMPONENT_VERSION=	1.9.5
COMPONENT_ARCHIVE_HASH= \
	sha256:4fde8ae9b44352e2a208584c36528ee3ed13cf5fe4417208a9785daccefd9968
COMPONENT_BUGDB=        x11/input
COMPONENT_ANITYA_ID=	15901
COMPONENT_BAID=		145582

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

LDFLAGS += -ldevinfo -lm

COMPONENT_INSTALL_ARGS += pkgconfigdir="$(DESTDIR)/usr/share/pkgconfig"

REQUIRED_PACKAGES += system/library/devinfo
REQUIRED_PACKAGES += system/library/math
