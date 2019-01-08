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
# Copyright (c) 2015, 2019, Oracle and/or its affiliates. All rights reserved.
#

# parfait is a bit unhappy (24796572)
export PARFAIT_BUILD=no

BUILD_BITS= 64
# For now, all things built for C++11 require gcc; the cmake files for this
# project already specify the required -std.
COMPILER= gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		webkitgtk
COMPONENT_VERSION=	2.22.5
COMPONENT_PROJECT_URL=	https://webkitgtk.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:99d3863f418a7c3a3e37e5062950dbf2d91fb106ec1633459b0ef6f2d5f6cb13
COMPONENT_ARCHIVE_URL=	https://webkitgtk.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/webkitgtk
COMPONENT_ANITYA_ID=	5355

TPNO=			48118

# Use project's own optimization flags instead.
gcc_OPT=

# We don't have JHbuild needed for tests
TEST_TARGET= $(NO_TESTS)

BUILD_STYLE= cmake

# Once 27639813 is figured out this can be removed along with the change
# in prep-patch.mk for ADDITIONAL_PATCHES
ifeq ($(MACH), sparc)
ADDITIONAL_PATCHES += patches/mapfile.$(MACH)
endif
ifeq ($(MACH), i386)
ADDITIONAL_PATCHES += patches/mapfile.$(MACH)
endif

include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ARGS += -j4

PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))
LD_OPTIONS += $(LD_OPTIONS.$(BITS))
LDFLAGS +=  -Wl,-zgnu-version-script-compat

# This should have avoided the need for mapfile.$(MACH) above
# why its not working needs to be eventually figured out (27639813)
LD_OPTIONS+=-zgnu-version-script-compat

# Required to ensure expected defines are set; also, ensures project's
# optimisation level set appropriately.  Would prefer RelWithDebInfo, but that
# target is curently broken.
CMAKE_OPTIONS += -DCMAKE_BUILD_TYPE=Release
CMAKE_OPTIONS += -DENABLE_MINIBROWSER=ON
CMAKE_OPTIONS += -DPORT=GTK
CMAKE_OPTIONS += -DENABLE_GLES2=OFF
CMAKE_OPTIONS += -DUSE_GSTREAMER_GL=OFF
CMAKE_OPTIONS += -DUSE_LIBHYPHEN=OFF
CMAKE_OPTIONS += -DUSE_WOFF2=OFF
CMAKE_OPTIONS += -DENABLE_SAMPLING_PROFILER=OFF
CMAKE_OPTIONS += -DENABLE_SUBTLE_CRYPTO=OFF
CMAKE_OPTIONS += -DENABLE_MEDIA_SOURCE=OFF
CMAKE_OPTIONS += -DUSE_SYSTEM_MALLOC=OFF

# Disabling for both architectures for now, otherwise x64 builds fail with
# offlineasm: No magic values found. Skipping assembly file generation.
CMAKE_OPTIONS += -DENABLE_JIT=OFF

CMAKE_OPTIONS += -DLIB_INSTALL_DIR="$(USRLIB)"
CMAKE_OPTIONS += -DLIBEXEC_INSTALL_DIR="$(USRLIB)"
CMAKE_OPTIONS += -DEXEC_INSTALL_DIR="$(USRBIN)"

# Tell g-ir-scanner not to cache results in homedir of user running the build
COMPONENT_BUILD_ENV += GI_SCANNER_DISABLE_CACHE=""

# Expects GNU versions of utilities to be found in PATH (e.g. xgettext).
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Ensure cmake finds the matching 32/64-bit version of dependencies.
COMPONENT_BUILD_ENV += PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"

COMPONENT_PRE_BUILD_ACTION += cd $(@D);
COMPONENT_PRE_BUILD_ACTION += echo Running cmake with $(CMAKE_OPTIONS);
COMPONENT_PRE_BUILD_ACTION += $(ENV) $(COMPONENT_BUILD_ENV) $(CMAKE) . $(CMAKE_OPTIONS);

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += developer/build/gnu-make
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += developer/gperf
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/desktop/libnotify
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/spell-checking/enchant
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += runtime/ruby
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/libxdamage
REQUIRED_PACKAGES += x11/library/mesa
