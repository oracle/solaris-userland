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

BUILD_BITS =            32_and_64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xcb-util
COMPONENT_VERSION=	0.4.1
COMPONENT_CATEGORY=	xcb
COMPONENT_PROJECT_URL=  https://xcb.freedesktop.org/XcbUtil/
COMPONENT_ARCHIVE_HASH= \
	sha256:5abe3bbbd8e54f0fa3ec945291b7e8fa8cfd3cccc43718f8758430f94126e512
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	5165
COMPONENT_BAID=		140580

COMPONENT_NAME_1=       xcb-util-cursor
COMPONENT_VERSION_1=    0.1.5
COMPONENT_ARCHIVE_URL_1=\
    https://www.x.org/releases/individual/lib/$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1=\
    https://www.x.org/releases/individual/lib/$(COMPONENT_ARCHIVE_1).sig
COMPONENT_ARCHIVE_HASH_1= \
    sha256:0caf99b0d60970f81ce41c7ba694e5eaaf833227bb2cbcdb2f6dc9666a663c57
COMPONENT_ANITYA_ID_1=  5166
COMPONENT_BAID_1=	175863

COMPONENT_NAME_2=       xcb-util-image
COMPONENT_VERSION_2=    0.4.1
COMPONENT_ARCHIVE_HASH_2= \
    sha256:ccad8ee5dadb1271fd4727ad14d9bd77a64e505608766c4e98267d9aede40d3d
COMPONENT_ANITYA_ID_2=  5167
COMPONENT_BAID_2=	132829

COMPONENT_NAME_3=       xcb-util-errors
COMPONENT_VERSION_3=    1.0.1
COMPONENT_ARCHIVE_HASH_3= \
    sha256:5628c87b984259ad927bacd8a42958319c36bdf4b065887803c9d820fb80f357
COMPONENT_ANITYA_ID_3=  371158
COMPONENT_BAID_3=	132830

COMPONENT_NAME_4=       xcb-util-keysyms
COMPONENT_VERSION_4=    0.4.1
COMPONENT_ARCHIVE_HASH_4= \
    sha256:7c260a5294412aed429df1da2f8afd3bd07b7cba3fec772fba15a613a6d5c638
COMPONENT_ANITYA_ID_4=  5168
COMPONENT_BAID_4=       132832

COMPONENT_NAME_5=       xcb-util-renderutil
COMPONENT_VERSION_5=    0.3.10
COMPONENT_ARCHIVE_HASH_5= \
    sha256:3e15d4f0e22d8ddbfbb9f5d77db43eacd7a304029bf25a6166cc63caa96d04ba
COMPONENT_ANITYA_ID_5=  5169
COMPONENT_BAID_5=       132833

COMPONENT_NAME_6=       xcb-util-wm
COMPONENT_VERSION_6=    0.4.2
COMPONENT_ARCHIVE_HASH_6= \
    sha256:62c34e21d06264687faea7edbf63632c9f04d55e72114aa4a57bb95e4f888a0b
COMPONENT_ANITYA_ID_6=  5170
COMPONENT_BAID_6=      	132836        

TEST_TARGET = $(NO_TESTS)

CONFIGURE_OPTIONS += --enable-shared=yes --enable-static=no

FIX_PC_FILES=	xcb-atom.pc.in xcb-aux.pc.in xcb-event.pc.in xcb-util.pc.in
FIX_PC_FILES_1=	cursor/xcb-cursor.pc.in
FIX_PC_FILES_2=	image/xcb-image.pc.in
FIX_PC_FILES_3=	xcb-errors.pc.in
FIX_PC_FILES_4=	keysyms/xcb-keysyms.pc.in
FIX_PC_FILES_5=	renderutil/xcb-renderutil.pc.in
FIX_PC_FILES_6=	ewmh/xcb-ewmh.pc.in icccm/xcb-icccm.pc.in

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3 4 5 6

define extra-target-rules
$(SOURCE_PC_FILES_$(1)): $(SOURCE_DIR_$(1))/.unpacked
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
$(BUILD_DIR)/$(MACH64)_$(1)/%: BITS=64
endef

$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) ?= $(COMPONENT_SRC_$(n)).tar.xz) \
    $(eval COMPONENT_ARCHIVE_URL_$(n) ?= $$(COMPONENT_ARCHIVE_URL:$$(COMPONENT_ARCHIVE)=$(COMPONENT_ARCHIVE_$(n)))) \
    $(eval SOURCE_PC_FILES_$(n) = $(FIX_PC_FILES_$(n):%=$(SOURCE_DIR_$(n))/%)) \
    $(eval SOURCE_PC_FILES += SOURCE_PC_FILES_$(n)) \
    $(eval CONFIGURE_$(MK_BITS) += $(BUILD_$(MK_BITS):%/.built=%_$(n)/.configured)) \
    $(eval BUILD_$(MK_BITS)_$(n) += $(BUILD_$(MK_BITS):%/.built=%_$(n)/.built)) \
    $(eval BUILD_TARGET += $(BUILD_$(MK_BITS)_$(n))) \
    $(eval INSTALL_$(MK_BITS)_$(n) += $(INSTALL_$(MK_BITS):%/.installed=%_$(n)/.installed)) \
    $(eval INSTALL_TARGET += $(INSTALL_$(MK_BITS)_$(n))) \
    $(eval $(call extra-target-rules,$(n))) \
)

PKG_VARS += SOURCE_DIR

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/gperf
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libxcb
