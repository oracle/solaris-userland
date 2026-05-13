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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		hicolor-icon-theme
COMPONENT_VERSION=	0.18
COMPONENT_PROJECT_URL=	http://freedesktop.org/wiki/Software/icon-theme/
COMPONENT_ARCHIVE_HASH= \
	sha256:db0e50a80aa3bf64bb45cbca5cf9f75efd9348cf2ac690b907435238c3cf81d7
COMPONENT_ARCHIVE_URL=	https://icon-theme.freedesktop.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        gnome/branding
COMPONENT_ANITYA_ID=	1316

COMPONENT_BAID=		167391
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk
