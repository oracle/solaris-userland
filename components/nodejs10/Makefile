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
# Copyright (c) 2019, 2020, Oracle and/or its affiliates. All rights reserved.
#

COMPILER=		gcc
BUILD_BITS=		64
BUILD_ARCH=		i386

include			../../make-rules/shared-macros.mk

COMPONENT_NAME=		node
COMPONENT_VERSION=	10.19.0
COMPONENT_SUBVERSION=
HUMAN_VERSION=		$(COMPONENT_VERSION)$(COMPONENT_SUBVERSION)
COMPONENT_PROJECT_URL=	https://github.com/nodejs/node
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH= \
    sha256:b2d1af5ee09c1946bd8c52c439b81d70912795e6e480180fe814d35b94ad29cb
COMPONENT_ARCHIVE_URL=	\
    $(COMPONENT_PROJECT_URL)/archive/v$(COMPONENT_VERSION).zip
COMPONENT_BUGDB=	utility/nodejs
TPNO=			56705
COMPONENT_ANITYA_ID=	8251

CONFIGURE_DEFAULT_DIRS=	no

TEST_TARGET=		$(TEST_64)
$(SKIP_TEST_AT_TOP_LEVEL)

include	$(WS_MAKE_RULES)/common.mk

VERSION_NUMBERS=	$(subst ., ,$(COMPONENT_VERSION))
NODE_MAJOR_VERSION=	$(word 1,$(VERSION_NUMBERS))

CONFIGURE_SCRIPT=	./configure
CONFIGURE_PREFIX=	/usr/nodejs/$(NODE_MAJOR_VERSION)

PKG_CONFIG_PATHS+=	/usr/openssl/1.1/pkgconfig/64

CONFIGURE_OPTIONS+=	--shared-nghttp2
CONFIGURE_OPTIONS+=	--shared-openssl
CONFIGURE_OPTIONS+=	--shared-zlib
CONFIGURE_OPTIONS+=	--with-intl=system-icu

# Read NPM_CONFIG_REGISTRY from local configuration file.
$(call read-config,NPM_CONFIG_REGISTRY,https://registry.npmjs.org/)

NPM_ENV=		NPM_CONFIG_USERCONFIG=/dev/null \
			NPM_CONFIG_CACHE=$(@D)/.npm \
			NPM_CONFIG_REGISTRY=$(NPM_CONFIG_REGISTRY)

#
# Node.js has build time dependency on python2.7. It has a hack that adds
# python->python2.7 symlink to out/tools/bin if python mediator is set to 3.x.
#
COMPONENT_BUILD_ENV+=	PATH=$(@D)/out/tools/bin:$(PATH):/usr/sbin $(NPM_ENV)

# Make test does not like cloney, so a simple copy is used instead.
COMPONENT_PRE_CONFIGURE_ACTION= \
	$(CP) -rp $(SOURCE_DIR)/. $(@D)

COMPONENT_POST_INSTALL_ACTION= \
    $(MKDIR) -p $(PROTO_DIR)/usr/share/doc/release-notes/; \
    $(CP) runtime-nodejs-nodejs-10.txt $(PROTO_DIR)/usr/share/doc/release-notes/

#
# OpenSSL 1.1 temporarily lives in non-standard directory. This is a workaround
# that prevents NodeJS to link against the old OpenSSL 1.0 that is otherwise
# found in standard directories.
#
LINK.OPENSSL11=		\
	"g++ $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) \
	pkg-config --libs-only-L --libs-only-other openssl)"

COMPONENT_BUILD_ARGS+=	LINK=$(LINK.OPENSSL11)
COMPONENT_INSTALL_ARGS+=LINK=$(LINK.OPENSSL11)
COMPONENT_TEST_ARGS=	test PATH=$(@D)/out/tools/bin:$(GNUBIN):$(PATH) CC=gcc \
			LINK=$(LINK.OPENSSL11)
COMPONENT_TEST_ENV+=	$(NPM_ENV)

PKG_MACROS+=		NODE_MAJOR_VERSION=$(NODE_MAJOR_VERSION)

REQUIRED_PACKAGES+=	system/core-os
REQUIRED_PACKAGES+=	system/library/math
REQUIRED_PACKAGES+=	system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES+=	library/icu
REQUIRED_PACKAGES+=	library/nghttp2
REQUIRED_PACKAGES+=	library/security/openssl-11
REQUIRED_PACKAGES+=	library/zlib
REQUIRED_PACKAGES+=	runtime/python-27
