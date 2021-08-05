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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gedit-plugins
COMPONENT_VERSION=	3.34.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Apps/Gedit
COMPONENT_ARCHIVE_HASH=	\
    sha256:c37fec89debcab15ed765f4d24d75e993691886ae942400c828098e7b8f2d1c9
COMPONENT_BUGDB=        gnome/applications
COMPONENT_ANITYA_ID=	5758

TPNO=			54026
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# Requires zeitgeist
CONFIGURE_OPTIONS += -Dplugin_zeitgeist=false

# Compile all python sources to .pyc files
PLUGINS_DIR = charmap; coloschemer; commander; git; multiedit;\
	sessionsaver; testsize; translate
COMPONENT_POST_INSTALL_ACTION += $(foreach i,$(PLUGINS_DIR),\
        $(PYTHON) -m compileall $(PROTO_DIR)$(USRLIBDIR64)/gedit/plugins/$(i));

REQUIRED_PACKAGES += editor/gedit
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtksourceview
REQUIRED_PACKAGES += library/desktop/libpeas
REQUIRED_PACKAGES += library/glib2
