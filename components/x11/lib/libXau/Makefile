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

COMPONENT_NAME=		libXau
COMPONENT_VERSION=	1.0.12
COMPONENT_ARCHIVE_HASH= \
	sha256:74d0e4dfa3d39ad8939e99bda37f5967aba528211076828464d2777d477fc0fb
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1765
COMPONENT_BAID=		191058

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xau.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xau

CONFIGURE_OPTIONS += --enable-xthreads

LINT_FLAGS += -I$(PROTOUSRINCDIR)/X11

LD_OPTIONS += -M$(COMPONENT_DIR)/mapfile

REQUIRED_PACKAGES += x11/header/x11-protocols
