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

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libICE
COMPONENT_VERSION=	1.0.9
COMPONENT_ARCHIVE_HASH= \
	sha256:8f7032f2c1c64352b5423f6b48a8ebdc339cc63064af34d66a6c9aa79759e202
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1638
TPNO=			45878

COMPONENT_NAME_1=       iceauth
COMPONENT_VERSION_1=    1.0.8
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).tar.bz2
COMPONENT_ARCHIVE_HASH_1= \
    sha256:e6ee213a217265cc76050e4293ea70b98c32dce6505c6421227efbda62ab60c6
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)/releases/individual/app/$(COMPONENT_ARCHIVE_1)
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID_1=  15048
TPNO_1=                 49160

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=ice.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-unix-transport
CONFIGURE_OPTIONS += --enable-tcp-transport
CONFIGURE_OPTIONS += --disable-local-transport
CONFIGURE_OPTIONS += --enable-ipv6

$(BUILD_TARGET):       LD_OPTIONS += -M$(COMPONENT_DIR)/mapfile

$(BUILD_DIR)/%_1/.configured:  SOURCE_DIR=$(SOURCE_DIR_1)
$(BUILD_DIR)/$(MACH64)_1/%:    BITS=64

configure:      $(BUILD_64:%/.built=%_1/.configured)
build:          $(BUILD_64:%/.built=%_1/.built)
install:        $(INSTALL_64:%/.installed=%_1/.installed)

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/xtrans
