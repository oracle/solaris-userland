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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		vim
COMPONENT_VERSION=	9.0
IPS_COMPONENT_VERSION=	9.0.138
COMPONENT_FULL_VERSION=$(shell echo $(IPS_COMPONENT_VERSION) | awk -F. '{printf("%d.%d.%04d\n", $$1, $$2, $$3)}')
COMPONENT_SRC=	vim-$(COMPONENT_FULL_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_URL=	https://github.com/vim/vim/archive/v$(COMPONENT_FULL_VERSION).zip
COMPONENT_ARCHIVE_HASH=	sha256:600b3d3cdee9438097bd3f59cd9a5fdef4374378ee8abb9fe4901f0316bb0ae8
COMPONENT_PROJECT_URL=	http://www.vim.org/
COMPONENT_ANITYA_ID=	5092

COMPONENT_BAID=		128070

PKG_MACROS +=	VIMVER=vim$(subst .,,$(COMPONENT_VERSION))

X_VARIANT =	$(BUILD_DIR)/$(MACH64)-gvim
NOX_VARIANT =	$(BUILD_DIR)/$(MACH64)-vim

VARIANTS =	$(X_VARIANT) $(NOX_VARIANT)

$(VARIANTS:%=%/.configured):	BITS=64

BUILD_64 = 	$(VARIANTS:%=%/.built)
INSTALL_64 = 	$(VARIANTS:%=%/.installed)
# Test only the terminal variant.
TEST_64 = 	$(NOX_VARIANT)/.tested-and-compared

include $(WS_MAKE_RULES)/common.mk

CFLAGS += -std=gnu99

# Make sure we use a 64-bit, multithreaded perl
CONFIGURE_ENV +=	vi_cv_path_perl=/usr/perl5/5.32/bin/perl
# Vim's configure script looks for a "python3" executable, per PEP 394
CONFIGURE_ENV +=	vi_cv_path_python3=$(PYTHON.3.7)
# zh_CN.cp936.po has invalid characters which GNU msgfmt seems to be able to ignore.
CONFIGURE_ENV +=	MSGFMT=gmsgfmt
CONFIGURE_ENV +=	SOURCE_DATE_EPOCH=$(SOURCE_DATE_EPOCH)

CONFIGURE_OPTIONS +=	--with-features=huge
CONFIGURE_OPTIONS +=	--with-compiledby="the Solaris Userland build environment"
CONFIGURE_OPTIONS +=	--with-modified-by="Solaris Userland Team"
CONFIGURE_OPTIONS +=	--enable-luainterp=dynamic
CONFIGURE_OPTIONS +=	--enable-perlinterp=dynamic
CONFIGURE_OPTIONS +=	--enable-pythoninterp=dynamic
CONFIGURE_OPTIONS +=	--enable-python3interp=dynamic
CONFIGURE_OPTIONS +=	--enable-rubyinterp=dynamic
CONFIGURE_OPTIONS +=	--disable-canberra

# We build two variants: with and without X support.
$(NOX_VARIANT)/.configured:	CONFIGURE_OPTIONS += --without-x
$(NOX_VARIANT)/.configured:	CONFIGURE_OPTIONS += --disable-gui
$(NOX_VARIANT)/.configured:	CONFIGURE_OPTIONS += --disable-gtktest
$(X_VARIANT)/.configured:	CONFIGURE_OPTIONS += --with-vim-name=gvim
$(X_VARIANT)/.configured:	CONFIGURE_OPTIONS += --with-x
$(X_VARIANT)/.configured:	CONFIGURE_OPTIONS += --enable-gui=gtk3

# Vim's build is too smart for itself and configure can't run outside of a
# complete source tree.
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

# For the GUI, install only the executable itself.
$(X_VARIANT)/.installed: COMPONENT_INSTALL_ARGS += -C src
$(X_VARIANT)/.installed: COMPONENT_INSTALL_TARGETS = installvimbin



################################################################################
################################### Testing ####################################
################################################################################

# The tests do create multiple temporary files which then may ostruct running
# the tests again. So before running the tests we remove all files ending with
# '~'
COMPONENT_PRE_TEST_ACTION += (gfind $(BUILD_DIR) -name \*~ | gxargs --no-run-if-empty --verbose rm);

# Vim test results vary whether you run vim with or without terminal available.
# So if terminal is not awailable we run the tests in screen(1) to always
# provide a terminal.
COMPONENT_TEST_CMD = $(COMPONENT_DIR)/vim_test_wrapper

# If the tests decided they need to execute itself in screen(1) then move the
# resulting file to final location where the rest of userland infrastructure
# will process it
COMPONENT_POST_TEST_ACTION += \
    if [ -e "$(COMPONENT_TEST_DIR)/outfile" ]; then \
	mv $(COMPONENT_TEST_DIR)/outfile $(COMPONENT_TEST_OUTPUT); \
    fi

# Setup the testing environment for non-X variant.
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TARGETS = test
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-n '
# There are multiple tests which sometimes do succeed and sometimes don't. We
# remove such tests from the result to make it comparable with master results file.
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/test_debugger.vim:/d" '
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/test_cmdline.vim:/d" '
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/test_suspend.vim:/d" '
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/test_messages.vim:/d" '
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/test_popupwin.vim:/d" '
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/test_vim9_script.vim:/d" '
# We keep in the filtered output just names of the failed tests. So we at least
# know that it's not getting worse.
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_TRANSFORMS += '-e "/^\tFrom /p" '
$(NOX_VARIANT)/.tested-and-compared: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += runtime/ruby-26
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += text/gnu-gettext
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/toolkit/libxt
