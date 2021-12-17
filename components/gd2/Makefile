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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gd
COMPONENT_VERSION=      2.3.3
COMPONENT_SRC=		libgd-gd-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	gd-$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=  http://www.libgd.org/

# this is the hash of the payload because it appears to be re-compressed
# periodically causing it to have a new hash value.
COMPONENT_ARCHIVE_HASH= \
    sha256:24429f9d0dbe0f865aaa4b1a63558242396ba9134e6cfd32ca5e486a84483350
COMPONENT_ARCHIVE_URL=  https://github.com/libgd/libgd/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/gd2
COMPONENT_ANITYA_ID=	880

COMPONENT_BAID=		111348

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

# The tests do not recognise /tmp to be a valid directory (presumabely it being
# a mount point), so we create it's own directory and supply it via TMPDIR
# variable
COMPONENT_TEST_CMD = \
	cmake -DBUILD_TEST=1 .; \
	(cd $(@D)/tests; gmake); \
	export TMPDIR="$(COMPONENT_TEST_DIR)/tmpdir"; \
	mkdir -p "$$TMPDIR"; \
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

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxpm
