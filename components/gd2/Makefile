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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gd
COMPONENT_VERSION=      2.2.5
COMPONENT_SRC=		libgd-gd-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	gd-$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=  http://www.libgd.org/
# this is the hash of the payload because it appears to be re-compressed
# periodically causing it to have a new hash value.
COMPONENT_ARCHIVE_HASH= \
    sha256:199874fdb006de0911819234104ffa84338e98e82fefbac042a58a3f8272a7df
COMPONENT_ARCHIVE_URL=  https://github.com/libgd/libgd/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/gd2
COMPONENT_ANITYA_ID=	880

TPNO=			42776

include $(WS_MAKE_RULES)/common.mk

PATCH_LEVEL = 0

CFLAGS += $(CPP_LARGEFILES)
CPPFLAGS += $(CPP_LARGEFILES)

LINT_FLAGS += -I$(SOURCE_DIR)/src

# Needed for "gmake test" to work.
COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS  +=           --includedir=$(CONFIGURE_INCLUDEDIR)/gd2
CONFIGURE_OPTIONS  +=           --disable-static
CONFIGURE_OPTIONS  +=           --disable-rpath
CONFIGURE_OPTIONS  +=           --with-x
CONFIGURE_OPTIONS  +=           --with-pic

COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -if)

# We only deliver 64-bit binaries and in /usr/bin.
COMPONENT_POST_INSTALL_ACTION.32 += \
	$(GSED) -i -e 's|$(USRBINDIR)/$(MACH32)|$(USRBINDIR)|' \
		$(PROTOUSRBINDIR)/$(MACH32)/gdlib-config;

# When we update to a version of libgd that has this test in the
# tarball, this can be removed along with files/php_bug_75571.gif
COMPONENT_PRE_TEST_ACTION = \
	cp files/php_bug_75571.gif $(@D)/tests/gif/

COMPONENT_TEST_CMD = \
	cmake -DBUILD_TEST=1 .; \
	(cd $(@D)/tests; gmake); \
	ctest .
COMPONENT_TEST_TARGETS =
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-e "/Performing/d" ' \
	'-e "s|\(^.*32 Test.*Passed\).*|\1|" ' \
	'-e "s|\(^.*32 Test.*Failed\).*|\1|" ' \
	'-e "s|    [0-9]\.[0-9][0-9] sec||" ' \
	'-n ' \
	'-e "/Passed/p" ' \
	'-e "/Failed/p" ' \
	'-e "/passed/p" ' \
	'-e "/FAILED/p" ' \
	'-e "/Errors/p" '

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxpm
