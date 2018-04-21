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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            32_and_64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xcb-util
COMPONENT_VERSION=	0.4.0
COMPONENT_CATEGORY=	xcb
COMPONENT_PROJECT_URL=  https://xcb.freedesktop.org/XcbUtil/
COMPONENT_ARCHIVE_HASH= \
	sha256:46e49469cb3b594af1d33176cd7565def2be3fa8be4371d62271fabb5eae50e9
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	5165
TPNO=			22888

COMPONENT_NAME_1=       xcb-util-cursor
COMPONENT_VERSION_1=    0.1.3
COMPONENT_ARCHIVE_HASH_1= \
    sha256:05a10a0706a1a789a078be297b5fb663f66a71fb7f7f1b99658264c35926394f
COMPONENT_ANITYA_ID_1=  5166
TPNO_1=			34676

COMPONENT_NAME_2=       xcb-util-image
COMPONENT_VERSION_2=    0.4.0
COMPONENT_ARCHIVE_HASH_2= \
    sha256:2db96a37d78831d643538dd1b595d7d712e04bdccf8896a5e18ce0f398ea2ffc
COMPONENT_ANITYA_ID_2=  5167
TPNO_2=			22893

COMPONENT_NAME_3=       xcb-util-errors
COMPONENT_VERSION_3=    1.0
COMPONENT_ARCHIVE_HASH_3= \
    sha256:682681769e818ba085870d1ccd65f1f282ca16ca7d6f0f73ee70bc3642aa1995
COMPONENT_ANITYA_ID_3=  17167
TPNO_3=			22962

COMPONENT_NAME_4=       xcb-util-keysyms
COMPONENT_VERSION_4=    0.4.0
COMPONENT_ARCHIVE_HASH_4= \
    sha256:0ef8490ff1dede52b7de533158547f8b454b241aa3e4dcca369507f66f216dd9
COMPONENT_ANITYA_ID_4=  5168
TPNO_4=                 22892

COMPONENT_NAME_5=       xcb-util-renderutil
COMPONENT_VERSION_5=    0.3.9
COMPONENT_ARCHIVE_HASH_5= \
    sha256:c6e97e48fb1286d6394dddb1c1732f00227c70bd1bedb7d1acabefdd340bea5b
COMPONENT_ANITYA_ID_5=  5169
TPNO_5=                 22890

COMPONENT_NAME_6=       xcb-util-wm
COMPONENT_VERSION_6=    0.4.1
COMPONENT_ARCHIVE_HASH_6= \
    sha256:28bf8179640eaa89276d2b0f1ce4285103d136be6c98262b6151aaee1d3c2a3f
COMPONENT_ANITYA_ID_6=  5170
TPNO_6=                 22889

TEST_TARGET = $(NO_TESTS)

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
    $(eval COMPONENT_ARCHIVE_$(n) ?= $(COMPONENT_SRC_$(n)).tar.bz2) \
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
