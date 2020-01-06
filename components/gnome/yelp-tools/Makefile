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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		yelp-tools
COMPONENT_VERSION=	3.32.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Yelp/Tools
COMPONENT_ARCHIVE_HASH= \
	sha256:183856b5ed0b0bb2c05dd1204af023946ed436943e35e789afb0295e5e71e8f9
COMPONENT_BUGDB=        gnome/docviewer
COMPONENT_ANITYA_ID=	8420

TPNO=			54136

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += library/gnome/yelp-xsl
REQUIRED_PACKAGES += library/libxslt
