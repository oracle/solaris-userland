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
# Copyright (c) 2019, 2020, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		meson
COMPONENT_VERSION=	0.54.3
COMPONENT_PROJECT_URL=	http://mesonbuild.com/
COMPONENT_ARCHIVE_HASH=	\
    sha256:f2bdf4cf0694e696b48261cdd14380fb1d0fe33d24744d8b2df0c12f33ebb662
COMPONENT_ARCHIVE_URL=	https://github.com/mesonbuild/meson/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_BUGDB=        utility/meson
COMPONENT_ANITYA_ID=	6472

TPNO=			59806

# As of 0.51.0, meson requires Python 3.5 or newer, and we only need
# to build for a single version, not all of them.
PYTHON_VERSIONS=	$(PYTHON_VERSION)

BUILD_STYLE= setup.py
include $(WS_MAKE_RULES)/common.mk

# Assumes GNU msgfmt is first in PATH
PYTHON_ENV += PATH="$(GCC_ROOT)/bin:$(GNUBIN):$(USRBINDIR64):$(USRBINDIR):$(SPRO_VROOT)/bin"

COMPONENT_PRE_INSTALL_ACTION += \
	$(RM) -r $(PROTOUSRSHAREDIR) ;

COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTO_DIR)$(PYTHON_DATA)/share $(PROTOUSRSHAREDIR) ;

COMPONENT_TEST_DIR=	$(COMPONENT_SRC)
COMPONENT_TEST_CMD=	./run_tests.py
COMPONENT_TEST_ARGS=
COMPONENT_TEST_MASTER=	$(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

# Test transforms retain only reproducible summaries of results output.
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Total .* time/d" ' \
	'-e "s/[0-9][0-9\.]* *s//" ' \
        '-e "/Total/p" ' \
	'-e "/^test/p" ' \
        '-e "/PASS/p" ' \
        '-e "/FAIL/p" ' \
        '-e "/ERROR/p" '

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)

# Ninja is needed at runtime, including when running tests, but not to build
REQUIRED_PACKAGES += developer/build/ninja

