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

COMPONENT_NAME=		libfontenc
COMPONENT_VERSION=	1.1.9
COMPONENT_ARCHIVE_HASH= \
	sha256:9d8392705cb10803d5fe1d27d236cbab3f664e26841ce01916bbbe430cf273e2
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1613
COMPONENT_BAID=		390329

COMPONENT_NAME_1=	encodings
COMPONENT_VERSION_1=	1.1.0
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)/releases/individual/font/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1= \
	sha256:9ff13c621756cfa12e95f32ba48a5b23839e8f577d0048beda66c67dab4de975
COMPONENT_SIG_URL_1=	$(COMPONENT_ARCHIVE_URL_1).sig
COMPONENT_ANITYA_ID_1=	15051
COMPONENT_BAID_1=	175859

BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

CONFIGURE_LIBDIR.32 = $(USRLIBDIR)/xorg
CONFIGURE_LIBDIR.64 = $(USRLIBDIR)/xorg/$(MACH64)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_POST_INSTALL_ACTION.32 += \
	if [ -f $(PROTOUSRLIBDIR)/xorg/pkgconfig/fontenc.pc ] ; then \
	    $(MKDIR) $(PROTOUSRLIBDIR)/pkgconfig/ ; \
	    $(MV) $(PROTOUSRLIBDIR)/xorg/pkgconfig/fontenc.pc \
		$(PROTOUSRLIBDIR)/pkgconfig/ ; \
	    $(PERL) -i -p $(FIX_PC_OPS) \
		$(PROTOUSRLIBDIR)/pkgconfig/fontenc.pc ; \
	fi

COMPONENT_POST_INSTALL_ACTION.64 += \
	if [ -f $(PROTOUSRLIBDIR)/xorg/$(MACH64)/pkgconfig/fontenc.pc ] ; then \
	    $(MKDIR) $(PROTOUSRLIBDIR)/$(MACH64)/pkgconfig/ ; \
	    $(MV) $(PROTOUSRLIBDIR)/xorg/$(MACH64)/pkgconfig/fontenc.pc \
		$(PROTOUSRLIBDIR)/$(MACH64)/pkgconfig/ ; \
	    $(PERL) -i -p $(FIX_PC_OPS) \
		$(PROTOUSRLIBDIR)/$(MACH64)/pkgconfig/fontenc.pc ; \
	fi

# Install the encodings
ENCODINGS_CONFIGURE_OPTIONS += -Dgzip-large-encodings=false
ENCODINGS_CONFIGURE_OPTIONS += -Dgzip-small-encodings=false
$(BUILD_DIR_NO_ARCH)_1/.configured: SOURCE_DIR=$(SOURCE_DIR_1)
$(BUILD_DIR_NO_ARCH)_1/.configured: CONFIGURE_OPTIONS += $(ENCODINGS_CONFIGURE_OPTIONS)
configure:      $(BUILD_DIR_NO_ARCH)_1/.configured
build:          $(BUILD_DIR_NO_ARCH)_1/.built
install:        $(BUILD_DIR_NO_ARCH)_1/.installed

CBE_PACKAGES += x11/header/x11-protocols

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
