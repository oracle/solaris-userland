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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mesa-demos
COMPONENT_VERSION=	9.0.0
COMPONENT_PROJECT_URL=	https://mesa3d.org/
COMPONENT_ARCHIVE_URL=  https://mesa.freedesktop.org/archive/demos/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
	sha256:3046a3d26a7b051af7ebdd257a5f23bfeb160cad6ed952329cdff1e9f1ed496b
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	16781

COMPONENT_BAID=		418363

BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CPPFLAGS += -D__EXTENSIONS__

# We just build and deliver glxinfo and glxgears
CONFIGURE_OPTIONS += -Dx11=enabled
CONFIGURE_OPTIONS += -Degl=disabled
CONFIGURE_OPTIONS += -Dglut=disabled
CONFIGURE_OPTIONS += -Dosmesa=disabled
CONFIGURE_OPTIONS += -Dlibdrm=disabled
CONFIGURE_OPTIONS += -Dvulkan=disabled
CONFIGURE_OPTIONS += -Dwith-system-data-files=false

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/mesa
