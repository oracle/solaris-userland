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
# Copyright (c) 2008, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		NO_ARCH
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk
COMPONENT_BUGDB=	x11/font

COMPONENT_NAME=		font-misc-cyrillic
COMPONENT_VERSION= 	1.0.4
COMPONENT_ARCHIVE_HASH=	\
	sha256:76021a7f53064001914a57fd08efae57f76b68f0a24dca8ab1b245474ee8e993
COMPONENT_ANITYA_ID=	17220
COMPONENT_BAID=		139261

COMPONENT_NAME_1=	font-cronyx-cyrillic
COMPONENT_VERSION_1= 	1.0.4
COMPONENT_ARCHIVE_HASH_1=	\
	sha256:dc0781ce0dcbffdbf6aae1a00173a13403f92b0de925bca5a9e117e4e2d6b789
COMPONENT_ANITYA_ID_1=	15052
COMPONENT_BAID_1=	139258

COMPONENT_NAME_2=	font-screen-cyrillic
COMPONENT_VERSION_2= 	1.0.5
COMPONENT_ARCHIVE_HASH_2=	\
	sha256:8f758bb8cd580c7e655487d1d0db69d319acae54d932b295d96d9d9b83fde5c0
COMPONENT_ANITYA_ID_2=	17221
COMPONENT_BAID_2=	139259

COMPONENT_NAME_3=	font-winitzki-cyrillic
COMPONENT_VERSION_3= 	1.0.4
COMPONENT_ARCHIVE_HASH_3=	\
	sha256:3b6d82122dc14776e3afcd877833a7834e1f900c53fc1c7bb2d67c781cfa97a8
COMPONENT_ANITYA_ID_3=	17222
COMPONENT_BAID_3=	139260


BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
endef

$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) = $(COMPONENT_SRC_$(n)).tar.xz) \
    $(eval COMPONENT_ARCHIVE_URL_$(n) = $$(COMPONENT_ARCHIVE_URL:$$(COMPONENT_ARCHIVE)=$(COMPONENT_ARCHIVE_$(n)))) \
    $(eval BUILD_DIR_$(n) += $(BUILD_DIR_NO_ARCH)_$(n)) \
    $(eval CONFIGURE_NO_ARCH += $(BUILD_DIR_$(n))/.configured) \
    $(eval BUILD_NO_ARCH_$(n) += $(BUILD_DIR_$(n))/.built) \
    $(eval BUILD_TARGET += $(BUILD_NO_ARCH_$(n))) \
    $(eval INSTALL_NO_ARCH_$(n) += $(BUILD_DIR_$(n))/.installed) \
    $(eval INSTALL_TARGET += $(INSTALL_NO_ARCH_$(n))) \
    $(eval $(call extra-target-rules,$(n))) \
)

CYRILLIC_FONT_DIR = $(USRSHAREFONTSDIR)/X11/cyrillic

include $(WS_MAKE_RULES)/x11-component.mk
include $(WS_MAKE_RULES)/font.mk

# Install to separate directory for easier packaging
CONFIGURE_OPTIONS += --with-fontdir=$(CYRILLIC_FONT_DIR)
