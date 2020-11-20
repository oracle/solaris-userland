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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 		32_and_64
COMPILER= 		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libproxy
COMPONENT_VERSION=	0.4.16
COMPONENT_PROJECT_URL=	https://libproxy.github.io/libproxy/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL= \
	https://github.com/libproxy/$(COMPONENT_NAME)/archive/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:9e7959d6ae1d6c817f0ac1e253105ce8d99f55d7821c1b6eaef32bf6879c6f0a
COMPONENT_BUGDB=	library/libproxy
COMPONENT_ANITYA_ID=	12742

TPNO=			63709

BUILD_STYLE= 		cmake
include $(WS_MAKE_RULES)/common.mk

CXXFLAGS += -std=c++11

PYTHON_VERSION=3.7

# Our Perl 5.22 is 64-bit, so don't deliver Perl bindings for 32-bit build.
CMAKE_OPTIONS.32 = -DWITH_PERL=OFF
CMAKE_OPTIONS.64 = -DWITH_PERL=ON

# Our Python 3.7 is 64-bit only, so don't deliver Python bindings for 32-bit build.
CMAKE_OPTIONS.32 = -DWITH_PYTHON3=OFF
CMAKE_OPTIONS.64 = -DWITH_PYTHON3=ON
CMAKE_OPTIONS.64 += -DPYTHON3_EXECUTABLE="$(PYTHON)"
CMAKE_OPTIONS.64 += -DPYTHON3_SITEPKG_DIR=$(PYTHON_LIB)

CMAKE_OPTIONS += -DINCLUDE_INSTALL_DIR="$(USRINCDIR)/$(COMPONENT_NAME)"
CMAKE_OPTIONS += -DPERL_VENDORINSTALL=ON
CMAKE_OPTIONS += -DPERL_EXECUTABLE=$(PERL)
CMAKE_OPTIONS += -DWITH_PYTHON2=OFF
CMAKE_OPTIONS += -DWITH_KDE=OFF
# Required for other components.
CMAKE_OPTIONS += -DWITH_GNOME3=ON
CMAKE_OPTIONS += -DWITH_VALA=ON
# Always build pacrunner as a module.
CMAKE_OPTIONS += -DBIPR=ON

LDFLAGS +=       $(LIBSOCKET) $(LIBNSL) $(LIBXNET)

# Assumes "make" is GNU make, turns into fork bomb if it finds Solaris make
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_POST_INSTALL_ACTION=	\
	[ $(BITS) -eq 64 ] && $(PYTHON) -m py_compile $(PROTO_DIR)/$(PYTHON_LIB)/libproxy.py || true

REQUIRED_PACKAGES += developer/build/autoconf
REQUIRED_PACKAGES += developer/build/automake
REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += developer/build/gnu-make
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/libdbus

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s/Passed .*/Passed/" '
COMPONENT_TEST_TRANSFORMS += '-e "/Total Test time/d" '
