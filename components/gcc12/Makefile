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
# Copyright (c) 2014, 2025, Oracle and/or its affiliates.
#
export PARFAIT_BUILD=no
BUILD_BITS =		64
COMPILER =		gcc
GCC_ROOT =		/usr/gcc/12
CTF_MODE =		off	# Breaks config

# Gcc 12 often fails when it is _not_ built in multiple parallel jobs. This can
# happen when full gate is built.
ifeq ($(strip $(COMPONENT_MAKE_JOBS)),1)
    COMPONENT_MAKE_JOBS=4
endif

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gcc
COMPONENT_VERSION=	12.5.0
COMPONENT_PROJECT_URL=	https://gcc.gnu.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:f2dfac9c026c58b04251732aa459db614ae1017d32a18a296b1ae5af3dcad927
COMPONENT_ARCHIVE_URL=	https://ftp.gnu.org/gnu/gcc/$(COMPONENT_SRC)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=        utility/gnu-compiler
COMPONENT_ANITYA_ID=	6502

COMPONENT_BAID=		336223

# Use gcc's default flags instead of userland's.
CFLAGS=
CPPFLAGS=
CXXFLAGS=

# Do not automatically run the unit tests since the results are not reproducible.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

PYTHON_VERSION = 3.11

# The GNU compiler wants the GNU utilities.
PATH=$(GNUBIN):$(USRBINDIR):$(USRDIR)/perl5/bin:$(GCC_ROOT)/bin

PARCH =         $(MACH:i386=x86_64-pc)
GNU_ARCH =      $(PARCH:sparc=sparcv9-sun)-solaris$(SOLARIS_VERSION)

PKG_MACROS +=   GNU_ARCH="$(GNU_ARCH)"

VERSION_NUMBERS = $(subst ., ,$(COMPONENT_VERSION))
GCC_VERSION=$(word 1,$(VERSION_NUMBERS)).$(word 2,$(VERSION_NUMBERS))
GCC_MAJOR_VERSION=$(word 1,$(VERSION_NUMBERS))
PKG_MACROS +=	GCC_MAJOR_VERSION=$(GCC_MAJOR_VERSION)
PKG_MACROS +=	GCC_VERSION=$(GCC_VERSION)
PKG_MACROS +=	GCC_BASEDIR=usr/gcc/$(GCC_MAJOR_VERSION)
ifeq ($(MACH),sparc)
PKG_MACROS +=	32BITS=sparcv8plus
else
PKG_MACROS +=	32BITS=32
endif

# direct binding causes various testsuite failures
LD_B_DIRECT=

# /usr/lib/ld/map.noexdata destroys Intel
LD_MAP_NOEXDATA.i386=

# /usr/lib/ld/map.noexbss destroys SPARC
LD_MAP_NOEXBSS.sparc=

# for some reason the fixincludes target fails with bash on Solaris.
CONFIG_SHELL = /bin/sh
MAKESHELL = /bin/sh
COMPONENT_BUILD_ENV += SHELL=$(CONFIG_SHELL)
COMPONENT_BUILD_ENV += MAKESHELL=$(MAKESHELL)

CONFIGURE_PREFIX =	/usr/gcc/$(GCC_MAJOR_VERSION)
CONFIGURE_INFODIR =	$(CONFIGURE_PREFIX)/share/info

# We are going to build the 64-bit version of the compiler and tools, but we
# want it to install in the normal .../{bin|lib}/... locations.  GCC will
# take care of building and putting 32/64 bit objects in the right place
# under there.
CONFIGURE_BINDIR.64 = $(CONFIGURE_PREFIX)/bin
CONFIGURE_LIBDIR.64 = $(CONFIGURE_PREFIX)/lib

CONFIGURE_OPTIONS +=	--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS +=	--libexecdir=$(CONFIGURE_PREFIX)/lib
CONFIGURE_OPTIONS +=	--enable-languages="ada,c,c++,fortran,go,objc"
CONFIGURE_OPTIONS +=	--enable-shared
CONFIGURE_OPTIONS +=	--enable-initfini-array
CONFIGURE_OPTIONS +=	--disable-rpath
CONFIGURE_OPTIONS +=	--with-system-zlib
CONFIGURE_OPTIONS +=	--with-build-config=no
CONFIGURE_OPTIONS +=	--without-gnu-ld --with-ld=$(USRBINDIR)/ld
CONFIGURE_OPTIONS +=	--with-gnu-as --with-as=$(GNUBIN)/as

