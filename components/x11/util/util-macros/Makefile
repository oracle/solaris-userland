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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		util-macros
COMPONENT_VERSION=	1.19.0
COMPONENT_ARCHIVE_HASH= \
	sha256:2835b11829ee634e19fa56517b4cfc52ef39acea0cd82e15f68096e27cbed0ba
COMPONENT_BUGDB=        x11/builds
COMPONENT_ANITYA_ID=	15037

TEST_TARGET = $(NO_TESTS)

# Install additional data files under xorg-macros instead of the
# too-generic "util-macros"
COMPONENT_PREP_ACTION +=  \
	$(PERL) -i.orig -p -e 's{util-macros}{xorg-macros}g' \
	$(SOURCE_DIR)/configure.ac ;

COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF) -fiv);

include $(WS_MAKE_RULES)/x11-component.mk

