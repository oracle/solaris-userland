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
# Copyright (c) 2019, 2025, Oracle and/or its affiliates.
#

COMPILER=		gcc
BUILD_BITS=		64
BUILD_ARCH=		i386
CTF_MODE =		off	# Has no effect

include			../../make-rules/shared-macros.mk

COMPONENT_NAME=		node
COMPONENT_VERSION=	20.19.2
COMPONENT_SUBVERSION=
HUMAN_VERSION=		$(COMPONENT_VERSION)$(COMPONENT_SUBVERSION)
COMPONENT_PROJECT_URL=	https://github.com/nodejs/node
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH= \
    sha256:aab04d1fd787c6d2729411b6e21e39f972e9580a115b439326e0bf6de4ff00b3
COMPONENT_ARCHIVE_URL=	\
    $(COMPONENT_PROJECT_URL)/archive/v$(COMPONENT_VERSION).zip
COMPONENT_BUGDB=	utility/nodejs
COMPONENT_BAID=		329346
COMPONENT_ANITYA_ID=	8251

CONFIGURE_DEFAULT_DIRS=	no

ifeq ($(MACH),i386)
TEST_TARGET=           $(TEST_64)
else
TEST_TARGET=           $(NO_TESTS)
endif

include	$(WS_MAKE_RULES)/common.mk

VERSION_NUMBERS=	$(subst ., ,$(COMPONENT_VERSION))
NODE_MAJOR_VERSION=	$(word 1,$(VERSION_NUMBERS))

CONFIGURE_SCRIPT=	./configure
CONFIGURE_PREFIX=	/usr/nodejs/$(NODE_MAJOR_VERSION)

CONFIGURE_OPTIONS+=	--shared-nghttp2
CONFIGURE_OPTIONS+=	--shared-openssl
CONFIGURE_OPTIONS+=	--openssl-is-fips
CONFIGURE_OPTIONS+=	--shared-zlib
CONFIGURE_OPTIONS+=	--with-intl=system-icu
CONFIGURE_OPTIONS+=	--shared-cares
CONFIGURE_OPTIONS+=	--shared-libuv
CONFIGURE_OPTIONS+=	--shared

#CC_PIC_MODE = $(CC_PIC_DISABLE)
#LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Read NPM_CONFIG_REGISTRY from local configuration file.
$(call read-config,NPM_CONFIG_REGISTRY,https://registry.npmjs.org/)

NPM_ENV=		NPM_CONFIG_USERCONFIG=$(COMPONENT_DIR)/Solaris/npmrc \
			NPM_CONFIG_CACHE=$(@D)/.npm \
			NPM_CONFIG_REGISTRY=$(NPM_CONFIG_REGISTRY)

COMPONENT_BUILD_ENV+=	PATH=$(PATH):/usr/sbin $(NPM_ENV)

#
# Fix gmake test failure on systems behind proxy and using
# local NPM repository.
#
COMPONENT_TEST_ENV+=	http_proxy=
COMPONENT_TEST_ENV+=	https_proxy=
COMPONENT_TEST_ENV+=	HTTP_PROXY=
COMPONENT_TEST_ENV+=	HTTPS_PROXY=

# Make test does not like cloney, so a simple copy is used instead.
COMPONENT_PRE_CONFIGURE_ACTION= \
	$(CP) -rpP $(SOURCE_DIR)/. $(@D)

#
# OpenSSL 3 temporarily lives in non-standard directory. This is a workaround
# that prevents NodeJS to link against the old OpenSSL 1.0 that is otherwise
# found in standard directories.
#
LINK.OPENSSL3=		\
	"$(GCC_ROOT)/bin/g++ $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) \
	pkg-config --libs-only-L --libs-only-other openssl)"

COMPONENT_BUILD_ARGS+=	LINK=$(LINK.OPENSSL3)
COMPONENT_INSTALL_ARGS+=LINK=$(LINK.OPENSSL3)

COMPONENT_TEST_TARGETS=	test-only
# The node-gyp sometimes rebuilds packages during 'gmake test'. It needs to
# know which compiler and linker to use. Pass the information via environment.
COMPONENT_TEST_ARGS+=	CC=gcc CXX=g++ LINK=$(LINK.OPENSSL3)
# add /usr/sbin to PATH for dtrace
# add openssl-3 to PATH, some tests can't speak to s_client from other versions
COMPONENT_TEST_ENV+=	PATH=$(BINDIR.OPENSSL3):$(GNUBIN):$(PATH):/usr/sbin \
			$(NPM_ENV)

PKG_MACROS+=		NODE_MAJOR_VERSION=$(NODE_MAJOR_VERSION)

NODE_PROTO_DIR=$(PROTO_DIR)/usr/nodejs/$(NODE_MAJOR_VERSION)

COMPONENT_POST_INSTALL_ACTION+= \
        $(MKDIR) $(NODE_PROTO_DIR)/lib/$(MACH64); \
        mv $(NODE_PROTO_DIR)/lib/libnode.so* $(NODE_PROTO_DIR)/lib/$(MACH64)/; \
        echo "Compile .pyc's..."; \
        $(PYTHON) -m compileall $(NODE_PROTO_DIR)/; \
        echo "Fix RPATH and RUNPATH..."; \
	elfedit -e 'dyn:runpath $$ORIGIN/../lib/$(MACH64)' \
	-e 'dyn:rpath $$ORIGIN/../lib/$(MACH64)' $(NODE_PROTO_DIR)/bin/node

REQUIRED_PACKAGES+=	system/core-os
REQUIRED_PACKAGES+=	system/library/math
REQUIRED_PACKAGES+=	system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES+=	system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES+=	library/icu
REQUIRED_PACKAGES+=	library/nghttp2
REQUIRED_PACKAGES+=	library/security/openssl-3
REQUIRED_PACKAGES+=	library/zlib
REQUIRED_PACKAGES+=	library/libcares
REQUIRED_PACKAGES+=	library/libuv
