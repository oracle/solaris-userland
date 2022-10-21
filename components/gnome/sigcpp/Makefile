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

BUILD_BITS =            32_and_64
# For now, all things built for C++11 require gcc.
COMPILER =		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		sigcpp
COMPONENT_VERSION=	2.10.8
COMPONENT_PROJECT_URL=	https://developer.gnome.org/libsigc++/stable/
COMPONENT_SRC=		libsigc++-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_HASH= \
    sha256:235a40bec7346c7b82b6a8caae0456353dc06e71f14bc414bcc858af1838719a
COMPONENT_ARCHIVE_URL= https://download.gnome.org/sources/libsigc++/2.10/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	7961

COMPONENT_BAID=		131088
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CXXFLAGS += -std=c++11

CONFIGURE_OPTIONS += -Dbuild-documentation=true

# for the tests
unexport SHELLOPTS
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9]*[0-9].[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/Ok:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/desktop/c++/mm-common
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += $(PERL_PKG) 
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
