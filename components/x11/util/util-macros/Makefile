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
# Copyright (c) 2018, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		util-macros
COMPONENT_VERSION=	1.20.0
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:0b86b262dbe971edb4ff233bc370dfad9f241d09f078a3f6d5b7f4b8ea4430db
COMPONENT_BUGDB=        x11/builds
COMPONENT_ANITYA_ID=	15037
COMPONENT_BAID=		140607

TEST_TARGET = $(NO_TESTS)

# Install additional data files under xorg-macros instead of the
# too-generic "util-macros"
COMPONENT_PREP_ACTION +=  \
	$(PERL) -i.orig -p -e 's{util-macros}{xorg-macros}g' \
	$(SOURCE_DIR)/configure.ac ;

COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF) -fiv);

include $(WS_MAKE_RULES)/x11-component.mk

