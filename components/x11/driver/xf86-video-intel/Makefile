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
BUILD_ARCH =		i386
COMPILER = 		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-intel
COMPONENT_VERSION=	2.99.917
COMPONENT_ARCHIVE_HASH= \
	sha256:00b781eea055582820a123c47b62411bdf6aabf4f03dc0568faec55faf9667c9
COMPONENT_BUGDB=        x11/devices-intel
COMPONENT_ANITYA_ID=	5223

TEST_TARGET = $(NO_TESTS)

PKG_PROTO_DIRS += $(SOURCE_DIR)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-dri2
CONFIGURE_OPTIONS += --enable-dri3
CONFIGURE_OPTIONS += --disable-sna
CONFIGURE_OPTIONS += --enable-xvmc
CONFIGURE_OPTIONS += --enable-uxa
CONFIGURE_OPTIONS += --with-default-accel='uxa'
CONFIGURE_OPTIONS += --disable-udev

CFLAGS += -DHAVE_DRI1

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

XVMC_BASE = $(WS_COMPONENTS)/x11/lib/libXvMC/build/prototype/$(MACH)

PKG_CONFIG_PATHS += $(XVMC_BASE)$(PKG_CONFIG_PATH.$(BITS))
CPPFLAGS += -I$(XVMC_BASE)$(USRINCDIR)
LD_OPTIONS += -L$(XVMC_BASE)$(USRLIB.$(BITS))
DEPENDED += $(WS_TOP)/components/x11/lib/libXvMC/build/manifest-$(MACH)-libXvMC.depend
REQUIRED_PACKAGES += $(shell $(GSED) -n 's/REQUIRED_PACKAGES +=//p' ../../lib/libXvMC/Makefile)

# Instead of allowing the default MODTYPE_LD_SHARED_OPTIONS to link everything
# against the Xorg binary, 01-solaris-port.patch adds the XORG_EXTERNS_FLAG
# variable to the link of just intel_drv.so not to the client-side XvMC libs.
XORG_EXTERNS_FLAG = ""
COMPONENT_BUILD_ENV += XORG_EXTERNS_FLAG='-Wl,-z,parent=$(USRBINDIR)/Xorg'

LD_OPTIONS.32 += -L$(X11_SERVERLIBS_DIR) -R$(X11_SERVERLIBS_DIR)
LD_OPTIONS.64 += -L$(X11_SERVERLIBS_DIR)/$(MACH64)
LD_OPTIONS.64 += -R$(X11_SERVERLIBS_DIR)/$(MACH64)
LD_OPTIONS.64 += -z muldefs
LD_OPTIONS += $(LD_OPTIONS.$(BITS))

# In 32-bit build, only build client-side Xvmc loadable modules, not driver
SUBDIRS=	src/legacy/i810/xvmc xvmc
COMPONENT_POST_CONFIGURE_ACTION.32 += \
	$(GSED) -i 's%SUBDIRS = .*%SUBDIRS = $(SUBDIRS)%' $(@D)/Makefile ;

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += x11/library/libdrm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxv
REQUIRED_PACKAGES += x11/library/libxvmc
REQUIRED_PACKAGES += x11/library/xcb-util
REQUIRED_PACKAGES += x11/server/xorg
