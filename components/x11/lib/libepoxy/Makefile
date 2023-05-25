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

BUILD_BITS =            64_and_32
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libepoxy
COMPONENT_VERSION=	1.5.10
COMPONENT_PROJECT_URL=  https://github.com/anholt/libepoxy
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL=  $(COMPONENT_PROJECT_URL)/archive/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:a7ced37f4102b745ac86d6a70a9da399cc139ff168ba6b8002b4d8d43c900c15
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	6090
COMPONENT_BAID=		144001

BUILD_STYLE=		meson

# Tests need work to compile
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += x11/library/mesa
