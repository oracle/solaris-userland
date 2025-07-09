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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		scons
COMPONENT_VERSION=	4.9.1
COMPONENT_PROJECT_URL=	http://www.scons.org/
COMPONENT_ARCHIVE=	SCons-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e2d78aa56e4646e5dbaf50c0758c6d1e4b0418464d8d6d07a09beb6cf257538f
COMPONENT_ARCHIVE_URL=	\
    https://sourceforge.net/projects/$(COMPONENT_NAME)/files/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)/download
COMPONENT_ANITYA_ID=	4770
COMPONENT_BAID=		333777

# we only need a single version of SCons
PYTHON_VERSION = 3.13
PYTHON_VERSIONS = $(PYTHON_VERSION)

BUILD_STYLE= pybuild
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

PKG_MACROS += PYVER=$(PYTHON_VERSION)

# man pages are not installed automatically
COMPONENT_POST_INSTALL_ACTION += ( \
    $(MKDIR) $(PROTO_DIR)/usr/share/man/man1; \
    $(CP) $(SOURCE_DIR)/*\.1 $(PROTO_DIR)/usr/share/man/man1; \
);
