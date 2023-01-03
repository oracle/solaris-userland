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
# Copyright (c) 2018, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_BUGDB=        x11/xclients

COMPONENT_NAME=         fslsfonts
COMPONENT_VERSION=      1.0.6
COMPONENT_ARCHIVE ?=    $(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=         \
    sha256:01cb0c5a7dbddadef846ca3b52c2ab9c60f2c32c3f16584cd97a6c7f293341ee
COMPONENT_ANITYA_ID=    17157
COMPONENT_BAID=         130798

COMPONENT_NAME_2=       showfont
COMPONENT_VERSION_2=    1.0.6
COMPONENT_ARCHIVE_2 ?= $(COMPONENT_SRC_2).tar.xz
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:2b9b9f06e65e095ed76ce560b701b9fc47fa63310ee706b54c8787af061d0e56
COMPONENT_ANITYA_ID_2=	12316
COMPONENT_BAID_2=	130800

COMPONENT_NAME_3=       xfsinfo
COMPONENT_VERSION_3=    1.0.7
COMPONENT_ARCHIVE_3=	$(COMPONENT_SRC_3).tar.xz
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:92f3ca451cba7717eed15f80de3c123aa56c82a1ee7d6e9116ba513021b98874
COMPONENT_ANITYA_ID_3=	17158
COMPONENT_BAID_3=	132588

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 2 3

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

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libfs
REQUIRED_PACKAGES += x11/library/libx11
