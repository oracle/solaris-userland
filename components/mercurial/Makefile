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
# Copyright (c) 2011, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 32_and_64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

PATH=$(USRBINDIR):$(GNUBIN):$(USRSBINDIR)

COMPONENT_NAME=		mercurial
COMPONENT_VERSION=	5.1.1
COMPONENT_PROJECT_URL=	http://mercurial-scm.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:0e716343d601e728530a4cb8e7b5d20b4a17a81b207e2527d521ead0671e2dfe
COMPONENT_ARCHIVE_URL=	https://www.mercurial-scm.org/release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/hg
COMPONENT_ANITYA_ID=	1969

TPNO=			55687

# Build mercurial for both Python 2.x and 3.x
PYTHON_VERSIONS = 2.7 3.7

BUILD_STYLE= setup.py

# Build and install 64-bit first, so that the 32-bit hg is what's installed.
INSTALL_TARGET = $(INSTALL_64) $(INSTALL_32)

# Disable the unit tests since the test results are outdated.
$(SKIP_TEST_AT_TOP_LEVEL)

# Add install dependency when system-test target is implemented.
include $(WS_MAKE_RULES)/common.mk

# Move the 'hg' main binary into it's own directory so that it can be mediated
COMPONENT_POST_INSTALL_ACTION = \
	(cd $(PROTO_DIR)/usr/bin; \
	$(MV) -f hg ../lib/python$(PYTHON_VERSION)/vendor-packages/mercurial);

# Make hg command executed by correct python version
COMPONENT_POST_INSTALL_ACTION += \
	$(call PYTHON_SCRIPT_SHEBANG_FIX_FUNC,$(PROTO_DIR)/usr/lib/python$(PYTHON_VERSION)/vendor-packages/mercurial)


PKG_PROTO_DIRS +=	$(COMPONENT_SRC)/contrib
PKG_PROTO_DIRS +=	$(COMPONENT_SRC)/doc
PKG_MACROS     +=	COMPONENT_SRC=$(COMPONENT_SRC)

GENERATE_PROTO_DIRS += $(COMPONENT_SRC)/contrib^usr/demo/mercurial

# The mercurial sources contain top level 'relnotes' directory and also
# 'contrib/relnotes' file. We deliver the 'contrib/relnotes' but the top level
# one confuses pkglint (because of the GENERATE_PROTO_DIRS above). So let's
# just remove it.
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(SOURCE_DIR); $(RM) -r relnotes);


# Use bash in sh mode for the tests; using /bin/sh on Solaris hasn't always
# worked, and using /bin/bash doesn't always work, either.  Also skip the
# tests which try to check all the code in the userland gate.  And finally,
# test the bits from the proto area, rather than rebuilding.  Given the way the
# test suite works, the hg executable must be named "hg".
#
# The test-commandserver.t seems to be some problem in the test suite itself,
# the test ends with:
# File "<WS>/build/prototype/i386/usr/lib/python2.7/vendor-packages/mercurial/hook.py", line 13, in <module>
#     from .i18n import _
# ValueError: Attempted relative import in non-package
# More detailed investigation is needed
TEST_BLACKLIST = \
	test-devel-warnings.t \
	test-hghave.t \
	test-run-tests.t \
	test-commandserver.t


COMPONENT_PRE_TEST_ACTION = \
	(cd $(BUILD_DIR); rm -f sh; ln -s /bin/bash sh; \
	printf "%s\n" $(TEST_BLACKLIST) > blacklist);

HGTEST_JOBS = 20

# Mercurial build process needs to be told that it's being built with Python
# 3.x
$(BUILD_DIR)/$(MACH64)-3.7/.built:  COMPONENT_BUILD_ENV += HGPYTHON3=1
$(BUILD_DIR)/$(MACH64)-3.7/.installed: COMPONENT_INSTALL_ENV += HGPYTHON3=1
$(BUILD_DIR)/$(MACH64)-3.7/.tested: COMPONENT_TEST_ENV += HGPYTHON3=1

COMPONENT_TEST_DIR =	$(COMPONENT_SRC)/tests
COMPONENT_TEST_ENV =	PYTHONPATH=$(PROTO_DIR)/$(PYTHON_LIB)
COMPONENT_TEST_ENV +=	TERM=dumb
COMPONENT_TEST_ENV +=	HGTEST_JOBS=$(or $(HGTEST_JOBS),1)
# We need GNU false(1) and diff(1)
COMPONENT_TEST_ENV += PATH=/usr/gnu/bin:/usr/bin
COMPONENT_TEST_ARGS =	./run-tests.py \
			--verbose \
			--timeout 600 \
			--slowtimeout 600 \
			--shell $(BUILD_DIR)/sh \
			--with-hg $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/mercurial/hg \
			--blacklist $(BUILD_DIR)/blacklist

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^\# Ran/p" ' \
	'-e "/^ERROR:/p" '

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

hg-local: clean prep
	# Prepare the locally installed hg in a separate directory, so that the
	# files are not later used in the resulting package
	$(RM) -r $(BUILD_DIR)/hg-local
	$(MKDIR) $(BUILD_DIR)
	$(CP) -r $(COMPONENT_SRC) $(BUILD_DIR)/hg-local
	gmake -C $(BUILD_DIR)/hg-local local $(PYTHON_ENV)


# Assuming you have docutils installed, update the manpages patch for a new
# mercurial version based on the patches applied to the source and to the
# manpage generator.Eventually we'll have docutils in the CBE and we'll be able
# to regenerate the manpages as part of the build, rather than patching them.
#
# Right now you have to
# - make sure that rst.patch and hgmanpage.patch applies
# sudo pip --proxy $http_proxy install docutils
# gmake regenerate-man-patch
#
# This recipe is just for the component maintainer's benefit.
.PHONY: regenerate-man-patch
regenerate-man-patch:
	$(RM) "$@"
	( \
	    ( : First create a workspace without manpages.patch applied ); \
	    $(RM) patches/manpages.patch; \
	    $(MAKE) clean prep; \
	    \
	    ( : Backup all the existing man pages ); \
	    cd $(COMPONENT_SRC); \
	    for f in hg.1 hgignore.5 hgrc.5 hg-ssh.8; do \
		$(CP) doc/$$f doc/$$f.orig; \
	    done; \
	    \
	    ( : Re-generate the man pages ); \
	    gmake -C doc man || true; \
	    \
	    ( : Run a diff and create new patch ); \
	    for f in hg.1 hgignore.5 hgrc.5 hg-ssh.8; do \
		diff -u ./doc/$$f.orig ./doc/$$f || : ; \
	    done | \
	    $$( : Remove timestamps by removing last three words \
	          to keep the diffs a bit less cluttered ) \
	    $(PERL) -pe 's/^(---|\+\+\+)(.*?)(\s+\S+){3}$$/$$1$$2/' > \
		$(COMPONENT_DIR)/patches/manpages.patch; \
	)

REQUIRED_PACKAGES += file/gnu-coreutils
REQUIRED_PACKAGES += text/gnu-diffutils
