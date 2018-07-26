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

BUILD_BITS =            32_and_64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mesa
COMPONENT_VERSION=	13.0.6
COMPONENT_PROJECT_URL=  https://www.mesa3d.org
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL=  https://mesa.freedesktop.org/archive/older-versions/13.x/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
	sha256:1076590f29103f022a2cd87e6dff6ae77072013745603d06b0410c373ab2bb1a
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1970
TPNO=			35915

TEST_TARGET = $(NO_TESTS)

PKG_PROTO_DIRS += $(SOURCE_DIR)/include/GL

include $(WS_MAKE_RULES)/x11-component.mk

FIX_PC_FILES += src/mesa/drivers/dri/dri.pc.in
FIX_PC_FILES += src/egl/main/egl.pc.in
FIX_PC_FILES += src/mesa/gl.pc.in
FIX_PC_FILES += src/mapi/es1api/glesv1_cm.pc.in
FIX_PC_FILES += src/mapi/es2api/glesv2.pc.in

LIBDRM_BASE = $(WS_COMPONENTS)/x11/lib/libdrm/libdrm-2.4.67

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

COMPONENT_POST_UNPACK_ACTION += \
	if [ ! -e "$(dir $(LIBDRM_BASE))/.prep" ]; then \
		$(MAKE) -C $(dir $(LIBDRM_BASE)) prep; \
	fi; \
	$(CP) $(LIBDRM_BASE)/intel/intel_aub.h $(SOURCE_DIR)/src/mesa/drivers/dri/i965; \

CONFIGURE_OPTIONS.32 += --disable-gallium-llvm
CONFIGURE_OPTIONS.64 += --enable-gallium-llvm --disable-llvm-shared-libs
CONFIGURE_OPTIONS += --enable-shared
ifneq ($(MACH), sparc)
CONFIGURE_OPTIONS += --with-dri-drivers='i915 i965 radeon r200 swrast'
else
CONFIGURE_OPTIONS += --with-dri-drivers='swrast'
endif
CONFIGURE_OPTIONS += --with-gallium-drivers=swrast
CONFIGURE_OPTIONS += --enable-gbm
CONFIGURE_OPTIONS += --disable-shader-cache
CONFIGURE_OPTIONS.32 += --with-dri-driverdir='/usr/lib/xorg/modules/dri'
CONFIGURE_OPTIONS.64 += --with-dri-driverdir='/usr/lib/xorg/modules/dri/$(MACH64)'

CXXFLAGS += -std=c++11
CFLAGS += -D__EXTENSIONS__ 
CPPFLAGS += -D__STDC_CONSTANT_MACROS -D__STDC_LIMIT_MACROS
LDFLAGS += -Wl,-z,rescan-now
CFLAGS.64 += -Wstack-protector -fdata-sections -fstack-protector-all
LD_OPTIONS.64+=	-z nodefs -z ignore -lLLVM -lssp
LD_OPTIONS += $(LD_OPTIONS.$(BITS))
LD_OPTIONS += -z discard-unused=dependencies
LD_OPTIONS += -M $(COMPONENT_DIR)/mapfile.externs

CONFIGURE_OPTIONS += --enable-ldflags="$(CC_BITS)"

REQUIRED_PACKAGES += developer/gnu-indent
REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += developer/llvm/llvm
REQUIRED_PACKAGES += developer/llvm/llvm-build
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/graphics/libvdpau
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libdrm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxdamage
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxxf86vm
REQUIRED_PACKAGES += x11/library/libpthread-stubs
