
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
# Copyright (c) 2007, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		tigervnc
COMPONENT_VERSION=	1.9.0
COMPONENT_PROJECT_URL=	http://tigervnc.org/
COMPONENT_ARCHIVE=	v$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= \
	sha256:f15ced8500ec56356c3bf271f52e58ed83729118361c7103eab64a618441f740
COMPONENT_ARCHIVE_URL=	https://github.com/TigerVNC/tigervnc/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        x11/vnc
COMPONENT_ANITYA_ID=	4970

TPNO=			47610

XORG_DIR=		$(COMPONENT_DIR:xvnc=xorg)
get-xorg-value=		$(MAKE) --no-print-directory -C $(XORG_DIR) print-$(1) \
				| $(PERL) -ne 'print "$$1\n" if m/^$(1)=(.*?)\s*\(origin:/'

LIBDRM_BASE = $(WS_COMPONENTS)/x11/lib/libdrm/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(LIBDRM_BASE)$(USRLIB)/pkgconfig/
CPPFLAGS += -I$(LIBDRM_BASE)/usr/include/ -I$(LIBDRM_BASE)/usr/include/libdrm
LD_OPTIONS += -L $(LIBDRM_BASE)$(USRLIB)

XORGPROTO_BASE += $(WS_COMPONENTS)/x11/proto/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(XORGPROTO_BASE)/usr/share/pkgconfig/
CPPFLAGS += -I$(XORGPROTO_BASE)/usr/include/

COMPONENT_NAME_1=	xorg-server
COMPONENT_VERSION_1:=	$(shell $(call get-xorg-value,COMPONENT_VERSION))
COMPONENT_SRC_1=     	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1:=	$(shell $(call get-xorg-value,COMPONENT_ARCHIVE))
COMPONENT_ARCHIVE_HASH_1:= $(shell $(call get-xorg-value,COMPONENT_ARCHIVE_HASH))
COMPONENT_ARCHIVE_URL_1:= $(shell $(call get-xorg-value,COMPONENT_ARCHIVE_URL))

TEST_TARGET = $(NO_TESTS)

# If only it was this simple - the outer layer of tigervnc code is built
# with cmake, but the inner unix/xserver code uses configure.
BUILD_STYLE= cmake

include $(WS_MAKE_RULES)/x11-component.mk

# We need to unpack the xserver source in the unix/xserver directory of the
# tigervnc source, but it's not empty, so we have to temporarily move the
# contents aside, unpack it, then move them into place.

XSERVER_SRC=	$(COMPONENT_SRC)/unix/xserver

COMPONENT_POST_UNPACK_ACTION += $(MV) $(XSERVER_SRC) $(XSERVER_SRC)-temp ;

COMPONENT_POST_UNPACK_ACTION_1 += \
	$(MV) $(COMPONENT_SRC_1) $(XSERVER_SRC) ; \
	$(MV) $(XSERVER_SRC)-temp/hw/vnc $(XSERVER_SRC)/hw/vnc ; \
	rmdir $(XSERVER_SRC)-temp/hw $(XSERVER_SRC)-temp ; \
	$(MKDIR) $(COMPONENT_SRC_1) ;

