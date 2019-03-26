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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk
COMPILER=gcc

COMPONENT_NAME        = graphviz
COMPONENT_VERSION     = 2.40.1
COMPONENT_PROJECT_URL = http://www.graphviz.org/
COMPONENT_SRC         = $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE     = $(COMPONENT_SRC).tar.gz

COMPONENT_ANITYA_ID   = 1249

GIT_REPO = https://gitlab.com/graphviz/graphviz/
GIT_TAG  = stable_release_2.40.1
GIT_COMMIT_ID = 67cd2e51
GIT_HASH = sha256:f1217dcd5178193c1308ec2e1c44f53a4100bc6cba4ba115d3e2536185757b4e

TPNO = 49299

COMPONENT_PREP_ACTION += \
	( cd $(@D) ; PATH="$(PATH)" $(CONFIG_SHELL) autogen.sh NOCONFIG)

# publish for only one version of perl
PERL_VERSIONS = $(PERL_VERSION)

# We want to build a couple of extra things after the installs are done, so set
# the install targets appropriately.
INSTALL_TARGET = $(INSTALL_$(MK_BITS))
INSTALL_TARGET += $(PROTOUSRLIBDIR)/graphviz/config6
INSTALL_TARGET += $(PROTO_DIR)/$(PYTHON.2.7.VENDOR_PACKAGES)/gv.pyc

include $(WS_MAKE_RULES)/common.mk

PATH =		/usr/php/7.1/bin:/usr/bin:/usr/gnu/bin

# GMP header files for the guile extension (no --with- flag)
# The guile build is broken with studio (15732452), so we disable this for now.
# CPPFLAGS +=	-I/usr/include/gmp
# Java header files (--with-javaincludedir allows for only one directory)
CPPFLAGS +=	-I$(JAVA_HOME)/include -I$(JAVA_HOME)/include/solaris
# PHP header files (no --with- flag)
CPPFLAGS +=	$(shell PATH=$(PATH) php-config --includes)

# Make sure to use the right python, depending on the 32/64-bit build.
CONFIGURE_ENV +=	PYTHON27=$(PYTHON.2.7)
CONFIGURE_OPTIONS +=	--without-included-ltdl
CONFIGURE_OPTIONS +=	--enable-ocaml=no
CONFIGURE_OPTIONS +=	--enable-python=no
CONFIGURE_OPTIONS +=	--enable-python27=yes
CONFIGURE_OPTIONS +=	--x-libraries=$(CONFIGURE_LIBDIR.$(BITS))
CONFIGURE_OPTIONS +=	--with-gdincludedir=$(USRINCDIR)/gd2

COMPONENT_BUILD_ARGS += 	GREP=$(USRBINDIR)/ggrep

# perl, ruby, php ship 64-bit only.
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--enable-perl=no
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--enable-ruby=no
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--enable-php=no
$(CONFIGURE_64): CONFIGURE_ENV +=	PERL=$(PERL)
$(CONFIGURE_64): CONFIGURE_ENV +=	RUBY=$(RUBY.2.5)
$(INSTALL_64): COMPONENT_INSTALL_ARGS += PHP_INSTALL_DIR=$(shell PATH=$(PATH) php-config --extension-dir)
# tcl ships both 32 and 64 bit, but even though /usr/bin/tclsh is 64-bit, there
# is no place to stick 64-bit modules, so skip it.  On the other hand, make
# sure to find the right tcl bits when building 32-bit.
$(CONFIGURE_64): CONFIGURE_OPTIONS +=	--enable-tcl=no
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--with-tclsh=$(USRBINDIR)/$(MACH32)/tclsh
$(CONFIGURE_32): CONFIGURE_ENV += 	TCLCONFIG=$(USRLIBDIR)/tclConfig.sh
# Put the 64-bit lua module in a 64-bit directory.
$(INSTALL_32): COMPONENT_INSTALL_ARGS += LUA_INSTALL_DIR=$(USRLIBDIR)/lua/5.2
$(INSTALL_64): COMPONENT_INSTALL_ARGS += LUA_INSTALL_DIR=$(USRLIBDIR)/lua/5.2/64
# Use GNU ln, which supports the -r (--relative) option.
COMPONENT_INSTALL_ARGS += LN_S="gln -s"

# Create the config file once the 32-bit build is complete.  This runs the bits
# we just built, so we have to set a handful of variables to the right place.
# The 32-bit executables are in their own directory, so we have to point to
# that version of dot explicitly.
$(PROTOUSRLIBDIR)/graphviz/config6: $(INSTALL_32)
	env LD_LIBRARY_PATH=$(PROTOUSRLIBDIR) GVBINDIR=$(PROTOUSRLIBDIR)/graphviz \
		$(PROTOUSRBINDIR)/$(MACH32)/dot -c

# Once the build is complete, compile the .py file.  There's no need to compile
# the one in the "64" directory, so don't recurse.  And make sure that the
# build path doesn't get embedded in the .pyc file.
$(PROTO_DIR)/$(PYTHON.2.7.VENDOR_PACKAGES)/gv.pyc: $(INSTALL_32)
	$(PYTHON.2.7.32) -m compileall -l -d $(PYTHON.2.7.VENDOR_PACKAGES) \
		$(PROTO_DIR)/$(PYTHON.2.7.VENDOR_PACKAGES)

PKG_MACROS += PERL_PKG=$(PERL_PKG)
PKG_MACROS += PERL_VERSION_NODOT=$(PERL_VERSION_NODOT)

# The test infrastructure doesn't run in a VPATHed environment.
COMPONENT_PRE_TEST_ACTION = \
    (cd $(@D)/rtest; \
    if ! test -L rtest.sh ; then \
        ln -s $(SOURCE_DIR)/rtest/* . ; \
    fi )
COMPONENT_TEST_DIR = $(@D)/rtest
COMPONENT_TEST_ENV = PATH=$(BUILD_DIR_$(BITS)):$(GNUBIN):$(PATH)
 
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-n -e "/No. tests: /p"'

# The tests are known to fail consistently because the test samples are out
# of date and not generated with a known configuration.
test: $(TEST_32_and_64)

REQUIRED_PACKAGES += desktop/pdf-viewer/poppler
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng14
REQUIRED_PACKAGES += image/library/librsvg
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/gd
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libtool/libltdl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/filter/ghostscript
REQUIRED_PACKAGES += print/filter/ghostscript-core
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += runtime/ruby-25
REQUIRED_PACKAGES += runtime/tk-8
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/c++-runtime
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/php-71
REQUIRED_PACKAGES += x11/library/freeglut
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
