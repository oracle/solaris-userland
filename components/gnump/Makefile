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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

PATH=$(dir $(CC)):$(USRBINDIR):$(GNUBIN)

COMPONENT_NAME=		gmp
COMPONENT_VERSION=      6.3.0
COMPONENT_PROJECT_URL=	https://gmplib.org/
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:a3c2b80201b89e68616f4ad30bc66aee4927c3ce50e33929ca819d5c43538898
COMPONENT_ARCHIVE_URL=  https://gmplib.org/download/gmp/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/gnump
COMPONENT_ANITYA_ID=	1186
COMPONENT_BAID=		156634

COMPONENT_PREP_ACTION = (cd $(@D) ; $(AUTORECONF) -fiv)

# We need to build an extra static version of this library for
# GRUB/Wanboot support.

WANBOOT_CONFIGURE.amd64 = $(BUILD_DIR)/wanboot-amd64/.configured
WANBOOT_BUILD.amd64 = $(BUILD_DIR)/wanboot-amd64/.built
WANBOOT_INSTALL.amd64 = $(BUILD_DIR)/wanboot-amd64/.installed

CONFIGURE_32_and_64 += $(WANBOOT_CONFIGURE.$(MACH64))
BUILD_32_and_64 += $(WANBOOT_BUILD.$(MACH64))
INSTALL_32_and_64 += $(WANBOOT_INSTALL.$(MACH64))

$(BUILD_DIR_64)/.installed:	$(WANBOOT_INSTALL.$(MACH64))

include $(WS_MAKE_RULES)/gnu-component.mk


MCS = mcs
STRIP = strip

# Set the wanboot CFLAGS as needed for the wanboot compilation
CFLAGS.wanboot += -D_BOOT
CFLAGS.wanboot += -g
CFLAGS.wanboot += -falign-jumps=1
CFLAGS.wanboot += -falign-loops=1
CFLAGS.wanboot += -falign-functions
CFLAGS.wanboot += -mno-mmx
CFLAGS.wanboot += -mno-3dnow
CFLAGS.wanboot += -fno-dwarf2-cfi-asm
CFLAGS.wanboot += -fno-asynchronous-unwind-tables
CFLAGS.wanboot += -fno-common
CFLAGS.wanboot += -mcmodel=large
CFLAGS.wanboot += -fno-stack-protector
CFLAGS.wanboot += -mno-stack-arg-probe
CFLAGS.wanboot += -fno-tree-vectorize

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

# We want to run tests in a stripped environment so nothing interferes
COMPONENT_TEST_ENV += -i

# Reduce the number of test iterations otherwise tests run almost forever...
COMPONENT_TEST_ENV += GMP_CHECK_REPFACTOR=0.25


COMPONENT_TEST_TRANSFORMS += \
	'-e "s/^make\[[0-9]\{1,\}\]/make/g"' \
	'-n ' \
	'-e "/make:.*directory/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/ERROR/p" ' \
	'-e "/=====/p" ' \
	'-e "/TOTAL/p" '

PARCH.32 =	$(MACH:i386=i386-pc)
PARCH.64 =	$(MACH:i386=x86_64-pc)
GNU_TRIPLE.32 =	$(PARCH.32:sparc=sparc-sun)-solaris$(SOLARIS_VERSION)
GNU_TRIPLE.64 =	$(PARCH.64:sparc=sparcv9-sun)-solaris$(SOLARIS_VERSION)

CONFIGURE_OPTIONS += --host $(GNU_TRIPLE.$(BITS))

CONFIGURE_OPTIONS.shared += --enable-shared
CONFIGURE_OPTIONS.shared += --disable-static
CONFIGURE_OPTIONS += --disable-libtool-lock
CONFIGURE_OPTIONS += --disable-alloca
CONFIGURE_OPTIONS.shared += --enable-cxx
CONFIGURE_OPTIONS += --enable-fft
CONFIGURE_OPTIONS += --disable-fat
CONFIGURE_OPTIONS.shared += --with-pic

