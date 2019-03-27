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

COMPONENT_NAME=		fstobdf
COMPONENT_VERSION=	1.0.6
COMPONENT_ARCHIVE_HASH= \
	sha256:66cf550326c993e7043f260a8ec4a533a3bf9d8f0e7397a6fe9cca803732e92e
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	17156
TPNO=			45804

COMPONENT_NAME_1=       fslsfonts
COMPONENT_VERSION_1=    1.0.5
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:f1ed55093356b78daec2678d22f52d42ec11fe88575562d734396962e626d7f6
COMPONENT_ANITYA_ID_1=	17157
TPNO_1=			45805

COMPONENT_NAME_2=       showfont
COMPONENT_VERSION_2=    1.0.5
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:e9735c1c530b8a52edfab7415cc0fd7f8d2889095114f4cb689a27476461ac89
COMPONENT_ANITYA_ID_2=	12316
TPNO_2=			45806

COMPONENT_NAME_3=       xfsinfo
COMPONENT_VERSION_3=    1.0.6
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:8a3e8b9b9ae6ed571989d04e1846d39b9043e28f7623b500ebe1d47762c9b1d6
COMPONENT_ANITYA_ID_3=	17158
TPNO_3=			50532

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
endef

$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) ?= $(COMPONENT_SRC_$(n)).tar.bz2) \
    $(eval COMPONENT_ARCHIVE_URL_$(n) ?= $$(COMPONENT_ARCHIVE_URL:$$(COMPONENT_ARCHIVE)=$(COMPONENT_ARCHIVE_$(n)))) \
    $(eval BUILD_DIR_$(n) += $(BUILD_DIR_$(MK_BITS))_$(n)) \
    $(eval CONFIGURE_$(MK_BITS) += $(BUILD_DIR_$(n))/.configured) \
    $(eval BUILD_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.built) \
    $(eval BUILD_TARGET += $(BUILD_$(MK_BITS)_$(n))) \
    $(eval INSTALL_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.installed) \
    $(eval INSTALL_TARGET += $(INSTALL_$(MK_BITS)_$(n))) \
    $(eval $(call extra-target-rules,$(n))) \
)

include $(WS_MAKE_RULES)/x11-component.mk

LIBFS_BASE = $(WS_COMPONENTS)/x11/lib/libFS/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(LIBFS_BASE)/usr/lib/$(MACH64)/pkgconfig
CFLAGS += -I$(LIBFS_BASE)/usr/include
LDFLAGS += -L$(LIBFS_BASE)/usr/lib/$(MACH64)

DEPENDED += $(WS_TOP)/components/x11/lib/libFS/build/manifest-$(MACH)-libFS.depend
REQUIRED_PACKAGES += $(shell $(GSED) -n 's/REQUIRED_PACKAGES +=//p' ../../lib/libFS/Makefile)

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libfs
REQUIRED_PACKAGES += x11/library/libx11
