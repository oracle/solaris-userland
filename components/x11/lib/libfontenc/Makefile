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

COMPONENT_NAME=		libfontenc
COMPONENT_VERSION=	1.1.3
COMPONENT_ARCHIVE_HASH= \
	sha256:70588930e6fc9542ff38e0884778fbc6e6febf21adbab92fd8f524fe60aefd21
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1613
TPNO=			14484

COMPONENT_NAME_1=	encodings
COMPONENT_VERSION_1=	1.0.4
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.bz2
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)/releases/individual/font/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1= \
	sha256:ced6312988a45d23812c2ac708b4595f63fd7a49c4dcd9f66bdcd50d1057d539
COMPONENT_ANITYA_ID_1=	15051

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=fontenc.pc.in

CONFIGURE_LIBDIR.32 = $(USRLIBDIR)/xorg
CONFIGURE_LIBDIR.64 = $(USRLIBDIR)/xorg/$(MACH64)

include $(WS_MAKE_RULES)/x11-component.mk

# Install the encodings
ENCODINGS_CONFIGURE_OPTIONS += --disable-gzip-large-encodings
ENCODINGS_CONFIGURE_OPTIONS += --disable-gzip-small-encodings
$(BUILD_DIR_NO_ARCH)_1/.configured: SOURCE_DIR=$(SOURCE_DIR_1)
$(BUILD_DIR_NO_ARCH)_1/.configured: COMPONENT_PRE_CONFIGURE_ACTION += $(CLONEY) $(SOURCE_DIR) $(@D);
$(BUILD_DIR_NO_ARCH)_1/.configured: CONFIGURE_OPTIONS += $(ENCODINGS_CONFIGURE_OPTIONS)
configure:      $(BUILD_DIR_NO_ARCH)_1/.configured
build:          $(BUILD_DIR_NO_ARCH)_1/.built
install:        $(BUILD_DIR_NO_ARCH)_1/.installed

COMPONENT_INSTALL_ARGS.32 += pkgconfigdir="$(DESTDIR)/usr/lib/pkgconfig"
COMPONENT_INSTALL_ARGS.64 += pkgconfigdir="$(DESTDIR)/usr/lib/$(MACH64)/pkgconfig"

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += x11/header/x11-protocols
