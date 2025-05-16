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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-browser-connector
COMPONENT_VERSION=	42.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GnomeShellIntegration
COMPONENT_SRC=		$(COMPONENT_NAME)-v$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL=	\
	https://gitlab.gnome.org/nE0sIghT/gnome-browser-connector/-/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:3df9eabee19bbcae6e9be81eb123a7de42026d8c265a65ecb4f7df292708ac6e
COMPONENT_BUGDB=	gnome/gnome-shell
COMPONENT_ANITYA_ID=	311451
COMPONENT_BAID=		128909

PYTHON_VERSION = 3.11

TEST_TARGET = $(NO_TESTS)

BUILD_STYLE = meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Need to use GNU head
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Need to convert "#! /usr/bin/env python" to actual path for pkgdepend to work
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/gnome-browser-connector
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/gnome-browser-connector-host

REQUIRED_PACKAGES += library/python/pygobject-3-311
REQUIRED_PACKAGES += runtime/python-311
