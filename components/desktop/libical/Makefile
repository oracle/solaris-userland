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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=		64_and_32
# For now, all things built for C++11 require gcc.
COMPILER= 		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libical
COMPONENT_VERSION=	1.0.1
COMPONENT_PROJECT_URL=	http://libical.github.io/libical/
COMPONENT_ARCHIVE_HASH= \
	sha256:089ce3c42d97fbd7a5d4b3c70adbdd82115dd306349c1f5c46a8fb3f8c949592
COMPONENT_ARCHIVE_URL=	https://github.com/$(COMPONENT_NAME)/$(COMPONENT_NAME)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	1637

TPNO=			24898

BUILD_STYLE= cmake
include $(WS_MAKE_RULES)/common.mk

# Use project's own optimisation flags instead.
gcc_OPT=

# Requires __EXTENSIONS__ for access to various non-standard time functions.
CFLAGS += -D__EXTENSIONS__
CXXFLAGS += -std=c++11 -D__EXTENSIONS__

CMAKE_OPTIONS += -DSHARED_ONLY=true
# Required for other components.
CMAKE_OPTIONS += -DGOBJECT_INTROSPECTION=true
# Always use Solaris-provided timezone data.
CMAKE_OPTIONS += -DUSE_BUILTIN_TZDATA=false

# Workaround g-ir-scanner breakage.
LD_Z_IGNORE=

# Required for gobject-introspection invocation.
COMPONENT_BUILD_ENV += CC="$(CC)"
COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ENV += CXX="$(CXX)"
COMPONENT_BUILD_ENV += CXXFLAGS="$(CXXFLAGS)"

# Tell g-ir-scanner not to cache results in homedir of user running the build
COMPONENT_BUILD_ENV += GI_SCANNER_DISABLE_CACHE=""

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TARGETS = test

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

# Check upstream test case from https://github.com/libical/libical/issues/253
COMPONENT_POST_TEST_ACTION += \
	(cd $(COMPONENT_TEST_DIR) ; \
	  printf 'Extra Test: parser-heap-use-after-free ...........   ' ; \
	  $(COMPONENT_TEST_ENV_CMD) $(COMPONENT_TEST_ENV) $(TEST_MEMCHECK_ENV) \
	  ./src/test/parser \
	  $(COMPONENT_DIR)/files/test-data/heap-use-after-free.ics \
	  >> /dev/null && print 'Passed' ) &>> $(COMPONENT_TEST_OUTPUT)

# Remove time measurements from results when comparing
COMPONENT_TEST_TRANSFORMS += '-e "s|[\.0-9]* sec||g" '

REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
