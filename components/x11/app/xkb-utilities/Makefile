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
# Copyright (c) 2018, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		setxkbmap
COMPONENT_VERSION=	1.3.2
COMPONENT_ARCHIVE_HASH= \
	sha256:8ff27486442725e50b02d7049152f51d125ecad71b7ce503cfa09d5d8ceeb9f5
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	12314
TPNO=			61937

COMPONENT_NAME_1=       xkbutils
COMPONENT_VERSION_1=    1.0.4
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:d2a18ab90275e8bca028773c44264d2266dab70853db4321bdbc18da75148130
COMPONENT_ANITYA_ID_1=	15016
TPNO_1=			45811

COMPONENT_NAME_2=       xkbprint
COMPONENT_VERSION_2=    1.0.4
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:0b3faab8fefad03dfb7e866f634cf859822801de6b5fc6cf5e0a62857ed93e12
COMPONENT_ANITYA_ID_2=	17159
TPNO_2=			45812

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2

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
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxkbfile
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
