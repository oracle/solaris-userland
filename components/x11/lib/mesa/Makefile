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
# Copyright (c) 2018, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mesa
COMPONENT_VERSION=	20.0.2
COMPONENT_PROJECT_URL=  https://www.mesa3d.org
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_ARCHIVE_URL=  https://mesa.freedesktop.org/archive/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
	sha256:aa54f1cb669550606aab8ceb475105d15aeb814fca5a778ce70d0fd10e98e86f
COMPONENT_BUGDB=        x11/mesa
COMPONENT_ANITYA_ID=	1970
TPNO=			57775
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

PKG_PROTO_DIRS += $(SOURCE_DIR)/include/GL

include $(WS_MAKE_RULES)/x11-component.mk

FIX_PC_FILES += src/mesa/drivers/dri/dri.pc.in
FIX_PC_FILES += src/egl/main/egl.pc.in
FIX_PC_FILES += src/mesa/gl.pc.in
FIX_PC_FILES += src/mapi/es1api/glesv1_cm.pc.in
FIX_PC_FILES += src/mapi/es2api/glesv2.pc.in

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# to find gnu egrep and gsed
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS.32 += -Ddri-drivers-path='/usr/lib/xorg/modules/dri'
CONFIGURE_OPTIONS.64 += -Ddri-drivers-path='/usr/lib/xorg/modules/dri/$(MACH64)'
CONFIGURE_OPTIONS += -Delf-tls=false
# swrast gallium provider just for 64 bits (there is no 32 bits LLVM library)
CONFIGURE_OPTIONS.32 += -Dgallium-drivers=''
CONFIGURE_OPTIONS.64 += -Dgallium-drivers='swrast'
CONFIGURE_OPTIONS += -Dvulkan-drivers=''
CONFIGURE_OPTIONS += -Dgbm=true
CONFIGURE_OPTIONS += -Dglvnd=false
CONFIGURE_OPTIONS += -Dplatforms='x11, drm'
CONFIGURE_OPTIONS += -Dllvm=true
CONFIGURE_OPTIONS += -Dglx='auto'
ifeq ($(MACH), i386)
# Note that only one swrast provider can be built.
CONFIGURE_OPTIONS.32 += -Ddri-drivers='i915,i965,r200,swrast'
CONFIGURE_OPTIONS.64 += -Ddri-drivers='i915,i965,r200'
else
CONFIGURE_OPTIONS.32 += -Ddri-drivers='swrast'
CONFIGURE_OPTIONS.64 += -Ddri-drivers=''
endif

CFLAGS += -D__EXTENSIONS__ -Wno-incompatible-pointer-types
CPPFLAGS += -D__STDC_CONSTANT_MACROS -D__STDC_LIMIT_MACROS
LDFLAGS += -Wl,-zgnu-version-script-compat
# This code has init cycles and multiple C++ libraries, and misbehaves
# when lazy loading is used. Since we're unable to restructure third
# party code at that level, we must instead disable lazy loading.
LDFLAGS += -Wl,-znolazyload
LDFLAGS += -Wl,-z,rescan-now
CFLAGS.64 += -Wstack-protector -fdata-sections -fstack-protector-all
LD_OPTIONS.64+=	-z nodefs -z ignore -lLLVM -lssp
LD_OPTIONS += $(LD_OPTIONS.$(BITS))
LD_OPTIONS += -z discard-unused=dependencies
LD_OPTIONS += -M $(COMPONENT_DIR)/mapfile.externs

# Use symlinks as Userland generate cannot treat hardlinks well.

COMPONENT_POST_INSTALL_ACTION.64 += \
	cd $(PROTOUSRLIBDIR)/xorg/modules/dri/$(MACH64) ; \
	$(RM) kms_swrast_dri.so ; $(SYMLINK) swrast_dri.so kms_swrast_dri.so ;

ifeq ($(MACH), i386)
COMPONENT_POST_INSTALL_ACTION.64 += \
	cd $(PROTOUSRLIBDIR)/xorg/modules/dri/$(MACH64) ; \
	$(RM) i965_dri.so ; $(SYMLINK) i915_dri.so i965_dri.so ; \
	$(RM) r200_dri.so ; $(SYMLINK) i915_dri.so r200_dri.so ;

COMPONENT_POST_INSTALL_ACTION.32 += \
	cd $(PROTOUSRLIBDIR)/xorg/modules/dri ; \
	$(RM) i915_dri.so ; $(SYMLINK) swrast_dri.so i915_dri.so ; \
	$(RM) i965_dri.so ; $(SYMLINK) swrast_dri.so i965_dri.so ; \
	$(RM) r200_dri.so ; $(SYMLINK) swrast_dri.so r200_dri.so ;
endif

# Add RPATH to xorg lib directory where is libdrm.

COMPONENT_POST_INSTALL_ACTION += \
	test $(BITS) -eq 64 && dir64=/$(MACH64) ; \
	for f in libgbm.so.1.0.0 libEGL.so.1.0.0 libGL.so.1.2.0 ; do \
	$(ELFEDIT) -e "dyn:runpath /usr/lib/xorg$$dir64" \
	  $(PROTOUSRLIBDIR)$$dir64/$$f ; \
	done ; \
	$(ELFEDIT) -e "dyn:runpath /usr/lib/xorg$$dir64" \
	  $(PROTOUSRLIBDIR)/xorg/modules/dri$$dir64/swrast_dri.so ;

ifeq ($(MACH), i386)
COMPONENT_POST_INSTALL_ACTION.64 += \
	$(ELFEDIT) -e "dyn:runpath /usr/lib/xorg/amd64" \
	  $(PROTOUSRLIBDIR)/xorg/modules/dri/amd64/i915_dri.so ;
endif

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
REQUIRED_PACKAGES += x11/library/libxshmfence
