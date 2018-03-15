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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		shared-mime-info
COMPONENT_VERSION=	1.8
COMPONENT_PROJECT_URL=	https://freedesktop.org/wiki/Software/shared-mime-info/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:2af55ef1a0319805b74ab40d331a3962c905477d76c086f49e34dc96363589e9
COMPONENT_ARCHIVE_URL=	http://freedesktop.org/~hadess/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	5524

TPNO=			37223

include $(WS_MAKE_RULES)/common.mk

# Requires gnu versions of xgettext & msgfmt first in $PATH
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

# Don't generate files at build time that update-mime-database will be
# generating from svc:/application/desktop-cache/mime-types-cache:default
# so we don't suck them into the package and then have pkg verify errors
CONFIGURE_OPTIONS += --disable-update-mimedb

REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += text/gnu-gettext
