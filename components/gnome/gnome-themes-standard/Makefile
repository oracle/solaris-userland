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

BUILD_BITS=             64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-themes-standard
COMPONENT_VERSION=	3.22.2
COMPONENT_ARCHIVE_HASH= \
	sha256:b34516cd59b873c187c1897c25bac3b9ce2d30a472f1fd7ae9d7105d93e17da5
COMPONENT_BUGDB=        gnome/themes
COMPONENT_ANITYA_ID=	10894

COMPONENT_BAID=		38913

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU find is first in path during build & install process.
CONFIGURE_ENV 		+= PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV 	+= PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV 	+= PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += --disable-gtk2-engine

REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
