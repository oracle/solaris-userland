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
# Copyright (c) 2015, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libffi
COMPONENT_VERSION=	3.4.4
COMPONENT_PROJECT_URL=	http://sourceware.org/libffi/
COMPONENT_ARCHIVE_HASH= \
    sha256:d66c56ad259a82cf2a9dfc408b32bf5da52371500b84745f7fb8b645712df676
COMPONENT_ARCHIVE_URL=	https://github.com/libffi/libffi/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libffi
COMPONENT_ANITYA_ID=	1611

COMPONENT_BAID=	136310

# For version update, we want to continue to provide the libffi.so
# (and its links) from version 3.2.1.
COMPONENT_VERSION_1 =	3.2.1
COMPONENT_BAID_1=	22315
COMPONENT_SRC_1 =	$(COMPONENT_NAME)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1 =	$(COMPONENT_SRC_1).tar.gz
COMPONENT_ARCHIVE_HASH_1 = \
	sha256:d06ebb8e1d9a22d19e38d63fdb83954253f39bedc5d46232a05645685722ca37
COMPONENT_ARCHIVE_URL_1 =	ftp://sources.redhat.com/pub/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE_1)
SOURCE_DIR_1 =		$(COMPONENT_DIR)/$(COMPONENT_SRC_1)

BUILD_OLD_DIR_32 = $(COMPONENT_DIR)/build/$(COMPONENT_VERSION_1)-$(MACH32)
BUILD_OLD_DIR_64 = $(COMPONENT_DIR)/build/$(COMPONENT_VERSION_1)-$(MACH64)

$(BUILD_OLD_DIR_32)/.configured: CONFIGURE_SCRIPT = $(SOURCE_DIR_1)/configure
$(BUILD_OLD_DIR_64)/.configured: CONFIGURE_SCRIPT = $(SOURCE_DIR_1)/configure
$(BUILD_OLD_DIR_32)/.configured:	BITS=32
$(BUILD_OLD_DIR_64)/.configured:	BITS=64

BUILD_32 += $(BUILD_OLD_DIR_32)/.built
BUILD_64 += $(BUILD_OLD_DIR_64)/.built

INSTALL_32 += $(BUILD_OLD_DIR_32)/.installed
INSTALL_64 += $(BUILD_OLD_DIR_64)/.installed

# install the old version first
$(BUILD_DIR_32)/.installed:	$(BUILD_OLD_DIR_32)/.installed
$(BUILD_DIR_64)/.installed:	$(BUILD_OLD_DIR_64)/.installed

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_DIR =	$(@D)/testsuite

# The 32 test suite is trying various ABI (fastcall, thiscall, stdcall).
# We don't support those on Solaris.
COMPONENT_TEST_TRANSFORMS += \
	'-e "s|^Test Run By.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^Native configuration is.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^make.*: Leaving directory.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^make.*: Entering directory.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "/^XXX_REMOVE_XXX$$/d" ' \
	'-e "/^Test run by .* on /d" ' \
	'-e "/^Making a new /d" ' \
	'-e "/^Using.*as tool init file/d" '

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

CFLAGS += -DFFI_MMAP_EXEC_WRIT=1

CONFIGURE_OPTIONS += --disable-raw-api
CONFIGURE_ENV += MAKE=$(GMAKE)

REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
