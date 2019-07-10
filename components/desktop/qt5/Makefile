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
# Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS=64
COMPILER=gcc

include ../../../make-rules/shared-macros.mk

MAJOR_VERSION=5.12
MICRO_VERSION=3

COMPONENT_NAME=		qt-everywhere
COMPONENT_VERSION=	$(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_PROJECT_URL=  https://qt.io/
COMPONENT_SRC=		$(COMPONENT_NAME)-src-$(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	sha256:6462ac74c00ff466487d8ef8d0922971aa5b1d5b33c0753308ec9d57711f5a42
COMPONENT_ARCHIVE_URL=	http://download.qt.io/official_releases/qt/$(MAJOR_VERSION)/$(COMPONENT_VERSION)/single/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/qt
COMPONENT_ANITYA_ID=	7927

TPNO=			52053

CONFIGURE_DEFAULT_DIRS=no

include $(WS_MAKE_RULES)/common.mk

# X86: Optimize the instruction scheduling for Haswell (running on all x86-64 cpus).
# SPARC: Optimize the build for the oldest supported CPU that boots Solaris 11.4.
OPT_FLAGS.i386 = -mtune=haswell
OPT_FLAGS.sparc = -mcpu=niagara4

CONFIGURE_OPTIONS  =  -opensource
CONFIGURE_OPTIONS +=  -confirm-license
CONFIGURE_OPTIONS +=  -release
CONFIGURE_OPTIONS +=  -platform solaris-g++-64

CONFIGURE_OPTIONS +=  -prefix /usr
CONFIGURE_OPTIONS +=  -bindir /usr/bin
CONFIGURE_OPTIONS +=  -libdir /usr/lib/$(MACH64)
CONFIGURE_OPTIONS +=  -plugindir /usr/lib/$(MACH64)/qt5/plugins
CONFIGURE_OPTIONS +=  -docdir /usr/share/qt5/doc
CONFIGURE_OPTIONS +=  -headerdir /usr/include/qt5
CONFIGURE_OPTIONS +=  -datadir /usr/share/qt5
CONFIGURE_OPTIONS +=  -translationdir /usr/share/qt5/translations

CONFIGURE_OPTIONS +=  -sysconfdir /etc/xdg
CONFIGURE_OPTIONS +=  -no-rpath
CONFIGURE_OPTIONS +=  -no-use-gold-linker
CONFIGURE_OPTIONS +=  QMAKE_CXXFLAGS+="$(CXXFLAGS) $(CC_PIC) $(OPT_FLAGS.$(MACH))"
CONFIGURE_OPTIONS +=  QMAKE_CFLAGS+="$(CFLAGS) $(CC_PIC) $(OPT_FLAGS.$(MACH))"

CONFIGURE_OPTIONS +=  -system-zlib
CONFIGURE_OPTIONS +=  -system-libpng
CONFIGURE_OPTIONS +=  -system-libjpeg
CONFIGURE_OPTIONS +=  -system-harfbuzz
CONFIGURE_OPTIONS +=  -system-pcre
CONFIGURE_OPTIONS +=  -system-sqlite

CONFIGURE_OPTIONS +=  -skip qt3d
CONFIGURE_OPTIONS +=  -skip qtactiveqt
CONFIGURE_OPTIONS +=  -skip qtandroidextras
CONFIGURE_OPTIONS +=  -skip qtcanvas3d
CONFIGURE_OPTIONS +=  -skip qtcharts
CONFIGURE_OPTIONS +=  -skip qtconnectivity
CONFIGURE_OPTIONS +=  -skip qtdatavis3d
CONFIGURE_OPTIONS +=  -skip qtdeclarative
CONFIGURE_OPTIONS +=  -skip qtgamepad
CONFIGURE_OPTIONS +=  -skip qtgraphicaleffects
CONFIGURE_OPTIONS +=  -skip qtimageformats
CONFIGURE_OPTIONS +=  -skip qtlocation
CONFIGURE_OPTIONS +=  -skip qtmacextras
CONFIGURE_OPTIONS +=  -skip qtnetworkauth
CONFIGURE_OPTIONS +=  -skip qtpurchasing
CONFIGURE_OPTIONS +=  -skip qtquickcontrols
CONFIGURE_OPTIONS +=  -skip qtquickcontrols2
CONFIGURE_OPTIONS +=  -skip qtremoteobjects
CONFIGURE_OPTIONS +=  -skip qtscript
CONFIGURE_OPTIONS +=  -skip qtscxml
CONFIGURE_OPTIONS +=  -skip qtsensors
CONFIGURE_OPTIONS +=  -skip qtserialbus
CONFIGURE_OPTIONS +=  -skip qtserialport
CONFIGURE_OPTIONS +=  -skip qtspeech
CONFIGURE_OPTIONS +=  -skip qtvirtualkeyboard
CONFIGURE_OPTIONS +=  -skip qtwayland
CONFIGURE_OPTIONS +=  -skip qtwebchannel
CONFIGURE_OPTIONS +=  -skip qtwebengine
CONFIGURE_OPTIONS +=  -skip qtwebglplugin
CONFIGURE_OPTIONS +=  -skip qtwebsockets
CONFIGURE_OPTIONS +=  -skip qtwebview
CONFIGURE_OPTIONS +=  -skip qtwinextras
CONFIGURE_OPTIONS +=  -skip qtx11extras
CONFIGURE_OPTIONS +=  -skip qtxmlpatterns
CONFIGURE_OPTIONS +=  -nomake examples
CONFIGURE_OPTIONS +=  -no-opengl
CONFIGURE_OPTIONS +=  -no-feature-sqlmodel
CONFIGURE_OPTIONS +=  -no-feature-itemmodeltester

COMPONENT_INSTALL_ENV += INSTALL_ROOT=$(PROTO_DIR)

REQUIRED_PACKAGES += database/sqlite-3
# Clang is a build and runtime dependency of qdoc binary,
# i.e., a tool to generate documentation from source files.
REQUIRED_PACKAGES += developer/llvm/clang
REQUIRED_PACKAGES += developer/llvm/clang-build
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
# Qt5 requires gtk3 to support GTK style and theme, e.g.,
# open/save dialog in Wireshark uses GTK style.
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-35
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += text/texinfo
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxkbcommon
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/xcb-util
