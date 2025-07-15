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
BUILD_BITS =		64_and_32
COMPILER =		gcc
CTF_MODE =		relaxed

include ../../make-rules/shared-macros.mk

COMPONENT_NAME        = graphviz
COMPONENT_VERSION     = 10.0.1
COMPONENT_PROJECT_URL = http://www.graphviz.org/
COMPONENT_SRC         = $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE     = $(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:28f452ef1cb12288c8758a62f8c3fcfefdb91b251f7aae61d0d703f851bde931
COMPONENT_ARCHIVE_URL = \
    http://gitlab.com/graphviz/graphviz/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID   = 1249

COMPONENT_BAID = 161633

COMPONENT_PREP_ACTION += \
	( cd $(@D) ; PATH="$(PATH)" $(CONFIG_SHELL) autogen.sh NOCONFIG)

# publish for only one version of perl
PERL_VERSIONS = $(PERL_VERSION)

# We want to build a couple of extra things after the installs are done, so set
# the install targets appropriately.
INSTALL_TARGET = $(INSTALL_$(MK_BITS))
INSTALL_TARGET += $(PROTOUSRLIBDIR)/graphviz/config6

# The test infrastructure doesn't run well in our out-of-source build
# environment. The system test, on the other hand, is trivial to run.
TEST_TARGET = $(SKIP_TEST)
SYSTEM_TEST_TARGET = $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/common.mk

PATH =		/usr/php/8.4/bin:/usr/bin:/usr/gnu/bin

# Java header files (--with-javaincludedir allows for only one directory)
CPPFLAGS +=	-I$(JAVA_HOME)/include -I$(JAVA_HOME)/include/solaris

CONFIGURE_ENV +=	PYTHON3=$(PYTHON.3.9)
CONFIGURE_ENV +=	PYTHON3_INSTALL_DIR=$(PYTHON.3.9.VENDOR_PACKAGES)
CONFIGURE_OPTIONS +=	--without-included-ltdl
CONFIGURE_OPTIONS +=	--with-qt=no
CONFIGURE_OPTIONS +=	--enable-go=no
CONFIGURE_OPTIONS +=	--enable-ocaml=no
CONFIGURE_OPTIONS +=	--enable-python=no
CONFIGURE_OPTIONS +=	--enable-python3=yes
CONFIGURE_OPTIONS +=	--enable-tcl=yes
CONFIGURE_OPTIONS +=	--x-libraries=$(CONFIGURE_LIBDIR.$(BITS))
CONFIGURE_OPTIONS +=	--with-gdincludedir=$(USRINCDIR)/gd2
CONFIGURE_OPTIONS +=	--enable-man-pdfs
CONFIGURE_OPTIONS +=	MAKE=$(GMAKE)

COMPONENT_BUILD_ARGS +=	GREP=$(USRBINDIR)/ggrep

# perl, ruby, php ship 64-bit only.
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--enable-perl=no
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--enable-ruby=no
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--enable-php=no
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--with-rsvg=no
$(CONFIGURE_64): CONFIGURE_ENV +=	PERL=$(PERL)
$(CONFIGURE_64): CONFIGURE_ENV +=	RUBY=$(RUBY.3.3)
$(INSTALL_64): COMPONENT_INSTALL_ARGS += PHP_INSTALL_DIR=$(shell PATH=$(PATH) php-config --extension-dir)
# tcl ships both 32 and 64 bit, but even though /usr/bin/tclsh is 64-bit, there
# is no place to stick 64-bit modules, so skip it.  On the other hand, make
# sure to find the right tcl bits when building 32-bit.
$(CONFIGURE_32): CONFIGURE_OPTIONS +=	--with-tclsh=$(USRBINDIR)/$(MACH32)/tclsh
$(CONFIGURE_32): CONFIGURE_ENV += 	TCLCONFIG=$(USRLIBDIR)/tclConfig.sh
$(CONFIGURE_64): CONFIGURE_OPTIONS +=	--with-tclsh=$(USRBINDIR)/tclsh
$(CONFIGURE_64): CONFIGURE_ENV += 	TCLCONFIG=$(USRLIBDIR)/$(MACH64)/tclConfig.sh
# Put the 64-bit lua module in a 64-bit directory.
$(INSTALL_32): COMPONENT_INSTALL_ARGS += LUA_INSTALL_DIR=$(USRLIBDIR)/lua/5.4
$(INSTALL_64): COMPONENT_INSTALL_ARGS += LUA_INSTALL_DIR=$(USRLIBDIR)/lua/5.4/64

# Use GNU ln, which supports the -r (--relative) option.
COMPONENT_INSTALL_ARGS += LN_S="gln -s"

# Build php and python modules for multiple versions. As graphviz doesn't
# support that, we have to handle all that manually below.

# Convenience variables for later use.
PHP_82_CONFIG = /usr/php/8.2/bin/php-config
PHP_82_INCLUDES := $(shell $(PHP_82_CONFIG) --includes)
PHP_82_INSTALL_DIR := $(shell $(PHP_82_CONFIG) --extension-dir)
PHP_82_LDFLAGS := $(shell $(PHP_82_CONFIG) --ldflags)
PHP_82_LIBS := $(shell $(PHP_82_CONFIG) --libs)

PHP_83_CONFIG = /usr/php/8.3/bin/php-config
PHP_83_INCLUDES := $(shell $(PHP_83_CONFIG) --includes)
PHP_83_INSTALL_DIR := $(shell $(PHP_83_CONFIG) --extension-dir)
PHP_83_LDFLAGS := $(shell $(PHP_83_CONFIG) --ldflags)
PHP_83_LIBS := $(shell $(PHP_83_CONFIG) --libs)

PKG_CONFIG = /usr/bin/pkg-config
PYTHON_311_INCLUDES := $(shell $(PKG_CONFIG) --cflags python-3.11)
PYTHON_311_LIBS = $(shell $(PKG_CONFIG) --libs python-3.11)
PYTHON_313_INCLUDES := $(shell $(PKG_CONFIG) --cflags python-3.13)
PYTHON_313_LIBS = $(shell $(PKG_CONFIG) --libs python-3.13)

# Create additional gv directories for non-default php and python
# versions and update all relevant Makefile variables.
$(CONFIGURE_64): COMPONENT_POST_CONFIGURE_ACTION += \
    (cd $(@D) ; cp -rp tclpkg/gv tclpkg/gv1 ; \
    $(GSED) -i '/^SUBDIRS =/s|$$| gv1|' tclpkg/Makefile ; \
    $(GSED) -i \
     -e '/^PHP_INCLUDES =/s|=.*$$|= $(PHP_83_INCLUDES)|' \
     -e '/^PHP_LIBS =/s|=.*$$|= $(PHP_83_LDFLAGS) $(PHP_83_LIBS)|' \
     -e '/^PYTHON3 =/s|=.*$$|= $(PYTHON.3.13)|' \
     -e '/^PYTHON3_INCLUDES =/s|=.*$$|= $(PYTHON_313_INCLUDES)|' \
     -e '/^PYTHON3_LIBS =/s|=.*$$|= $(PYTHON_313_LIBS)|' \
     `find tclpkg/gv1 -name Makefile` ) ; \
    (cd $(@D) ; cp -rp tclpkg/gv tclpkg/gv2 ; \
    $(GSED) -i '/^SUBDIRS =/s|$$| gv2|' tclpkg/Makefile ; \
    $(GSED) -i \
     -e '/^PHP_INCLUDES =/s|=.*$$|= $(PHP_82_INCLUDES)|' \
     -e '/^PHP_LIBS =/s|=.*$$|= $(PHP_82_LDFLAGS) $(PHP_82_LIBS)|' \
     -e '/^PYTHON3 =/s|=.*$$|= $(PYTHON.3.11)|' \
     -e '/^PYTHON3_INCLUDES =/s|=.*$$|= $(PYTHON_311_INCLUDES)|' \
     -e '/^PYTHON3_LIBS =/s|=.*$$|= $(PYTHON_311_LIBS)|' \
     `find tclpkg/gv2 -name Makefile` ) ; \

# Install Python bindings for each version into vendor-packages directories
# and generate pyc files. The default version is already installed, but
# without the .pyc file and without .so version tag.
39_VENDOR_PROTO := $(PROTO_DIR)$(PYTHON.3.9.VENDOR_PACKAGES)
311_VENDOR_PROTO := $(PROTO_DIR)$(PYTHON.3.11.VENDOR_PACKAGES)
313_VENDOR_PROTO := $(PROTO_DIR)$(PYTHON.3.13.VENDOR_PACKAGES)

$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON.3.9) -m compileall -l -d $(PYTHON.3.9.VENDOR_PACKAGES) $(39_VENDOR_PROTO); \
	$(MV) $(39_VENDOR_PROTO)/_gv.so $(39_VENDOR_PROTO)/_gv.cpython-39.so; \
	$(RM) -r $(311_VENDOR_PROTO); $(MKDIR) $(311_VENDOR_PROTO); \
	$(INSTALL) -m 644 $(@D)/tclpkg/gv1/gv.py $(311_VENDOR_PROTO)/gv.py; \
	$(PYTHON.3.11) -m compileall -l -d $(PYTHON.3.11.VENDOR_PACKAGES) $(311_VENDOR_PROTO); \
	$(INSTALL) $(@D)/tclpkg/gv1/.libs/libgv_python3.soT $(311_VENDOR_PROTO)/_gv.cpython-311.so; \
	$(RM) -r $(313_VENDOR_PROTO); $(MKDIR) $(313_VENDOR_PROTO); \
	$(INSTALL) -m 644 $(@D)/tclpkg/gv2/gv.py $(313_VENDOR_PROTO)/gv.py; \
	$(PYTHON.3.13) -m compileall -l -d $(PYTHON.3.13.VENDOR_PACKAGES) $(313_VENDOR_PROTO); \
	$(INSTALL) $(@D)/tclpkg/gv2/.libs/libgv_python3.soT $(313_VENDOR_PROTO)/_gv.cpython-313.so;

