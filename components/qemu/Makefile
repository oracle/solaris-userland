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
# Copyright (c) 2020, 2025, Oracle and/or its affiliates.
#

BUILD_ARCH =		i386
BUILD_BITS =		64
COMPILER =		gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		qemu
COMPONENT_VERSION=	9.0.2

COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_ARCHIVE_HASH=	\
	sha256:a8c3f596aece96da3b00cafb74baafa0d14515eafb8ed1ee3f7f5c2d0ebf02b6
COMPONENT_ANITYA_ID=	13607

COMPONENT_ARCHIVE_URL=  https://download.qemu.org/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_PUBLIC_KEY_URL= \
	https://keys.openpgp.org/vks/v1/by-fingerprint/CEACC9E15534EBABB82D3FA03353C9CEF108B584
COMPONENT_PROJECT_URL=	https://www.qemu.org
COMPONENT_BUGDB=    utility/qemu-img

COMPONENT_BAID=		176681

# qemu currently has a custom build system that uses the same commands as
# GNU autoconf to configure and build from the outside, but actually wraps
# around meson & ninja inside.
BUILD_STYLE= configure

# Disable non-tools targets
CONFIGURE_OPTIONS =  --disable-system
CONFIGURE_OPTIONS += --without-default-features
CONFIGURE_OPTIONS += --enable-tools
CONFIGURE_OPTIONS += --enable-vdi
CONFIGURE_OPTIONS += --enable-vmdk

# Tests are focused on emulator, don't cover tools
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PATH=   $(GNUBIN):$(USRBINDIR64):$(USRBINDIR)

COMPONENT_BUILD_ENV += PATH="$(PATH)"

# Use Solaris ar no matter what the $PATH order is, to avoid meson detecting
# GNU extensions that GNU ar supports but the Solaris linker does not.
CONFIGURE_ENV += AR=/usr/bin/ar

# To build qemu-img.1 man page, we need the sphinx_rtd_theme which
# isn't in our package.  Uncomment the following lines to build it:
#CONFIGURE_OPTIONS += --enable-docs --python=/usr/bin/python3.11
#CONFIGURE_ENV += https_proxy=www-proxy.us.oracle.com:80

REQUIRED_PACKAGES += developer/build/meson
REQUIRED_PACKAGES += developer/build/ninja
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
