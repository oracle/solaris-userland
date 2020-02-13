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
# Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
#

# parfait is a bit unhappy (24796622)
export PARFAIT_BUILD=no

BUILD_BITS =            32_and_64
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mozjs
COMPONENT_VERSION=	60.2.3
COMPONENT_PROJECT_URL=	https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey
COMPONENT_SRC=          mozjs-60.2.3
COMPONENT_ARCHIVE=    	mozjs60_60.2.3.orig.tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:4163add2c4c25499fb45d7cca7cab9ecbede0cb054b9bcfc9abaee84733c4d04
COMPONENT_ARCHIVE_URL=  https://launchpad.net/ubuntu/+archive/primary/+sourcefiles/mozjs60/60.2.3-1ubuntu1/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libmozjs
COMPONENT_ANITYA_ID=	11754

TPNO=			53743

CXXFLAGS += -std=c++11

# Only used during build process.
PYTHON_VERSIONS= 2.7
PYTHON= $(PYTHON.2.7.$(BITS))

# Tests hook up need work
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D))
# configure script is not at root of source tree.
CONFIGURE_SCRIPT= $(SOURCE_DIR)/js/src/configure

CONFIGURE_ENV += PYTHON="$(PYTHON)"
CONFIGURE_ENV += LDSHARED="$(CC) -shared"
CONFIGURE_ENV += NSPR_CONFIG="/usr/bin/pkg-config nspr"

CONFIGURE_OPTIONS += --disable-jemalloc
CONFIGURE_OPTIONS += --enable-ctypes
CONFIGURE_OPTIONS += --disable-tests
# Uses ancient embedded version of ICU.
CONFIGURE_OPTIONS += --without-intl-api
# Resulting packages are a few hundred megabytes larger without this!
CONFIGURE_OPTIONS += --enable-install-strip
CONFIGURE_OPTIONS += --enable-readline
CONFIGURE_OPTIONS += --enable-shared-js
CONFIGURE_OPTIONS += --disable-static-js
CONFIGURE_OPTIONS += --enable-system-ffi
CONFIGURE_OPTIONS += --enable-threadsafe
CONFIGURE_OPTIONS += --with-system-zlib
CONFIGURE_OPTIONS += --with-x
CONFIGURE_OPTIONS += --enable-strip
CONFIGURE_OPTIONS.32 += --with-system-nspr
# A pkg-config file isn't shipped in Solaris for nspr 64-bit, so configure will
# fail to find it, requiring manual specification of the flags and libs.
CONFIGURE_OPTIONS.64 += --with-nspr-cflags="-I/usr/include/mps"
CONFIGURE_OPTIONS.64 += --with-nspr-libs="-R/usr/lib/mps/64 -L/usr/lib/mps/64 -lplds4 -lplc4 -lnspr4"
LDFLAGS += -z gnu-version-script-compat
CONFIGURE_OPTIONS.32 += --bindir=$(PROTOUSRBINDIR)/$(MACH32)
CONFIGURE_OPTIONS.64 += --bindir=$(PROTOUSRBINDIR)/$(MACH64)

# passing in --bindir doesn't seem to work, resulting in 32-bit bins 
# being overwritten.  Copy 32-bit js-config from the build area 
COMPONENT_POST_INSTALL_ACTION.32 += \
	$(MKDIR) $(PROTOUSRBINDIR)/$(MACH32); \
	$(CP) $(BUILD_DIR_32)/js/src/build/js-config $(PROTOUSRBINDIR)/$(MACH32)/js$(COMPONENT_VERSION)-config;

unexport SHELLOPTS
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
