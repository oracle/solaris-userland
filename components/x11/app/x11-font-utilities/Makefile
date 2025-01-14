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
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mkfontscale
COMPONENT_VERSION=	1.2.3
COMPONENT_ARCHIVE_HASH= \
	sha256:2921cdc344f1acee04bcd6ea1e29565c1308263006e134a9ee38cf9c9d6fe75e
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15043
COMPONENT_BAID=		174128

COMPONENT_NAME_2=       bdftopcf
COMPONENT_VERSION_2=    1.1.2
COMPONENT_CATEGORY_2=	util
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:bc60be5904330faaa3ddd2aed7874bee2f29e4387c245d6787552f067eb0523a
COMPONENT_ANITYA_ID_2=	15054
COMPONENT_BAID_2=	191038

COMPONENT_NAME_3=       font-util
COMPONENT_VERSION_3=    1.4.1
COMPONENT_CATEGORY_3=	font
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:5c9f64123c194b150fee89049991687386e6ff36ef2af7b80ba53efaf368cc95
COMPONENT_ARCHIVE_URL_3= \
    $(COMPONENT_PROJECT_URL)/releases/individual/font/$(COMPONENT_ARCHIVE_3)
COMPONENT_ANITYA_ID_3=	15055
COMPONENT_BAID_3=	179997

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 2 3

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
endef

$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) ?= $(COMPONENT_SRC_$(n)).tar.xz) \
    $(eval COMPONENT_ARCHIVE_URL_$(n) ?= $$(COMPONENT_ARCHIVE_URL:$$(COMPONENT_CATEGORY)/$$(COMPONENT_ARCHIVE)=$(COMPONENT_CATEGORY_$(n))/$(COMPONENT_ARCHIVE_$(n)))) \
    $(eval BUILD_DIR_$(n) += $(BUILD_DIR_$(MK_BITS))_$(n)) \
    $(eval CONFIGURE_$(MK_BITS) += $(BUILD_DIR_$(n))/.configured) \
    $(eval BUILD_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.built) \
    $(eval BUILD_TARGET += $(BUILD_$(MK_BITS)_$(n))) \
    $(eval INSTALL_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.installed) \
    $(eval INSTALL_TARGET += $(INSTALL_$(MK_BITS)_$(n))) \
    $(eval $(call extra-target-rules,$(n))) \
)

include $(WS_MAKE_RULES)/x11-component.mk

# Extra configure flag just for mkfontscale
$(BUILD_DIR_$(MK_BITS))/.configured:	CONFIGURE_OPTIONS += --with-bzip2

COMPONENT_INSTALL_ARGS += pkgconfigdir="$(DESTDIR)/usr/share/pkgconfig"

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libfontenc