# Add some additional Solaris-specific sources into the xserver directory,
# just as we do in the ../xorg build
COMPONENT_POST_UNPACK_ACTION_1 += \
        $(CP) -r $(XORG_DIR)/sun-src/IA $(XSERVER_SRC)/IA ; \
        $(CP) -r $(XORG_DIR)/sun-src/os/* $(XSERVER_SRC)/os/ ;


# Apply patches from upstream tigervnc tarball and xorg directory to
# embedded xserver sources
PATCH_STAMPS += $(XSERVER_SRC)/.patched

$(XSERVER_SRC)/.patched: $(UNPACK_STAMP) $(UNPACK_STAMP_1) 
	$(GPATCH) -d $(XSERVER_SRC) $(GPATCH_FLAGS) < \
		$(SOURCE_DIR)/unix/xserver120.patch ; \
	for patch in $(XORG_DIR)/patches/*.patch ; do \
		echo "$(GPATCH) -d $(XSERVER_SRC) $(GPATCH_FLAGS) < $${patch}" ; \
		$(GPATCH) -d $(XSERVER_SRC) $(GPATCH_FLAGS) < $${patch} ; \
	done
	touch $@

$(SOURCE_DIR)/.patched: $(XSERVER_SRC)/.patched

### Main part of TigerVNC is built with cmake

CMAKE_OPTIONS += -Wno-dev
CMAKE_OPTIONS += -DBUILD_JAVA:BOOL=FALSE
CMAKE_OPTIONS += -DCMAKE_SKIP_RPATH:BOOL=TRUE

### Xvnc (embedded in unix/xserver in TigerVNC sources) is built w/ autotools

include $(WS_MAKE_RULES)/configure.mk

# common.mk would set these if BUILD_STYLE=configure, but not for cmake
CONFIGURE_ENV += CFLAGS="$(strip $(CFLAGS))"
CONFIGURE_ENV += CXXFLAGS="$(strip $(CXXFLAGS))"
CONFIGURE_ENV += LDFLAGS="$(strip $(LDFLAGS))"

# Other settings we want
CONFIGURE_ENV += LD="$(CC) -m$(BITS)"
CPPFLAGS += -DSUNSOFT

# Start with the configure options we use to build the Xorg server
CONFIGURE_OPTIONS += $(shell $(call get-xorg-value,CONFIGURE_OPTIONS))
# Disable all the things we don't need in the Xvnc build since we
# get them in the normal Xorg build instead
CONFIGURE_OPTIONS += --disable-builddocs --disable-xfree86-utils
CONFIGURE_OPTIONS += --disable-xorg --disable-xnest --disable-xvfb --disable-dmx
CONFIGURE_OPTIONS += --disable-xwin --disable-xephyr --disable-kdrive
CONFIGURE_OPTIONS += --disable-dri3 --disable-present
CONFIGURE_OPTIONS += --disable-all-encodings
# Disable building Xorg hardware device support that Xvnc can't use
CONFIGURE_OPTIONS += --without-int10 --disable-config-hal --disable-dga
# The X server unit tests currently depend on the Xorg ddx being built
CONFIGURE_OPTIONS += --disable-unit-tests

GNUTLS_PKGCONFIG_CMD = PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)" pkg-config
GNUTLS_ENV += GNUTLS_CFLAGS="$$($(GNUTLS_PKGCONFIG_CMD) --cflags gnutls)"
GNUTLS_ENV += GNUTLS_LDFLAGS="$$($(GNUTLS_PKGCONFIG_CMD) --libs gnutls)"
CONFIGURE_OPTIONS += $(GNUTLS_ENV)
COMPONENT_BUILD_ENV += $(GNUTLS_ENV)

BITS=64
XSERVER_BUILD_DIR = $(BUILD_DIR_64)/unix/xserver

configure:	$(XSERVER_BUILD_DIR)/.configured
build:		$(XSERVER_BUILD_DIR)/.built
install:	$(XSERVER_BUILD_DIR)/.installed

$(XSERVER_BUILD_DIR)/.configured: $(SOURCE_DIR)/.prep
	(cd $(@D); $(AUTORECONF_ENV) $(AUTORECONF) -fiv)
	(cd $(@D) ; $(ENV) $(CONFIGURE_ENV) $(CONFIG_SHELL) \
		./configure $(CONFIGURE_OPTIONS))
	$(COMPONENT_POST_CONFIGURE_ACTION)
	$(TOUCH) $@

$(XSERVER_BUILD_DIR)/.built: $(BUILD_TARGET) $(XSERVER_BUILD_DIR)/.configured
	$(PERL) -i -p -e 's{/usr/bin/env perl}{$(PERL)}' \
		$(XSERVER_BUILD_DIR)/unix/vncserver
	(cd $(@D) ; $(ENV) $(COMPONENT_BUILD_ENV) \
		$(GMAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS))
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
	-$(PARFAIT) $(@D)
endif
	$(TOUCH) $@

$(XSERVER_BUILD_DIR)/.installed: $(XSERVER_BUILD_DIR)/.built
	(cd $(@D) ; $(ENV) $(COMPONENT_INSTALL_ENV) $(GMAKE) \
		$(COMPONENT_INSTALL_ARGS) $(COMPONENT_INSTALL_TARGETS))
	$(RM) $(PROTO_DIR)/usr/lib/xorg/modules/extensions/libvnc.so
	$(TOUCH) $@


### Wasn't that fun?

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/font-utilities
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxdamage
REQUIRED_PACKAGES += x11/library/libxdmcp
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxfont2
REQUIRED_PACKAGES += x11/library/libxrandr
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/libxtst
REQUIRED_PACKAGES += x11/library/mesa
REQUIRED_PACKAGES += x11/library/toolkit/fltk
REQUIRED_PACKAGES += x11/library/xtrans
REQUIRED_PACKAGES += x11/keyboard/xkeyboard-config
REQUIRED_PACKAGES += x11/server/xserver-common
