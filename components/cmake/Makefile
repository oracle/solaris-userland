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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
# Currently only builds with gcc
COMPILER =		gcc
export PARFAIT_BUILD =	no
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cmake
CMAKE_MAJOR_VERSION=	3.24
COMPONENT_VERSION=	$(CMAKE_MAJOR_VERSION).0
COMPONENT_ARCHIVE_HASH=	\
    sha256:c2b61f7cdecb1576cad25f918a8f42b8685d88a832fd4b62b9e0fa32e915a658
COMPONENT_ARCHIVE_URL=	http://www.cmake.org/files/v$(CMAKE_MAJOR_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  http://www.cmake.org/
COMPONENT_ANITYA_ID=	306

COMPONENT_BAID=		128604

# configure in cmake does not accept many of the options set in
# configure.mk (CC=, CXX=, --bindir, --libdir, --sbindir).
CONFIGURE_DEFAULT_DIRS= no

# expected failure for test: CTestTestUpload
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/common.mk

# Remove undesriable /opt/csw lines from the Modules/*.cmake files.
COMPONENT_PREP_ACTION += \
	cd $(COMPONENT_SRC)/Modules; $(GNU_GREP) -l '/opt/csw' *.cmake | /usr/bin/xargs -I \{\} $(GSED) -i -e '/^[ ]*\/opt\/csw/d' \{\}

# The default -O3 is *MUCH* too aggressive and will break things,
# not just in CMake but everywhere.
# CMake sets its own Language Standard flags in the Makefile it
# generates for itself. The Userland default Language Standard flags
# contradict cmake.
gcc_OPT = -O2

# Need to remove this option from LD_OPTIONS (only affects sparc build);
# it causes a SegFault failure in kwsys/testSystemInformation
# when testing on sparc
LD_MAP_NOEXBSS.sparc=

# map.noexbss has the side effect of making the heap non executable.
# Reflect the setting above explicitly disabling NXHEAP.
NXHEAP_MODE = $(NXHEAP_DISABLE)

LDFLAGS +=		$(LIBSOCKET) $(LIBNSL)

# We need these in the environment, although they are already passed
# as CONFIGURE_OPTIONS; otherwise the correct compilers are not used
CONFIGURE_ENV +=	MAKE="$(GMAKE)"
CONFIGURE_ENV +=	CFLAGS="$(CFLAGS)"
CONFIGURE_ENV +=	CXXFLAGS="$(CXXFLAGS)"
CONFIGURE_ENV +=	LDFLAGS="$(LDFLAGS)"

# Use system-installed third-party libraries, rather than the private
# copies in the cmake source.
CONFIGURE_OPTIONS =
CONFIGURE_OPTIONS +=	--prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS +=	--mandir=/share/man
CONFIGURE_OPTIONS +=	--sphinx-man
CONFIGURE_OPTIONS +=	--system-curl
CONFIGURE_OPTIONS +=	--system-expat
CONFIGURE_OPTIONS +=	--system-zlib
CONFIGURE_OPTIONS +=	--system-bzip2
CONFIGURE_OPTIONS +=	--system-libarchive
CONFIGURE_OPTIONS +=	--system-liblzma

COMPONENT_BUILD_ENV +=	CC="$(CC)"
COMPONENT_BUILD_ENV +=	CXX="$(CXX)"
COMPONENT_BUILD_ENV +=	LDFLAGS="$(LDFLAGS)"
COMPONENT_BUILD_ENV +=	MAKE="$(GMAKE)"
COMPONENT_BUILD_ENV +=	CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ENV +=	CXXFLAGS="$(CXXFLAGS)"
COMPONENT_BUILD_TARGETS =	all

# Pass cmake "major" version number to the publish phase to hopefully reduce
# the amount of change needed between each update.
PKG_MACROS+= CMAKE_MAJOR_VERSION=$(CMAKE_MAJOR_VERSION)

# The default version of gfortran compiler should correspond to gcc and g++ versions.
COMPONENT_TEST_ENV += FC="$(GCC_ROOT)/bin/gfortran"
# Disable term colors to avoid test failures (actual and expected output mismatch).
COMPONENT_TEST_ENV += CLICOLOR=0

COMPONENT_TEST_CMD = $(BUILD_DIR)/$(MACH64)/bin/ctest --output-on-failure
COMPONENT_TEST_TRANSFORMS += ' -n '
COMPONENT_TEST_TRANSFORMS += ' -e "/tests failed out of/p" '

# Add path to libgfortran.so.[0-9] library to avoid Fortran test failures.
# The library preload can be removed after bug 30144732 is fixed.
# Note that the library preload could also be removed if the mediator is
# set to the latest GCC version but it is safer to keep it since it would
# break again when a newer version of GNU compiler is added to CBE.
COMPONENT_TEST_ENV +=   LD_LIBRARY_PATH="$(GCC_ROOT)/lib/$(MACH64)/"

COMPONENT_SYSTEM_TEST_TARGETS =	test

# Built binaries are moved aside and replaced with
# symlinks to the system-installed binaries in /usr/bin,
# which will be executed for the system-test target
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	$(MV) $(BUILD_DIR_64)/bin $(BUILD_DIR_64)/bin-save; \
	$(MKDIR) $(BUILD_DIR_64)/bin; cd $(BUILD_DIR_64)/bin; \
	$(LN) -s $(USRBINDIR)/cmake; $(LN) -s /usr/bin/ctest; \
	$(LN) -s $(USRBINDIR)/ccmake; $(LN) -s /usr/bin/cpack

# Restore the built binaries after system-test is done
COMPONENT_POST_SYSTEM_TEST_ACTION += \
	$(RM) -r $(BUILD_DIR_64)/bin; \
	$(MV) $(BUILD_DIR_64)/bin-save $(BUILD_DIR_64)/bin

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += developer/documentation-tool/sphinx
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
