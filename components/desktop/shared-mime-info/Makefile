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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		shared-mime-info
COMPONENT_VERSION=	2.2
COMPONENT_PROJECT_URL=	https://freedesktop.org/wiki/Software/shared-mime-info/
COMPONENT_ARCHIVE_HASH= \
	sha256:7e571525280ebd3ef1d6234f0ea7a0bc675b37b2b0f45497afd894ad49de5efb
COMPONENT_ARCHIVE_URL=	\
	https://gitlab.freedesktop.org/xdg/shared-mime-info/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	5524
COMPONENT_BAID=		136073

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/common.mk

# Don't generate files at build time that update-mime-database will be
# generating from svc:/application/desktop-cache/mime-types-cache:default
# so we don't suck them into the package and then have pkg verify errors
CONFIGURE_OPTIONS += -Dupdate-mimedb=false

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
# Needed for minimal-fs dependency in mime-types-cache.xml SMF manifest:
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += text/gnu-gettext
