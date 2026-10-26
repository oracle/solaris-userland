#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2019, 2026, Oracle and/or its affiliates.
#

BUILD_BITS=		64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		meson
COMPONENT_VERSION=	1.12.1
COMPONENT_PROJECT_URL=	http://mesonbuild.com/
COMPONENT_ARCHIVE_HASH=	\
    sha256:ab0a6ca09f8ef70c564c8241fb5a23957886a0b53fb58412b5e07eaf07dba743
COMPONENT_ARCHIVE_URL=	https://github.com/mesonbuild/meson/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_BUGDB=	utility/meson
COMPONENT_ANITYA_ID=	6472
COMPONENT_BAID=		453238

# As of 1.12.0, meson requires Python 3.10 or newer, and we only need
# to build for a single version, not all of them.
PYTHON_VERSION=    3.11
PYTHON_VERSIONS=	$(PYTHON_VERSION)

BUILD_STYLE= setup.py

include $(WS_MAKE_RULES)/common.mk

# Assumes GNU msgfmt is first in PATH, hence $(GNUBIN) before $(USRBINDIR).
#
# $(USRBINDIR64) must also be ahead of $(USRBINDIR) for the wxwidgets test
# to find the correct version of wx-config for building 64-bit binaries.
#
# $(GNUBIN)/$(MACH64) must also be ahead of $(GNUBIN) for the ncurses test
# to find the correct version of ncursesw5-config for building 64-bit binaries.
PYTHON_ENV += \
 PATH="$(GCC_ROOT)/bin:$(GNUBIN)/$(MACH64):$(GNUBIN):$(USRBINDIR64):$(USRBINDIR)"

COMPONENT_PRE_INSTALL_ACTION += \
	$(RM) -r $(PROTOUSRSHAREDIR) ;

COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTO_DIR)$(PYTHON_DATA)/share $(PROTOUSRSHAREDIR) ;

COMPONENT_TEST_DIR=	$(COMPONENT_SRC)
COMPONENT_TEST_CMD=	./run_tests.py
# Meson's default of up to 64 project-test workers can exhaust build hosts.
COMPONENT_TEST_ARGS=	-j 8
COMPONENT_TEST_MASTER=	$(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

# 'test cases/common/230 external project' fails if /usr/bin/make is used
# due to Solaris make bug 15352407 not handling $< in explicit rules unless
# the GNU compatibility mode is enabled.  Using GNU make directly is easier.
COMPONENT_TEST_ENV +=	MAKE=$(GMAKE)

# We put /usr/gnu/bin ahead of /usr/bin in the $PATH above, but we also
# need to make sure we run /usr/bin/ar instead of /usr/gnu/bin/ar or
# many tests will fail.
COMPONENT_TEST_ENV +=	AR=/usr/bin/ar

# GCC 16 cannot combine CTF debug info with the precompiled-header tests.
COMPONENT_TEST_ENV +=	CFLAGS="$(filter-out -gctf,$(CFLAGS))"

# D test binaries need the matching libgphobos at runtime.
COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(GCC_ROOT)/lib/$(MACH64)

# Use installed Python build dependencies for the pip installation test.
# Isolated builds can exceed the test's five-minute timeout on build hosts.
# The false value disables pip's build isolation option.
COMPONENT_TEST_ENV +=	PIP_NO_BUILD_ISOLATION=false

# Test transforms retain only reproducible summaries of results output.
# -E flag enables extended regular expressions, so that | can be used
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/^Total .*time:/d" ' \
        '-e "s/[0-9][0-9\.]* *s//" ' \
        '-e "s/ED  *\[[ 1][ 0-9][0-9]%\]$$/ED/" ' \
        '-e "/^Total/p" ' \
        '-E -e "/(^test| \.\.\. |PASS|FAIL|ERROR)/p" '

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)

# Ninja is needed at runtime, including when running tests, but not to build
CBE_PACKAGES += developer/build/ninja

REQUIRED_PACKAGES += library/python/setuptools-311
REQUIRED_PACKAGES += runtime/python-311
