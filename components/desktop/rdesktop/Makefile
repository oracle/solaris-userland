#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

BUILD_BITS=		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		rdesktop
COMPONENT_VERSION=	1.9.1
COMPONENT_PROJECT_URL=	https://github.com/marcofortina/rdesktop
COMPONENT_ARCHIVE_HASH= \
	sha256:5a48736533ed09e3eef76f770bfbe9322e3e5661547c1585cf6eca21c8f18917
COMPONENT_ARCHIVE_URL=	https://github.com/marcofortina/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	gnome/remote-desktop

COMPONENT_BAID=		465772

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# rdesktop-1.6.0 tarball includes configure.ac but not configure, so we make it
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS += --with-ipv6
CONFIGURE_OPTIONS += --x-includes=""
CONFIGURE_OPTIONS += --x-libraries=""
# Smartcard redirection is not required for the Solaris package. Exclude the
# implementation, including the unresolved upstream issue 115 code paths.
CONFIGURE_OPTIONS += --disable-smartcard

REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libtasn1
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxrandr
