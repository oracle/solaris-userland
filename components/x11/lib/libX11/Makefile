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
# Copyright (c) 2018, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libX11
COMPONENT_VERSION=	1.7.2
COMPONENT_ARCHIVE_HASH= \
	sha256:1cfa35e37aaabbe4792e9bb690468efefbfbf6b147d9c69d6f90d13c3092ea6c
COMPONENT_BUGDB=	x11/libraries
COMPONENT_ANITYA_ID=	1764
TPNO=			71515

PKG_PROTO_DIRS += $(SOURCE_DIR)/src/xlibi18n/

FIX_PC_FILES=x11.pc.in x11-xcb.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

LINT_FLAGS += -I$(SOURCE_DIR)/include/X11

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

COMPONENT_POST_UNPACK_ACTION = \
	$(CP) -r files/modules/lc/gb18030 $(SOURCE_DIR)/modules/lc/gb18030; \
	$(CP) files/src/xlibi18n/lcUniConv/* $(SOURCE_DIR)/src/xlibi18n/lcUniConv; \
	$(CP) files/src/XInteractive.c $(SOURCE_DIR)/src/

CONFIGURE_ENV += LIB_MAN_SUFFIX=3x11

CONFIGURE_OPTIONS += --enable-xthreads
CONFIGURE_OPTIONS += --enable-loadable-i18n
CONFIGURE_OPTIONS += --disable-xf86bigfont
CONFIGURE_OPTIONS += --disable-secure-rpc
CONFIGURE_OPTIONS += --with-xcb=yes
CONFIGURE_OPTIONS += --enable-loadable-xcursor
CONFIGURE_OPTIONS += --enable-xcms
CONFIGURE_OPTIONS += --enable-xlocaledir
CONFIGURE_OPTIONS += --enable-xkb
CONFIGURE_OPTIONS += --enable-man-pages
CONFIGURE_OPTIONS.32 += --with-locale-lib-dir='$${exec_prefix}/lib/X11/locale'
CONFIGURE_OPTIONS.64 += --with-locale-lib-dir='$${exec_prefix}/lib/X11/locale/$(MACH64)'

# -DSUNSOFT enables Solaris extensions
# -DMOTIFBC enables compatibility with bugs in Motif & other apps
# -DSUNSOFT_KBD enables Solaris traditional keyboard handling
CPPFLAGS += -DSUNSOFT -DMOTIFBC -DSUNSOFT_KBD

# for tests
unexport SHELLOPTS
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

# The default Userland locale transforms don't work with libX11 locale files
LOCALE_TRANSFORMS =

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += system/library/iconv
