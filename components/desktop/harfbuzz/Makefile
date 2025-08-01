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

BUILD_BITS =		64_and_32

# For now, all things built for C++11 require gcc.
COMPILER = 		gcc
CTF_MODE =		off	# C++

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		harfbuzz
COMPONENT_VERSION=	8.4.0
COMPONENT_PROJECT_URL=	https://github.com/harfbuzz/harfbuzz
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:af4ea73e25ab748c8c063b78c2f88e48833db9b2ac369e29bd115702e789755e
COMPONENT_ARCHIVE_URL=	https://github.com/harfbuzz/harfbuzz/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/harfbuzz
COMPONENT_ANITYA_ID=	1299

COMPONENT_BAID=		163169

CXXFLAGS += -std=c++11

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += CC="$(CC) $(CC_BITS)"
CONFIGURE_ENV += MAKE=gmake

# Required by other components.
CONFIGURE_OPTIONS.32 += --disable-introspection
CONFIGURE_OPTIONS.64 += --enable-introspection
# Required by other components.
CONFIGURE_OPTIONS += --with-gobject
# Requires GNU-ABI compatible build of ICU.
CONFIGURE_OPTIONS += --with-icu
# Required by other components.
CONFIGURE_OPTIONS += --with-glib
# build the API documentation
CONFIGURE_OPTIONS += --enable-gtk-doc

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i

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
