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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates.
#

# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=		gcc
BUILD_BITS =		32_and_64
include ../../../make-rules/shared-macros.mk
BUILD_STYLE=            meson

COMPONENT_NAME=		gdk-pixbuf
COMPONENT_VERSION=	2.39.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GdkPixbuf
COMPONENT_ARCHIVE_HASH= \
     sha256:63e59387b5c5504f3bf07530bac0b69542e55936e09283400d32529b2b32e1ca
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	9533

TPNO=		        56020

SYSTEM_TEST_TARGET= $(SYSTEM_TESTS_NOT_IMPLEMENTED)

# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Workaround for build failures due to gdk-pixbuf Makefiles not passing CFLAGS
# or LDFLAGS, especially the -m32/64 flag, to g-ir-scanner
COMPONENT_BUILD_ENV += CFLAGS="$(strip $(CFLAGS))"
COMPONENT_BUILD_ENV += LDFLAGS="$(strip $(LDFLAGS))"

CONFIGURE_OPTIONS.32 += -Dgir=false

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# Generate and install architecture-specific configuration files that define
# the set of plugins available.
PROTOLCACHEDIR.32=	$(PROTO_DIR)/$(USRLIB.32)/gdk-pixbuf-2.0/2.10.0
PROTOLCACHEDIR.64=	$(PROTO_DIR)/$(USRLIB.64)/gdk-pixbuf-2.0/2.10.0
PROTOLCACHECONF.32=	$(PROTOLCACHEDIR.32)/loaders.cache
PROTOLCACHECONF.64=	$(PROTOLCACHEDIR.64)/loaders.cache

$(PROTOLCACHECONF.32):
	$(MKDIR) $(PROTOLCACHEDIR.32); \
	LD_LIBRARY_PATH="$(PROTO_DIR)/$(USRLIB.32):$(GLIB_LD_LIBRARY_PATH)" \
	  $(PROTO_DIR)/$(USRBIN.32)/gdk-pixbuf-query-loaders \
	  $(PROTOLCACHEDIR.32)/loaders/*.so | \
	  $(GSED) -e "s#$(PROTO_DIR)/##" > $(PROTOLCACHECONF.32)

$(PROTOLCACHECONF.64):
	$(MKDIR) $(PROTOLCACHEDIR.64); \
	LD_LIBRARY_PATH="$(PROTO_DIR)/$(USRLIB.64):$(GLIB_LD_LIBRARY_PATH)" \
	  $(PROTO_DIR)/$(USRBIN.64)/gdk-pixbuf-query-loaders \
	  $(PROTOLCACHEDIR.64)/loaders/*.so | \
	  $(GSED) -e "s#$(PROTO_DIR)/##" > $(PROTOLCACHECONF.64)

install: $(PROTOLCACHECONF.32) $(PROTOLCACHECONF.64)

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgdk_pixbuf-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgdk_pixbuf-2.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgdk_pixbuf_xlib-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgdk_pixbuf_xlib-2.0.3lib;

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

# pixbuf-randomly-modified tests have a different random suffix each time,
# so strip that out to allow repeatable comparisons
COMPONENT_TEST_TRANSFORMS += \
	'-e "s%/pixbuf/randomly-modified/.*%/pixbuf/randomly-modified/...%"'

# Standard automake test framework results transform
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/ok/p" '

# Requires >= 2.69 autoconf
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
