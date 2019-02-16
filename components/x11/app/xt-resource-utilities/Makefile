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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		listres
COMPONENT_VERSION=	1.0.4
COMPONENT_ARCHIVE_HASH= \
	sha256:6a1229f478796e141d6658762f432ebbe1f6083b27550847d52239b3f7ec2b10
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	17161
TPNO=			49524

COMPONENT_NAME_1=       appres
COMPONENT_VERSION_1=    1.0.5
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:ffad893712c81943b919e3cbfe46fc65259cc0d9eb96d5e658670e3fbb265928
COMPONENT_ANITYA_ID_1=	15053
TPNO_1=			49523

COMPONENT_NAME_2=       editres
COMPONENT_VERSION_2=    1.0.7
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:089ad34628e55a779b97e369f55fb12caefc96d684b508d9022eb9e12b775c11
COMPONENT_ANITYA_ID_2=	17160
TPNO_2=			49521

COMPONENT_NAME_3=       viewres
COMPONENT_VERSION_3=    1.0.5
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:5ed818e84c39bcf26dadc885c9860432b85843caad3621e26d99edea660ae3d7
COMPONENT_ANITYA_ID_3=	17162
TPNO_3= 		49522

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3 

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

COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
