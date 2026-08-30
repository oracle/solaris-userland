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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =		64
BUILD_STYLE =		meson
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xwd
COMPONENT_VERSION=	1.0.10
COMPONENT_ARCHIVE_HASH= \
    sha256:4909eacc26c4cd5a9afcd1468aec26e7c646544639031bdad4f71173aa82f3c3
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	14950
COMPONENT_BAID=		427404

COMPONENT_NAME_1=       xpr
COMPONENT_VERSION_1=    1.2.1
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:0a5b947cd5e3990c9fcd04fdf92603241de4a55a29b89d4e8a0e473320b778ba
COMPONENT_ANITYA_ID_1=	14959
COMPONENT_BAID_1=	427665

COMPONENT_NAME_2=       xwud
COMPONENT_VERSION_2=    1.0.8
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:2e282648c34018fd870052b8d814ea4d35ad9fdb9bcfc8bdc5a06822c0f86e99
COMPONENT_ANITYA_ID_2=	14948
COMPONENT_BAID_2=	427405

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
endef

$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) ?= $(COMPONENT_SRC_$(n)).tar.xz) \
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

CBE_PACKAGES += x11/header/x11-protocols

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxkbfile
REQUIRED_PACKAGES += x11/library/libxmuu
