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
BUILD_BITS = 64
COMPILER = gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME        = Python
COMPONENT_VERSION     = 3.7.1
COMPONENT_PROJECT_URL = https://python.org/
COMPONENT_SRC         = $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE     = $(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:fa7e2b8e8c9402f192ad56dc4f814089d1c4466c97d780f5e5acc02c04243d6d
COMPONENT_ARCHIVE_URL = $(COMPONENT_PROJECT_URL)ftp/python/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB       = utility/python
COMPONENT_ANITYA_ID   = 13254

TPNO = 47423

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/configure.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/lint-libraries.mk


# Need to preserve timestamp for Grammar files.  If the pickle files are older,
# Python will try to rebuild them.
PKGSEND_PUBLISH_OPTIONS += -T \*Grammar\*.txt
PKGSEND_PUBLISH_OPTIONS += -T \*Grammar\*.pickle

# We patch auto* files, so regenerate headers and configure
COMPONENT_PREP_ACTION = (cd $(@D) ; autoheader ; autoconf -f)

# we don't want to leak $(CC_BITS) into BASECFLAGS as it causes problems with
# python-config
CC += $(CFLAGS)

CPPFLAGS += -IPython

# to find the ncurses headers
CPPFLAGS += -I/usr/include/ncurses
# enable large files how they did in JDS
CPPFLAGS += -D_LARGEFILE64_SOURCE

# libffi for _ctypes
CPPFLAGS += $(shell pkg-config --cflags-only-I libffi)

# because python links with $(CC) ... $(LDFLAGS) ...
LDFLAGS = $(CC_BITS) $(CC_PIC)

# build pic
CFLAGS += $(CC_PIC)
CFLAGS += $(CFLAGS.$(MACH))

# The python build is profile-guided for gcc.  Use of xprofile requires that
# the same options be used during compilation and linking.  The targets chosen
# are based on Solaris 11 minimum supported system requirements.
XPROFILE_DIR = $(BUILD_DIR_$(BITS))/.profile
PYFLAGS.i386 = -march=opteron
PYFLAGS.sparc =
CFLAGS += $(PYFLAGS.$(MACH))
LDFLAGS += $(PYFLAGS.$(MACH))

# Set best optimization level for each architecture
CFLAGS.gcc += -O2
CFLAGS.sparc += -O3

# Python puts its header files in a special place.
LINT_FLAGS += -I$(SOURCE_DIR)/Include

# PYTHONPATH in the environment can be harmful, but setting it to empty via
# _INSTALL_ENV causes problems too, so just ignore the entire environment.
# (see 20396493) Because of this, we have to explicitly specify PATH in
# multiple places below.
ENV += -i

# Configure script should look into sbin folder when looking for dtrace
CONFIGURE_ENV += PATH="$(PATH):/usr/sbin"

CONFIGURE_OPTIONS += --with-system-expat
CONFIGURE_OPTIONS += --with-system-ffi
CONFIGURE_OPTIONS += --enable-ipv6
CONFIGURE_OPTIONS += --with-dtrace
CONFIGURE_OPTIONS += --with-gcc
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --without-ensurepip
CONFIGURE_OPTIONS += --enable-optimizations

CONFIGURE_OPTIONS += --bindir=/usr/bin
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)

CONFIGURE_OPTIONS += CPPFLAGS="$(CPPFLAGS)"
CONFIGURE_OPTIONS += LDFLAGS="$(LDFLAGS)"
CONFIGURE_OPTIONS += CFLAGS="$(CFLAGS)"
CONFIGURE_OPTIONS += DFLAGS="-$(BITS)"
CONFIGURE_OPTIONS += XPROFILE_DIR="$(XPROFILE_DIR)"

CONFIGURE_OPTIONS += "ac_cv_func_getentropy=no"

COMPONENT_BUILD_ENV += DFLAGS="-$(BITS)"
COMPONENT_BUILD_ENV += XPROFILE_DIR="$(XPROFILE_DIR)"
COMPONENT_BUILD_ENV += PATH="$(PATH)"

# Some tests have non-ASCII characters encoded for international domain names;
# the publish step will fail in 'pkgdepend generate' without this:
COMPONENT_PUBLISH_ENV += LC_ALL=en_US.UTF-8

# 64 bit shared objects need to go in a 64-bit directory
COMPONENT_INSTALL_ARGS.64 += DESTSHARED=$(CONFIGURE_PREFIX)/lib/python3.7/lib-dynload

