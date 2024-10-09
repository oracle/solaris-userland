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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xdpyinfo
COMPONENT_VERSION=	1.3.4
COMPONENT_ARCHIVE_HASH= \
	sha256:a8ada581dbd7266440d7c3794fa89edf6b99b8857fc2e8c31042684f3af4822b
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15028
COMPONENT_BAID=		179998

COMPONENT_NAME_1=       xdriinfo
COMPONENT_VERSION_1=    1.0.7
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:dd838bae9d2b19ddd71fe6d30ed33abc7c85e19d223e79d35600db3fa44bf734
COMPONENT_ANITYA_ID_1=	15027
COMPONENT_BAID_1=	139174

COMPONENT_NAME_2=       xlsclients
COMPONENT_VERSION_2=    1.1.5
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:68baee57e70250ac4a7759fb78221831f97d88bc8e51dcc2e64eb3f8ca56bae3
COMPONENT_ANITYA_ID_2=	14989
COMPONENT_BAID_2=	139175

COMPONENT_NAME_3=       xwininfo
COMPONENT_VERSION_3=    1.1.6
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:3518897c17448df9ba99ad6d9bb1ca0f17bc0ed7c0fd61281b34ceed29a9253f
COMPONENT_ANITYA_ID_3=	14949
COMPONENT_BAID_3=	150808

COMPONENT_NAME_4=       xlsfonts
COMPONENT_VERSION_4=    1.0.8
COMPONENT_ARCHIVE_HASH_4=       \
    sha256:807f909eace684b866fc63b3e962729c120822a6c96e051ff51cf350b3ffb6cd

COMPONENT_ANITYA_ID_4=	14964
COMPONENT_BAID_4=	174207

COMPONENT_NAME_5=       xvinfo
COMPONENT_VERSION_5=    1.1.5
COMPONENT_ARCHIVE_HASH_5=       \
    sha256:3ede71ecb26d9614ccbc6916720285e95a2c7e0c5e19b8570eaaf72ad7c5c404
COMPONENT_ANITYA_ID_5=	14951
COMPONENT_BAID_5=	139176

COMPONENT_NAME_6=       xlsatoms
COMPONENT_VERSION_6=    1.1.4
COMPONENT_ARCHIVE_HASH_6=       \
    sha256:f4bfa15f56c066d326a5d5b292646708f25b9247506840b9047cd2687dcc71b7
COMPONENT_ANITYA_ID_6=	14990
COMPONENT_BAID_6=	139177

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3 4 5 6

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

# Disable support for DMX & xf86misc in xdpyinfo, since they've been EOF'ed
CONFIGURE_OPTIONS += --without-dmx
CONFIGURE_OPTIONS += --without-xf86misc

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/libxtst
REQUIRED_PACKAGES += x11/library/libxv
REQUIRED_PACKAGES += x11/library/libxxf86vm
REQUIRED_PACKAGES += x11/library/mesa
REQUIRED_PACKAGES += x11/library/xcb-util
