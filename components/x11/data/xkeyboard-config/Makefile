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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xkeyboard-config
COMPONENT_VERSION=	2.37
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/wiki/Software/XKeyboardConfig/
COMPONENT_ARCHIVE_URL=	https://www.x.org/releases/individual/$(COMPONENT_CATEGORY)/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:eb1383a5ac4b6210d7c7302b9d6fab052abdf51c5d2c9b55f1f779997ba68c6c
COMPONENT_BUGDB=        x11/i18n
COMPONENT_ANITYA_ID=	5191
COMPONENT_SIG_URL=

COMPONENT_BAID=		132959

BUILD_STYLE=		meson

PKG_PROTO_DIRS += $(SOURCE_DIR)/compat
PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

# Assumes xgettext is first in $PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += library/perl-5/xml-parser
