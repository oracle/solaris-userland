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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#

# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=		gcc
BUILD_BITS =		32_and_64
include ../../../make-rules/shared-macros.mk
BUILD_STYLE=            meson

COMPONENT_NAME=		gdk-pixbuf
COMPONENT_VERSION=	2.42.8
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GdkPixbuf
COMPONENT_ARCHIVE_HASH= \
     sha256:84acea3acb2411b29134b32015a5b1aaa62844b19c4b1ef8b8971c6b0759f4c6
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	9533

COMPONENT_BAID=		118905

COMPONENT_NAME_1=	gdk-pixbuf-xlib
COMPONENT_VERSION_1=	2.40.2
COMPONENT_PROJECT_URL_1=https://wiki.gnome.org/Projects/GdkPixbuf
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_URL_1=https://download.gnome.org/sources/gdk-pixbuf-xlib/2.40/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1= \
     sha256:8b8e1c270ec16a06f665ea841f8e4e167eaa0118d0cbfeeade43745f09198ff7
COMPONENT_BUGDB_1=	gnome/libraries
COMPONENT_ANITYA_ID_1=	229509
COMPONENT_BAID_1=	111708

SYSTEM_TEST_TARGET= $(SYSTEM_TESTS_NOT_IMPLEMENTED)

include $(WS_MAKE_RULES)/gnome-component.mk

# Workaround for build failures due to gdk-pixbuf Makefiles not passing CFLAGS
# or LDFLAGS, especially the -m32/64 flag, to g-ir-scanner
COMPONENT_BUILD_ENV += CFLAGS="$(strip $(CFLAGS))"
COMPONENT_BUILD_ENV += LDFLAGS="$(strip $(LDFLAGS))"

# Only gdk-pixbuf recognizes -Dintrospection=disabled, not gdk-pixbuf-xlib
DISABLE_INTROSPECTION = -Dintrospection=disabled
CONFIGURE_OPTIONS.32 += $(DISABLE_INTROSPECTION)
CONFIGURE_OPTIONS_1 = $(filter-out $(DISABLE_INTROSPECTION),$(CONFIGURE_OPTIONS))

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

COMPONENT_POST_INSTALL_ACTION.32 += \
        (cd $(COMPONENT_DIR)/$(COMPONENT_SRC_1); \
	$(ENV) $(CONFIGURE_ENV) meson setup ../build_32 . $(CONFIGURE_OPTIONS_1);  \
	$(COMPONENT_POST_CONFIGURE_ACTION) cd ../build_32; \
	$(ENV) $(COMPONENT_BUILD_ENV) $(NINJA) $(COMPONENT_BUILD_ARGS) \
		$(COMPONENT_BUILD_TARGETS); \
	$(ENV) $(COMPONENT_INSTALL_ENV) $(NINJA) $(COMPONENT_INSTALL_ARGS) \
		$(COMPONENT_INSTALL_TARGETS) install)

COMPONENT_POST_INSTALL_ACTION.64 += \
        (cd $(COMPONENT_DIR)/$(COMPONENT_SRC_1); \
	$(ENV) $(CONFIGURE_ENV) meson setup ../build_64 . $(CONFIGURE_OPTIONS_1);  \
	$(COMPONENT_POST_CONFIGURE_ACTION) cd ../build_64; \
	$(ENV) $(COMPONENT_BUILD_ENV) $(NINJA) $(COMPONENT_BUILD_ARGS) \
		$(COMPONENT_BUILD_TARGETS); \
	$(ENV) $(COMPONENT_INSTALL_ENV) $(NINJA) $(COMPONENT_INSTALL_ARGS) \
		$(COMPONENT_INSTALL_TARGETS) install)

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

# Standard automake test framework results transform
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

clean:: $(SUBDIRS)
	$(RM) -r build build_32 build_64

clobber:: $(SUBDIRS) clean

# Requires >= 2.69 autoconf
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
# Needed for minimal-fs dependency in pixbuf-loaders-installer.xml SMF manifest:
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
