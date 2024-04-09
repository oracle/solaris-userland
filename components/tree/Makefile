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
# Copyright (c) 2014, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		tree
COMPONENT_VERSION=	2.1.1
COMPONENT_BAID=		161730
COMPONENT_ARCHIVE_HASH=	sha256:bcd2a0327ad40592a9c43e09a4d2ef834e6f17aa9a59012a5fb1007950b5eced
COMPONENT_SRC_NAME=	unix-$(COMPONENT_NAME)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	https://gitlab.com/OldManProgrammer/unix-tree
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	5006

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Fixes creation of executable
LDFLAGS += $(CC_BITS)

COMPONENT_BUILD_ARGS += CC="$(CC)"
COMPONENT_BUILD_ARGS += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ARGS += LDFLAGS="$(LDFLAGS)"
COMPONENT_INSTALL_ARGS += DESTDIR=$(PROTOUSRBINDIR)
COMPONENT_INSTALL_ARGS += MANDIR=$(PROTOUSRSHAREMANDIR)
