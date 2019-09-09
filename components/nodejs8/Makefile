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

COMPILER=		gcc
BUILD_BITS=		64
BUILD_ARCH=		i386

include			../../make-rules/shared-macros.mk

COMPONENT_NAME=		node
COMPONENT_VERSION=	8.16.1
COMPONENT_SUBVERSION=
HUMAN_VERSION=		$(COMPONENT_VERSION)$(COMPONENT_SUBVERSION)
COMPONENT_PROJECT_URL=	https://github.com/nodejs/node
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH= \
    sha256:2aceb2c3847c255ef9de5fd7c7d323c1682456524185be14f0993a22cd07cd94
COMPONENT_ARCHIVE_URL=	\
    $(COMPONENT_PROJECT_URL)/archive/v$(COMPONENT_VERSION).zip
COMPONENT_BUGDB=	utility/nodejs
TPNO=			53859
COMPONENT_ANITYA_ID=	8251

CONFIGURE_DEFAULT_DIRS=	no

TEST_TARGET=		$(TEST_64)
$(SKIP_TEST_AT_TOP_LEVEL)

include	$(WS_MAKE_RULES)/common.mk

VERSION_NUMBERS=	$(subst ., ,$(COMPONENT_VERSION))
NODE_MAJOR_VERSION=	$(word 1,$(VERSION_NUMBERS))

CONFIGURE_SCRIPT=	./configure
CONFIGURE_PREFIX=	/usr/nodejs/$(NODE_MAJOR_VERSION)

CONFIGURE_OPTIONS+=	--shared-nghttp2
CONFIGURE_OPTIONS+=	--shared-openssl
CONFIGURE_OPTIONS+=	--shared-zlib
CONFIGURE_OPTIONS+=	--with-intl=system-icu

COMPONENT_BUILD_ENV+=	PATH=$(PATH):/usr/sbin

# Make test does not like cloney, so a simple copy is used instead.
COMPONENT_PRE_CONFIGURE_ACTION= \
	$(CP) -rp $(SOURCE_DIR)/. $(@D)

COMPONENT_POST_INSTALL_ACTION= \
    $(MKDIR) -p $(PROTO_DIR)/usr/share/doc/release-notes/; \
    $(CP) runtime-nodejs-nodejs-8.txt $(PROTO_DIR)/usr/share/doc/release-notes/

COMPONENT_TEST_ARGS=	test PATH=$(GNUBIN):$(PATH) CC=gcc

PKG_MACROS+=		NODE_MAJOR_VERSION=$(NODE_MAJOR_VERSION)

REQUIRED_PACKAGES+=	system/core-os
REQUIRED_PACKAGES+=	system/library/math
REQUIRED_PACKAGES+=	system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES+=	library/icu
REQUIRED_PACKAGES+=	library/nghttp2
REQUIRED_PACKAGES+=	library/security/openssl
REQUIRED_PACKAGES+=	library/zlib
