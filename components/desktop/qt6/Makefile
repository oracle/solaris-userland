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
# Copyright (c) 2019, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		relaxed	# Spotty coverage, C++

include ../../../make-rules/shared-macros.mk

MAJOR_VERSION=6.9
MICRO_VERSION=1

COMPONENT_NAME=		qt-everywhere
COMPONENT_VERSION=	$(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_PROJECT_URL=  https://qt.io/
COMPONENT_SRC=		$(COMPONENT_NAME)-src-$(MAJOR_VERSION).$(MICRO_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	sha256:364fde2d7fa42dd7c9b2ea6db3d462dd54f3869e9fd0ca0a0ca62f750cd8329b
COMPONENT_ARCHIVE_URL=	http://download.qt.io/official_releases/qt/$(MAJOR_VERSION)/$(COMPONENT_VERSION)/single/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/qt
COMPONENT_ANITYA_ID=	7927

COMPONENT_BAID=		332324

TEST_TARGET= $(SKIP_TEST)

include $(WS_MAKE_RULES)/common.mk

# Qt doesn't use cmake just for configuring but also for build and install.
build:: GMAKE = cmake
COMPONENT_BUILD_ARGS = --build . --parallel
COMPONENT_BUILD_TARGETS =
install:: GMAKE = cmake
COMPONENT_INSTALL_ARGS = --install .
COMPONENT_INSTALL_TARGETS = 
COMPONENT_INSTALL_ENV = DESTDIR=$(PROTO_DIR)

# X86: Optimize the instruction scheduling for Haswell (running on all x86-64 cpus).
OPT_FLAGS.i386 = -mtune=haswell
# SPARC: Optimize the build for the oldest supported CPU that boots Solaris 11.4.
OPT_FLAGS.sparc = -mcpu=ultrasparc3 -mtune=niagara4

CONFIGURE_OPTIONS  =  -opensource
CONFIGURE_OPTIONS +=  -confirm-license
CONFIGURE_OPTIONS +=  -release
CONFIGURE_OPTIONS +=  -platform solaris-g++-64

CONFIGURE_OPTIONS +=  -prefix /usr
CONFIGURE_OPTIONS +=  -bindir /usr/bin
CONFIGURE_OPTIONS +=  -libdir /usr/lib/$(MACH64)
CONFIGURE_OPTIONS +=  -plugindir /usr/lib/$(MACH64)/qt6/plugins
CONFIGURE_OPTIONS +=  -docdir /usr/share/qt6/doc
CONFIGURE_OPTIONS +=  -headerdir /usr/include/qt6
CONFIGURE_OPTIONS +=  -datadir /usr/share/qt6
CONFIGURE_OPTIONS +=  -translationdir /usr/share/qt6/translations

CONFIGURE_OPTIONS +=  -sysconfdir /etc/xdg
CONFIGURE_OPTIONS +=  -no-openssl
CONFIGURE_OPTIONS +=  -no-pch
CONFIGURE_OPTIONS +=  -no-rpath
CONFIGURE_OPTIONS +=  -no-use-gold-linker
CONFIGURE_OPTIONS +=  -DQMAKE_CC=$(CC)
CONFIGURE_OPTIONS +=  -DQMAKE_CXX=$(CXX)
CONFIGURE_OPTIONS +=  -DQMAKE_LINK=$(CXX)

CONFIGURE_OPTIONS +=  -system-zlib
CONFIGURE_OPTIONS +=  -system-libpng
CONFIGURE_OPTIONS +=  -system-libjpeg
CONFIGURE_OPTIONS +=  -system-harfbuzz
CONFIGURE_OPTIONS +=  -system-pcre
CONFIGURE_OPTIONS +=  -system-sqlite

CONFIGURE_OPTIONS +=  -skip qt3d
CONFIGURE_OPTIONS +=  -skip qtactiveqt
CONFIGURE_OPTIONS +=  -skip qtcharts
CONFIGURE_OPTIONS +=  -skip qtconnectivity
CONFIGURE_OPTIONS +=  -skip qtdatavis3d
CONFIGURE_OPTIONS +=  -skip qtdeclarative
CONFIGURE_OPTIONS +=  -skip qtdoc
CONFIGURE_OPTIONS +=  -skip qtgraphs
CONFIGURE_OPTIONS +=  -skip qtgrpc
CONFIGURE_OPTIONS +=  -skip qtquick3d
CONFIGURE_OPTIONS +=  -skip qtquick3dphysics
CONFIGURE_OPTIONS +=  -skip qtquickeffectmaker
CONFIGURE_OPTIONS +=  -skip qtimageformats
CONFIGURE_OPTIONS +=  -skip qtlocation
CONFIGURE_OPTIONS +=  -skip qtlottie
CONFIGURE_OPTIONS +=  -skip qtmqtt
CONFIGURE_OPTIONS +=  -skip qtnetworkauth
CONFIGURE_OPTIONS +=  -skip qtremoteobjects
CONFIGURE_OPTIONS +=  -skip qtquicktimeline
CONFIGURE_OPTIONS +=  -skip qtopcua
CONFIGURE_OPTIONS +=  -skip qtscxml
CONFIGURE_OPTIONS +=  -skip qtsensors
CONFIGURE_OPTIONS +=  -skip qtserialbus
CONFIGURE_OPTIONS +=  -skip qtserialport
CONFIGURE_OPTIONS +=  -skip qtspeech
CONFIGURE_OPTIONS +=  -skip qtvirtualkeyboard
CONFIGURE_OPTIONS +=  -skip qtwayland
CONFIGURE_OPTIONS +=  -skip qtwebchannel
CONFIGURE_OPTIONS +=  -skip qtwebengine
CONFIGURE_OPTIONS +=  -skip qtwebsockets
CONFIGURE_OPTIONS +=  -skip qtwebview
CONFIGURE_OPTIONS +=  -nomake examples
CONFIGURE_OPTIONS +=  -no-opengl
CONFIGURE_OPTIONS +=  -no-feature-sqlmodel
CONFIGURE_OPTIONS +=  -no-feature-itemmodeltester

# Workaround for QTBUG-113686
ifeq ($(MACH),i386)
COMPONENT_POST_CONFIGURE_ACTION += $(GSED) -i 's;LINK_LIBRARIES =;LINK_LIBRARIES = -lgcc ;' $(@D)/build.ninja ;
endif

COMPONENT_INSTALL_ENV += INSTALL_ROOT=$(PROTO_DIR)

REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxkbcommon
REQUIRED_PACKAGES += x11/library/xcb-util
