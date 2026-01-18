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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
override CONSOLIDATION = userland

include ../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

PATH=$(USRBINDIR):$(GNUBIN):$(USRSBINDIR)

COMPONENT_NAME=		mercurial
COMPONENT_VERSION=	7.1.2
VERSION_DIRECTORY=	71
COMPONENT_PROJECT_URL=	http://mercurial-scm.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:ce27b9a4767cf2ea496b51468bae512fa6a6eaf0891e49f8961dc694b4dc81ca
COMPONENT_ARCHIVE_URL=	https://www.mercurial-scm.org/release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/hg
COMPONENT_ANITYA_ID=	1969
COMPONENT_BAID=		358191

PYTHON_VERSIONS= 3.11 3.13
BUILD_STYLE= pybuild

# Add install dependency when system-test target is implemented.
include $(WS_MAKE_RULES)/common.mk

# Move the 'hg' main binary into it's own directory so that it can be mediated
COMPONENT_POST_INSTALL_ACTION = \
	(cd $(PROTO_DIR)/usr/bin; \
	$(MV) -f hg ../lib/python$(PYTHON_VERSION)/vendor-packages/mercurial);

# Regenerate man pages modified by patches/rst.patch
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(COMPONENT_SRC); gmake -C doc man PYTHON=$(PYTHON));

PKG_PROTO_DIRS +=	$(COMPONENT_SRC)/contrib
PKG_PROTO_DIRS +=	$(COMPONENT_SRC)/doc
PKG_MACROS     +=	COMPONENT_SRC=$(COMPONENT_SRC)

# Scan directory "contrib" and place everything under /usr/demo/mercurialXY
GENERATE_PROTO_DIRS += $(COMPONENT_SRC)/contrib^usr/demo/mercurial$(VERSION_DIRECTORY)

# The mercurial sources contain top level 'relnotes' directory and also
# 'contrib/relnotes' file. We deliver the 'contrib/relnotes' but the top level
# one confuses pkglint (because of the GENERATE_PROTO_DIRS above). So let's
# just remove it.
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(SOURCE_DIR); $(RM) -r relnotes);


COMPONENT_PRE_TEST_ACTION = \
	(cd $(BUILD_DIR); rm -f sh; ln -s /bin/bash sh);

HGTEST_JOBS = 20
HGTEST_TIMEOUT = 720

COMPONENT_TEST_DIR =	$(COMPONENT_SRC)/tests
COMPONENT_TEST_ENV =	PYTHONPATH=$(PROTO_DIR)/$(PYTHON_LIB)
COMPONENT_TEST_ENV +=	TERM=dumb
COMPONENT_TEST_ENV +=	HGTEST_JOBS=$(or $(HGTEST_JOBS),1)
COMPONENT_TEST_ENV +=	HGTEST_TIMEOUT=$(or $(HGTEST_TIMEOUT),360)
# We need GNU false(1) and diff(1)
COMPONENT_TEST_ENV +=	PATH=/usr/gnu/bin:/usr/bin

# The extra large timeout is needed for test test-copies-chain-merge.t which is
# very slow on sparc. It takes 700+ seconds.
COMPONENT_TEST_ARGS =	./run-tests.py \
			--verbose \
			--timeout 4800 \
			--slowtimeout 4800 \
			--shell $(BUILD_DIR)/sh \
			--with-hg $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/mercurial/hg

# Print just total test count and tests which failed
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^\# Ran/p" ' \
	'-e "/^ERROR:/p" ' \
	'-e "/^Failed /p" '

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

hg-local: clean prep
	# Prepare the locally installed hg in a separate directory, so that the
	# files are not later used in the resulting package
	$(RM) -r $(BUILD_DIR)/hg-local
	$(MKDIR) $(BUILD_DIR)
	$(CP) -r $(COMPONENT_SRC) $(BUILD_DIR)/hg-local
	gmake -C $(BUILD_DIR)/hg-local local $(PYTHON_ENV)


PKG_MACROS +=    VERSION_DIRECTORY=$(VERSION_DIRECTORY)

REQUIRED_PACKAGES += developer/documentation-tool/docutils
REQUIRED_PACKAGES += file/gnu-coreutils
REQUIRED_PACKAGES += text/gnu-diffutils
