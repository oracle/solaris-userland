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
COMPILER =		gcc
CTF_MODE =		off	# Breaks config
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gdb
COMPONENT_VERSION=	15.1
COMPONENT_ARCHIVE_HASH=	\
    sha256:8b61b0c2bdd9d9c83b113c9167866bdb474651d291fedcaa5eb7cde49bd47036
COMPONENT_ANITYA_ID=	11798

COMPONENT_BAID=		177948

# The traditional output from gmake test omits some
# test results information that is contained in the 
# build/<arch>/gdb/testsuite/gdb.sum file, so use that file instead
# for test results comparison. Also sort the results so that they are
# comparable
COMPONENT_POST_TEST_ACTION += \
	( $(MV) $(COMPONENT_TEST_OUTPUT) $(COMPONENT_TEST_OUTPUT)-orig ; \
	$(PERL) $(COMPONENT_TEST_RESULTS_DIR)/sort-results.pl $(BUILD_DIR_64)/gdb/testsuite/gdb.sum $(COMPONENT_TEST_OUTPUT) )



# Test results vary from run to run and machine to machine,
# so master test results will not match (+- 50 passes).
# Results output is also different on Intel vs. SPARC.
COMPONENT_TEST_MASTER = \
        $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

# Run only GDB unit tests.
COMPONENT_TEST_DIR = $(BUILD_DIR)/$(MACH64)/gdb

# Test transforms retain only relevant results output.
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/^FAIL/p" ' \
        '-e "/^KFAIL/p" ' \
        '-e "/^PASS/p" ' \
        '-e "/^UNRESOLVED/p" ' \
        '-e "/^UNSUPPORTED/p" ' \
        '-e "/^UNTESTED/p" ' \
        '-e "/^XFAIL/p" ' \
        '-e "/^\# of /p" '

include $(WS_MAKE_RULES)/gnu-component.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# GDB wants the GNU utilities
PATH=/usr/gnu/bin:$(GCC_ROOT)/bin:/usr/bin:/usr/perl5/$(PERL_VERSION)/bin

# Specify the C Standard to use when building
CC += -std=gnu99

ifndef GDB_DEBUG
# The oldest supported SPARC processor for Solaris 11.4 is SPARC64-X.
CFLAGS_sparc = -O2 -mcpu=ultrasparc3 -mtune=niagara4
# Tune the generated code to better fit newer Intel architectures
# but still keep compatibility with older x86-64 machines.
CFLAGS_i386 = -O2 -mtune=sandybridge
else
CFLAGS_sparc = -g -Og
CFLAGS_i386 = -g -Og
endif

# Report used instruction sets in ELF's capability section.
LD_OPTIONS += -z discap

CFLAGS_sparc +=	-mno-unaligned-doubles
CFLAGS_sparc += -mapp-regs -mhard-float
CFLAGS_EXTRA = -Wall -Wno-long-long -Wcast-align -fno-omit-frame-pointer

CFLAGS = $(CC_BITS) $(CFLAGS_EXTRA) $(CFLAGS_$(MACH))
CXXFLAGS = $(CC_BITS) $(CFLAGS_EXTRA) $(CFLAGS_$(MACH))
CPPFLAGS = -D_REENTRANT -I$(USRINCDIR)/ncurses

CONFIGURE_OPTIONS += --with-x=no
CONFIGURE_OPTIONS += --with-curses
CONFIGURE_OPTIONS += --disable-sim
CONFIGURE_OPTIONS += --disable-werror
CONFIGURE_OPTIONS += --enable-plugins
CONFIGURE_OPTIONS += --enable-tui
CONFIGURE_OPTIONS += --without-auto-load-safe-path
CONFIGURE_OPTIONS += --with-python=$(PYTHON.3.11)
CONFIGURE_OPTIONS += --with-libexpat-prefix=$(USRLIBDIR)
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --with-system-zlib


