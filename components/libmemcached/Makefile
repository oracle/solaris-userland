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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
COMPILER =		gcc
CTF_MODE =		off # C++
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libmemcached
COMPONENT_VERSION=	1.1.4
COMPONENT_BAID=		363466
COMPONENT_ARCHIVE_HASH=	\
    sha256:c477e1f6510e1dc698e84f3717ce690a8f65b94c616ecaa62306cce0f5e3116a
COMPONENT_PROJECT_URL=  https://github.com/awesomized/libmemcached
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/archive/refs/tags/$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	database/memcached
COMPONENT_ANITYA_ID=	5412

BUILD_STYLE= cmake

include $(WS_MAKE_RULES)/common.mk

LDFLAGS+= -lumem

# need some files in $(SOURCE_DIR)/docs during build
COMPONENT_PRE_CONFIGURE_ACTION = \
    ($(CLONEY) $(SOURCE_DIR) $(@D))

# Disable parallel test run to get consistent test results.
CONFIGURE_ENV += CIRRUS_CI=1

CMAKE_OPTIONS += -DBUILD_TESTING=ON
CMAKE_OPTIONS += -DBUILD_DOCS_MAN=ON
CMAKE_OPTIONS += -DBUILD_DOCS_MANGZ=OFF
CMAKE_OPTIONS += -DENABLE_MEMASLAP=OFF
CMAKE_OPTIONS += -DENABLE_SASL=ON
CMAKE_OPTIONS += -DMEMCACHED_BINARY=/usr/lib/memcached

RMRPATH= $(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH"

COMPONENT_POST_INSTALL_ACTION.64 += \
	$(RMRPATH) $(PROTOUSRLIBDIR64)/libhashkit.so.2.0.0 ; \
	$(RMRPATH) $(PROTOUSRLIBDIR64)/libmemcached.so.11.0.0 ; \
	$(RMRPATH) $(PROTOUSRLIBDIR64)/libmemcachedprotocol.so.0.0.0 ; \
	$(RMRPATH) $(PROTOUSRLIBDIR64)/libmemcachedutil.so.2.0.0; \
	$(RMRPATH) $(PROTOUSRLIBDIR)/libhashkit.so.2.0.0 ; \
	$(RMRPATH) $(PROTOUSRLIBDIR)/libmemcached.so.11.0.0 ; \
	$(RMRPATH) $(PROTOUSRLIBDIR)/libmemcachedprotocol.so.0.0.0 ; \
	$(RMRPATH) $(PROTOUSRLIBDIR)/libmemcachedutil.so.2.0.0;

# Allow to pass test memcached/options.cpp and find options.config
# even when build in UL setup.
COMPONENT_PRE_TEST_ACTION = \
    ($(SYMLINK) $(SOURCE_DIR) $(@D)/test/$(COMPONENT_SRC))

COMPONENT_TEST_ENV += CLICOLOR=0
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += -e '"s/[[:space:]]\+[0-9]\+\(\.[0-9]\+\)\? sec//g" '

REQUIRED_PACKAGES += service/memcached
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libsasl2
