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
# Copyright (c) 2014, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		jansson
COMPONENT_VERSION=	2.15.1
COMPONENT_PROJECT_URL=	http://www.digip.org/jansson
COMPONENT_SRC_URL=	https://github.com/akheron/jansson
COMPONENT_ARCHIVE_HASH=	\
    sha256:0c7114dc0b2d22a670724a1f95922029d7077c19dbf79a584cb8084d2f267f2f
COMPONENT_ARCHIVE_URL=	$(COMPONENT_SRC_URL)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/jansson
COMPONENT_ANITYA_ID=	1417
COMPONENT_BAID=		431179

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

LINT_FLAGS += -I$(PROTOUSRINCDIR)

CONFIGURE_OPTIONS += --includedir=$(USRINCDIR)/jansson

# build and install documentation
COMPONENT_POST_BUILD_ACTION.64 += \
	(cd $(BUILD_DIR_64)/doc ; $(GMAKE) html man)

COMPONENT_POST_INSTALL_ACTION.64 += \
	($(MKDIR) $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_SRC); \
	$(CP) -r $(BUILD_DIR_64)/doc/_build/html $(PROTOUSRSHAREDOCDIR)/$(COMPONENT_SRC); \
	$(MKDIR) $(PROTOUSRSHAREMAN3DIR)lib; \
	$(CP) -r $(BUILD_DIR_64)/doc/_build/man/* $(PROTOUSRSHAREMAN3DIR)lib)

# The test/suites/api/check-exports uses nm and expects it to be the GNU kind.
COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(PATH)

# Remove accidentally packaged stale test artifacts
# which otherwise break our out-of-source testing.
COMPONENT_PREP_ACTION += $(RM) \
	$(@D)/scripts/clang-format-check.log \
	$(@D)/scripts/clang-format-check.trs

CBE_PACKAGES += developer/documentation-tool/sphinx

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