# If the compiler used to build matches the compiler being built, there is no
# need for a 3 stage build.
ifneq ($(shell $(CC) --version | grep $(COMPONENT_VERSION)),)
CONFIGURE_OPTIONS +=    --disable-bootstrap
else
COMPONENT_BUILD_TARGETS=bootstrap
endif

CONFIGURE_OPTIONS +=	BOOT_CFLAGS='-g -O2'

# This is the target and it must be last
CONFIGURE_OPTIONS +=    $(GNU_ARCH)

# Don't use gnatbind/gnatmake from /usr/bin.
CONFIGURE_ENV     += GNATBIND="$(GCC_ROOT)/bin/gnatbind"
CONFIGURE_ENV     += GNATMAKE="$(GCC_ROOT)/bin/gnatmake"

CONFIGURE_ENV     += PYTHON="$(PYTHON)"

# compile python modules
COMPONENT_POST_INSTALL_ACTION = \
	( gfind $(PROTO_DIR)$(CONFIGURE_PREFIX) -name '*.py' | \
	  xargs -n 1 dirname | sort -u | \
	  xargs $(PYTHON) -m compileall )


COMPONENT_PRE_TEST_ENV += TCL_LIBRARY="$(USRLIBDIR)/tcl8.5"
COMPONENT_PRE_TEST_ENV += DEJAGNULIBS="$(USRSHAREDIR)/dejagnu"

#
# Run the tests and generate a summary report, then output the summary
# report into the results file. Note that list of reported tests is sorted
# to allow parallel test run.
#
# To ensure that all tests that are expected to pass actually
# pass, we have to increase the stacksize limit to at least
# 16MB. Otherwise we'll get spurious failures in the test
# harness (gcc.c-torture/compile/limits-exprparen.c and others).
# With the soft stacksize limit set to 16384 we get reasonably good
# test results.
#
COMPONENT_PRE_TEST_ACTION += \
	(cd $(COMPONENT_TEST_DIR) ; \
	 ulimit -Ss 16385 ; \
	 $(ENV) $(COMPONENT_PRE_TEST_ENV) \
	        $(GMAKE) -k -i $(JOBS:%=-j%) check check-target ; \
	 $(FIND) . -name  '*.sum' | while read f; do \
	        gsed -e '1,/^Running target unix/p' -e  'd' $f > $f.2; \
	        gsed -e '/^Running target unix/,/Summary ===$/p' -e  'd' $f | grep  '^.*: ' | sort -k 2 >> $f.2; \
	        gsed -e '/Summary ===$/,$p' -e  'd' $f >> $f.2; \
	        mv $f.2 $f; done; \
	 $(GMAKE) mail-report.log)

COMPONENT_TEST_CMD = $(CAT)
COMPONENT_TEST_TARGETS = mail-report.log
COMPONENT_TEST_TRANSFORMS += '-e "s| --disable-bootstrap||g" '

# Master test results are different between x86 and SPARC.
COMPONENT_TEST_MASTER = \
	$(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

license: install
	@echo "regenerating license text"
	cat $(SOURCE_DIR)/COPYING3 > $(COMPONENT_NAME).license
	for license in \
		$(SOURCE_DIR)/COPYING.RUNTIME \
		$(SOURCE_DIR)/COPYING \
		$(SOURCE_DIR)/COPYING3.LIB \
		$(SOURCE_DIR)/COPYING.LIB \
		../../licenses/FDLv1.3 \
		gmon.license \
		$(SOURCE_DIR)/libgo/LICENSE \
		$(SOURCE_DIR)/libcody/LICENSE \
	; do \
	  (echo '-----------------------------------------------------------------------------' && \
	  cat $$license) >> $(COMPONENT_NAME).license ; \
	done

# GCC ships some static libraries (.a).
MANIFEST_CLEANUP_TRANSFORM=

# We can not use PKG_AUTO_HARDLINKS because the generate files always expect
# given path to be either file or hardlink. The hardlinks are in several
# packages, which means that generate files would 'see' correctly only the
# hardlinks found in the currently processed p5m. We would have to change the
# generate files so that they accept both file and hardlink action for given
# path. But it is probably easier to just name the hardlinks manually.

PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/g++
PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/gcc
PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/gcc-ar
PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/gcc-nm
PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/gcc-ranlib
PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/gccgo
PKG_HARDLINKS += usr/gcc/$(GCC_MAJOR_VERSION)/bin/gfortran


REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += developer/gcc/gcc-gnat-12
REQUIRED_PACKAGES += developer/test/dejagnu
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/isl
REQUIRED_PACKAGES += library/mpc
REQUIRED_PACKAGES += library/mpfr
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/tcl-8
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
