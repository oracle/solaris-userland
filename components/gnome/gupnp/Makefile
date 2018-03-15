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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gupnp
COMPONENT_VERSION=	1.0.2
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/GUPnP
COMPONENT_ARCHIVE_HASH= \
	sha256:5173fda779111c6b01cd4a5e41b594322be9d04f8c74d3361f0a0c2069c77610
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	1281

TPNO=			35414

# Tests don't work on Solaris yet
TEST_TARGET = $(SKIP_TEST)

# Contains a single Python script written for Python 2.x/3.x; prefer 3.4.
PYTHON=3.4
PYTHON_VERSIONS=3.4

include $(WS_MAKE_RULES)/gnome-component.mk

# uuid detection fails due to Solaris bug 15586738.
CONFIGURE_OPTIONS += ac_cv_search_uuid_to_string=generic
CONFIGURE_ENV += UUID_CFLAGS="-I/usr/include/uuid"
CONFIGURE_ENV.32 += UUID_LIBS="-luuid"
CONFIGURE_ENV.64 += UUID_LIBS="-L/usr/lib/$(MACH64) -luuid"

CONFIGURE_OPTIONS += --disable-static
# Required for documentation.
CONFIGURE_OPTIONS += --enable-gtk-doc
# Required for other components.
CONFIGURE_OPTIONS += --enable-introspection
CONFIGURE_OPTIONS += --enable-largefile
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/desktop/gssdp
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += runtime/python-34
