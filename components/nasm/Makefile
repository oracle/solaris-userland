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
# Copyright (c) 2021, 2023, Oracle and/or its affiliates.
#

BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		nasm
COMPONENT_VERSION=	2.16.01
IPS_COMPONENT_VERSION=	2.16.1
COMPONENT_PROJECT_URL=	https://www.nasm.us/
COMPONENT_ARCHIVE_HASH=	\
    sha256:d833bf0f5716e89dbcd345b7f545f25fe348c6e2ef16dbc293e1027bcd22d881
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/pub/nasm/releasebuilds/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	2048

COMPONENT_BAID= 139126

COMPONENT_ARCHIVE_1 = $(COMPONENT_SRC)-test-results.tar.bz2
COMPONENT_ARCHIVE_HASH_1 = \
    sha256:03503e13addb95d3127c3e8a9b3a51a64c0581c4d7d0faa1660e9b9fd76fa3ae
COMPONENT_ARCHIVE_URL_1 =  make://golden-test-results/$(COMPONENT_ARCHIVE_1)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_TEST_TARGETS = test

COMPONENT_PRE_TEST_ACTION += \
	(cd $(@D); gtar  --transform 's,$(COMPONENT_SRC)/,,' -xf $(COMPONENT_DIR)/$(COMPONENT_ARCHIVE_1));

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
