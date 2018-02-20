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
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		synergy
COMPONENT_VERSION=	1.7.6
COMPONENT_PROJECT_URL=  http://symless.com/synergy
COMPONENT_ARCHIVE=	v1.7.6-stable.tar.gz
COMPONENT_SRC=		synergy-stable-builds-1.7.6-stable
COMPONENT_ARCHIVE_URL=	https://github.com/brahma-dev/synergy-stable-builds/archive/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:43fdd40697dbaf9e81c38e1997b50fbcb52de258eaa21faedb2cdedf696fad53
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	5718
TPNO=			29402

PKG_PROTO_DIRS += $(BUILD_DIR_64)/bin
PKG_PROTO_DIRS += $(BUILD_DIR_64)/bin/plugins
PKG_PROTO_DIRS += $(BUILD_DIR_64)/doc

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --disable-debug

COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_INSTALL_TARGETS = all

REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxtst
