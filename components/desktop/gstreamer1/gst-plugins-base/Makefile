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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
CTF_MODE =		off	# C++
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gst-plugins-base
COMPONENT_VERSION=	1.24.12
COMPONENT_PROJECT_URL=	https://gstreamer.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:f6efbaa8fea8d00bc380bccca76a530527b1f083e8523eafb3e9b1e18bc653d3
COMPONENT_ARCHIVE_URL=	https://gstreamer.freedesktop.org/src/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	1263

COMPONENT_BAID=		324177

BUILD_STYLE=		meson
PYTHON_VERSION = 3.11

include $(WS_MAKE_RULES)/common.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# needed for clutter-gst
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled
CONFIGURE_OPTIONS.64 += -Dintrospection=enabled

CONFIGURE_OPTIONS += -Dogg=enabled
CONFIGURE_OPTIONS += -Dtheora=enabled
CONFIGURE_OPTIONS += -Dvorbis=enabled
CONFIGURE_OPTIONS += -Dx11=enabled
CONFIGURE_OPTIONS += -Dexamples=disabled
CONFIGURE_OPTIONS += -Ddrm=disabled

# We EOF'ed libvisual - no need for generating visualizations for audio
CONFIGURE_OPTIONS += -Dlibvisual=disabled

# Requires GNU version of msgfmt...
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS)-$(MACH).master
COMPONENT_TEST_ARGS = -k 0
COMPONENT_TEST_ENV = -i

REQUIRED_PACKAGES += codec/libtheora
REQUIRED_PACKAGES += codec/libogg
REQUIRED_PACKAGES += codec/libvorbis
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/graphene
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/orc
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/sdl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxv
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/mesa
