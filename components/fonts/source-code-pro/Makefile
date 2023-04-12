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

COMPONENT_NAME=		source-code-pro
COMPONENT_VERSION=	2.010R-ro-1.030R-it
IPS_COMPONENT_VERSION=	20150707
COMPONENT_SRC=		source-code-pro-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	https://fonts.google.com/specimen/Source+Code+Pro
COMPONENT_ARCHIVE_URL=	https://github.com/adobe-fonts/source-code-pro/archive/2.010R-ro/1.030R-it.tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:3ee5a0d04e6586f12de038cb33ec963f137bbc4907ae1e10a6333478a2b884f8

COMPONENT_BUGDB=	g11n/font
COMPONENT_BAID=		28053

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_SRC_DIR=		TTF
COMPONENT_FONT_FILES= 		*.ttf
COMPONENT_FONT_DOC_FILES=	LICENSE.txt README.md
