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
# Copyright (c) 2011, 2020, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		lua
COMPONENT_VERSION=	5.4.0
COMPONENT_PROJECT_URL=	http://www.lua.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:084c7fdaec954074f1728e6140df9fb25342b2b9fb854bbd9ab4e11c729f87b3
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)ftp/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	1847

# As per https://www.lua.org/tests/: if test suite for our release is not
# available, download one for the closest Lua release of the same version.
COMPONENT_SRC_TESTS=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-tests
COMPONENT_ARCHIVE_TESTS=	$(COMPONENT_SRC_TESTS).tar.gz
COMPONENT_ARCHIVE_HASH_TESTS=	\
	sha256:a3a2b42c70cd830b39774101a224b65dbe40e093441fb015244ec9a3225d2b78
COMPONENT_ARCHIVE_URL_TESTS=	$(COMPONENT_PROJECT_URL)tests/$(COMPONENT_ARCHIVE_TESTS)

TPNO=			60064

BUILD_STYLE= justmake
INSTALL_32_and_64 += $(BUILD_DIR)/lua-64.pc
SYSTEM_TEST_TARGET= $(SYSTEM_TEST_32_and_64)
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
COMPONENT_TEST_ARGS =		-e"_U=true"
COMPONENT_TEST_TARGETS =	all.lua

# Master test results are the same for both 32-bit and 64-bit, so override
# here, rather than create multiple identical master files.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# The additional lua specific set of transforms to be applied to the
# test results to try to normalize them.
COMPONENT_TEST_TRANSFORMS += \
	'-e "/---- total memory:/d" ' \
	'-e "s|\(time:\).*|\1|" ' \
	'-e "s|elements in ..\?\... |elements in \#\#\# |g" ' \
	'-e "s|[0-9]|\#|g" ' \
	'-e "s|\(calls:\).*|\1|" ' \
	'-e "s|\(seeds:\).*|\1|" ' \
	'-e "s|\(test done on\).*|\1|" '

COMPONENT_SYSTEM_TEST_DIR =	$(COMPONENT_SRC_TESTS)
COMPONENT_SYSTEM_TEST_CMD =	$(USRBINDIR)/lua
COMPONENT_SYSTEM_TEST_ARGS =	-e"_U=true"
COMPONENT_SYSTEM_TEST_TARGETS =	all.lua

REQUIRED_PACKAGES += system/library/math
