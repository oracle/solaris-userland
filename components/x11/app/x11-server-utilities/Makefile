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

COMPONENT_NAME=		xhost
COMPONENT_VERSION=	1.0.9
COMPONENT_ARCHIVE_HASH= \
	sha256:ea86b531462035b19a2e5e01ef3d9a35cca7d984086645e2fc844d8f0e346645
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15021
COMPONENT_BAID=		139147

COMPONENT_NAME_1=       xrefresh
COMPONENT_VERSION_1=    1.0.7
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:a9f1d635f2f42283d0174e94d09ab69190c227faa5ab542bfe15ed9607771b1e
COMPONENT_ANITYA_ID_1=	14955
COMPONENT_BAID_1=	131835

COMPONENT_NAME_2=       xset
COMPONENT_VERSION_2=    1.2.5
COMPONENT_SRC_2=        $(COMPONENT_NAME_2)-$(COMPONENT_VERSION_2)
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:9f692d55635b3862cd63633b1222a87680ec283c7a8e8ed6dd698a3147f75e2f
COMPONENT_ANITYA_ID_2=	14954
COMPONENT_BAID_2=	139148

COMPONENT_NAME_3=       xsetroot
COMPONENT_VERSION_3=    1.1.3
COMPONENT_SRC_3=        $(COMPONENT_NAME_3)-$(COMPONENT_VERSION_3)
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:6081b45a9eb4426e045d259d1e144b32417fb635e5b96aa90647365ac96638d1
COMPONENT_ANITYA_ID_3=	14953
COMPONENT_BAID_3=	132587

COMPONENT_NAME_4=       xrdb
COMPONENT_VERSION_4=    1.2.1
COMPONENT_SRC_4=        $(COMPONENT_NAME_4)-$(COMPONENT_VERSION_4)
COMPONENT_ARCHIVE_4=    $(COMPONENT_SRC_4).tar.bz2
COMPONENT_ARCHIVE_HASH_4=       \
    sha256:4f5d031c214ffb88a42ae7528492abde1178f5146351ceb3c05f3b8d5abee8b4
COMPONENT_ANITYA_ID_4=	14956
COMPONENT_BAID_4=	109907

COMPONENT_NAME_5=       xrandr
COMPONENT_VERSION_5=    1.5.2
COMPONENT_SRC_5=        $(COMPONENT_NAME_5)-$(COMPONENT_VERSION_5)
COMPONENT_ARCHIVE_HASH_5=       \
    sha256:c8bee4790d9058bacc4b6246456c58021db58a87ddda1a9d0139bf5f18f1f240
COMPONENT_ANITYA_ID_5=	14957
COMPONENT_BAID_5=	139183

COMPONENT_NAME_6=       xmodmap
COMPONENT_VERSION_6=    1.0.11
COMPONENT_SRC_6=        $(COMPONENT_NAME_6)-$(COMPONENT_VERSION_6)
COMPONENT_ARCHIVE_HASH_6=       \
    sha256:9a2f8168f7b0bc382828847403902cb6bf175e17658b36189eac87edda877e81
COMPONENT_ANITYA_ID_6=	14960
COMPONENT_BAID_6=	130808

COMPONENT_NAME_7=       xprop
COMPONENT_VERSION_7=    1.2.6
COMPONENT_SRC_7=        $(COMPONENT_NAME_7)-$(COMPONENT_VERSION_7)
COMPONENT_ARCHIVE_HASH_7=       \
    sha256:580b8525b12ecc0144aa16c88b0aafa76d2e799b44c8c6c50f9ce92788b5586e
COMPONENT_ANITYA_ID_7=	14958
COMPONENT_BAID_7=	139182

COMPONENT_NAME_8=       xgamma
COMPONENT_VERSION_8=    1.0.7
COMPONENT_SRC_8=        $(COMPONENT_NAME_8)-$(COMPONENT_VERSION_8)
COMPONENT_ARCHIVE_HASH_8=       \
    sha256:1c79dae85a8953a15f4fe5c2895a033307b43b8613456c87ec47b374b113bc8f
COMPONENT_ANITYA_ID_8=	15022
COMPONENT_BAID_8=	139181

COMPONENT_NAME_9=       xcmsdb
COMPONENT_VERSION_9=    1.0.6
COMPONENT_SRC_9=        $(COMPONENT_NAME_9)-$(COMPONENT_VERSION_9)
COMPONENT_ARCHIVE_HASH_9=       \
    sha256:3c77eec4537d5942bb0966973b787bfdaf7121f3125ffa81bb1c9708d4cf4f55
COMPONENT_ANITYA_ID_9=	15031
COMPONENT_BAID_9=	130813

COMPONENT_NAME_10=       xinput
COMPONENT_VERSION_10=    1.6.3
COMPONENT_SRC_10=        $(COMPONENT_NAME_10)-$(COMPONENT_VERSION_10)
COMPONENT_ARCHIVE_10=    $(COMPONENT_SRC_10).tar.bz2
COMPONENT_ARCHIVE_HASH_10=       \
    sha256:35a281dd3b9b22ea85e39869bb7670ba78955d5fec17c6ef7165d61e5aeb66ed
COMPONENT_ANITYA_ID_10=  15020
COMPONENT_BAID_10=	 67909

COMPONENT_NAME_11=       rgb
COMPONENT_VERSION_11=    1.1.0
COMPONENT_SRC_11=        $(COMPONENT_NAME_11)-$(COMPONENT_VERSION_11)
COMPONENT_ARCHIVE_HASH_11=       \
    sha256:fc03d7f56e5b2a617668167f8927948cce54f93097e7ccd9f056077f479ed37b
COMPONENT_ANITYA_ID_11=	 17151
COMPONENT_BAID_11=	 132586

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3 4 5 6 7 8 9 10 11

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

CONFIGURE_OPTIONS += --disable-secure-rpc	# for xhost
$(BUILD_DIR_2)/.configured: CONFIGURE_OPTIONS += --without-xf86misc # for xset

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/data/xbitmaps
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxmuu
REQUIRED_PACKAGES += x11/library/libxrandr
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/libxxf86vm
