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

BUILD_BITS =            64_and_32
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxkbfile
COMPONENT_VERSION=	1.1.3
COMPONENT_ARCHIVE_HASH= \
	sha256:a9b63eea997abb9ee6a8b4fbb515831c841f471af845a09de443b28003874bec
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1781
COMPONENT_BAID=		175861

# required because of a patched Makefile.am
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv);

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xkbfile.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
