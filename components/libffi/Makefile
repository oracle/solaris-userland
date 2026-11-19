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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libffi
COMPONENT_VERSION=	3.8.0
COMPONENT_PROJECT_URL=	http://sourceware.org/libffi/
COMPONENT_ARCHIVE_HASH= \
    sha256:7da3e2d9a171eb0a038f592ecad3ff2bb2550f3496d87b3b29ad0cf4430c0db4
COMPONENT_ARCHIVE_URL=	https://github.com/libffi/libffi/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libffi
COMPONENT_ANITYA_ID=	1611

COMPONENT_BAID=	468997

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_DIR =	$(@D)/testsuite

# DejaGnu does not inherit CFLAGS.  Match the library's data model so tests
# link against the freshly built libffi instead of the installed library.
COMPONENT_TEST_ARGS += RUNTESTFLAGS="--target_board=unix/-m$(BITS)"

COMPONENT_TEST_TRANSFORMS += \
	'-e "s|^Test Run By.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^Native configuration is.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^make.*: Leaving directory.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^make.*: Entering directory.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "/^XXX_REMOVE_XXX$$/d" ' \
	'-e "/^Test run by .* on /d" ' \
	'-e "/^Making a new /d" ' \
	'-e "/^Using.*as tool init file/d" '

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

CFLAGS += -DFFI_MMAP_EXEC_WRIT=1

CONFIGURE_OPTIONS += --disable-raw-api
CONFIGURE_ENV += MAKE=$(GMAKE)

CBE_PACKAGES += system/library/gcc/gcc-c-runtime

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
