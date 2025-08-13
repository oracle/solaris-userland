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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		braille-printer-app
COMPONENT_VERSION=	2.0.0
COMPONENT_PROJECT_URL=	https://github.com/OpenPrinting/$(COMPONENT_NAME)
GIT_REPO=		https://github.com/OpenPrinting/$(COMPONENT_NAME)
GIT_COMMIT_ID=		3df7f94
GIT_HASH=		sha256:3e526fd90c08f07e4eee557923a43faf9fd8ee460c51d3995b505990e534ac0b
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_BUGDB=	utility/cups
COMPONENT_BAID=		182118
COMPONENT_ANITYA_ID=	5541

include $(WS_MAKE_RULES)/common.mk

# configure script is not distributed
COMPONENT_PREP_ACTION = (cd $(@D); LC_ALL=C autoreconf -fiv)

CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are
# processed.
CONFIGURE_OPTIONS +=	MAKE=$(GMAKE)

COMPONENT_BUILD_ENV +=	PATH="$(GNUBIN):$(PATH)"
