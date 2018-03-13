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

COMPONENT_NAME=		imake
COMPONENT_VERSION=	1.0.7
COMPONENT_PROJECT_URL=  https://www.x.org
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
    sha256:690c2c4ac1fad2470a5ea73156cf930b8040dc821a0da4e322014a42c045f37e
COMPONENT_ARCHIVE_URL=  $(COMPONENT_PROJECT_URL)/releases/individual/util/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        x11/builds
COMPONENT_ANITYA_ID=	1373

COMPONENT_NAME_1=       xorg-cf-files
COMPONENT_VERSION_1=    1.0.6
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).tar.bz2
COMPONENT_ARCHIVE_HASH_1= \
    sha256:4dcf5a9dbe3c6ecb9d2dd05e629b3d373eae9ba12d13942df87107fdc1b3934d
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_PROJECT_URL)/releases/individual/util/$(COMPONENT_ARCHIVE_1)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

IMAKE_CONFIGURE_OPTIONS += --enable-mkdirhier
IMAKE_CONFIGURE_OPTIONS += --disable-ccmakedep
IMAKE_CONFIGURE_OPTIONS += --disable-cleanlinks
IMAKE_CONFIGURE_OPTIONS += --disable-makeg
IMAKE_CONFIGURE_OPTIONS += --disable-mergelib
IMAKE_CONFIGURE_OPTIONS += --disable-mkhtmlindex
IMAKE_CONFIGURE_OPTIONS += --disable-revpath

# Prefer cpp from /usr/lib
IMAKE_CONFIGURE_OPTIONS += RAWCPP=/usr/lib/cpp

XORG_CF_CONFIGURE_OPTIONS += --with-config-dir="$(USRLIBDIR)/X11/config"

$(BUILD_DIR_64)/.configured:   CONFIGURE_OPTIONS += $(IMAKE_CONFIGURE_OPTIONS)
$(BUILD_DIR_64)_1/.configured: CONFIGURE_OPTIONS += $(XORG_CF_CONFIGURE_OPTIONS)

$(BUILD_DIR_64)_1/.configured: SOURCE_DIR=$(SOURCE_DIR_1)
configure:	$(BUILD_DIR_64)_1/.configured
build:		$(BUILD_DIR_64)_1/.built
install:	$(BUILD_DIR_64)_1/.installed

REQUIRED_PACKAGES += x11/header/x11-protocols
