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

COMPONENT_NAME=		xstdcmap
COMPONENT_VERSION=	1.0.3
COMPONENT_ARCHIVE_HASH= \
	sha256:f648e2b0cf16aa29856de998e2c7204be39dc1f8daeda9464d32288e0b580fc1
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	17150

# Additional Sun-created utilties
COMPONENT_NAME_1=	cmap_alloc
COMPONENT_NAME_2=	cmap_compact
COMPONENT_NAME_3=	xcolor

# check-releases.py requires these to be spelled out, not auto-generated
COMPONENT_ANITYA_ID_1=	N/A
COMPONENT_ANITYA_ID_2=	N/A
COMPONENT_ANITYA_ID_3=	N/A


TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.built: SOURCE_DIR=$$(SOURCE_DIR_$(1))
$(BUILD_DIR)/%_$(1)/.built: COMPONENT_BUILD_TARGETS=$$(COMPONENT_NAME_$(1))
endef

$(foreach n, $(LIST), \
    $(eval SOURCE_DIR_$(n) = $(COMPONENT_DIR)/sun-src/$(COMPONENT_NAME_$(n))) \
    $(eval BUILD_DIR_$(n) = $(BUILD_DIR_$(MK_BITS))_$(n)) \
    $(eval BUILD_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.built) \
    $(eval BUILD_TARGET += $(BUILD_$(MK_BITS)_$(n))) \
    $(eval INSTALL_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.installed) \
    $(eval INSTALL_TARGET += $(INSTALL_$(MK_BITS)_$(n))) \
    $(eval $(call extra-target-rules,$(n))) \
)

include $(WS_MAKE_RULES)/x11-component.mk

# No configure script for Sun-created utils, just build & install
CONFIGURE_ENV += LD="$(CC) $(CC_BITS)"
COMPONENT_INSTALL_ENV += INSTALL="$(INSTALL)" PREFIX="$(CONFIGURE_PREFIX)"

$(BUILD_DIR_$(MK_BITS))_%/.built:
	$(RM) -r $(@D) ; $(MKDIR) $(@D)
	$(CLONEY) $(SOURCE_DIR) $(@D)
	cd $(@D); $(ENV) $(CONFIGURE_ENV) $(COMPONENT_BUILD_ENV) \
	    $(GMAKE) VPATH=$(SOURCE_DIR) -f $(SOURCE_DIR)/Makefile \
	    $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS)
	touch $@

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxmu
