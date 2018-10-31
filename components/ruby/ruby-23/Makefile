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
BUILD_BITS= 64
COMPILER= gcc
include ../../../make-rules/shared-macros.mk

# rdoc cores dump when gcc 7 is used
GCC_ROOT = /usr/gcc/5
 
COMPONENT_NAME=		ruby
COMPONENT_VERSION=	2.3.8
COMPONENT_PROJECT_URL=	http://www.ruby-lang.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:b5016d61440e939045d4e22979e04708ed6c8e1c52e7edb2553cf40b73c59abf
COMPONENT_ARCHIVE_URL=	\
	http://cache.ruby-lang.org/pub/ruby/2.3/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	4223

# Rubygems support
COMPONENT_NAME_1=     rubygems
COMPONENT_VERSION_1=  2.7.6
COMPONENT_SRC_NAME_1= $(COMPONENT_NAME_1)
COMPONENT_SRC_1=      $(COMPONENT_SRC_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=  $(COMPONENT_SRC_1).tgz
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:67f714a582a9ce471bbbcb417374ea9cf9c061271c865dbb0d093f3bc3371eeb
COMPONENT_ARCHIVE_URL_1= https://rubygems.org/rubygems/$(COMPONENT_ARCHIVE_1)

# Convenience variable
RUBYGEMS=$(COMPONENT_SRC_1)

TPNO=			47007

include $(WS_MAKE_RULES)/common.mk

TPNO_RUBYGEMS=          42693

COMPONENT_PREP_ACTION = \
        $(TAR) xvzf $(COMPONENT_ARCHIVE_1); \
        $(CP) -r $(RUBYGEMS)/lib $(SOURCE_DIR); \
	$(CP) -r $(RUBYGEMS)/bundler/exe $(SOURCE_DIR)/bin; \
	$(CP) $(SOURCE_DIR)/bin/exe/* $(SOURCE_DIR)/bin;\
	$(CP) -r $(RUBYGEMS)/bundler $(SOURCE_DIR)/gems; \
	$(CP) -r $(RUBYGEMS)/bundler $(SOURCE_DIR)/ext; \
        $(CP) -r $(RUBYGEMS)/bin $(SOURCE_DIR);\
        $(CP) -r $(RUBYGEMS)/hide_lib_for_update $(SOURCE_DIR);\
        $(CP) -r $(RUBYGEMS)/util $(SOURCE_DIR);\
	$(CP) -r $(RUBYGEMS)/Rakefile $(SOURCE_DIR);\
        $(CP) -r $(RUBYGEMS)/test/rubygems $(SOURCE_DIR)/test;

# COMPONENT_VERSION <major>.<minor>.<teeny>
# is transformed into <major>.<minor> for RUBY_VER.
# First change the separator '.' to ' ', so we can use "word" to pull the 
# first two space-separated words from the string.
RUBY_VER_WORDS=	$(subst ., ,$(COMPONENT_VERSION))
RUBY_VER=$(word 1,$(RUBY_VER_WORDS)).$(word 2,$(RUBY_VER_WORDS))
# RUBY_VER_NO_DOT is just <major><minor>, like RUBY_VER but no
# '.' separating <major> and <minor>.  Used when editing manpages (see below).
RUBY_VER_NO_DOT=$(subst .,,$(RUBY_VER))
# the library-compatible version
RUBY_LIB_VER=2.3.0

PROTORUBYDIR=$(PROTOUSRDIR)/ruby/$(RUBY_VER)
PROTO_RBCONFIG_FILE=$(PROTORUBYDIR)/lib/ruby/$(RUBY_LIB_VER)/$(MACH64)-solaris$(SOLARIS_VERSION)/rbconfig.rb

# these macros are used in the package manifest
PKG_MACROS+=	RUBY_VER=$(RUBY_VER) RUBY_LIB_VER=$(RUBY_LIB_VER) RUBY_VER_NO_DOT=$(RUBY_VER_NO_DOT)
PKG_MACROS+=	TPNO_RUBYGEMS=$(TPNO_RUBYGEMS)

# Prevent re-compile of ripper.so during install, which would result in
# an erroneous full build directory in its RUNPATH.  The below change to 
# ext/ripper/Makefile is identical to what occurs during install
# and prevents its regeneration. 
COMPONENT_PRE_INSTALL_ACTION += \
	$(GSED) -i -e "s/^static: check/static: all/" $(BUILD_DIR_64)/ext/ripper/Makefile ; \
	$(TOUCH) -r $(BUILD_DIR_64)/ext/ripper/ripper.o $(BUILD_DIR_64)/ext/ripper/Makefile

# Apply some of the edits here--including to the sed scripts themselves.
# These modifications of ruby.1 must occur after ruby
# is installed, not before.  Although there are some other patches
# to ruby.1 that occur before, the ruby installation does some 
# formatting of ruby.1 that won't occur if the below changes
# are applied.
# Fix generated rbconfig.rb using /usr/bin/sed; gsed doesn't 
# work for some of the commands in rbconfig.sedscript.
COMPONENT_POST_INSTALL_ACTION += \
	$(GSED) -e "s/RUBY_VER_NO_DOT/$(RUBY_VER_NO_DOT)/g" \
	    -e "s/RUBY_VER/$(RUBY_VER)/g" \
	    -e "s/RUBY_LIB_VER/$(RUBY_LIB_VER)/g" Solaris/gem.1-generic \
	    > Solaris/gem.1 ; \
	$(GSED) -e "s/RUBY_VER_NO_DOT/$(RUBY_VER_NO_DOT)/g" \
	    -e "s/RUBY_VER/$(RUBY_VER)/g" \
	    -e "s/RUBY_LIB_VER/$(RUBY_LIB_VER)/g" Solaris/ruby.1.sedscript \
	    > Solaris/ruby.1.sedscript.mod ; \
	$(GSED) -e  "s/RUBY_VER/$(RUBY_VER)/g" \
	    -e "s/RUBY_LIB_VER/$(RUBY_LIB_VER)/g" Solaris/rbconfig.sedscript \
	    > Solaris/rbconfig.sedscript.mod ; \
	$(GSED) -i -f Solaris/ruby.1.sedscript.mod \
	    $(PROTORUBYDIR)/share/man/man1/ruby.1 ; \
	/usr/bin/sed -f Solaris/rbconfig.sedscript.mod \
	$(PROTO_RBCONFIG_FILE) > rbconfig.rb.mod ; \
	$(MV) rbconfig.rb.mod $(PROTO_RBCONFIG_FILE)

# default LD_OPTION $(LD_B_DIRECT) causes problems--
# during install of ruby, ruby is executed and will core dump
# after compiling with this option
LD_B_DIRECT=

# don't use LD_Z_IGNORE: causes ruby linker problems with 
# unreferenced symbol tgetent in libreadline, similar to bug #15617172
LD_Z_IGNORE=

# sparc build sometimes fails with studio 12.3 because of 17537968;
# -xO3 worked around the problem. Also, iropt optimizer has a 
# an assertion failure when compiling ext/socket/raddrinfo.c,
# (CR 20704428); dropping down to -xO2 works around the bug.
studio_OPT.sparc.64 = -xO2

# without this define, config fails frequently on i386 when including 
# /usr/include/sys/isa_defs.h with error: "ISA not supported";
# many extensions don't get built and at least one error causes 
# the build to fail
studio_XBITS.i386.64 += -D__amd64

CONFIGURE_PREFIX =	$(USRDIR)/$(COMPONENT_NAME)/$(RUBY_VER)

# we are building 64-bit, but most of the ruby libraries (*.rb files)
# are non-bit-specfic text files, so don't put them under lib/$(MACH64).
# The 64-bit *.so libraries will be in the $(MACH64)-solaris$(SOLARIS_VERSION)
# arch directories under lib

CONFIGURE_OPTIONS +=	--with-rubylibprefix=$(CONFIGURE_LIBDIR.32)/ruby
CONFIGURE_OPTIONS +=	--enable-shared
CONFIGURE_OPTIONS +=	--enable-rpath
# Don't need docs for ruby C source files
CONFIGURE_OPTIONS +=	--disable-install-capi
CONFIGURE_OPTIONS +=	--disable-option-checking
CONFIGURE_OPTIONS +=	--with-openssl
# If Ruby is configured with __builtin_setjmp, may cause
# problems with gems compiled with gcc.  Studio compiler doesn't 
# report an error for __builtin_setjmp, but gcc would.
CONFIGURE_OPTIONS +=	--with-setjmp-type=_setjmp
CONFIGURE_OPTIONS +=	DTRACE="$(USRSBINDIR)/dtrace"
# ensure we use the 64-bit configuration file, not the 32-bit one
CONFIGURE_OPTIONS +=	--with-tclConfig-file=$(USRLIBDIR)/64/tclConfig.sh
	# set mantype to "man" so tool/mdoc2man.rb is used to convert
	# the manpages from doc to man format; otherwise mantype is "doc" and
	# headers we add to the manpages will not work properly
CONFIGURE_OPTIONS +=	--with-mantype=man

# keep ASLR disabled; 
# miniruby may core dump on sparc during build
ASLR_MODE =		$(ASLR_DISABLE)

CLEAN_PATHS +=		Solaris/gem.1 Solaris/rbconfig.sedscript.mod \
			Solaris/ruby.1.sedscript.mod \
			$(RUBYGEMS)

# Some tests produce warnings if HTTP_PROXY is set
COMPONENT_TEST_ENV += "--unset=HTTP_PROXY"

# This set of tests goes through thousands of entries in the passwd
# and group table, taking hours to run; move it aside so we skip it.
# There may also be spurious errors if group memberships are modified
# during testing.
COMPONENT_PRE_TEST_ACTION += \
	( if test -e $(SOURCE_DIR)/test/etc/test_etc.rb ; then \
	    $(MV) $(SOURCE_DIR)/test/etc/test_etc.rb \
	    $(SOURCE_DIR)/test/etc/test_etc.rb-save ; fi )

COMPONENT_TEST_TRANSFORMS += \
    '-n' \
    '-e "s/Finished tests in .*s, .* tests\/s, .* assertions/Finished tests in Xs, X tests\/s, X assertions/"' \
    '-e "s/\(.*\) tests, .* assertions, \(.*\) failures, \(.*\) errors, .* skips/\1 tests, X assertions, \2 failures, \3 errors, X skips/"' \
    '-e "/^make/d"' \
    '-e "/fatal/Ip"' \
    '-e "/test succeeded/p"' \
    '-e "/Running tests/p"' \
    '-e "/Finished tests in Xs, X tests\/s, X assertions/p"' \
    '-e "/.* tests, X assertions, .* failures, .* errors, X skips/p"'

# master test results are not entirely clean, so not
# appropriate to run at top level
$(SKIP_TEST_AT_TOP_LEVEL)

REQUIRED_PACKAGES += developer/gcc-5
REQUIRED_PACKAGES += library/database/gdbm
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/tcl-8
REQUIRED_PACKAGES += runtime/tk-8
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/linker
REQUIRED_PACKAGES += x11/library/libx11