# Similarly, install PHP bindings for each version. _gv.so for default version
# is already installed by Graphviz. Additional mediated links are handled
# in manifests.
PHP_GRAPHVIZ_PROTO = $(PROTO_DIR)$(USRLIBDIR64)/graphviz/php
PHP82_VENDOR_PROTO = $(PROTO_DIR)$(PHP_82_INSTALL_DIR)
PHP83_VENDOR_PROTO = $(PROTO_DIR)$(PHP_83_INSTALL_DIR)

$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PHP82_VENDOR_PROTO); \
	$(INSTALL) $(@D)/tclpkg/gv2/.libs/libgv_php.soT $(PHP82_VENDOR_PROTO)/gv.so; \
	$(MKDIR) $(PHP83_VENDOR_PROTO); \
	$(INSTALL) $(@D)/tclpkg/gv1/.libs/libgv_php.soT $(PHP83_VENDOR_PROTO)/gv.so; \
	$(RM) -r $(PHP_GRAPHVIZ_PROTO); $(MKDIR) $(PHP_GRAPHVIZ_PROTO); \
	$(INSTALL) $(@D)/tclpkg/gv/.libs/libgv_php.soT $(PHP_GRAPHVIZ_PROTO)/libgv_php84.so; \
	$(INSTALL) $(@D)/tclpkg/gv2/.libs/libgv_php.soT $(PHP_GRAPHVIZ_PROTO)/libgv_php82.so; \
	$(INSTALL) $(@D)/tclpkg/gv1/.libs/libgv_php.soT $(PHP_GRAPHVIZ_PROTO)/libgv_php83.so;

