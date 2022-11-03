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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gedit
COMPONENT_VERSION=	41.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Apps/Gedit
COMPONENT_ARCHIVE_HASH=	\
    sha256:7a9b18b158808d1892989165f3706c4f1a282979079ab7458a79d3c24ad4deb5
COMPONENT_BUGDB=	gnome/applications
COMPONENT_ANITYA_ID=	5758
COMPONENT_BAID=		120411

BUILD_STYLE=		meson
PYTHON_VERSION=		3.7

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# Compile all python sources to .pyc files
COMPONENT_POST_INSTALL_ACTION += \
        $(MV) $(PROTO_DIR)/usr/lib/python$(PYTHON_VERSION)/site-packages \
              $(PROTO_DIR)/usr/lib/python$(PYTHON_VERSION)/vendor-packages; \
        $(PYTHON) -m compileall $(PROTO_DIR)/usr/lib/python$(PYTHON_VERSION)/vendor-packages/gi/overrides;
PLUGINS_DIR = snippets; quickopen; externaltools
COMPONENT_POST_INSTALL_ACTION += $(foreach i,$(PLUGINS_DIR),\
        $(PYTHON) -m compileall $(PROTO_DIR)$(USRLIBDIR64)/gedit/plugins/$(i));

# Temporary workaround until all build machines are running meson-0.63
COMPONENT_POST_INSTALL_ACTION += \
for f in $(PROTO_DIR)/usr/share/help/[a-z]*/gedit/figures ; do \
    (cd $$f ; $(RM) *.png ; $(SYMLINK) ../../../C/gedit/figures/*.png . ); \
done ;

REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtksourceview
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-desktop
REQUIRED_PACKAGES += library/desktop/libpeas
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/spell-checking/enchant
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
