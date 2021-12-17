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
# Copyright (c) 2012, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		sg3_utils
COMPONENT_VERSION=	1.46
COMPONENT_PROJECT_URL=	http://sg.danny.cz/sg/sg3_utils.html
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_HASH= \
    sha256:701dfa3c828867f97e904d25f280346d46da9e582a66e6afebe2b294ae4a6176
COMPONENT_ARCHIVE_URL=	http://sg.danny.cz/sg/p/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/sg3utils
COMPONENT_ANITYA_ID=	4801

COMPONENT_BAID=		111445

# Even though "gmake check" goes to completion, it doesn't really do anything.
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I$(COMPONENT_DIR)/$(COMPONENT_SRC)/include

CONFIGURE_OPTIONS +=	--disable-static

COMPONENT_INSTALL_ARGS += bindir=$(USRBINDIR)

# Don't use rpath!
COMPONENT_POST_CONFIGURE_ACTION = \
	(cd $(@D) ; \
	$(GSED) -i 's|^hardcode_libdir_flag_spec=.*|hardcode_libdir_flag_spec=""|g' libtool ; \
	$(GSED) -i 's|^runpath_var=LD_RUN_PATH|runpath_var=DIE_RPATH_DIE|g' libtool)
