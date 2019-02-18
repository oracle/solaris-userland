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
export PARFAIT_BUILD=no
BUILD_BITS=64
COMPILER=gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		llvm
COMPONENT_VERSION=	6.0.1
COMPONENT_PROJECT_URL=	https://llvm.org/
COMPONENT_SRC=		$(COMPONENT_NAME)
COMPONENT_BUGDB=	utility/llvm

COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_SRC_NAME=	$(COMPONENT_SRC).src
COMPONENT_ARCHIVE=	$(COMPONENT_SRC_NAME).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:b6d6c324f9c71494c0ccaf3dac1f16236d970002b42bb24a6c9e1634f7d0f4e2
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	1830

TPNO=			45099

COMPONENT_NAME_1 =	clang
COMPONENT_SRC_1 =	cfe-$(COMPONENT_VERSION).src
COMPONENT_ARCHIVE_1 =	$(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_HASH_1 = \
	sha256:7c243f1485bddfdfedada3cd402ff4792ea82362ff91fbdac2dae67c6026b667
COMPONENT_ARCHIVE_URL_1 = $(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1=	$(COMPONENT_ARCHIVE_URL_1).sig
COMPONENT_ANITYA_ID_1=	11811

COMPONENT_POST_UNPACK_ACTION = \
       ( $(MV) $(COMPONENT_SRC_NAME) $(COMPONENT_SRC) )

COMPONENT_POST_UNPACK_ACTION_1 = \
	 ( $(RM) -rf $(COMPONENT_SRC)/tools/$(COMPONENT_NAME_1) ; \
	 $(CP) -rp $(COMPONENT_SRC_1) \
	    $(COMPONENT_SRC)/tools/$(COMPONENT_NAME_1) )

BUILD_STYLE = cmake
# Building with debug info results in ~7GB of package data, so while preferred,
# is not practical.
CMAKE_BUILD_TYPE = Release
CLONEY = echo
TEST_TARGET=
SYSTEM_TEST_TARGET=
include $(WS_MAKE_RULES)/common.mk

PATCH_LEVEL := 0
DEBUG_BUILD := 0
HAVE_SPHINX := 0

export PATH=/usr/gnu/bin:/usr/bin:/usr/perl5/$(PERL_VERSION)/bin

# We need the specific C++ runtime that clang/llvm was built and
# linked with, and not some random and incompatible stuff from
# /usr/lib.
LLVM_RUNPATH_32 = $(GCC_ROOT)/lib
LLVM_RUNPATH_64 = $(GCC_ROOT)/lib/$(MACH64)
LLVM_RUNPATH = $(LLVM_RUNPATH_$(BITS))

ifeq ($(DEBUG_BUILD), 1)
  CMAKE_BUILD_TYPE = Debug
  GFLAG=-g3
else
  GFLAG=
endif

# Because LLVM's install target doesn't install everything that
# needs to be installed.
EXTRA_INSTALL_BITS=llvm-lto arcmt-test c-arcmt-test c-index-test diagtool
LLVM_INSTALL_BINDIR=$(PROTOUSRBINDIR)
LLVM_BINDIR=$(BUILD_DIR_$(BITS))/bin

INSTALL_CXA_FINALIZE := 0

SCAN_VIEW_FILES=Reporter.py ScanView.py
CLANG_FORMAT_FILES=clang-format-diff.py clang-format-sublime.py \
		   clang-format.py
LLVM_MAN_FILES=FileCheck.1 bugpoint.1 clang.1 lit.1 llc.1 lli.1 \
	       llvm-ar.1 llvm-as.1 llvm-bcanalyzer.1 llvm-build.1 \
	       llvm-config.1 llvm-cov.1 llvm-diff.1 llvm-dis.1 \
	       llvm-dwarfdump.1 llvm-extract.1 llvm-lib.1 llvm-link.1 \
	       llvm-nm.1 llvm-profdata.1 llvm-readobj.1 llvm-stress.1 \
	       llvm-symbolizer.1 opt.1 tblgen.1

COMPONENT_POST_BUILD_ACTION = \
      if test -d $(COMPONENT_DIR)/cxa_finalize ; then \
      $(GMAKE) -C $(COMPONENT_DIR)/cxa_finalize build ; \
      fi

COMPONENT_POST_INSTALL_ACTION = \
	if test -d $(COMPONENT_DIR)/cxa_finalize ; then \
	$(GMAKE) -C $(COMPONENT_DIR)/cxa_finalize install ; \
	fi;

COMPONENT_POST_INSTALL_ACTION += \
	list1='$(EXTRA_INSTALL_BITS)' ; for f in $$list1 ; do \
	    $(INSTALL) --mode=755 $(LLVM_BINDIR)/$$f \
			$(LLVM_INSTALL_BINDIR)/$$f ; \
	done ;

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) \
	  $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages ; \
	list2='$(SCAN_VIEW_FILES)' ; for f in $$list2 ; do \
	$(INSTALL) --mode=644 $(PROTOUSRSHAREDIR)/scan-view/$$f \
	  $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/$$f ; \
	done ;

COMPONENT_POST_INSTALL_ACTION += \
	list3='$(CLANG_FORMAT_FILES)' ; for f in $$list3 ; do \
	  $(INSTALL) --mode=644 $(PROTOUSRSHAREDIR)/clang/$$f \
	    $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/$$f ; \
	done ;

COMPONENT_POST_INSTALL_ACTION += \
	cd $(PROTOUSRLIBDIR) ; \
	$(PYTHON) -m compileall . ;

COMPONENT_POST_INSTALL_ACTION += \
	cd $(COMPONENT_DIR) ; \
	$(MKDIR) $(PROTOUSRSHAREMAN1DIR) ; \
	list4='$(LLVM_MAN_FILES)' ; for f in $$list4 ; do \
	  $(INSTALL) --mode=644 $(COMPONENT_DIR)/Solaris/man1/$$f \
	    $(PROTOUSRSHAREMAN1DIR)/$$f ; \
	done ;

ifeq ($(INSTALL_CXA_FINALIZE),1)
COMPONENT_POST_INSTALL_ACTION += \
	$(INSTALL) --mode=644 \
	  $(COMPONENT_DIR)/cxa_finalize/cxa_finalize-32.o \
	  $(PROTOUSRLIBDIR)/clang/cxa_finalize.o ; \
	$(INSTALL) --mode=644 \
	  $(COMPONENT_DIR)/cxa_finalize/cxa_finalize_pic-32.o \
	  $(PROTOUSRLIBDIR)/clang/cxa_finalize_pic.o ; \
	$(INSTALL) --mode=644 \
	  $(COMPONENT_DIR)/cxa_finalize/cxa_finalize-64.o \
	  $(PROTOUSRLIBDIR)/clang/$(MACH64)/cxa_finalize.o ; \
	$(INSTALL) --mode=644 \
	  $(COMPONENT_DIR)/cxa_finalize/cxa_finalize_pic-64.o \
	  $(PROTOUSRLIBDIR)/clang/$(MACH64)/cxa_finalize_pic.o ;
endif

# Remove RPATH pointing to build area
COMPONENT_POST_INSTALL_ACTION += \
	for f in arcmt-test c-index-test c-arcmt-test diagtool llvm-lto; do \
	$(ELFEDIT) -e "dyn:runpath $(LLVM_RUNPATH_64)" \
	  $(PROTOUSRBINDIR)/$$f; done

# Results output is slightly different on Intel vs. SPARC.
COMPONENT_TEST_MASTER = \
	$(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH64).master

# Do not change the order of these regexp transforms.
COMPONENT_TEST_TRANSFORMS += \
    '-e "s/^Testing Time: .*$$/Test results:/" ' \
    '-e "/^Test results:/,/Unexpected Failures:/p" ' \
    '-e "/.*/d" '

# -fstack-protector-all:
# Enable stack smashing (stack corruption) protection and detection.
# This flag should always be used in conjunction with -Wstack-protector.
# -Wstack-protector acts at compile-time, -fstack-protector-all acts
# at runtime. -fstack-protector-all enables linking with libssp.so.
# This flag carries significant runtime overhead, but is very useful.
# Always enabled for now. May be removed in the future.
#
# -g3: Enable macro visibility in GDB. With just -g, debug builds will
# not record the expanded values of macros. With -g3, the values of
# expanded macros will be recorded, and macros will be observable in
# GDB.
#
# -mno-unaligned-doubles:
# Assume that the code does not make use of misaligned doubles on SPARC.
# On SPARC, doubles must align on 8. This flag makes GCC assume that
# there is no misaligned double use in the code, and GCC will not
# attempt to correct such misaligned loads/stores. If, however, there
# is such broken code when using this flag, the program will SIGBUS
# at runtime. This is a very useful debugging flag.
#
# -mhard-float:
# Use hardware floating-point operations when available. Compilers
# generally make very little use of floating-point, but this is
# a valuable/low-cost optimization for those rare cases where
# floating-point operations are used. No-op for quad-floating-point
# and UltraSPARC-1/2/3 because on those ISA's quad-floating-point
# ops are always done in software. But quad-floating-point ops in a
# compiler are virtually non-existent.
#
# -mimpure-text:
# When used in addition to -shared on SPARC, this tells GCC to not pass
# -z text to the linker when linking a shared object.
# There is some suspicious interaction happening here between GCC/GAS
# and the Sun linker. Technically, and in theory, this flag should not
# be needed when compiling -fPIC. However, extensive documented use
# and practice has shown that it is indeed needed. The disadvantage
# of using this flag is that it triggers copy-on-write relocations.
#
# -mno-sse3 -mno-ssse3:
# Do not use SSE3/SSSE3 instructions on Intel. These might not be
# available and they always come with side-effects.
# Building for Opteron - which implies SSE2 - is adequate for
# performance purposes.

CFLAGS += $(GFLAG) -pthread -std=c99 -fno-strict-aliasing
CFLAGS += -Wall -Wcast-align -Wno-long-long -Woverflow
CFLAGS += -Wstack-protector -fdata-sections -fstack-protector-all
CFLAGS += -fkeep-static-consts -ffunction-sections
# Never omit frame pointer; not worth the very minor performance gains for the
# loss of debugging capability.  Additionally, on sparc, omitting the frame
# pointer also currently causes bad code generation by gcc (4.x, 5.x):
#
#	Many sparc testcases FAIL at -O0 with -fomit-frame-pointer
#	https://gcc.gnu.org/bugzilla/show_bug.cgi?id=79749
#
CFLAGS += -fno-omit-frame-pointer
CFLAGS += -Wl,-z -Wl,relax=common
CFLAGS += -Wl,-z -Wl,relax=secadj
CFLAGS += -Wl,-z -Wl,relax=transtls
CFLAGS += -Wl,-z -Wl,relax=symbound
CFLAGS += -Wl,-R -Wl,$(LLVM_RUNPATH)
CFLAGS.gcc.i386 += -mtune=opteron -mno-sse3 -mno-ssse3 -fno-common 

# At optimization levels above O0, gcc can either crash or generates unusable
# code on SPARC.  Disabling delay-slot instruction scheduling avoids this
# problem.
CFLAGS.gcc.sparc += -fno-delayed-branch
CFLAGS.gcc.sparc += -mtune=ultrasparc -mcpu=ultrasparc -mvis -mhard-float
CFLAGS.gcc.sparc += -fdata-sections -falign-functions=8
CFLAGS.gcc.sparc += -mno-unaligned-doubles -mimpure-text

CXXFLAGS += $(CFLAGS.$(COMPILER).$(MACH))
CXXFLAGS += $(GFLAG) -pthread -fno-strict-aliasing
CXXFLAGS += -fexceptions -frtti -fstack-protector-all
CXXFLAGS += -Wall -Wcast-align -Wno-long-long -Woverflow
CXXFLAGS += -Wstack-protector -fkeep-static-consts
CXXFLAGS += -std=c++11 -fdata-sections -ffunction-sections
CXXFLAGS += -Wl,-z -Wl,relax=common
CXXFLAGS += -Wl,-z -Wl,relax=secadj
CXXFLAGS += -Wl,-z -Wl,relax=transtls
CXXFLAGS += -Wl,-z -Wl,relax=symbound
CXXFLAGS += -Wl,-z -Wl,relax=comdat
CXXFLAGS += -Wl,-z -Wl,gnu-version-script-compat
CXXFLAGS += -Wl,-R -Wl,$(LLVM_RUNPATH)

CPPFLAGS += -D_GNU_SOURCE -DLLVM_SOLARIS -I/usr/gnu/include

ifeq ($(DEBUG_BUILD),1)
  CPPFLAGS += -D_DEBUG
endif

CPPFLAGS += -D_REENTRANT -D_LARGEFILE64_SOURCE
CPPFLAGS += -D_FILE_OFFSET_BITS=64 -D__EXTENSIONS__=1
CPPFLAGS += -D__STDC_CONSTANT_MACROS -D__STDC_FORMAT_MACROS
CPPFLAGS += -D__STDC_LIMIT_MACROS -DHAVE_POSIX_MEMALIGN
CPPFLAGS += -D_GLIBCXX_FULLY_DYNAMIC_STRING=1
CPPFLAGS.i386 = -DLLVM_INTEL
CPPFLAGS.sparc = -DLLVM_SPARC
CPPFLAGS += $(CPPFLAGS.$(MACH))

LIBFFI_INCDIR_32 = $(shell pkg-config --cflags-only-I libffi | sed -e s,-I,,)
LIBFFI_INCDIR_64 = $(shell env PKG_CONFIG_PATH=$(PKG_CONFIG_PATH.64) pkg-config --cflags-only-I libffi | sed -e s,-I,,)
LIBFFI_INCDIR = $(LIBFFI_INCDIR_$(BITS))

LIBFFI_LIBDIR_32 = /usr/lib
LIBFFI_LIBDIR_64 = /usr/lib/$(MACH64)
LIBFFI_LIBDIR = $(LIBFFI_LIBDIR_$(BITS))

# -Bdirect and -M /usr/lib/ld/map.noexbss break SPARC builds.
LD_B_DIRECT =
LD_OPTIONS = -M /usr/lib/ld/map.noexstk
LD_OPTIONS += -M /usr/lib/ld/map.pagealign
LD_OPTIONS_SO = $(LD_Z_DEFS) $(LD_DEF_LIBS)

# The default target triple must be set so that the OS release is included by
# default as LLVM will use this to find the installed gcc internal libraries
# and headers (e.g.  /usr/gcc/5/lib/gcc/sparcv9-sun-solaris2.11/5.5.0/).  This
# also means that when specifying a --target to clang, developers must also
# include the OS release (e.g. --target=sparcv9-sun-solaris2.11).
ifeq ($(MACH),sparc)
  CMAKE_OPTIONS += -DLLVM_TARGETS_TO_BUILD:STRING="Sparc"
  CMAKE_OPTIONS += -DLLVM_DEFAULT_TARGET_TRIPLE:STRING="sparcv9-sun-solaris$(SOLARIS_VERSION)"
endif
ifeq ($(MACH),i386)
  CMAKE_OPTIONS += -DLLVM_TARGETS_TO_BUILD:STRING="X86"
  CMAKE_OPTIONS += -DLLVM_DEFAULT_TARGET_TRIPLE:STRING="x86_64-pc-solaris$(SOLARIS_VERSION)"
endif

CMAKE_OPTIONS += -DCMAKE_ASM_COMPILER:STRING="/usr/gnu/bin/as"
CMAKE_OPTIONS += -DCMAKE_INSTALL_RPATH:STRING="$(LLVM_RUNPATH)"
CMAKE_OPTIONS += -DLLVM_BUILD_TOOLS:BOOL=ON
CMAKE_OPTIONS += -DLLVM_INCLUDE_TOOLS:BOOL=ON
CMAKE_OPTIONS += -DLLVM_BUILD_TESTS:BOOL=ON
CMAKE_OPTIONS += -DLLVM_INCLUDE_TESTS:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ENABLE_THREADS:BOOL=ON
CMAKE_OPTIONS += -DLLVM_BUILD_32_BITS:BOOL=OFF

# CMake tries really hard to be too smart for its own good.
ifeq ($(DEBUG_BUILD),1)
  CMAKE_OPTIONS += -DLLVM_BUILD_EXAMPLES:BOOL=ON
  CMAKE_OPTIONS += -DLLVM_INCLUDE_EXAMPLES:BOOL=ON
  CMAKE_OPTIONS += -DLLVM_ENABLE_ASSERTIONS:BOOL=ON
  CMAKE_OPTIONS += -DLLVM_ENABLE_EXPENSIVE_CHECKS:BOOL=ON
else
  CMAKE_OPTIONS += -DLLVM_BUILD_EXAMPLES:BOOL=OFF
  CMAKE_OPTIONS += -DLLVM_INCLUDE_EXAMPLES:BOOL=OFF
  CMAKE_OPTIONS += -DLLVM_ENABLE_ASSERTIONS:BOOL=OFF
  CMAKE_OPTIONS += -DLLVM_ENABLE_EXPENSIVE_CHECKS:BOOL=OFF
endif

CMAKE_OPTIONS += -DCMAKE_ASM_FLAGS:STRING="$(gcc_OPT) $(GFLAG)"

CMAKE_OPTIONS += -DLLVM_ENABLE_EH:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ENABLE_PIC:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ENABLE_RTTI:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ENABLE_WARNINGS:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ENABLE_PEDANTIC:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ABI_BREAKING_CHECKS:STRING="FORCE_OFF"
CMAKE_OPTIONS += -DLLVM_ENABLE_ZLIB:BOOL=ON
CMAKE_OPTIONS += -DLLVM_ENABLE_FFI:BOOL=ON
CMAKE_OPTIONS += -DFFI_INCLUDE_DIR:STRING=$(LIBFFI_INCDIR)
CMAKE_OPTIONS += -DFFI_LIBRARY_DIR:STRING=$(LIBFFI_LIBDIR)

ifeq ($(HAVE_SPHINX),1)
  CMAKE_OPTIONS += -DSPHINX_EXECUTABLE:STRING="/usr/bin/sphinx-build"
  CMAKE_OPTIONS += -DLLVM_ENABLE_SPHINX:BOOL=ON
  CMAKE_OPTIONS += -DLLVM_BUILD_DOCS:BOOL=ON
  CMAKE_OPTIONS += -DSPHINX_OUTPUT_HTML:BOOL=ON
  CMAKE_OPTIONS += -DSPHINX_OUTPUT_MAN:BOOL=ON
endif

# Enable FileCheck utility
CMAKE_OPTIONS += -DLLVM_INSTALL_UTILS=ON

# Always build the libLLVM and libclang shared libraries
CMAKE_OPTIONS += -DLLVM_BUILD_LLVM_DYLIB:BOOL=ON
CMAKE_OPTIONS += -DLLVM_LINK_LLVM_DYLIB:BOOL=ON

CMAKE_OPTIONS += -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON

CMAKE_OPTIONS += -DLLVM_COMPILER_IS_GCC_COMPATIBLE:BOOL=ON

CMAKE_OPTIONS += -DLLVM_LIBDIR_SUFFIX="/$(MACH64)"

COMPONENT_BUILD_ENV = CC="$(CC)"
COMPONENT_BUILD_ENV += CXX="$(CXX)"
COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ENV += CXXFLAGS="$(CXXFLAGS)"
COMPONENT_BUILD_ENV += LDFLAGS="$(LDFLAGS)"
COMPONENT_BUILD_ENV += LD_OPTIONS="$(LD_OPTIONS)"
COMPONENT_BUILD_ENV += PATH="$(PATH)"
COMPONENT_BUILD_ENV += LANG="C"
COMPONENT_BUILD_ENV += LC_ALL="C"
COMPONENT_BUILD_ENV += LD_EXEC_OPTIONS="-zaslr=disable"

# use bash(1) to run the install recipes otherwise clang header installation
# fails
COMPONENT_INSTALL_ARGS += SHELL=/bin/bash

clean::
		cd cxa_finalize; gmake clean

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += developer/gnu-binutils
REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/libiomp5
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/perl-522
REQUIRED_PACKAGES += library/perl-5/xml-libxml
REQUIRED_PACKAGES += library/perl-5/xml-namespacesupport
REQUIRED_PACKAGES += library/perl-5/xml-parser
REQUIRED_PACKAGES += library/perl-5/xml-sax
REQUIRED_PACKAGES += library/perl-5/xml-sax-base
REQUIRED_PACKAGES += library/perl-5/xml-simple
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/header
REQUIRED_PACKAGES += system/library/gcc/gcc-runtime-7
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime-7
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime-7
REQUIRED_PACKAGES += system/library/gcc/gcc-gobjc-runtime-7
REQUIRED_PACKAGES += system/library/math
