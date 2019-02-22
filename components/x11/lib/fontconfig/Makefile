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

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		fontconfig
COMPONENT_VERSION=	2.12.1
COMPONENT_PROJECT_URL=	https://fontconfig.org/
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)release/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:b449a3e10c47e1d1c7a6ec6e2016cca73d3bd68fbbd4f0ae5cc6b573f7d6c7f3
COMPONENT_BUGDB=        x11/font
COMPONENT_ANITYA_ID=	827
TPNO=			30873

CONFIGURE_BINDIR.32 =  $(CONFIGURE_PREFIX)/bin/$(MACH32)
CONFIGURE_BINDIR.64 =  $(CONFIGURE_PREFIX)/bin/$(MACH64)

FIX_PC_FILES=fontconfig.pc.in
# Don't include path to freetype headers in our proto area in the *.pc files.
# The 'Requires: freetype2' will handle the right -I flags for us.
COMPONENT_FIX_PC_FLAGS += -e 's| \@FREETYPE_CFLAGS\@||g;'

include $(WS_MAKE_RULES)/x11-component.mk

# GNU Build System files have to be regenerated for automake 1.16.
# It can be removed when the upstream starts to use a newer automake version.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv)

CONFIGURE_OPTIONS += --with-baseconfigdir='/etc/fonts'
CONFIGURE_OPTIONS += --with-templatedir='/etc/fonts/conf.avail'
CONFIGURE_OPTIONS += --with-xmldir='/etc/fonts'
CONFIGURE_OPTIONS += --with-default-fonts='/usr/share/fonts'
CONFIGURE_OPTIONS += --with-add-fonts='/etc/X11/fontpath.d,/usr/share/ghostscript/fonts,/usr/X11/lib/X11/fonts'
CONFIGURE_OPTIONS += --with-cache-dir=/var/cache/fontconfig

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS += MAKE=$(GMAKE)

COMPONENT_POST_INSTALL_ACTION = \
	(cat files/sunman-notes-fc-cache >> $(PROTO_DIR)/usr/share/man/man1/fc-cache.1)

# for tests
unexport SHELLOPTS
COMPONENT_TEST_DIR =  $(BUILD_DIR)/$(MACH$(BITS))
COMPONENT_TEST_CMD = cd $(COMPONENT_TEST_DIR); gmake check;
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/freetype-2