# At some places (for example compiling gen-fac.c) CC_FOR_BUILD is used as a
# compiler. That does not respect our CFLAGS and CPPFLAGS so the PIC build
# breaks. This is a way to overcome it.
COMPONENT_BUILD_ARGS += CC_FOR_BUILD='$(CC) $(CONFIGURE_CPPFLAGS) $(CC_PIC_ENABLE)'

# Set the wanboot configure options as needed for wanboot

CONFIGURE_OPTIONS.wanboot += --disable-assert
CONFIGURE_OPTIONS.wanboot += --disable-cxx
CONFIGURE_OPTIONS.wanboot += --disable-nails
CONFIGURE_OPTIONS.wanboot += --disable-profiling
CONFIGURE_OPTIONS.wanboot += --disable-minithres
CONFIGURE_OPTIONS.wanboot += --disable-shared
CONFIGURE_OPTIONS.wanboot += --enable-static
CONFIGURE_OPTIONS.wanboot += --disable-libtool-lock
CONFIGURE_OPTIONS.wanboot += --without-readline
CONFIGURE_OPTIONS.wanboot += --without-pic

COMPONENT_POST_INSTALL_ACTION.shared = \
	(cd $(PROTOUSRINCDIR) ; $(MV) -f gmp.h gmp-$(BITS).h)

COMPONENT_POST_INSTALL_ACTION.wanboot = \
      ( $(MKDIR) $(PROTOUSRLIBDIR)/grub/wanboot; \
	$(MV) $(PROTOUSRLIBDIR64)/libgmp.a $(PROTO_DIR)/usr/lib/grub/wanboot/libgmp.a; \
	$(STRIP) -x $(PROTOUSRLIBDIR)/grub/wanboot/libgmp.a; \
	$(MCS) -d $(PROTOUSRLIBDIR)/grub/wanboot/libgmp.a; \
	$(AR) ts $(PROTOUSRLIBDIR)/grub/wanboot/libgmp.a )

# common targets
configure:	$(CONFIGURE_32_and_64)

$(BUILD_DIR)/$(MACH32)/.configured: CONFIGURE_OPTIONS += $(CONFIGURE_OPTIONS.shared)
$(BUILD_DIR)/$(MACH64)/.configured: CONFIGURE_OPTIONS += $(CONFIGURE_OPTIONS.shared)
$(BUILD_DIR)/wanboot-amd64/.configured: BITS=64
$(BUILD_DIR)/wanboot-amd64/.configured: COMPILER=gcc
$(BUILD_DIR)/wanboot-amd64/.configured: CPPFLAGS += $(CPPFLAGS.wanboot)
$(BUILD_DIR)/wanboot-amd64/.configured: CFLAGS += $(CFLAGS.wanboot)
$(BUILD_DIR)/wanboot-amd64/.configured: CXXFLAGS += $(CXXFLAGS.wanboot)
$(BUILD_DIR)/wanboot-amd64/.configured: CONFIGURE_OPTIONS += $(CONFIGURE_OPTIONS.wanboot)
# Wanboot can not be built in PIC mode
$(BUILD_DIR)/wanboot-amd64/.configured: CC_PIC_MODE = $(CC_PIC_DISABLE)
$(BUILD_DIR)/wanboot-amd64/.configured: LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)


build: $(BUILD_32_and_64)

install: $(INSTALL_32_and_64)

$(BUILD_DIR)/$(MACH32)/.installed: COMPONENT_POST_INSTALL_ACTION = $(COMPONENT_POST_INSTALL_ACTION.shared)
$(BUILD_DIR)/$(MACH64)/.installed: COMPONENT_POST_INSTALL_ACTION = $(COMPONENT_POST_INSTALL_ACTION.shared)
$(BUILD_DIR)/wanboot-amd64/.installed: COMPONENT_POST_INSTALL_ACTION = $(COMPONENT_POST_INSTALL_ACTION.wanboot)

# Some static libraries are delivered, avoid manifest cleanup.
MANIFEST_CLEANUP_TRANSFORM=

REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
