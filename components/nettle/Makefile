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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nettle
COMPONENT_VERSION=	3.5.1
COMPONENT_PROJECT_URL=	http://www.lysator.liu.se/~nisse/nettle/
COMPONENT_ARCHIVE_HASH=	\
    sha256:75cca1998761b02e16f2db56da52992aef622bf55a3b45ec538bc2eedadc9419
COMPONENT_BUGDB=	library/nettle
COMPONENT_ANITYA_ID=	2073

TPNO=	55302

ifeq ($(MACH),i386)

# We need to build an extra static version of these libraries for GRUB/Wanboot support.
WANBOOT_CONFIGURE = $(BUILD_DIR)/wanboot-amd64/.configured
WANBOOT_BUILD = $(BUILD_DIR)/wanboot-amd64/.built
WANBOOT_INSTALL = $(BUILD_DIR)/wanboot-amd64/.installed

CONFIGURE_32_and_64 += $(WANBOOT_CONFIGURE)
BUILD_32_and_64 += $(WANBOOT_BUILD)
INSTALL_32_and_64 += $(WANBOOT_INSTALL)

endif

include $(WS_MAKE_RULES)/gnu-component.mk

MCS = mcs
STRIP = strip

# Some static libraries are delivered, avoid manifest cleanup.
MANIFEST_CLEANUP_TRANSFORM=

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
CFLAGS.wanboot += -mno-red-zone
CFLAGS.wanboot += -fno-stack-protector
CFLAGS.wanboot += -mno-stack-arg-probe

CONFIGURE_OPTIONS  += --libexecdir=$(CONFIGURE_LIBDIR.$(BITS))
CONFIGURE_OPTIONS  += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  += --with-include-path=$(USRINCDIR)/gmp
# Disable __builtin_bswap64 to avoid linkage errors.
CONFIGURE_OPTIONS  += nettle_cv_c_builtin_bswap64=no

# Set the wanboot configure options as needed for wanboot

CONFIGURE_OPTIONS.wanboot  += --disable-assembler
CONFIGURE_OPTIONS.wanboot  += --enable-static
CONFIGURE_OPTIONS.wanboot  += --disable-shared
CONFIGURE_OPTIONS.wanboot  += --disable-pic
CONFIGURE_OPTIONS.wanboot  += --disable-gcov
CONFIGURE_OPTIONS.wanboot  += --disable-openssl
CONFIGURE_OPTIONS.wanboot  += --disable-documentation
CONFIGURE_OPTIONS.wanboot  += --disable-fat
CONFIGURE_OPTIONS.wanboot  += --disable-arm-neon
CONFIGURE_OPTIONS.wanboot  += --disable-x86-aesni
CONFIGURE_OPTIONS.wanboot  += --disable-mini-gmp
CONFIGURE_OPTIONS.wanboot  += --disable-ld-version-script

# The additional set of transforms to be applied to the
# test results to try to normalize them.
COMPONENT_TEST_TRANSFORMS += \
    '-e "1,/run-tests/d"' \
    '-e "/^e/d"' 

COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

$(BUILD_DIR)/wanboot-amd64/.configured: BITS=64
$(BUILD_DIR)/wanboot-amd64/.configured: COMPILER=gcc
$(BUILD_DIR)/wanboot-amd64/.configured: CFLAGS += $(CFLAGS.wanboot)
$(BUILD_DIR)/wanboot-amd64/.configured: CONFIGURE_OPTIONS += $(CONFIGURE_OPTIONS.wanboot)

$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)/usr/lib/grub/wanboot;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTO_DIR)/usr/lib/amd64/libnettle.a $(PROTO_DIR)/usr/lib/grub/wanboot/libnettle.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(STRIP) -x $(PROTO_DIR)/usr/lib/grub/wanboot/libnettle.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(MCS) -d $(PROTO_DIR)/usr/lib/grub/wanboot/libnettle.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(AR) ts $(PROTO_DIR)/usr/lib/grub/wanboot/libnettle.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTO_DIR)/usr/lib/amd64/libhogweed.a $(PROTO_DIR)/usr/lib/grub/wanboot/libhogweed.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(STRIP) -x $(PROTO_DIR)/usr/lib/grub/wanboot/libhogweed.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(MCS) -d $(PROTO_DIR)/usr/lib/grub/wanboot/libhogweed.a;
$(BUILD_DIR)/wanboot-amd64/.installed: \
	COMPONENT_POST_INSTALL_ACTION += \
	$(AR) ts $(PROTO_DIR)/usr/lib/grub/wanboot/libhogweed.a;

# Install nettle 3.4.0 and copy the shared libraries.
COMPONENT_POST_INSTALL_ACTION += ( \
	cd ../nettle34; \
	$(GMAKE) install; \
	$(MKDIR) $(PROTO_DIR)/usr/lib/$(MACH64)/; \
	gcp -av build/prototype/$(MACH)/usr/lib/libhogweed.so.4* $(PROTO_DIR)/usr/lib/; \
	gcp -av build/prototype/$(MACH)/usr/lib/libnettle.so.6* $(PROTO_DIR)/usr/lib/; \
	gcp -av build/prototype/$(MACH)/usr/lib/$(MACH64)/libhogweed.so.4* $(PROTO_DIR)/usr/lib/$(MACH64)/; \
	gcp -av build/prototype/$(MACH)/usr/lib/$(MACH64)/libnettle.so.6* $(PROTO_DIR)/usr/lib/$(MACH64)/; \
);

PRE_CLEAN_ACTION += cd ../nettle34 && $(GMAKE) clean;

REQUIRED_PACKAGES += library/gmp
