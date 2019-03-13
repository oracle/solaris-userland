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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xorg-server
COMPONENT_VERSION=	1.20.3
COMPONENT_ARCHIVE_HASH= \
	sha256:1b3ce466c12cacbe2252b3ad5b0ed561972eef9d09e75900d65fb1e21f9201de
COMPONENT_BUGDB=        x11/xorg-server
COMPONENT_ANITYA_ID=	5250

TPNO=			49340

PKG_PROTO_DIRS += $(SOURCE_DIR)/config
PKG_PROTO_DIRS += $(COMPONENT_DIR)/sun-src/os/solaris/mdb/scripts
PKG_PROTO_DIRS += $(SOURCE_DIR)/hw/xfree86/os-support/bus

# Remove compiler specific visibility flag that breaks builds of drivers
# with other compilers
FIX_PC_FILES = xorg-server.pc.in
COMPONENT_FIX_PC_FLAGS += -e 's|\@symbol_visibility\@||'

include $(WS_MAKE_RULES)/x11-component.mk

CFLAGS.studio += $(studio_FEATURES_EXTENSIONS)

CONFIGURE_OPTIONS += --docdir="$(USRSHAREDOCDIR)"
CONFIGURE_OPTIONS += --enable-dmx
CONFIGURE_OPTIONS += --enable-builddocs
CONFIGURE_OPTIONS += --enable-kdrive
CONFIGURE_OPTIONS += --enable-xephyr
CONFIGURE_OPTIONS += --disable-xsdl
CONFIGURE_OPTIONS += --disable-systemd-logind
CONFIGURE_OPTIONS += --disable-glamor
CONFIGURE_OPTIONS += --enable-xdm-auth-1
CONFIGURE_OPTIONS += --enable-xdmcp
CONFIGURE_OPTIONS += --enable-xcsecurity
CONFIGURE_OPTIONS += --disable-secure-rpc
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-glx
CONFIGURE_OPTIONS += --enable-dri2
CONFIGURE_OPTIONS += --disable-xsdl
CONFIGURE_OPTIONS += --disable-xwin
CONFIGURE_OPTIONS += --disable-xnest
CONFIGURE_OPTIONS += --disable-install-setuid
CONFIGURE_OPTIONS += --without-dtrace
CONFIGURE_OPTIONS += --with-vendor-name="Oracle Corporation, based on X.Org Foundation sources"
CONFIGURE_OPTIONS += --with-vendor-web="https://support.oracle.com/"
CONFIGURE_OPTIONS += --with-builderstring="Solaris ABI: $(BITS)-bit"
CONFIGURE_OPTIONS += --with-os-name="`uname -srm`"
CONFIGURE_OPTIONS += --with-log-dir="/var/log"
CONFIGURE_OPTIONS += --with-xkb-output="/var/run/xkb"
CONFIGURE_OPTIONS += --with-serverconfig-path="/usr/lib/xorg"
CONFIGURE_OPTIONS += --with-module-dir="/usr/lib/xorg/modules"
CONFIGURE_OPTIONS += --with-dri-driver-path="/usr/lib/xorg/modules/dri/$(MACH64)"
CONFIGURE_OPTIONS += --with-default-font-path="catalogue:/etc/X11/fontpath.d"
CONFIGURE_OPTIONS += --with-xkb-bin-directory="$(USRBINDIR)"
CONFIGURE_OPTIONS += --with-default-xkb-model="pc105"

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

