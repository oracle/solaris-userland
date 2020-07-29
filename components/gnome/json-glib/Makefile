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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		json-glib
COMPONENT_VERSION=	1.4.4
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/JsonGlib
COMPONENT_ARCHIVE_HASH=	\
    sha256:720c5f4379513dc11fd97dc75336eb0c0d3338c53128044d9fabec4374f4bc47
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13144

TPNO=			54080
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += -Ddocs=true
CONFIGURE_OPTIONS += -Dman=true
CONFIGURE_OPTIONS.32 += -Dintrospection=false
COMPONENT_BUILD_ENV +=  PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV +=  PATH="$(GNUBIN):$(PATH)"

# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/K       [0-9].[0-9][0-9] s/K/" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += data/docbook/docbook-style-dsssl
REQUIRED_PACKAGES += data/docbook/docbook-style-xsl
REQUIRED_PACKAGES += data/sgml-common
REQUIRED_PACKAGES += data/xml-common
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += text/gnu-gettext
REQUIRED_PACKAGES += text/locale