# Simplify the definitions of CC, CXX, CFLAGS and LDFLAGS so they hard-code
# neither paths from our build systems nor Studio-specific options.
COMPONENT_PRE_INSTALL_ACTION= \
    (cd $(@D) ; \
    $(GSED) -i -e 's/^CC=.*/CC=\t\tgcc/' -e 's/^CXX=.*/CXX=\t\tg++/' \
    -e 's/^CFLAGS=.*/CFLAGS=\t\t\$$\(BASECFLAGS) \$$\(OPT) \$$\(EXTRA_CFLAGS)/' \
    -e 's|^LDFLAGS=.*|LDFLAGS=|' Makefile)

# Because we stripped the Makefile above, we need to pass several things in the
# environment, and use -e to tell gmake to pay attention to the environment.
COMPONENT_INSTALL_ENV  += CC="$(CC)"
COMPONENT_INSTALL_ENV  += CXX="$(CXX)"
COMPONENT_INSTALL_ENV  += CFLAGS="$(CFLAGS)"
COMPONENT_INSTALL_ENV  += LDFLAGS="$(LDFLAGS)"
COMPONENT_INSTALL_ENV  += PATH="$(PATH)"
COMPONENT_INSTALL_ARGS += -e

# Strip build machine paths from _sysconfigdata.py & config/Makefile,
# then (re)compile _sysconfigdata.py since we just updated it.
# Note that once Python 3.7 has been integrated and propagated to build
# machines, then the LD_LIBRARY_PATH setting and PROTO_DIR prefix below
# can both be removed.
COMPONENT_POST_INSTALL_ACTION= \
    (cd $(PROTOUSRLIBDIR)/python3.7 ; \
     $(GSED) -i -e 's|$(SOURCE_DIR)|.|g' -e 's|$(COMPONENT_DIR)|..|g' \
    -e 's|$(SPRO_VROOT)/bin/||g' _sysconfigdata_m_sunos5_.py config-3.7m/Makefile; \
    LD_LIBRARY_PATH=$(PROTOUSRLIBDIR64) $(PROTO_DIR)$(PYTHON.3.7) -m py_compile _sysconfigdata_m_sunos5_.py)

# common targets
configure:  $(CONFIGURE_64)
build:      $(BUILD_64)
install:    $(INSTALL_64)

# You can set TESTOPTS_PYTHON_TEST to a particular test if you want to run just
# one test.  For example:
# $ TESTOPTS_PYTHON_TEST=test_sys
TESTOPTS_PYTHON_TEST =
COMPONENT_TEST_ENV = PATH="$(PATH)"
# Using "-uall,-network" ensures all tests are run except the network tests.
# The network tests contain many expected failures when run behind a firewall.
# The "-v" ensures verbose mode.
COMPONENT_TEST_ENV += EXTRATESTOPTS="-v -uall,-network $(TESTOPTS_PYTHON_TEST)"
# Prevent the tests from getting stuck waiting for input.
COMPONENT_TEST_TARGETS = test < /dev/null

# Some different values for system testing.
COMPONENT_SYSTEM_TEST_TARGETS = 
COMPONENT_SYSTEM_TEST_CMD  = $(PYTHON.3.7)
COMPONENT_SYSTEM_TEST_ENV  = PATH="$(PATH)"
COMPONENT_SYSTEM_TEST_ARGS = /usr/lib/python3.7/test/regrtest.py -v -uall,-network

# The test output contains details from each test, in whatever order they
# complete.  The default _TRANSFORMER is not powerful enough to deal with
# this; we need heavier artillery.  Extract just the sections that start
# with "tests OK." and end with "Re-running failed tests..." for comparison.
COMPONENT_TEST_TRANSFORMER = $(NAWK)
COMPONENT_TEST_TRANSFORMS  = "'/tests OK./ {results = 1}; /Total duration/ {results = 0}; /Re-running failed tests in verbose mode/ {results = 0} {if (results) print $0 }'"

test:        $(TEST_64)
system-test: $(SYSTEM_TEST_64)

# Help manifest check to decide what will be a hardlink
PKG_HARDLINKS += usr/bin/python3.7m

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/base-developer-utilities
REQUIRED_PACKAGES += library/database/gdbm
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/tcl-8
REQUIRED_PACKAGES += runtime/tk-8
REQUIRED_PACKAGES += system/library/datalink
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
