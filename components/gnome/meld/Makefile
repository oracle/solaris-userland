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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		meld
COMPONENT_VERSION=	3.21.0
COMPONENT_PROJECT_URL=	https://meldmerge.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:b680114d5ab793324549fd58f4eb202d8e280c0633a0b765ede6dfb34160a81b
COMPONENT_BUGDB=        utility/meld
COMPONENT_ANITYA_ID=	5520

COMPONENT_BAID=		106234

# We just need to build one version.
PYTHON_VERSIONS =       3.7

BUILD_STYLE= meson
TEST_TARGET=	$(TEST_64)

include $(WS_MAKE_RULES)/gnome-component.mk

# Needed to find GNU xgettext.
PATH =			$(GNUBIN):$(USRBINDIR)

PYTHON_VERSION =	3.7
PKG_MACROS +=		PYVER="$(PYTHON_VERSION)" PYV="$(PYTHON_VERSION:3.%=3%)"

PYTHON_DATA =		/usr

# Don't build and package these, they need to be generated on install to
# reflect all the other packages installed on the machine too, not just meld
COMPONENT_SETUP_ARGS += --no-compile-schemas
COMPONENT_SETUP_ARGS += --no-update-icon-cache

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTOUSRLIBDIR)/python3.7/vendor-packages; \
        $(MV) $(PROTOUSRLIBDIR)/python3.7/site-packages/* $(PROTOUSRLIBDIR)/python3.7/vendor-packages/; \
	$(PYTHON) -m compileall $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages;

PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/meld

# To find py3cairo
PKG_CONFIG_PATHS += /usr/lib/python3.7/vendor-packages/lib/pkgconfig

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9]*[0-9].[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += '-e "s/OK      [0-9]//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/Ok/p" ' \
        '-e "/Pass/p" ' \
        '-e "/Fail/p" '

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtksourceview
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/gnome/gnome-common
REQUIRED_PACKAGES += library/python/pycairo-37
REQUIRED_PACKAGES += library/python/pygobject-3-37
REQUIRED_PACKAGES += library/python/tkinter-37
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += text/gnu-gettext
