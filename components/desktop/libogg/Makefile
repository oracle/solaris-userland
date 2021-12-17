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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

BUILD_BITS= 		32_and_64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libogg
COMPONENT_VERSION=	1.3.4
COMPONENT_PROJECT_URL=	https://xiph.org/ogg/
COMPONENT_ARCHIVE_HASH= \
	sha256:fe5670640bd49e828d64d2879c31cb4dde9758681bb664f9bdbf159a01b0c76e
COMPONENT_ARCHIVE_URL=	http://downloads.xiph.org/releases/ogg/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	1694

COMPONENT_BAID=		71210

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += system/library/math
