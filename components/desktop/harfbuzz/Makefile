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

BUILD_BITS=		64_and_32

# For now, all things built for C++11 require gcc.
COMPILER= 		gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		harfbuzz
COMPONENT_VERSION=	2.3.1
COMPONENT_PROJECT_URL=	http://www.freedesktop.org/wiki/Software/HarfBuzz/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:f205699d5b91374008d6f8e36c59e419ae2d9a7bb8c5d9f34041b9a5abcae468
COMPONENT_ARCHIVE_URL=	http://www.freedesktop.org/software/harfbuzz/release/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/harfbuzz
COMPONENT_ANITYA_ID=	1299

TPNO=			49826

CXXFLAGS += -std=c++11

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += CC="$(CC) $(CC_BITS)"

# Required by other components.
CONFIGURE_OPTIONS += --enable-introspection
# Required by other components.
CONFIGURE_OPTIONS += --with-gobject
# Requires GNU-ABI compatible build of ICU.
CONFIGURE_OPTIONS += --with-icu
# Required by other components.
CONFIGURE_OPTIONS += --with-glib
# build the API documentation
CONFIGURE_OPTIONS += --enable-gtk-doc

# For components using gobject-introspection, don't cache results in $HOME
COMPONENT_BUILD_ENV += GI_SCANNER_DISABLE_CACHE=yes

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i

# We unset SHELLOPTS to avoid 'unbound variable' errors during the tests.
unexport SHELLOPTS

COMPONENT_TEST_ENV = PATH=/usr/gnu/bin:/usr/bin
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/XFAIL:/p" ' \
        '-e "/XERROR:/p" ' \
        '-e "/ERROR:/p" '

REQUIRED_PACKAGES += developer/build/autoconf
REQUIRED_PACKAGES += developer/build/automake
REQUIRED_PACKAGES += developer/build/gnu-make
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/icu
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
