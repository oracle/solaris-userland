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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-input-keyboard
COMPONENT_VERSION=	2.1.0
COMPONENT_ARCHIVE_HASH= \
	sha256:77ce50f28c30347c6eb59169c12c19b639d73f10e49284b2849f023c6dee7c57
COMPONENT_BUGDB=        x11/input
COMPONENT_ANITYA_ID=	15902
COMPONENT_BAID=		191033

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk
