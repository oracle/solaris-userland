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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64

# Parallel build jobs are supported only if GNU make is used.
COMPONENT_MAKE_JOBS=1

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pycairo
COMPONENT_VERSION=	1.10.0
COMPONENT_PROJECT_URL=	http://cairographics.org/pycairo/
COMPONENT_ARCHIVE=      $(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:9aa4078e7eb5be583aeabbe8d87172797717f95e8c4338f0d4a17b683a7253be
COMPONENT_ARCHIVE_URL=	http://cairographics.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	python-mod/pycairo
COMPONENT_ANITYA_ID=	13166

TPNO=			30739

# upstream delivers python2 support separately as "py2cairo"
PYTHON_VERSIONS=        $(PYTHON3_VERSIONS)

BUILD_STYLE= waf

# replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses waf.mk instead
CONFIGURE_64 = $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
BUILD_64     = $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
INSTALL_64   = $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
TEST_64      = $(PYTHON3_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)

include $(WS_MAKE_RULES)/common.mk

# Trick bundled waf into unpacking itself so we can patch it
COMPONENT_POST_UNPACK_ACTION += \
	(cd $(@D) ; $(PYTHON.3.5) waf --help >> /dev/null );

# Do not install optimised compiled .pyo files
CONFIGURE_OPTIONS += --nopyo

# This needed to be added for pycairo to build cleanly s12_109 onwards
studio_C99MODE = $(studio_C99_ENABLE)

# The bundled waf compiles to the old pre-python-3.2 locations, so
# tell it not to bother, and take care of it ourselves
CONFIGURE_OPTIONS += --nopyc
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)$(PYTHON_LIB)/cairo ;

# waf picks up the PYTHONDIR & PYTHONARCHDIR settings at configure time,
# but still insists on installing to site-packages instead of vendor-packages
PYTHON_SITE_DIR = $(USRLIB)/python$(PYTHON_VERSION)/site-packages
COMPONENT_PRE_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)$(PYTHON_LIB)/cairo \
		 $(PROTO_DIR)$(PYTHON_SITE_DIR) ; \
	$(RM) -r $(PROTO_DIR)$(PYTHON_SITE_DIR) ; \
	$(LN) -s $(PROTO_DIR)$(PYTHON_LIB) $(PROTO_DIR)$(PYTHON_SITE_DIR) ; \
	$(RM) -r $(PROTO_DIR)$(PYTHON_LIB)/cairo/64 ; \
	$(LN) -s . $(PROTO_DIR)$(PYTHON_LIB)/cairo/64

# the test scripts aren't hooked into the test target in pycairo, so run directly
COMPONENT_TEST_DIR = $(@D)/test
COMPONENT_TEST_CMD = /usr/bin/py.test-$(PYTHON_VERSION)
COMPONENT_TEST_TARGETS =
# Display warnings that may be raised by tests
COMPONENT_TEST_ARGS += -rw
# Upstream hasn't made their code pep8 clean, and we're not forking to do it
COMPONENT_TEST_ARGS += -p no:codechecker
# Workaround Bug 26654485 (pytest_capturelog causes warnings if installed)
COMPONENT_TEST_ARGS += -p no:capturelog

# more bits replicated from $(WS_MAKE_RULES)/setup.py.mk
COMPONENT_TEST_BUILD_DIR = $(BUILD_DIR)/test/$(MACH$(BITS))-$(PYTHON_VERSION)
# This would separate results per python version, but pycairo can use a
# common results file for all versions for now:
# COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION)-$(BITS).master
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_OUTPUT = $(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-$(BITS)-results
COMPONENT_TEST_DIFFS =  $(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-$(BITS)-diffs
COMPONENT_TEST_SNAPSHOT = $(COMPONENT_TEST_BUILD_DIR)/results-$(PYTHON_VERSION)-$(BITS).snapshot
COMPONENT_TEST_TRANSFORM_CMD = $(COMPONENT_TEST_BUILD_DIR)/transform-$(PYTHON_VERSION)-$(BITS)-results

# Test scripts just run 'python', but we need to specify the right version
COMPONENT_PRE_TEST_ACTION += $(GSED) -i -e 's%/usr/bin/env python%$(PYTHON)%' \
	-e "s%subprocess.call('python %subprocess.call('$(PYTHON) %" \
	$(COMPONENT_TEST_DIR)/*.py

# Exclude lines with version information of other packages, so we don't have
# to update our results everytime one of them is updated.
COMPONENT_TEST_TRANSFORMS += '-e "/^platform sunos5/d" ' '-e "/^plugins: /d"'
COMPONENT_TEST_TRANSFORMS += '-e "s/ in [0-9]*\.[0-9]* seconds//" '

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += runtime/python-34
REQUIRED_PACKAGES += runtime/python-35

# py.test is required for testing, not building or runtime
REQUIRED_PACKAGES += library/python/pytest

