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
# Copyright (c) 2005, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =		NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		bitstream-vera
COMPONENT_VERSION=	1.10
COMPONENT_PROJECT_URL=	http://www.gnome.org/fonts/
COMPONENT_SRC=		ttf-$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
	sha256:db5b27df7bbb318036ebdb75acd3e98f1bd6eb6608fb70a67d478cd243d178dc
COMPONENT_ARCHIVE_URL=  https://download.gnome.org/sources/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	x11/font
COMPONENT_ANITYA_ID=	198
COMPONENT_BAID= 	11410

TEST_TARGET= $(NO_TESTS)

# Not part of the GNOME incorporation, so not using gnome-component.mk
include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES= 		*.ttf
COMPONENT_FONT_DOC_FILES= 	*.TXT
