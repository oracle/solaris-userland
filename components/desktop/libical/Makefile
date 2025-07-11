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
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libical
COMPONENT_VERSION=	3.0.18
COMPONENT_PROJECT_URL=	http://libical.github.io/libical/
COMPONENT_ARCHIVE_HASH= \
	sha256:72b7dc1a5937533aee5a2baefc990983b66b141dd80d43b51f80aced4aae219c
COMPONENT_ARCHIVE_URL=	https://github.com/$(COMPONENT_NAME)/$(COMPONENT_NAME)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	1637
COMPONENT_BAID=		180256

BUILD_STYLE= cmake

# Tests do not pass because of insufficient gsed filtering.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1 

# Use project's own optimisation flags instead.
gcc_OPT=

# Requires __EXTENSIONS__ for access to various non-standard time functions.
CFLAGS += -D__EXTENSIONS__
CXXFLAGS += -std=c++11 -D__EXTENSIONS__

CMAKE_OPTIONS += -DSHARED_ONLY=true
# Required for other components.
CMAKE_OPTIONS.32 += -DGOBJECT_INTROSPECTION=false
CMAKE_OPTIONS.64 += -DGOBJECT_INTROSPECTION=true
# Always use Solaris-provided timezone data.
CMAKE_OPTIONS += -DUSE_BUILTIN_TZDATA=false
CMAKE_OPTIONS.32 += -DICAL_GLIB=false
CMAKE_OPTIONS.64 += -DICAL_GLIB=true
CMAKE_OPTIONS.64 += -DICAL_GLIB_VAPI=true

# Workaround g-ir-scanner breakage.
LD_Z_IGNORE=

# Required for gobject-introspection invocation.
COMPONENT_BUILD_ENV += CC="$(CC)"
COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ENV += CXX="$(CXX)"
COMPONENT_BUILD_ENV += CXXFLAGS="$(CXXFLAGS)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master
COMPONENT_TEST_TARGETS = test

# Remove any color coding from the test output.
COMPONENT_TEST_ARGS += COLOR=no

# Enable libadimalloc or libumem (only ADI caught the heap-use-after-free case)
ISA_EXTENSIONS.64	= $(shell isainfo -x | grep '^$(MACH64):')
TEST_MEMCHECK_ENV.32	= LD_PRELOAD=libumem.so UMEM_DEBUG=default,verbose
ifeq ($(filter adi, $(ISA_EXTENSIONS.64)), adi)
TEST_MEMCHECK_ENV.64	= LD_PRELOAD_64=libadimalloc.so.1
TEST_MEMCHECK_ENV.64	+= ADIMALLOC_DEBUG=default,verbose,adi_precise
else
TEST_MEMCHECK_ENV.64	= $(TEST_MEMCHECK_ENV.32)
endif
TEST_MEMCHECK_ENV	= $(TEST_MEMCHECK_ENV.$(BITS))

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libical.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libical.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libicalss.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libicalss.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libicalvcal.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libicalvcal.3lib;

# Remove time measurements from results when comparing
COMPONENT_TEST_TRANSFORMS += '-e "s|  *[\.0-9]* sec||g" '

REQUIRED_PACKAGES += database/berkeleydb-5
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
