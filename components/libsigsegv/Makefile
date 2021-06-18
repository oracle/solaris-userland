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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libsigsegv
COMPONENT_VERSION=	2.13
COMPONENT_ARCHIVE_HASH=	\
    sha256:be78ee4176b05f7c75ff03298d84874db90f4b6c9d5503f0da1226b3a3c48119
COMPONENT_BUGDB=	library/libsigsegv
COMPONENT_ANITYA_ID=	1722

TPNO=			71884

GENERATE_PROTO_DIRS += man3

include $(WS_MAKE_RULES)/gnu-component.mk

# Disable Address Space Layout Randomization
# since it breaks the detection of stack overflows.
ASLR_MODE= $(ASLR_DISABLE)

CONFIGURE_OPTIONS  +=		--disable-static
CONFIGURE_OPTIONS  +=		--enable-shared

# Avoid libtool errors during the unit tests.
unexport SHELLOPTS
