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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		scons
COMPONENT_VERSION=	4.4.0
COMPONENT_PROJECT_URL=	http://www.scons.org/
COMPONENT_SRC=		SCons-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:abb46de98cc8fa23fbcb2a591f26e143ee7e7df4927fb5b7c2d5b88c2826ebb1
COMPONENT_ARCHIVE_URL=	\
    https://sourceforge.net/projects/$(COMPONENT_NAME)/files/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)/download
COMPONENT_ANITYA_ID=	4770
COMPONENT_BAID=		133404

# we only need a single version of SCons
PYTHON_VERSION = 3.11
PYTHON_VERSIONS = $(PYTHON_VERSION)

BUILD_STYLE= setup.py
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

PKG_MACROS += PYVER=$(PYTHON_VERSION)

PKG_PROTO_DIRS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)
