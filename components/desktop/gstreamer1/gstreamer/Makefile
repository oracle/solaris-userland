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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gstreamer
COMPONENT_VERSION=	1.24.12
COMPONENT_PROJECT_URL=	https://gstreamer.freedesktop.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:b3522d1b4fe174fff3b3c7f0603493e2367bd1c43f5804df15b634bd22b1036f
COMPONENT_ARCHIVE_URL=	https://gstreamer.freedesktop.org/src/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	1263

COMPONENT_BAID=		324170

BUILD_STYLE=		meson
PYTHON_VERSION=		3.11

include $(WS_MAKE_RULES)/common.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Required for other components.
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled
CONFIGURE_OPTIONS.64 += -Dintrospection=enabled
CONFIGURE_OPTIONS.32 += -Dptp-helper=disabled
CONFIGURE_OPTIONS.64 += -Dptp-helper=enabled
CONFIGURE_OPTIONS += --libexecdir="$(CONFIGURE_LIBDIR.$(BITS))"

# Requires GNU version of msgfmt...
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# The shebang line is hardcoded to python scripts; to avoid using
# the current system default, one is explicitly specified here.
COMPONENT_POST_INSTALL_ACTION += ( \
		$(PERL) -i -pe 's|\#!/usr/bin/env python3|\#!$(PYTHON)|' $(PROTOUSRLIBDIR)/gstreamer-1.0/gst-plugins-doc-cache-generator; \
		$(PERL) -i -pe 's|\#!/usr/bin/env python3|\#!$(PYTHON)|' $(PROTOUSRLIBDIR64)/gstreamer-1.0/gst-plugins-doc-cache-generator \
	);

COMPONENT_TEST_ENV = -i
COMPONENT_TEST_ARGS = -k 0

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
