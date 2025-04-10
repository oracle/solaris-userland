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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		rdesktop
COMPONENT_VERSION=	1.9.0
COMPONENT_PROJECT_URL=	http://www.rdesktop.org/
COMPONENT_ARCHIVE_HASH= \
	sha256:d547c2e6f3e4c818a7e69a0f39adb39fac303633e0c25aa804bb588507ffc230
COMPONENT_ARCHIVE_URL=	https://github.com/rdesktop/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	gnome/remote-desktop
COMPONENT_ANITYA_ID=	4172

COMPONENT_BAID=		72612

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# rdesktop-1.6.0 tarball includes configure.ac but not configure, so we make it
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS += --with-ipv6
CONFIGURE_OPTIONS += --x-includes=""
CONFIGURE_OPTIONS += --x-libraries=""
# we don't have libgssglue for this
CONFIGURE_OPTIONS += --disable-credssp

REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libtasn1
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += library/security/pcsc/pcsclite
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxrandr
