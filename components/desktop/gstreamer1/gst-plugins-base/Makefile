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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gst-plugins-base
COMPONENT_VERSION=	1.16.2
COMPONENT_PROJECT_URL=	https://gstreamer.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:b13e73e2fe74a4166552f9577c3dcb24bed077021b9c7fa600d910ec6987816a
COMPONENT_ARCHIVE_URL=	https://gstreamer.freedesktop.org/src/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	1263

TPNO=			55664

PYTHON_VERSION = 3.7

# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

# Use the build area of gstreamer
GST_BASE = $(WS_COMPONENTS)/desktop/gstreamer1/gstreamer/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(GST_BASE)$(USRLIB)/pkgconfig/ 

CPPFLAGS += -I$(GST_BASE)/usr/include/gstreamer-1.0
LD_OPTIONS += -L $(GST_BASE)$(USRLIB)

$(CONFIGURE_32):	LDFLAGS += -m32

COMPONENT_BUILD_ENV += LD_LIBRARY_PATH_32="$(GST_BASE)$(USRLIB.$(BITS)):$(BUILD_DIR_32)/gst-libs/gst/audio/.libs:$(BUILD_DIR_32)/gst-libs/gst/video/.libs:$(BUILD_DIR_32)/gst-libs/gst/rtp/.libs:$(BUILD_DIR_32)/gst-libs/gst/rtsp/.libs:$(BUILD_DIR_32)/gst-libs/gst/pbutils/.libs:$(BUILD_DIR_32)/gst-libs/gst/allocators/.libs:$(BUILD_DIR_32)/gst-libs/gst/tag/.libs:$(BUILD_DIR_32)/gst-libs/gst/app/.libs:$(BUILD_DIR_32)/gst-libs/gst/sdp/.libs:$(BUILD_DIR_32)/gst-libs/gst/gl/.libs"
COMPONENT_BUILD_ENV += LD_LIBRARY_PATH_64="$(GST_BASE)$(USRLIB.$(BITS)):$(BUILD_DIR_64)/gst-libs/gst/audio/.libs:$(BUILD_DIR_64)/gst-libs/gst/video/.libs:$(BUILD_DIR_64)/gst-libs/gst/rtp/.libs:$(BUILD_DIR_64)/gst-libs/gst/rtsp/.libs:$(BUILD_DIR_64)/gst-libs/gst/pbutils/.libs:$(BUILD_DIR_64)/gst-libs/gst/allocators/.libs:$(BUILD_DIR_64)/gst-libs/gst/tag/.libs:$(BUILD_DIR_64)/gst-libs/gst/app/.libs:$(BUILD_DIR_64)/gst-libs/gst/sdp/.libs:$(BUILD_DIR_64)/gst-libs/gst/gl/.libs"

# needed for clutter-gst
CONFIGURE_OPTIONS.32 += --enable-introspection=no
CONFIGURE_OPTIONS.64 += --enable-introspection=yes

CFLAGS += -DHAVE_FIONREAD_IN_SYS_FILIO

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-ogg
CONFIGURE_OPTIONS += --enable-theora
CONFIGURE_OPTIONS += --enable-vorbis
CONFIGURE_OPTIONS += --with-x

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS += MAKE=$(GMAKE)

# The build process modifies the shebang line to use the version of Python
# automatically found; to avoid using the current system default, one is
# explicitly specified here.
CONFIGURE_ENV += PYTHON="$(PYTHON.3.7)"

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON_VENDOR_PACKAGES)

# Required due to patches.
COMPONENT_PREP_ACTION += ( cd $(@D) ; NOCONFIGURE=1 $(CONFIG_SHELL) autogen.sh );

# for the tests
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS)-$(MACH).master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '
# To prevent "libtool_install_magic: unbound variable"
unexport SHELLOPTS

REQUIRED_PACKAGES += codec/libtheora
REQUIRED_PACKAGES += codec/libogg
REQUIRED_PACKAGES += codec/libvorbis
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/graphene
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/libvisual
REQUIRED_PACKAGES += library/desktop/orc
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxv
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/mesa
