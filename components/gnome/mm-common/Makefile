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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS= 		NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mm-common
COMPONENT_VERSION=	1.0.5
COMPONENT_PROJECT_URL=	https://developer.gnome.org/glibmm/stable/
COMPONENT_ARCHIVE_HASH= \
    sha256:705c6d29f4116a29bde4e36cfc1b046c92b6ef8c6dae4eaec85018747e6da5aa
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13152

COMPONENT_BAID=		155729
BUILD_STYLE=		meson

# Use explicit Python version rather than the default one
PYTHON_VERSION = 3.11
CONFIGURE_ENV += PYTHON=$(PYTHON)

# pkgdepend complains if it doesn't find a version of python specified
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/mm-common-get

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += shell/ksh93
