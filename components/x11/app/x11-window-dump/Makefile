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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xwd
COMPONENT_VERSION=	1.0.8
COMPONENT_ARCHIVE_HASH= \
    sha256:fbaa2b34163714fe7be22b60920ea4683f63b355babb1781aec2e452a033031b
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	14950
COMPONENT_BAID=		109906

COMPONENT_NAME_1=       xpr
COMPONENT_VERSION_1=    1.1.0
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:a0bbb11475366622632440b1c6f16d19964b4516483232fe5f46c169528557c5
COMPONENT_ANITYA_ID_1=	14959
COMPONENT_BAID_1=	130807

COMPONENT_NAME_2=       xwud
COMPONENT_VERSION_2=    1.0.6
COMPONENT_ARCHIVE_2=     $(COMPONENT_SRC_2).tar.xz
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:64048cd15eba3cd9a3d2e3280650391259ebf6b529f2101d1a20f441038c1afe
COMPONENT_ANITYA_ID_2=	14948
COMPONENT_BAID_2=	130805

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
REQUIRED_PACKAGES += x11/library/libxmuu