COMPONENT_POST_UNPACK_ACTION = \
        $(CP) -r sun-src/IA $(SOURCE_DIR); \
        $(CP) -r sun-src/os/* $(SOURCE_DIR)/os;

LIBDRM_BASE = $(WS_COMPONENTS)/x11/lib/libdrm/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(LIBDRM_BASE)$(USRLIB)/pkgconfig/
CPPFLAGS += -I$(LIBDRM_BASE)/usr/include/ -I$(LIBDRM_BASE)/usr/include/libdrm
LD_OPTIONS += -L $(LIBDRM_BASE)$(USRLIB)

XORGPROTO_BASE += $(WS_COMPONENTS)/x11/proto/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(XORGPROTO_BASE)/usr/share/pkgconfig/
CPPFLAGS += -I$(XORGPROTO_BASE)/usr/include/

LDFLAGS += -lm
CFLAGS += -I/usr/include/pixman-1
CFLAGS += -I/usr/include/X11/dri/
CPPFLAGS += $(DPMS_DEFINES) -DSUNSOFT -DTSOL 
CONFIGURE_ENV += XSERVERCFLAGS_CFLAGS="-DHAS_FCHOWN -DHAS_STICKY_DIR_BIT -D_REENTRANT -D_POSIX_PTHREAD_SEMANTICS -DXTHREADS -DXUSE_MTSAFE_API"
CONFIGURE_ENV += PTHREAD_LIBS="-lc"

LD_OPTIONS += -z lazyload

# Pass linker mapfile listing symbols that modules can count on resolving
# from the Xorg binary itself
LD_SHARED_OPTIONS +=  -M$(COMPONENT_DIR)/mapfile.$(MACH)

# Disable direct binding in shared objects, since it breaks libglx.so
COMPONENT_BUILD_ENV += LD_SHARED_UNSET="$(LD_B_DIRECT)"

# configure scripts add libraries like -lm to the global $(LIBS) when only
# some objects need them, so discard them in the rest, but only when building
# programs or .so's, not the Dtrace magic relocatable objects.
LD_EXEC_OPTIONS +=     -zdiscard-unused=dependencies -zdiscard-unused=files
LD_PIE_OPTIONS +=      -zdiscard-unused=dependencies -zdiscard-unused=files
LD_SHARED_OPTIONS +=   -zdiscard-unused=dependencies -zdiscard-unused=files
COMPONENT_BUILD_ENV += LD_SHARED_OPTIONS="$(LD_SHARED_OPTIONS)"

# Don't include build date & time in delivered binaries as it just causes
# unnecessary binary differences to be pulled into package updates, but
# leave it in debug builds for developer convenience.
ifeq ($(filter -g,$(CFLAGS)),)
COMPONENT_POST_CONFIGURE_ACTION += \
	printf '\#undef BUILD_DATE\\n\#undef BUILD_TIME\\n' > \
		$(@D)/hw/xfree86/common/xf86Build.h ;
endif

## mdb module rules
# Build & install mdb modules & scripts that aren't integrated to
# normal build process.
MDB_SOURCE_DIR = $(SOURCE_DIR)/os/solaris/mdb
MDB_BUILD_DIR  = $(BUILD_DIR_64)/os/solaris/mdb
MDB_REL_SOURCE_DIR = ../../../../$(MDB_SOURCE_DIR)
MDB_MODULE_DIR=/usr/lib/mdb/proc/$(MACH64)
MDB_SCRIPT_DIR=/usr/demo/Xserver/mdb
MDB_SCRIPTS=list_Xserver_clients \
	list_Xserver_devicegrab_client \
	list_Xserver_servergrab_client
MDB_MODULE_NAMES=Xephyr Xorg Xvfb Xvnc Xdmx

BUILT_MDB_MODULE=$(MDB_BUILD_DIR)/modules/Xserver.so

INSTALLED_MDB_LINKS=$(MDB_MODULE_NAMES:%=$(PROTO_DIR)$(MDB_MODULE_DIR)/%.so)
INSTALLED_MDB_MODULE=$(PROTO_DIR)$(MDB_MODULE_DIR)/Xserver.so
INSTALLED_MDB_README=$(PROTO_DIR)$(MDB_SCRIPT_DIR)/README
INSTALLED_MDB_SCRIPTS=$(MDB_SCRIPTS:%=$(PROTO_DIR)$(MDB_SCRIPT_DIR)/%)
INSTALLED_MDB_ALL=$(INSTALLED_MDB_MODULE) $(INSTALLED_MDB_LINKS) \
	$(INSTALLED_MDB_README) $(INSTALLED_MDB_SCRIPTS)

# Since configure options aren't used to build the mdb modules, pass
# those variables at build time
MDB_BUILD_ENV  = $(CONFIGURE_ENV) $(COMPONENT_BUILD_ENV)
MDB_BUILD_ENV += ARCHLIBSUBDIR="/$(MACH64)"
MDB_BUILD_ENV += top_builddir="$(BUILD_DIR_64)"
MDB_BUILD_ENV += top_srcdir="$(SOURCE_DIR)"

build: $(BUILT_MDB_MODULE)
build_mdb: $(BUILT_MDB_MODULE)

$(BUILT_MDB_MODULE): $(BUILD_DIR_64)/.configured
	$(RM) -r $(MDB_BUILD_DIR) ; $(MKDIR) $(MDB_BUILD_DIR)
	$(CLONEY) $(MDB_SOURCE_DIR) $(MDB_BUILD_DIR)
	cd $(@D) && $(ENV) $(MDB_BUILD_ENV) $(MAKE) all

install: $(INSTALLED_MDB_ALL)
install_mdb: $(INSTALLED_MDB_ALL)

$(INSTALLED_MDB_MODULE): $(BUILT_MDB_MODULE)
	$(MKDIR) $(PROTO_DIR)$(MDB_MODULE_DIR)
	$(INSTALL) -D -m 0555 $(BUILT_MDB_MODULE) $@

$(INSTALLED_MDB_LINKS): $(INSTALLED_MDB_MODULE)
	$(RM) $@
	$(SYMLINK) Xserver.so $@

$(INSTALLED_MDB_SCRIPTS): $(INSTALLED_MDB_MODULE)
	$(MKDIR) $(PROTO_DIR)$(MDB_SCRIPT_DIR)/
	$(INSTALL) -D -m 0555 $(MDB_SOURCE_DIR)/scripts/$(@F) \
		$(PROTO_DIR)$(MDB_SCRIPT_DIR)/

$(INSTALLED_MDB_README): $(INSTALLED_MDB_MODULE)
	$(MKDIR) $(PROTO_DIR)$(MDB_SCRIPT_DIR)/
	$(INSTALL) -D -m 0444 $(MDB_SOURCE_DIR)/README \
		$(PROTO_DIR)$(MDB_SCRIPT_DIR)/

# for tests
unexport SHELLOPTS
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

# Needed for agp headers on x86
REQUIRED_PACKAGES.i386 += driver/graphics/agpgart
REQUIRED_PACKAGES += $(REQUIRED_PACKAGES.$(MACH))

REQUIRED_PACKAGES += developer/assembler
REQUIRED_PACKAGES += developer/debug/mdb
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += file/gnu-coreutils
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += system/dtrace
REQUIRED_PACKAGES += system/hal
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/font-utilities
REQUIRED_PACKAGES += x11/library/libdmx
REQUIRED_PACKAGES += x11/library/libdrm
REQUIRED_PACKAGES += x11/library/libepoxy
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxdmcp
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxfont2
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxmuu
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/libxres
REQUIRED_PACKAGES += x11/library/libxshmfence
REQUIRED_PACKAGES += x11/library/mesa
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
REQUIRED_PACKAGES += x11/library/xcb-util
REQUIRED_PACKAGES += x11/library/xtrans
REQUIRED_PACKAGES += x11/keyboard/xkeyboard-config
