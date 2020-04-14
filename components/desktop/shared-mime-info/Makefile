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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		shared-mime-info
COMPONENT_VERSION=	1.15
COMPONENT_PROJECT_URL=	https://freedesktop.org/wiki/Software/shared-mime-info/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:f482b027437c99e53b81037a9843fccd549243fd52145d016e9c7174a4f5db90
COMPONENT_ARCHIVE_URL=	\
	https://gitlab.freedesktop.org/xdg/shared-mime-info/uploads/b27eb88e4155d8fccb8bb3cd12025d5b/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	5524

TPNO=			58366

include $(WS_MAKE_RULES)/common.mk

# Requires gnu versions of xgettext & msgfmt first in $PATH
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

# Don't generate files at build time that update-mime-database will be
# generating from svc:/application/desktop-cache/mime-types-cache:default
# so we don't suck them into the package and then have pkg verify errors
CONFIGURE_OPTIONS += --disable-update-mimedb
CONFIGURE_OPTIONS += --disable-dependency-tracking

# Tests need GNU version of make to work correctly
COMPONENT_TEST_ENV +=   PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += text/gnu-gettext
