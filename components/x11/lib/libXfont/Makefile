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

COMPONENT_NAME=		libXfont
COMPONENT_VERSION=	1.5.4
COMPONENT_ARCHIVE_HASH= \
	sha256:1a7f7490774c87f2052d146d1e0e64518d32e6848184a18654e8d0bb57883242
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1776

TEST_TARGET = $(NO_TESTS)

CONFIGURE_LIBDIR.32 = $(USRLIBDIR)/xorg
CONFIGURE_LIBDIR.64 = $(USRLIBDIR)/xorg/$(MACH64)

FIX_PC_FILES=xfont.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-freetype
CONFIGURE_OPTIONS += --disable-type1
CONFIGURE_OPTIONS += --disable-cid
CONFIGURE_OPTIONS += --disable-speedo
CONFIGURE_OPTIONS += --enable-fontcache
CONFIGURE_OPTIONS += --enable-fc
CONFIGURE_OPTIONS += --with-bzip2
CONFIGURE_OPTIONS += --enable-builtins

LD_OPTIONS += -M$(COMPONENT_DIR)/mapfile

COMPONENT_INSTALL_ARGS.32 += pkgconfigdir="$(DESTDIR)/usr/lib/pkgconfig"
COMPONENT_INSTALL_ARGS.64 += pkgconfigdir="$(DESTDIR)/usr/lib/$(MACH64)/pkgconfig"

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libfontenc
REQUIRED_PACKAGES += x11/library/xtrans
