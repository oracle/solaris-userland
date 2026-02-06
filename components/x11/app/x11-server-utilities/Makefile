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

BUILD_BITS =            64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xhost
COMPONENT_VERSION=	1.0.10
COMPONENT_ARCHIVE_HASH= \
	sha256:a8afd70059479c712948b895e41c35a4a8bfcede3ba2d5a4b855c88bbb725be1
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15021
COMPONENT_BAID=		342689

COMPONENT_NAME_1=       xrefresh
COMPONENT_VERSION_1=    1.1.0
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:29ed592d5ece35a3029004d8c46f3002f92970870a96c11e38baf7f1122b8b5f
COMPONENT_ANITYA_ID_1=	14955
COMPONENT_BAID_1=	174096

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
COMPONENT_VERSION_4=    1.2.2
COMPONENT_SRC_4=        $(COMPONENT_NAME_4)-$(COMPONENT_VERSION_4)
COMPONENT_ARCHIVE_HASH_4=       \
    sha256:31f5fcab231b38f255b00b066cf7ea3b496df712c9eb2d0d50c670b63e5033f4
COMPONENT_ANITYA_ID_4=	14956
COMPONENT_BAID_4=	180000

COMPONENT_NAME_5=       xrandr
COMPONENT_VERSION_5=    1.5.3
COMPONENT_SRC_5=        $(COMPONENT_NAME_5)-$(COMPONENT_VERSION_5)
COMPONENT_ARCHIVE_HASH_5=       \
    sha256:f8dd7566adb74147fab9964680b6bbadee87cf406a7fcff51718a5e6949b841c
COMPONENT_ANITYA_ID_5=	14957
COMPONENT_BAID_5=	191043
COMPONENT_SIG_URL_5=

COMPONENT_NAME_6=       xmodmap
COMPONENT_VERSION_6=    1.0.11
COMPONENT_SRC_6=        $(COMPONENT_NAME_6)-$(COMPONENT_VERSION_6)
COMPONENT_ARCHIVE_HASH_6=       \
    sha256:9a2f8168f7b0bc382828847403902cb6bf175e17658b36189eac87edda877e81
COMPONENT_ANITYA_ID_6=	14960
COMPONENT_BAID_6=	130808

COMPONENT_NAME_7=       xprop
COMPONENT_VERSION_7=    1.2.8
COMPONENT_SRC_7=        $(COMPONENT_NAME_7)-$(COMPONENT_VERSION_7)
COMPONENT_ARCHIVE_HASH_7=       \
    sha256:d689e2adb7ef7b439f6469b51cda8a7daefc83243854c2a3b8f84d0f029d67ee
COMPONENT_ANITYA_ID_7=	14958
COMPONENT_BAID_7=	191042

COMPONENT_NAME_8=       xgamma
COMPONENT_VERSION_8=    1.0.8
COMPONENT_SRC_8=        $(COMPONENT_NAME_8)-$(COMPONENT_VERSION_8)
COMPONENT_ARCHIVE_HASH_8=       \
    sha256:98f9f69e53a11c354a6637ea5c3d7699ceb5c5b1f8ad6f0a14d9931e5a10d079
COMPONENT_ANITYA_ID_8=	15022
COMPONENT_BAID_8=	342690

COMPONENT_NAME_9=       xcmsdb
COMPONENT_VERSION_9=    1.0.7
COMPONENT_SRC_9=        $(COMPONENT_NAME_9)-$(COMPONENT_VERSION_9)
COMPONENT_ARCHIVE_HASH_9=       \
    sha256:5ec4068e488187b05ea92ee1362c96b78a90f19ccc7a1844c5921d70626bbc38
COMPONENT_ANITYA_ID_9=	15031
COMPONENT_BAID_9=	191049

COMPONENT_NAME_10=       xinput
COMPONENT_VERSION_10=    1.6.4
COMPONENT_SRC_10=        $(COMPONENT_NAME_10)-$(COMPONENT_VERSION_10)
COMPONENT_ARCHIVE_HASH_10=       \
    sha256:ad04d00d656884d133110eeddc34e9c69e626ebebbbab04dc95791c2907057c8
COMPONENT_ANITYA_ID_10=  15020
COMPONENT_BAID_10=	 180001

COMPONENT_NAME_11=       rgb
COMPONENT_VERSION_11=    1.1.1
COMPONENT_SRC_11=        $(COMPONENT_NAME_11)-$(COMPONENT_VERSION_11)
COMPONENT_ARCHIVE_HASH_11=       \
    sha256:c80ff280a02f56c30fadc2dfa210fc6979c4ab968afa315278cb97768b64ecab
COMPONENT_ANITYA_ID_11=	 17151
COMPONENT_BAID_11=	 369506

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
