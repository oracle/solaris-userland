#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		lua
COMPONENT_VERSION=	5.4.9
COMPONENT_PROJECT_URL=	https://www.lua.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:2335b6c582a52654f94612bf10d2f4672805d05329aa6568b1d8cd9e5c6fb8e6
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)ftp/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	1847

# As per https://www.lua.org/tests/: if test suite for our release is not
# available, download one for the closest Lua release of the same version.
COMPONENT_SRC_TESTS=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-tests
COMPONENT_ARCHIVE_TESTS=	$(COMPONENT_SRC_TESTS).tar.gz
COMPONENT_ARCHIVE_HASH_TESTS=	\
	sha256:7d971845f545ffc09fbb3128a86b2c6524161c70d0fdf0154a16e8c00c343fca
COMPONENT_ARCHIVE_URL_TESTS=	$(COMPONENT_PROJECT_URL)tests/$(COMPONENT_ARCHIVE_TESTS)

COMPONENT_BAID=		467723

BUILD_STYLE= justmake
INSTALL_32_and_64 += $(BUILD_DIR)/lua-64.pc
# The installed /usr/bin/lua executable is 64-bit.
SYSTEM_TEST_TARGET= $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/common.mk

# This is because lua uses $(CC) to build its shared libraries.
CFLAGS +=	$(CC_PIC) $(CPP_LARGEFILES)

COMPONENT_BUILD_ARGS += MYCFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ARGS += MYLDFLAGS="$(CC_BITS)"

COMPONENT_INSTALL_ARGS += INSTALL=$(INSTALL)
COMPONENT_INSTALL_ARGS += INSTALL_TOP=$(PROTOUSRDIR)
$(INSTALL_32):	COMPONENT_INSTALL_ARGS += INSTALL_BIN=$(PROTOUSRBINDIR)/$(MACH32)
$(INSTALL_64):	COMPONENT_INSTALL_ARGS += INSTALL_LIB=$(PROTOUSRLIBDIR64)

$(BUILD_DIR)/lua-64.pc:		files/lua-64.pc
	$(GSED) -e "s#MACH64#$(MACH64)#g" < $< > $@

LUA_ENV =	LD_LIBRARY_PATH=$(COMPONENT_DIR)/build/$(MACH$(BITS))/src/
LUA_EXE =	$(BUILD_DIR)/$(MACH$(BITS))/src/$(COMPONENT_NAME)

COMPONENT_TEST_DIR =		$(COMPONENT_SRC_TESTS)
COMPONENT_TEST_ENV = 		$(LUA_ENV)
COMPONENT_TEST_CMD =		$(LUA_EXE)
# Keep the portable suite, including its long/memory-consuming tests.
# _U also forces _soft=true, which would skip big.lua and other coverage.
COMPONENT_TEST_ARGS =		-e"_port=true;_nomsg=true"
COMPONENT_TEST_TARGETS =	all.lua

# Use the default per-bitness masters: big.lua's string-length overflow
# test applies to 32-bit size_t only.

# The additional lua specific set of transforms to be applied to the
# test results to try to normalize them.
COMPONENT_TEST_TRANSFORMS += \
	'-e "/---- total memory:/d" ' \
	'-e "/^Lua warning: \#time difference from previous test:/d" ' \
	'-e "s|\(time:\).*|\1|" ' \
	'-e "s|elements in [0-9][0-9.]* |elements in \#\#\# |g" ' \
	'-e "s|[0-9]|\#|g" ' \
	'-e "s|\(calls:\).*|\1|" ' \
	'-e "s|\(seeds:\).*|\1|" ' \
	'-e "s|\(test done on\).*|\1|" '

COMPONENT_SYSTEM_TEST_DIR =	$(COMPONENT_SRC_TESTS)
COMPONENT_SYSTEM_TEST_CMD =	$(USRBINDIR)/lua
COMPONENT_SYSTEM_TEST_ARGS =	$(COMPONENT_TEST_ARGS)
COMPONENT_SYSTEM_TEST_TARGETS =	all.lua

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
