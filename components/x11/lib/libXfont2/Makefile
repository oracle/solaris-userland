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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER = 		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXfont2
COMPONENT_VERSION=	2.0.7
COMPONENT_ARCHIVE_HASH= \
	sha256:8b7b82fdeba48769b69433e8e3fbb984a5f6bf368b0d5f47abeec49de3e58efb
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	17165
COMPONENT_BAID=		174227

TEST_TARGET = $(NO_TESTS)

CONFIGURE_LIBDIR.32 = $(USRLIBDIR)/xorg
CONFIGURE_LIBDIR.64 = $(USRLIBDIR)/xorg/$(MACH64)

FIX_PC_FILES=xfont2.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

# Use mapfile instead of -fvisibility to control symbol visibility
# so that we can expose symbols needed by our installalias program.
LD_SHARED_OPTIONS += -M$(COMPONENT_DIR)/mapfile
COMPONENT_BUILD_ARGS +=  OS_CFLAGS="-fvisibility=default"
COMPONENT_INSTALL_ARGS += OS_CFLAGS="-fvisibility=default"

# Build installalias after libXfont is built
INSTALLALIAS_SOURCE_DIR =	$(COMPONENT_DIR)/sun-src
COMPONENT_POST_BUILD_ACTION += \
	$(RM) -r $(@D)/sun-src ; $(MKDIR) $(@D)/sun-src ; \
	cd $(@D)/sun-src; $(ENV) $(CONFIGURE_ENV) $(COMPONENT_BUILD_ENV) \
	    $(GMAKE) VPATH=$(INSTALLALIAS_SOURCE_DIR) \
		-f $(INSTALLALIAS_SOURCE_DIR)/Makefile \
		libdir=$(CONFIGURE_LIBDIR.64) \
		CPPFLAGS="$(CC_BITS) -I $(SOURCE_DIR)/include" \
		$(COMPONENT_BUILD_ARGS) build ;
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)/usr/lib/X11 ; \
	$(INSTALL) -m 555 $(@D)/sun-src/installalias $(PROTO_DIR)/usr/lib/X11 ;


COMPONENT_INSTALL_ARGS.32 += pkgconfigdir="$(DESTDIR)/usr/lib/pkgconfig"
COMPONENT_INSTALL_ARGS.64 += pkgconfigdir="$(DESTDIR)/usr/lib/$(MACH64)/pkgconfig"

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libfontenc
REQUIRED_PACKAGES += x11/library/xtrans
