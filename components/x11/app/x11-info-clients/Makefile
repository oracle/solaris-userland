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

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xdpyinfo
COMPONENT_VERSION=	1.3.2
COMPONENT_ARCHIVE_HASH= \
	sha256:30238ed915619e06ceb41721e5f747d67320555cc38d459e954839c189ccaf51
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15028

COMPONENT_NAME_1=       xdriinfo
COMPONENT_VERSION_1=    1.0.5
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:4cba3766ef89557422062287248adeb933999071bad6f3ef9c0a478a3c680119
COMPONENT_ANITYA_ID_1=	15027

COMPONENT_NAME_2=       xlsclients
COMPONENT_VERSION_2=    1.1.3
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:5d9666fcc6c3de210fc70d5a841a404955af709a616fde530fe4e8f7723e3d3d
COMPONENT_ANITYA_ID_2=	14989

COMPONENT_NAME_3=       xwininfo
COMPONENT_VERSION_3=    1.1.3
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:218eb0ea95bd8de7903dfaa26423820c523ad1598be0751d2d8b6a2c23b23ff8
COMPONENT_ANITYA_ID_3=	14949

COMPONENT_NAME_4=       xlsfonts
COMPONENT_VERSION_4=    1.0.5
COMPONENT_ARCHIVE_HASH_4=       \
    sha256:40295bec35077cee93be2e4c26cc00268ed6ace779ae6e97766a866c1e3927fa
COMPONENT_ANITYA_ID_4=	14964

COMPONENT_NAME_5=       xvinfo
COMPONENT_VERSION_5=    1.1.3
COMPONENT_ARCHIVE_HASH_5=       \
    sha256:9fba8b68daf53863e66d5004fa9c703fcecf69db4d151ea2d3d885d621e6e5eb
COMPONENT_ANITYA_ID_5=	14951

COMPONENT_NAME_6=       xlsatoms
COMPONENT_VERSION_6=    1.1.2
COMPONENT_ARCHIVE_HASH_6=       \
    sha256:47e5dc7c3dbda6db2cf8c00cedac1722835c1550aa21cfdbc9ba83906694dea4
COMPONENT_ANITYA_ID_6=	14990

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3 4 5 6

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
REQUIRED_PACKAGES += x11/library/libdmx
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/libxtst
REQUIRED_PACKAGES += x11/library/libxv
REQUIRED_PACKAGES += x11/library/libxxf86misc
REQUIRED_PACKAGES += x11/library/libxxf86vm
REQUIRED_PACKAGES += x11/library/mesa
REQUIRED_PACKAGES += x11/library/xcb-util
