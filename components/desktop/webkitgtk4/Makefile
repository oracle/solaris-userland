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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#

# parfait is a bit unhappy (bug 24796572)
export PARFAIT_BUILD=no

BUILD_BITS= 64
# For now, all things built for C++17 require gcc; the cmake files for this
# project already specify the required -std.
COMPILER= gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		webkitgtk
COMPONENT_VERSION=	2.34.6
COMPONENT_PROJECT_URL=	https://webkitgtk.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:6bc8fd034aad0432a2459ce4fc7ee25ad65a4924c618bf8d93b52b0c1a84c1f6
COMPONENT_ARCHIVE_URL=	https://webkitgtk.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/webkitgtk
COMPONENT_ANITYA_ID=	5355

COMPONENT_BAID=		117102

# Use project's own optimization flags instead.
gcc_OPT=

# We don't have JHbuild needed for tests
TEST_TARGET= $(NO_TESTS)

BUILD_STYLE= cmake

# Once 27639813 is figured out this can be removed along with the change
# in prep-patch.mk for ADDITIONAL_PATCHES
ifeq ($(MACH), sparc)
ADDITIONAL_PATCHES += patches/build.sparc
ADDITIONAL_PATCHES += patches/mapfile.$(MACH)
LD_EXEC_OPTIONS += -M $(COMPONENT_DIR)/mapfile_sparc_48bits
endif
ifeq ($(MACH), i386)
ADDITIONAL_PATCHES += patches/mapfile.$(MACH)
endif

include $(WS_MAKE_RULES)/common.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# The sequential build is broken, use multiple build jobs to avoid the following error.
# *** No rule to make target 'JavaScriptCore-4.0.gir', needed by 'WebKit2-4.0.gir'.  Stop.
# See upstream bug: https://bugs.webkit.org/show_bug.cgi?id=195251
ifeq ($(COMPONENT_MAKE_JOBS),1)
COMPONENT_BUILD_ARGS += -j4
endif

PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))
LD_OPTIONS += $(LD_OPTIONS.$(BITS))
LDFLAGS +=  -Wl,-zgnu-version-script-compat

# This should have avoided the need for mapfile.$(MACH) above
# why its not working needs to be eventually figured out (bug 27639813)
LD_OPTIONS+=-zgnu-version-script-compat

# Enable a release build and GTK port.
CMAKE_OPTIONS += -DCMAKE_BUILD_TYPE=Release
CMAKE_OPTIONS += -DPORT=GTK
CMAKE_OPTIONS += -DUSE_SOUP2=ON

ifeq ($(MACH),sparc)
# Use system malloc to avoid crashes on SPARC (bugs 31513265 and 31433939).
CMAKE_OPTIONS += -DUSE_SYSTEM_MALLOC=ON
# Disable OpenGL to workaround rendering issues on SPARC (bug 31433578).
CMAKE_OPTIONS += -DUSE_GSTREAMER_GL=OFF
CMAKE_OPTIONS += -DENABLE_GLES2=OFF
CMAKE_OPTIONS += -DUSE_OPENGL=OFF
CMAKE_OPTIONS += -DENABLE_WEBGL=OFF
CMAKE_OPTIONS += -DUSE_OPENGL_OR_ES=OFF
endif

ifeq ($(MACH),i386)
# Prefer to use embedded bmalloc allocator on x86 platform.
CMAKE_OPTIONS += -DUSE_SYSTEM_MALLOC=OFF
endif

# OpenJPEG library is well tested, reasonable to enable it.
CMAKE_OPTIONS += -DUSE_OPENJPEG=ON
# Disabling for both architectures for now, otherwise x64 builds fail with
# offlineasm: No magic values found. Skipping assembly file generation.
CMAKE_OPTIONS += -DENABLE_JIT=OFF
# Sushi requires that introspection is enabled.
CMAKE_OPTIONS += -DENABLE_INTROSPECTION=ON
# Avoid to accidentally use ld.gold linker on Solaris.
CMAKE_OPTIONS += -DUSE_LD_GOLD=OFF
# Use a default python3 interpreter.
CMAKE_OPTIONS += -DPYTHON_EXECUTABLE=$(PYTHON)
# Solaris uses SMF and not systemd.
CMAKE_OPTIONS += -DUSE_SYSTEMD=OFF
# We need video playback support for gnome-welcome-tour.
CMAKE_OPTIONS += -DENABLE_VIDEO=ON
# Disable features we do not need for gnome desktop.
CMAKE_OPTIONS += -DENABLE_MINIBROWSER=OFF
CMAKE_OPTIONS += -DUSE_LIBHYPHEN=OFF
CMAKE_OPTIONS += -DUSE_WOFF2=OFF
CMAKE_OPTIONS += -DENABLE_SAMPLING_PROFILER=OFF
CMAKE_OPTIONS += -DENABLE_WEB_CRYPTO=OFF
CMAKE_OPTIONS += -DENABLE_MEDIA_SOURCE=OFF
CMAKE_OPTIONS += -DUSE_WPE_RENDERER=OFF
CMAKE_OPTIONS += -DENABLE_GAMEPAD=OFF
# Setup Solaris install paths...
CMAKE_OPTIONS += -DLIB_INSTALL_DIR="$(USRLIB)"
CMAKE_OPTIONS += -DLIBEXEC_INSTALL_DIR="$(USRLIB)"
CMAKE_OPTIONS += -DEXEC_INSTALL_DIR="$(USRBIN)"

# Expects GNU versions of utilities to be found in PATH (e.g. xgettext).
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Ensure cmake finds the matching 32/64-bit version of dependencies.
COMPONENT_BUILD_ENV += PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += developer/build/gnu-make
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += developer/gperf
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += image/library/openjpeg2
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
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libtasn1
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/spell-checking/enchant
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-37
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
