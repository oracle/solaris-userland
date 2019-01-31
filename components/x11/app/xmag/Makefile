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

COMPONENT_NAME=		xmag
COMPONENT_VERSION=	1.0.6
COMPONENT_ARCHIVE_HASH= \
	sha256:87a2bc23b251e2d8f8370d3283a4d6c8dac98a30cb5749a04336cdb55c14e161
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	14963

# Sun source
COMPONENT_NAME_1=       xmag_multivis
COMPONENT_ARCHIVE_SRC_1=none
COMPONENT_ANITYA_ID_1=	N/A

PKG_PROTO_DIRS += $(COMPONENT_DIR)/sun-src

TEST_TARGET = $(NO_TESTS)
BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
endef

LIST = 1

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

undefine COMPONENT_ARCHIVE_URL_1

include $(WS_MAKE_RULES)/x11-component.mk

# No configure script for Sun sources, just build and install
SOURCE_DIR_1=   $(COMPONENT_DIR)/sun-src

$(BUILD_DIR_1)/.built: COMPONENT_BUILD_ENV += LD="$(CC)"

$(BUILD_DIR_1)/.built:
	$(RM) -r $(@D) ; $(MKDIR) $(@D)
	cd $(@D); $(ENV) $(CONFIGURE_ENV) $(COMPONENT_BUILD_ENV) \
	    $(GMAKE) VPATH=$(SOURCE_DIR_1) -f $(SOURCE_DIR_1)/Makefile \
	    $(COMPONENT_BUILD_ARGS) all
	touch $@

$(BUILD_DIR_1)/.installed: $(BUILD_DIR_1)/.built
	$(MKDIR) $(PROTO_DIR)$(USRBINDIR)
	$(INSTALL) -m 555 $(@D)/xmag_multivis $(PROTO_DIR)/usr/bin
	touch $@

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
