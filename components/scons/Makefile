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
# Copyright (c) 2015, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		scons
COMPONENT_VERSION=	3.1.1
COMPONENT_PROJECT_URL=	http://www.scons.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:32beeb908ef34d172e2121a39dae8680ed4033ece212cd31253e4ce118996ad1
COMPONENT_ARCHIVE_URL=	\
    https://sourceforge.net/projects/$(COMPONENT_NAME)/files/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)/download
COMPONENT_ANITYA_ID=	4770

TPNO=			54196

# we only need a single version of SCons
PYTHON_VERSIONS = 3.7

BUILD_STYLE= setup.py
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

PKG_MACROS += PYVER=$(PYTHON_VERSION)

# pkgdepend doesn't like the first line of a Python script to be:
# '#!/usr/bin/env python' so turn it into '#!/usr/bin/python$(PYTHON_VERSION)'
COMPONENT_POST_INSTALL_ACTION += \
	$(GSED) -i -e 's?env python?python$(PYTHON_VERSION)?' \
		$(PROTOUSRBINDIR)/*-$(COMPONENT_VERSION);

PKG_PROTO_DIRS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)
