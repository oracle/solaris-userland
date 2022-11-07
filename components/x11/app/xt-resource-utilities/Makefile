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

COMPONENT_NAME=		listres
COMPONENT_VERSION=	1.0.5
COMPONENT_ARCHIVE_HASH= \
	sha256:ce2a00bbe7d2eb8d75177006f343c80443a22d52570c48a43c6fe70ea074dc9d
COMPONENT_ARCHIVE=  $(COMPONENT_SRC).tar.xz
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	17161
COMPONENT_BAID=		122775

COMPONENT_NAME_1=       appres
COMPONENT_VERSION_1=    1.0.6
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:8b2257e2a0a1ad8330323aec23f07c333075d7fe4e6efd88e0c18fba8223590b
COMPONENT_ARCHIVE_1=  $(COMPONENT_SRC_1).tar.xz
COMPONENT_ANITYA_ID_1=	15053
COMPONENT_BAID_1=	122774

COMPONENT_NAME_2=       editres
COMPONENT_VERSION_2=    1.0.8
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:83cf5dffb1883635fd9c6a8dc48ff9e560f6c6d8ce1a0e929d5f409cba18b6f9
COMPONENT_ARCHIVE_2=  $(COMPONENT_SRC_2).tar.xz
COMPONENT_ANITYA_ID_2=	17160
COMPONENT_BAID_2=	122776

COMPONENT_NAME_3=       viewres
COMPONENT_VERSION_3=    1.0.7
COMPONENT_ARCHIVE_3=	$(COMPONENT_SRC_3).tar.xz
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:b15a62085b1a10f55ae1cf17b7ded75b72b21be240c68071685db377c4afc628
COMPONENT_ANITYA_ID_3=	17162
COMPONENT_BAID_3= 	132595

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
