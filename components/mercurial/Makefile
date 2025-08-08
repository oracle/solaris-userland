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
BUILD_BITS= 64
COMPILER= gcc
override CONSOLIDATION = userland

include ../../make-rules/shared-macros.mk

PATH=$(USRBINDIR):$(GNUBIN):$(USRSBINDIR)

COMPONENT_NAME=		mercurial
COMPONENT_VERSION=	6.8
VERSION_DIRECTORY=	68
COMPONENT_PROJECT_URL=	http://mercurial-scm.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:08e4d0e5da8af1132b51e6bc3350180ad57adcd935f097b6d0bc119a2c2c0a10
COMPONENT_ARCHIVE_URL=	https://www.mercurial-scm.org/release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/hg
COMPONENT_ANITYA_ID=	1969

COMPONENT_BAID=		174608

PYTHON_VERSIONS= 3.11
BUILD_STYLE= setup.py

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


# The tests which are failing and we do not want to fix or investigate deeper
# test-debugcommands.t - sometimes fails, looks like a race condition? It seems to work with Python 3.11
# test-commandserver.t - guess is that the test does not expect us to built outside of directory
# test-removeemptydirs.t - empty directories seem to behave differently in Solaris
# test-dirstate-read-race.t - needs more investigation
TEST_BLACKLIST = \
	test-debugcommands.t \
	test-commandserver.t \
	test-removeemptydirs.t \
	test-dirstate-read-race.t

COMPONENT_PRE_TEST_ACTION = \
	(cd $(BUILD_DIR); rm -f sh; ln -s /bin/bash sh; \
	printf "%s\n" $(TEST_BLACKLIST) > blacklist);

HGTEST_JOBS = 20
HGTEST_TIMEOUT = 720

COMPONENT_TEST_DIR =	$(COMPONENT_SRC)/tests
COMPONENT_TEST_ENV =	PYTHONPATH=$(PROTO_DIR)/$(PYTHON_LIB)
COMPONENT_TEST_ENV +=	TERM=dumb
COMPONENT_TEST_ENV +=	HGTEST_JOBS=$(or $(HGTEST_JOBS),1)
COMPONENT_TEST_ENV +=	HGTEST_TIMEOUT=$(or $(HGTEST_TIMEOUT),360)
# We need GNU false(1) and diff(1)
COMPONENT_TEST_ENV += PATH=/usr/gnu/bin:/usr/bin

# The extra large timeout is needed for test test-copies-chain-merge.t which is
# very slow on sparc. It takes 700+ seconds.
COMPONENT_TEST_ARGS =	./run-tests.py \
			--verbose \
			--timeout 4800 \
			--slowtimeout 4800 \
			--shell $(BUILD_DIR)/sh \
			--with-hg $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/mercurial/hg \
			--blacklist $(BUILD_DIR)/blacklist

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
