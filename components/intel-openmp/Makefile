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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

export PARFAIT_BUILD=no

BUILD_BITS =		64_and_32
COMPILER =		gcc
CTF_MODE =		off	# Has no effect

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME        = libomp
COMPONENT_VERSION     = 20151009
COMPONENT_SRC         = $(COMPONENT_NAME)_$(COMPONENT_VERSION)
COMPONENT_ARCHIVE     = $(COMPONENT_SRC)_oss.tgz
COMPONENT_ARCHIVE_HASH= \
         sha256:d4254420d0081c6844eb05237bab5e731e669a429a9c1c87e2e0221ccf0de6ac
COMPONENT_ARCHIVE_URL = http://www.openmprtl.org/sites/default/files/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL = http://www.openmprtl.org/
COMPONENT_BUGDB       = library/intel-openmp

COMPONENT_BAID = 29554

# There are no tests for this version of the Intel OpenMP Library
# OpenMP tests will be integrated in ${WS_TOP}/components/bots.
BUILD_STYLE = cmake
CMAKE_BUILD_TYPE = Release
TEST_TARGET = $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

export PATH=/usr/gnu/bin:$(GCC_ROOT)/bin:/usr/bin

PATCH_LEVEL := 0
DEBUG_BUILD := 0

CFLAGS += -fno-omit-frame-pointer
CFLAGS.gcc.i386  += -march=opteron -mtune=opteron
CFLAGS.gcc.sparc += -mtune=ultrasparc3 -mcpu=ultrasparc3
CFLAGS.gcc.sparc += -mvis2 -mhard-float -mno-unaligned-doubles
CFLAGS.gcc.sparc += -mimpure-text

OMP_STATS = off
GFLAG =
DFLAG = -DNDEBUG

ifeq ($(DEBUG_BUILD),1)
  OMP_STATS = on
  GFLAG = -g3
  DFLAG =
endif

# Because of the weird way in which libiomp wants to build itself,
# we can't pass a -std=<N> on compile line. This is done internally
# by the cmake configuration files.
# The Userland default flags for GCC are broken.
CFLAGS += $(GFLAG) $(DFLAG) -Wall
CFLAGS += -fkeep-static-consts -fno-strict-aliasing

CXXFLAGS += $(GFLAG) $(DFLAG) -Wall
CXXFLAGS += -fkeep-static-consts -fno-strict-aliasing
CXXFLAGS += -Wl,-z -Wl,relax=comdat

CPPFLAGS += -D__EXTENSIONS__=1 -DKMP_GOMP_COMPAT=1
CPPFLAGS += -DKMP_TDATA_GTID=1
LDFLAGS += -z ignore -z relax=comdat

LD_OPTIONS	= -z ignore -z relax=comdat

CMAKE_OPTIONS += -DCMAKE_MAKE_PROGRAM=$(GMAKE)
CMAKE_OPTIONS += -DCMAKE_SHARED_LIBRARY_SUFFIX=".so.5"
CMAKE_OPTIONS += -DPERL_EXECUTABLE=$(PERL)

CMAKE_OPTIONS += -DCMAKE_VERBOSE_MAKEFILE=1
CMAKE_OPTIONS += -DCOMPILER_SUPPORTS_QUAD_PRECISION=true
CMAKE_OPTIONS += -DDEBUG_BUILD=false
CMAKE_OPTIONS += -DLIBOMP_OMPT_SUPPORT=on

CMAKE_OPTIONS += -DLIBOMP_USE_ADAPTIVE_LOCKS=true
CMAKE_OPTIONS += -DLIBOMP_STATS=$(OMP_STATS)
CMAKE_OPTIONS += -DLIBOMP_FORTRAN_MODULES=true
CMAKE_OPTIONS += -DLIBOMP_VERSION=5
CMAKE_OPTIONS += -DLIBOMP_OMP_VERSION=41

COMPONENT_BUILD_ENV += LD_OPTIONS="$(LD_OPTIONS)"

# THe tarball extracts to 'libomp_oss' which doesn't match
# the name constructed in $(COMPONENT_SRC). We fix that here.
COMPONENT_POST_UNPACK_ACTION = \
      $(MV) libomp_oss $(COMPONENT_SRC)

REQUIRED_PACKAGES += developer/gcc/gcc-gfortran-13
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
