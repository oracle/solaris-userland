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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libICE
COMPONENT_VERSION=	1.1.2
COMPONENT_ARCHIVE_HASH= \
	sha256:974e4ed414225eb3c716985df9709f4da8d22a67a2890066bc6dfc89ad298625
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1638
COMPONENT_BAID=		191050

COMPONENT_NAME_1=       iceauth
COMPONENT_VERSION_1=    1.0.10
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:3deefb7da26af9dc799b5628d929d91c9af68c78575639944db3b955f29aa029
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)/releases/individual/app/$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1=	$(COMPONENT_ARCHIVE_URL_1).sig
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID_1=  15048
COMPONENT_BAID_1=	174123

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
