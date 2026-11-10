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
# Copyright (c) 2021, 2026, Oracle and/or its affiliates.
#

BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nasm
COMPONENT_VERSION=	3.02
IPS_COMPONENT_VERSION=	3.2
COMPONENT_PROJECT_URL=	https://www.nasm.us/
COMPONENT_ARCHIVE_HASH=	\
    sha256:f504227b2f529e658d41629075f0503b38d67d790af345f34eba4af60c6a5998
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/pub/nasm/releasebuilds/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	2048

COMPONENT_BAID= 465616

COMPONENT_ARCHIVE_1 = $(COMPONENT_SRC)-test-results.tar.bz2
COMPONENT_ARCHIVE_HASH_1 = \
    sha256:e9549b4601674961ecfcde440c055d402cf99643568c2ae68bf7286a8934992d
COMPONENT_ARCHIVE_URL_1 =  make://golden-test-results/$(COMPONENT_ARCHIVE_1)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_TEST_TARGETS = test
# The top-level upstream target changes into the source tree.  Run the
# test subdirectory target against the cloned tree and its built ../nasm.
COMPONENT_TEST_ARGS += -C test

COMPONENT_PRE_TEST_ACTION += \
	(cd $(@D); gtar  --transform 's,$(COMPONENT_SRC)/,,' -xf $(COMPONENT_DIR)/$(COMPONENT_ARCHIVE_1));

# performtest.pl does not fail when a golden file cannot be compared.
# The existing golden recipe omits compilation-date-dependent _version
# output, so check the version independently.
COMPONENT_POST_TEST_ACTION = \
	$(@D)/nasm -v | /usr/gnu/bin/grep '^NASM version 3\.02 ' && \
	/usr/gnu/bin/awk '\
	    /performtest\.pl/ { ran = 1 } \
	    $$0 == "Can\047t compare at _version/version file stdout" { next } \
	    /Can\047t compare|failed on|Warning:|\*\*\*/ { print; bad = 1 } \
	    END { exit (bad || !ran) }' $(COMPONENT_TEST_OUTPUT)

COMPONENT_TEST_TRANSFORMS = \
        '-e "/^Test /p" ' \
	'-e "/.*/d" '

# Build nasm so that 'golden' test resutls can be created and stored.
golden-test-results:
	$(RM) -r $(COMPONENT_SRC); gtar xf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE); \
	cd $(COMPONENT_SRC); \
	  for i in `find $(COMPONENT_DIR)/patches -name '*.patch'` ; do gpatch -p1 < $$i; done ; \
	  $(ENV) $(CONFIGURE_ENV) $(CONFIG_SHELL) $(CONFIGURE_SCRIPT) $(CONFIGURE_OPTIONS) ; \
	  $(ENV) $(COMPONENT_BUILD_ENV) $(GMAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS) ; \
	  cd test; $(ENV) $(COMPONENT_BUILD_ENV) $(GMAKE) golden; $(RM) -r golden/_version
	TZ=UTC gtar cjvf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_1) --sort=name \
	  --mtime='1970-01-01' --owner=root --group=root $(COMPONENT_SRC)/test/golden
	/usr/bin/sha256sum $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_1)

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
