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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cantarell-fonts
COMPONENT_VERSION=	0.301
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/CantarellFonts
COMPONENT_ARCHIVE_URL=	https://download.gnome.org/sources/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:3d35db0ac03f9e6b0d5a53577591b714238985f4cfc31a0aa17f26cd74675e83
COMPONENT_BUGDB=        gnome/themes
COMPONENT_ANITYA_ID=	10888

TPNO=			68667
BUILD_STYLE=		meson

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)

CONFIGURE_OPTIONS += -Dfontsdir=$(USRSHARETTFONTSDIR)/cantarell
