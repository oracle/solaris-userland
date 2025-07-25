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
# Copyright (c) 2010, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk
# Tests do require X11
include ../../make-rules/test-x11.mk
#libreadline.so needs libcurses.so, but -z ignore will not leave a dependency.
LD_Z_IGNORE=

COMPONENT_NAME=		gnuplot
COMPONENT_VERSION=	6.0.3
COMPONENT_PROJECT_URL=  https://gnuplot.sourceforge.net/
COMPONENT_ARCHIVE_HASH= \
	sha256:ec52e3af8c4083d4538152b3f13db47f6d29929a3f6ecec5365c834e77f251ab
COMPONENT_ARCHIVE_URL=  https://sourceforge.net/projects/$(COMPONENT_NAME)/files/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)/download
COMPONENT_ANITYA_ID=	1216

COMPONENT_BAID=		331430

COMPONENT_BUILD_TARGETS = all info
PKG_MACROS +=	GNUPLOT_VERSION=$(shell echo $(COMPONENT_VERSION) | cut -d. -f1-2)

# We have a patch against configure.ac, we need to regenerate configure script
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

# Copy info file and demos to proto area.
COMPONENT_POST_INSTALL_ACTION += ( \
	$(MKDIR) $(PROTO_DIR)/usr/share/info $(PROTO_DIR)/usr/demo; \
	$(CP) $(BUILD_DIR)/$(MACH64)/docs/gnuplot.info $(PROTO_DIR)/usr/share/info/; \
	$(CP) -r $(COMPONENT_SRC)/demo $(PROTO_DIR)/usr/demo/gnuplot; \
	$(CP) -r $(BUILD_DIR)/$(MACH64)/demo/* $(PROTO_DIR)/usr/demo/gnuplot/; \
	$(CP) $(COMPONENT_DIR)/rundemo $(COMPONENT_DIR)/runtcldemo $(PROTO_DIR)/usr/demo/gnuplot/ \
);

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Remove lines containing datetime
COMPONENT_TEST_TRANSFORMS += '-e "/sunrise.*sunset.*sunlight/d" '

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS  += --libexecdir=$(CONFIGURE_LIBDIR.$(BITS))
CONFIGURE_OPTIONS  += --sysconfdir=$(ETCDIR)/gnu
CONFIGURE_OPTIONS  += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  += --x-libraries=$(CONFIGURE_LIBDIR.$(BITS))
CONFIGURE_OPTIONS  += --without-qt
CONFIGURE_OPTIONS  += WX_CONFIG="$(USRBINDIR64)/wx-config"
CONFIGURE_OPTIONS  += --without-libcerf

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/gd
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/graphics/wxwidgets-32
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/font/truetype/liberation
REQUIRED_PACKAGES += system/font/xorg/xorg-core
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