# Generate the newly added Solaris instruction and
# register tables which weren't there by default.
COMPONENT_PRE_CONFIGURE_ACTION = \
  ( cd  $(SOURCE_DIR)/gdb/features ; \
    $(GMAKE) all )

# Ensure PATH is set during build;
# need /usr/perl5/$(PERL_VERSION)/bin from PATH to access 
# pod2man perl script, used to create manpages
COMPONENT_BUILD_ENV += PATH=$(PATH)

# build the manpages
COMPONENT_POST_BUILD_ACTION = \
	( cd $(BUILD_DIR_64)/gdb/doc ; \
	$(GMAKE) man )

# The default version of gfortran compiler should correspond to gcc and g++ versions.
COMPONENT_TEST_ENV += FC="$(GCC_ROOT)/bin/gfortran"

# Add path to libgfortran.so.[0-9] library to avoid Fortran test failures.
# The library preload can be removed after bug 30144732 is fixed.
# Note that the library preload could also be removed if the mediator is
# set to the latest GCC version but it is safer to keep it since it would
# break again when a newer version of GNU compiler is added to CBE.
COMPONENT_TEST_ENV +=   LD_LIBRARY_PATH="$(GCC_ROOT)/lib/$(MACH64)/"

# The test gdb.mi/mi-exec-run.exp hangs up the test run, so skip it.
COMPONENT_PRE_TEST_ACTION += \
 (  cd $(SOURCE_DIR)/gdb/testsuite/gdb.mi ; \
    if test -e mi-exec-run.exp ; then \
      $(MV) mi-exec-run.exp mi-exec-run.exp-save ; \
    fi ; \
    cd "$(BUILD_DIR_64)/gdb/testsuite/" ; \
    PATH=$(PATH) $(MAKE) site.exp ; \
    echo "set gdb_test_timeout 120" >> site.exp \
 )

COMPONENT_POST_INSTALL_ACTION = \
  ( cd  $(PROTOUSRDIR)/share/gdb/python/gdb ; \
      $(PYTHON) -m compileall . ; \
    cd  $(PROTOUSRDIR)/share/gdb/python/gdb/command ; \
      $(PYTHON) -m compileall . ; \
    cd  $(PROTOUSRDIR)/share/gdb/python/gdb/function ; \
      $(PYTHON) -m compileall . ; \
    cd  $(COMPONENT_DIR) ; \
      $(INSTALL) -m 0755 $(COMPONENT_DIR)/Solaris/gdbtui \
	$(PROTOUSRBINDIR)/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-1  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-2  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-3  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-4  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-5  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-6  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-7  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/gdb.info-8  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/annotate.info  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(INSTALL) -m 0644 $(SOURCE_DIR)/gdb/doc/stabs.info  \
	$(PROTOUSRSHAREDIR)/info/ ; \
      $(MKDIR) $(PROTOGNUSHAREMAN1) ; \
      $(MKDIR) $(PROTOUSRSHAREMAN1DIR) ; \
      $(INSTALL) -m 0444 $(SOURCE_DIR)/gdb/doc/gdb.1 \
	$(PROTOUSRSHAREMAN1DIR) );

# The manifest check expects that the component does not
# install files for other architecture to the proto area.
# Remove these files to make manifest-check happy.
COMPONENT_POST_INSTALL_ACTION += \
	(	cd $(PROTOUSRSHAREDIR); \
		if [ "$(MACH)" = "sparc" ]; then \
			rm gdb/syscalls/i386-solaris.xml; \
			rm gdb/syscalls/amd64-solaris.xml; \
		elif [ "$(MACH)" = "i386" ]; then \
			rm gdb/syscalls/sparc-solaris.xml; \
			rm gdb/syscalls/sparc64-solaris.xml; \
		else \
			echo "Cannot detect the architecture!" >&2; \
			exit 1; \
		fi \
	)

# Disable ASLR: it's a debugger and we do not want to risk
# altering the results of the debugging experiment.
ASLR_MODE=$(ASLR_DISABLE)

REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += library/mpfr
REQUIRED_PACKAGES += text/texinfo
