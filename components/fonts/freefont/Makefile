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
# Copyright (c) 2017, 2023, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		freefont
COMPONENT_VERSION=	20120503
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-ttf-$(COMPONENT_VERSION).zip
COMPONENT_PROJECT_URL=	https://www.gnu.org/software/freefont/
COMPONENT_ARCHIVE_URL=	https://ftp.gnu.org/gnu/freefont/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
    sha256:7c85baf1bf82a1a1845d1322112bc6ca982221b484e3b3925022e25b5cae89af
COMPONENT_BUGDB=	g11n/font
COMPONENT_ANITYA_ID=	9983
COMPONENT_BAID=		23770

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES=	*.ttf
COMPONENT_FONT_DOC_FILES= AUTHORS CREDITS ChangeLog README TROUBLESHOOTING USAGE