# Create the config file once the 32-bit build is complete.  This runs the bits
# we just built, so we have to set a handful of variables to the right place.
# The 32-bit executables are in their own directory, so we have to point to
# that version of dot explicitly.
$(PROTOUSRLIBDIR)/graphviz/config6: $(INSTALL_32)
	env LD_LIBRARY_PATH=$(PROTOUSRLIBDIR) GVBINDIR=$(PROTOUSRLIBDIR)/graphviz \
		$(PROTOUSRBINDIR)/$(MACH32)/dot -c


# 'gvpr' uses HOSTCC variable instead of our configured compiler and options so
# PIE build fails. This is a workaround for that.
COMPONENT_BUILD_ARGS += HOSTCC='$(CC) $(CC_PIC_ENABLE)'

PKG_MACROS += PERL_PKG=$(PERL_PKG)
PKG_MACROS += PERL_VERSION_NODOT=$(PERL_VERSION_NODOT)

# Several tests require bigger stack to pass.
$(SYSTEM_TEST_64): ENV := ulimit -Ss 16384; $(ENV)

COMPONENT_SYSTEM_TEST_DIR = $(SOURCE_DIR)
# The Graphviz test suite uses Pytest for all its functionality.
COMPONENT_SYSTEM_TEST_CMD = $(PYTHON) -m pytest
COMPONENT_SYSTEM_TEST_ARGS = tests --verbose
COMPONENT_SYSTEM_TEST_TARGETS =
COMPONENT_SYSTEM_TEST_ENV = CC=$(CC)

REQUIRED_PACKAGES += desktop/pdf-viewer/poppler-viewer
REQUIRED_PACKAGES += image/ghostscript
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += image/library/librsvg
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/gd
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libtool/libltdl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/filter/poppler
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += runtime/python-313
REQUIRED_PACKAGES += runtime/ruby-33
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/php-82
REQUIRED_PACKAGES += web/php-83
REQUIRED_PACKAGES += web/php-84
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
